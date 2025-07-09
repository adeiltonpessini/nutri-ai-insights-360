
-- Create table for team invitations
CREATE TABLE public.team_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  role public.user_role NOT NULL DEFAULT 'cliente',
  invited_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for user onboarding progress
CREATE TABLE public.user_onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  completed_steps TEXT[] NOT NULL DEFAULT '{}',
  current_step TEXT NOT NULL DEFAULT 'welcome',
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for Stripe webhook events
CREATE TABLE public.stripe_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT false,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_webhook_events ENABLE ROW LEVEL SECURITY;

-- RLS policies for team_invitations
CREATE POLICY "Company admins can manage invitations" ON public.team_invitations
FOR ALL USING (
  company_id IN (
    SELECT company_id FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('company_admin', 'super_admin') 
    AND is_active = true
  )
);

CREATE POLICY "Users can view their own invitations" ON public.team_invitations
FOR SELECT USING (email = auth.email());

-- RLS policies for user_onboarding
CREATE POLICY "Users can manage their own onboarding" ON public.user_onboarding
FOR ALL USING (user_id = auth.uid());

-- RLS policies for stripe_webhook_events (admin only)
CREATE POLICY "Super admins can view webhook events" ON public.stripe_webhook_events
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'super_admin' 
    AND is_active = true
  )
);

-- Create function to handle user onboarding initialization
CREATE OR REPLACE FUNCTION public.handle_new_user_onboarding()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_onboarding (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

-- Create trigger for new user onboarding
CREATE TRIGGER on_auth_user_created_onboarding
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_onboarding();

-- Create function to accept team invitation
CREATE OR REPLACE FUNCTION public.accept_team_invitation(invitation_token TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  invitation_record RECORD;
  user_email TEXT;
BEGIN
  -- Get current user email
  SELECT email INTO user_email FROM auth.users WHERE id = auth.uid();
  
  -- Find and validate invitation
  SELECT * INTO invitation_record 
  FROM public.team_invitations 
  WHERE token = invitation_token 
  AND email = user_email 
  AND status = 'pending' 
  AND expires_at > now();
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Invalid or expired invitation');
  END IF;
  
  -- Insert user role
  INSERT INTO public.user_roles (user_id, company_id, role)
  VALUES (auth.uid(), invitation_record.company_id, invitation_record.role)
  ON CONFLICT (user_id, company_id) DO UPDATE SET role = invitation_record.role;
  
  -- Update invitation status
  UPDATE public.team_invitations 
  SET status = 'accepted', updated_at = now()
  WHERE id = invitation_record.id;
  
  -- Update user profile with company
  UPDATE public.profiles 
  SET company_id = invitation_record.company_id
  WHERE user_id = auth.uid() AND company_id IS NULL;
  
  RETURN json_build_object('success', true, 'company_id', invitation_record.company_id);
END;
$$;

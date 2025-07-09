
-- Criar tabela de assinaturas de usuários
CREATE TABLE public.user_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'inactive',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Política para usuários visualizarem suas próprias assinaturas
CREATE POLICY "Usuários podem ver suas próprias assinaturas" 
  ON public.user_subscriptions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para usuários atualizarem suas próprias assinaturas
CREATE POLICY "Usuários podem atualizar suas próprias assinaturas" 
  ON public.user_subscriptions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Política para inserção de assinaturas (edge functions)
CREATE POLICY "Permitir inserção de assinaturas" 
  ON public.user_subscriptions 
  FOR INSERT 
  WITH CHECK (true);

-- Super admins podem ver todas as assinaturas
CREATE POLICY "Super admins podem ver todas as assinaturas" 
  ON public.user_subscriptions 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'super_admin' 
    AND is_active = true
  ));

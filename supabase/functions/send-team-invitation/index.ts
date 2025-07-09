
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    const { email, role, companyId } = await req.json();
    
    if (!email || !role || !companyId) {
      throw new Error("Missing required fields: email, role, companyId");
    }

    // Verify user has permission to invite
    const { data: userRole } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("company_id", companyId)
      .eq("is_active", true)
      .single();

    if (!userRole || !['company_admin', 'super_admin'].includes(userRole.role)) {
      throw new Error("Insufficient permissions to send invitations");
    }

    // Create invitation
    const { data: invitation, error } = await supabaseClient
      .from("team_invitations")
      .insert({
        email,
        role,
        company_id: companyId,
        invited_by: user.id
      })
      .select()
      .single();

    if (error) throw error;

    // Here you would typically send an email with the invitation link
    // For now, we'll just return the token for manual sharing
    const invitationUrl = `${req.headers.get("origin")}/accept-invitation?token=${invitation.token}`;

    console.log(`Invitation created for ${email} with URL: ${invitationUrl}`);

    return new Response(JSON.stringify({ 
      success: true, 
      invitationUrl,
      invitation 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error sending invitation:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

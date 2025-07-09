
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOKS] ${step}${detailsStr}`);
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
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeKey || !webhookSecret) {
      throw new Error("Missing Stripe configuration");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const signature = req.headers.get("stripe-signature");
    
    if (!signature) {
      throw new Error("No Stripe signature found");
    }

    const body = await req.text();
    
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      logStep("Webhook signature verification failed", { error: err.message });
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    logStep("Event verified", { type: event.type, id: event.id });

    // Check if event already processed
    const { data: existingEvent } = await supabaseClient
      .from("stripe_webhook_events")
      .select("id")
      .eq("stripe_event_id", event.id)
      .single();

    if (existingEvent) {
      logStep("Event already processed", { eventId: event.id });
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Store webhook event
    await supabaseClient
      .from("stripe_webhook_events")
      .insert({
        stripe_event_id: event.id,
        event_type: event.type,
        data: event.data,
        processed: false
      });

    // Process different event types
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await handleSubscriptionChange(event, supabaseClient, stripe);
        break;
      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event, supabaseClient, stripe);
        break;
      case "invoice.payment_failed":
        await handlePaymentFailed(event, supabaseClient, stripe);
        break;
      default:
        logStep("Unhandled event type", { type: event.type });
    }

    // Mark event as processed
    await supabaseClient
      .from("stripe_webhook_events")
      .update({ processed: true })
      .eq("stripe_event_id", event.id);

    logStep("Event processed successfully", { type: event.type, id: event.id });

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in webhook", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function handleSubscriptionChange(event: any, supabaseClient: any, stripe: Stripe) {
  const subscription = event.data.object;
  const customerId = subscription.customer;
  
  // Get customer email
  const customer = await stripe.customers.retrieve(customerId);
  if (!customer || customer.deleted) return;
  
  const email = customer.email;
  if (!email) return;

  // Get user by email
  const { data: users } = await supabaseClient.auth.admin.listUsers();
  const user = users?.users?.find((u: any) => u.email === email);
  if (!user) return;

  let planId = 'free';
  let status = 'inactive';

  if (subscription.status === 'active' || subscription.status === 'trialing') {
    status = 'active';
    
    // Determine plan from price
    const priceId = subscription.items.data[0].price.id;
    const price = await stripe.prices.retrieve(priceId);
    const amount = price.unit_amount || 0;
    
    if (amount <= 999) {
      planId = 'basico';
    } else if (amount <= 2999) {
      planId = 'profissional';
    } else {
      planId = 'enterprise';
    }
  }

  await supabaseClient.from("user_subscriptions").upsert({
    user_id: user.id,
    plan_id: planId,
    status: status,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });

  logStep("Subscription updated", { userId: user.id, planId, status });
}

async function handlePaymentSucceeded(event: any, supabaseClient: any, stripe: Stripe) {
  logStep("Payment succeeded", { invoiceId: event.data.object.id });
  // Add custom logic for successful payments if needed
}

async function handlePaymentFailed(event: any, supabaseClient: any, stripe: Stripe) {
  logStep("Payment failed", { invoiceId: event.data.object.id });
  // Add custom logic for failed payments if needed
}

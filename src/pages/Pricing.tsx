
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Star, ArrowLeft, CreditCard, Shield, Zap, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SubscriptionPlans } from "@/components/SubscriptionPlans";
import { SUBSCRIPTION_PLANS, SubscriptionPlan } from "@/types/subscription";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Pricing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');

  useEffect(() => {
    if (user) {
      loadCurrentSubscription();
    }
  }, [user]);

  const loadCurrentSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('plan_id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (data) {
        setCurrentPlan(data.plan_id);
      }
    } catch (error) {
      console.log('No active subscription found');
    }
  };

  const handleSelectPlan = async (plan: SubscriptionPlan) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setLoading(true);
    try {
      // Mock checkout process - in real implementation, this would call Stripe
      toast({
        title: "Funcionalidade em desenvolvimento",
        description: "O sistema de pagamento será implementado em breve."
      });
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar pagamento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPlans = SUBSCRIPTION_PLANS.filter(plan => plan.interval === billingInterval);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="transition-smooth">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>

        <div className="text-center mb-12">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-tech-blue rounded-2xl flex items-center justify-center mb-6 shadow-glow">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-tech-blue bg-clip-text text-transparent">
            VetSaaS Pro - Planos
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transforme sua gestão veterinária com as melhores ferramentas do mercado
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <Tabs value={billingInterval} onValueChange={(value) => setBillingInterval(value as 'month' | 'year')}>
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="month">Mensal</TabsTrigger>
              <TabsTrigger value="year" className="relative">
                Anual
                <Badge className="ml-2 bg-success text-white text-xs">-20%</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <SubscriptionPlans 
          currentPlan={currentPlan}
          onSelectPlan={handleSelectPlan}
          loading={loading}
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <Card className="text-center border border-border/50 shadow-soft hover:shadow-medium transition-smooth">
            <CardContent className="pt-6">
              <Shield className="w-8 h-8 mx-auto mb-4 text-tech-blue" />
              <h3 className="font-semibold mb-2">Segurança Total</h3>
              <p className="text-sm text-muted-foreground">Dados protegidos com criptografia</p>
            </CardContent>
          </Card>
          
          <Card className="text-center border border-border/50 shadow-soft hover:shadow-medium transition-smooth">
            <CardContent className="pt-6">
              <Zap className="w-8 h-8 mx-auto mb-4 text-warning" />
              <h3 className="font-semibold mb-2">IA Avançada</h3>
              <p className="text-sm text-muted-foreground">Diagnósticos inteligentes</p>
            </CardContent>
          </Card>
          
          <Card className="text-center border border-border/50 shadow-soft hover:shadow-medium transition-smooth">
            <CardContent className="pt-6">
              <Users className="w-8 h-8 mx-auto mb-4 text-sustainability" />
              <h3 className="font-semibold mb-2">Equipe Completa</h3>
              <p className="text-sm text-muted-foreground">Gerencie toda sua equipe</p>
            </CardContent>
          </Card>
          
          <Card className="text-center border border-border/50 shadow-soft hover:shadow-medium transition-smooth">
            <CardContent className="pt-6">
              <CreditCard className="w-8 h-8 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Sem Taxas Ocultas</h3>
              <p className="text-sm text-muted-foreground">Preço transparente</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Tem dúvidas? <Button variant="link" className="p-0 transition-smooth">Entre em contato</Button>
          </p>
        </div>
      </div>
    </div>
  );
}

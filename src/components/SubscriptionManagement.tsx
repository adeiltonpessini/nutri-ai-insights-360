
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Calendar, TrendingUp, ExternalLink } from 'lucide-react';

export function SubscriptionManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    if (user) {
      checkSubscription();
    }
  }, [user]);

  const checkSubscription = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase.functions.invoke('check-subscription');

      if (error) throw error;

      setSubscription(data);
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase.functions.invoke('customer-portal');

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Erro",
        description: "Não foi possível abrir o portal do cliente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const openCheckout = async (priceId: string, planType: string) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId,
          planType
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Erro",
        description: "Não foi possível iniciar o checkout.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'trialing': return 'bg-blue-500';
      case 'past_due': return 'bg-yellow-500';
      case 'canceled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPlanName = (planId: string) => {
    switch (planId) {
      case 'basico': return 'Básico';
      case 'profissional': return 'Profissional';
      case 'enterprise': return 'Enterprise';
      default: return 'Gratuito';
    }
  };

  const plans = [
    {
      id: 'basico',
      name: 'Básico',
      price: 'R$ 29/mês',
      priceId: 'price_basic_monthly'
    },
    {
      id: 'profissional',
      name: 'Profissional',
      price: 'R$ 79/mês',
      priceId: 'price_professional_monthly'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'R$ 149/mês',
      priceId: 'price_enterprise_monthly'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Assinatura</h2>
        <p className="text-muted-foreground">
          Gerencie sua assinatura e plano atual
        </p>
      </div>

      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Plano Atual
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Carregando...</p>
          ) : subscription ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    {getPlanName(subscription.plan_id)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Status: 
                    <Badge className={`ml-2 ${getStatusColor(subscription.status)}`}>
                      {subscription.status === 'active' ? 'Ativo' : 
                       subscription.status === 'inactive' ? 'Inativo' : subscription.status}
                    </Badge>
                  </p>
                </div>
                
                {subscription.subscribed && (
                  <Button onClick={openCustomerPortal} disabled={loading}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Gerenciar Assinatura
                  </Button>
                )}
              </div>

              {subscription.current_period_end && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Próxima cobrança: {new Date(subscription.current_period_end).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )}

              {!subscription.subscribed && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Faça upgrade do seu plano</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Desbloqueie recursos avançados com nossos planos pagos.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {plans.map((plan) => (
                      <div key={plan.id} className="border rounded-lg p-3 text-center">
                        <h5 className="font-medium">{plan.name}</h5>
                        <p className="text-sm text-muted-foreground">{plan.price}</p>
                        <Button 
                          size="sm" 
                          className="mt-2 w-full"
                          onClick={() => openCheckout(plan.priceId, plan.id)}
                          disabled={loading}
                        >
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Upgrade
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p>Não foi possível carregar informações da assinatura.</p>
          )}
        </CardContent>
      </Card>

      {/* Refresh Button */}
      <div className="text-center">
        <Button variant="outline" onClick={checkSubscription} disabled={loading}>
          {loading ? 'Verificando...' : 'Atualizar Status'}
        </Button>
      </div>
    </div>
  );
}


import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OnboardingSubscriptionProps {
  onNext: () => void;
}

export function OnboardingSubscription({ onNext }: OnboardingSubscriptionProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      id: 'basico',
      name: 'Básico',
      price: 'R$ 29',
      period: '/mês',
      priceId: 'price_basic_monthly', // Replace with actual Stripe price ID
      description: 'Ideal para clínicas pequenas',
      popular: false,
      features: [
        'Até 100 animais',
        'Até 5 usuários',
        'Relatórios básicos',
        'Suporte por email'
      ]
    },
    {
      id: 'profissional',
      name: 'Profissional',
      price: 'R$ 79',
      period: '/mês',
      priceId: 'price_professional_monthly', // Replace with actual Stripe price ID
      description: 'Para clínicas em crescimento',
      popular: true,
      features: [
        'Até 500 animais',
        'Até 15 usuários',
        'Relatórios avançados',
        'IA diagnóstica',
        'Suporte prioritário',
        'Integrações'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'R$ 149',
      period: '/mês',
      priceId: 'price_enterprise_monthly', // Replace with actual Stripe price ID
      description: 'Para grandes operações',
      popular: false,
      features: [
        'Animais ilimitados',
        'Usuários ilimitados',
        'Relatórios personalizados',
        'IA avançada',
        'Suporte 24/7',
        'API personalizada',
        'Treinamento incluso'
      ]
    }
  ];

  const handleSelectPlan = async (plan: typeof plans[0]) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId: plan.priceId,
          planType: plan.id
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
        onNext();
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Erro",
        description: "Não foi possível iniciar o checkout. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUseFree = () => {
    toast({
      title: "Plano gratuito ativado!",
      description: "Você pode fazer upgrade a qualquer momento."
    });
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Escolha seu plano</h2>
        <p className="text-muted-foreground">
          Selecione o plano ideal para suas necessidades
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
            {plan.popular && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                Mais Popular
              </Badge>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="space-y-1">
                <div className="text-3xl font-bold">
                  {plan.price}
                  <span className="text-lg font-normal text-muted-foreground">
                    {plan.period}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                className={`w-full ${plan.popular ? 'bg-gradient-to-r from-primary to-tech-blue' : ''}`}
                variant={plan.popular ? 'default' : 'outline'}
                onClick={() => handleSelectPlan(plan)}
                disabled={loading}
              >
                {loading ? 'Processando...' : 'Selecionar Plano'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center bg-muted/50 rounded-lg p-6">
        <h3 className="font-semibold mb-2">Prefere começar grátis?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Use o plano gratuito com funcionalidades básicas e faça upgrade quando precisar.
        </p>
        <Button variant="outline" onClick={handleUseFree}>
          Continuar com plano gratuito
        </Button>
      </div>
    </div>
  );
}

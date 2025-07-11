
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Star, ArrowLeft, CreditCard, Shield, Zap, Users, Heart, Award, Phone, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  maxAnimals: number;
  maxUsers: number;
  maxProducts: number;
  stripePriceId: string;
  popular?: boolean;
  color: string;
  icon: React.ReactNode;
}

const PLANS: SubscriptionPlan[] = [
  {
    id: 'basico',
    name: 'Básico',
    description: 'Ideal para clínicas veterinárias iniciantes',
    price: 89.90,
    interval: 'month',
    stripePriceId: 'price_basico_monthly',
    maxAnimals: 100,
    maxUsers: 3,
    maxProducts: 50,
    color: 'bg-gradient-primary',
    icon: <Heart className="w-6 h-6" />,
    features: [
      'Até 100 animais cadastrados',
      'Até 3 usuários na equipe',
      'Cadastro básico de produtos',
      'Diagnósticos manuais',
      'Receitas digitais',
      'Relatórios básicos',
      'Suporte por email',
      'Backup diário'
    ]
  },
  {
    id: 'profissional',
    name: 'Profissional',
    description: 'Para clínicas e empresas em crescimento',
    price: 149.90,
    interval: 'month',
    stripePriceId: 'price_profissional_monthly',
    maxAnimals: 500,
    maxUsers: 10,
    maxProducts: 200,
    popular: true,
    color: 'bg-gradient-vital',
    icon: <Award className="w-6 h-6" />,
    features: [
      'Até 500 animais cadastrados',
      'Até 10 usuários na equipe',
      'Catálogo completo de produtos',
      'IA para diagnósticos',
      'Receitas com QR Code',
      'Dashboard analytics avançado',
      'Gestão de estoque',
      'Alertas inteligentes',
      'Suporte prioritário',
      'Integrações básicas'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Para grandes operações e fazendas',
    price: 299.90,
    interval: 'month',
    stripePriceId: 'price_enterprise_monthly',
    maxAnimals: -1,
    maxUsers: 50,
    maxProducts: -1,
    color: 'bg-gradient-to-r from-gray-800 to-gray-900',
    icon: <TrendingUp className="w-6 h-6" />,
    features: [
      'Animais ilimitados',
      'Até 50 usuários na equipe',
      'Produtos ilimitados',
      'IA avançada com machine learning',
      'Relatórios personalizados',
      'API completa',
      'Gestão multi-fazenda',
      'Dashboard ESG e sustentabilidade',
      'Suporte 24/7',
      'Treinamento personalizado',
      'Integrações avançadas',
      'Manager dedicado'
    ]
  }
];

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
      navigate('/auth?from=pricing');
      return;
    }

    setLoading(true);
    try {
      toast({
        title: "Funcionalidade em desenvolvimento",
        description: "O sistema de pagamento será implementado em breve.",
        duration: 3000
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

  const getYearlyPrice = (monthlyPrice: number) => {
    return (monthlyPrice * 12 * 0.8); // 20% desconto no anual
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-card border-b border-border shadow-soft">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/')} className="transition-smooth">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">∞</span>
                </div>
                <span className="font-semibold text-foreground">InfinityVet</span>
              </div>
            </div>
            {!user && (
              <Button onClick={() => navigate('/auth')} variant="outline">
                Entrar
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="mx-auto w-20 h-20 bg-gradient-hero rounded-2xl flex items-center justify-center mb-8 shadow-glow">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-heading font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
            Planos InfinityVet
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Gestão inteligente, sustentável e sem limites para veterinários, empresas e fazendas. 
            Escolha o plano ideal para sua operação.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <Tabs value={billingInterval} onValueChange={(value) => setBillingInterval(value as 'month' | 'year')}>
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto h-12">
              <TabsTrigger value="month" className="text-base">Mensal</TabsTrigger>
              <TabsTrigger value="year" className="relative text-base">
                Anual
                <Badge className="ml-2 bg-vital-green text-white text-xs">-20%</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {PLANS.map((plan, index) => {
            const price = billingInterval === 'year' ? getYearlyPrice(plan.price) : plan.price;
            const isCurrentPlan = currentPlan === plan.id;
            
            return (
              <Card 
                key={plan.id} 
                className={`relative transition-all duration-300 hover:shadow-strong animate-fade-in group ${
                  plan.popular 
                    ? 'border-2 border-vital-green shadow-strong scale-105 bg-gradient-card' 
                    : 'border border-border hover:border-muted-foreground'
                } ${isCurrentPlan ? 'ring-2 ring-primary' : ''}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-vital-green text-white px-4 py-2 text-sm font-medium shadow-medium">
                      <Star className="w-3 h-3 mr-1" />
                      Mais Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-6">
                  <div className={`w-16 h-16 mx-auto rounded-2xl ${plan.color} flex items-center justify-center text-white mb-6 shadow-medium group-hover:shadow-strong transition-all duration-300`}>
                    {plan.icon}
                  </div>
                  <CardTitle className="text-2xl font-heading font-bold text-card-foreground">{plan.name}</CardTitle>
                  <CardDescription className="text-muted-foreground text-base mt-2">{plan.description}</CardDescription>
                  
                  <div className="mt-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-heading font-bold text-card-foreground">R$ {formatPrice(price)}</span>
                      <span className="text-muted-foreground ml-1">
                        /{billingInterval === 'month' ? 'mês' : 'ano'}
                      </span>
                    </div>
                    {billingInterval === 'year' && (
                      <p className="text-sm text-vital-green mt-2 font-medium">
                        Economize R$ {formatPrice(plan.price * 12 * 0.2)} por ano
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-vital-green shrink-0 mt-0.5" />
                        <span className="text-card-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={() => handleSelectPlan(plan)}
                    disabled={loading || isCurrentPlan}
                    size="lg"
                    className={`w-full mt-8 h-12 text-base font-medium transition-smooth ${
                      plan.popular 
                        ? 'bg-vital-green hover:bg-vital-green-dark text-white' 
                        : isCurrentPlan
                        ? 'bg-primary hover:bg-primary-dark text-primary-foreground'
                        : 'bg-card-foreground hover:bg-muted-foreground text-card'
                    }`}
                  >
                    {loading ? (
                      "Processando..."
                    ) : isCurrentPlan ? (
                      "Plano Atual"
                    ) : (
                      "Escolher Plano"
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="bg-card rounded-2xl p-8 shadow-medium border border-border mb-16">
          <h2 className="text-3xl font-heading font-bold text-center mb-12 text-card-foreground">
            Por que escolher o InfinityVet?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-glow transition-all duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2 text-card-foreground">Segurança Total</h3>
              <p className="text-muted-foreground">Dados protegidos com criptografia de ponta e backup automático</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto bg-gradient-vital rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-glow transition-all duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2 text-card-foreground">IA Avançada</h3>
              <p className="text-muted-foreground">Diagnósticos inteligentes e recomendações personalizadas</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-glow transition-all duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2 text-card-foreground">Gestão de Equipe</h3>
              <p className="text-muted-foreground">Controle total sobre usuários, permissões e atividades</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-glow transition-all duration-300">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2 text-card-foreground">Suporte Dedicado</h3>
              <p className="text-muted-foreground">Equipe especializada pronta para ajudar quando precisar</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-heading font-bold text-center mb-12 text-foreground">Perguntas Frequentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "Posso cancelar a qualquer momento?",
                answer: "Sim, você pode cancelar sua assinatura a qualquer momento sem taxas adicionais."
              },
              {
                question: "Há período de teste gratuito?",
                answer: "Oferecemos 14 dias de teste gratuito para todos os planos, sem compromisso."
              },
              {
                question: "Meus dados ficam seguros?",
                answer: "Utilizamos criptografia de ponta e backup automático para garantir a segurança total dos seus dados."
              },
              {
                question: "Posso mudar de plano depois?",
                answer: "Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento."
              }
            ].map((faq, index) => (
              <Card key={index} className="p-6 border border-border shadow-soft hover:shadow-medium transition-smooth">
                <h3 className="font-heading font-semibold text-lg mb-3 text-card-foreground">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-hero rounded-2xl p-12 text-white shadow-strong">
          <h2 className="text-3xl font-heading font-bold mb-4">Pronto para transformar sua gestão?</h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhares de profissionais que já confiam no InfinityVet
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/auth')}
              className="bg-white text-primary hover:bg-secondary font-medium transition-smooth"
            >
              Começar Teste Gratuito
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary font-medium transition-smooth"
            >
              Falar com Consultor
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

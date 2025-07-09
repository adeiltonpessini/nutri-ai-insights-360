
import { Check, Star, Zap, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    id: "veterinario_basic",
    name: "Veterinário Básico",
    description: "Para veterinários iniciantes",
    price: "R$ 99",
    period: "/mês",
    maxAnimals: 100,
    maxClients: 20,
    features: [
      "Até 100 animais cadastrados",
      "Até 20 clientes",
      "Diagnóstico com IA",
      "Receitas digitais",
      "Histórico médico completo",
      "Suporte por email"
    ],
    popular: false,
    icon: Zap,
    color: "blue"
  },
  {
    id: "veterinario_pro",
    name: "Veterinário Profissional",
    description: "Para clínicas veterinárias",
    price: "R$ 299",
    period: "/mês",
    maxAnimals: 500,
    maxClients: 100,
    features: [
      "Até 500 animais cadastrados",
      "Até 100 clientes",
      "Diagnóstico avançado com IA",
      "Receitas digitais ilimitadas",
      "Relatórios detalhados",
      "Gestão de lotes",
      "Análise de performance",
      "Suporte prioritário"
    ],
    popular: true,
    icon: Star,
    color: "green"
  },
  {
    id: "veterinario_enterprise",
    name: "Veterinário Enterprise",
    description: "Para grandes clínicas e hospitais",
    price: "R$ 799",
    period: "/mês",
    maxAnimals: 2000,
    maxClients: 500,
    features: [
      "Até 2000 animais cadastrados",
      "Até 500 clientes",
      "Diagnóstico com IA premium",
      "Multi-usuários",
      "API personalizada",
      "Integrações avançadas",
      "Dashboard executivo",
      "Suporte 24/7"
    ],
    popular: false,
    icon: Building2,
    color: "purple"
  },
  {
    id: "empresa_medicamentos",
    name: "Empresa de Medicamentos",
    description: "Para fabricantes de medicamentos veterinários",
    price: "R$ 499",
    period: "/mês",
    maxProducts: 200,
    features: [
      "Até 200 produtos cadastrados",
      "Catálogo digital completo",
      "Análise de mercado",
      "Relatórios de vendas",
      "Integração com veterinários",
      "Dashboard de performance",
      "Suporte especializado"
    ],
    popular: false,
    icon: Building2,
    color: "red"
  },
  {
    id: "empresa_alimentos",
    name: "Empresa de Alimentos",
    description: "Para fabricantes de alimentos para animais",
    price: "R$ 599",
    period: "/mês",
    maxProducts: 300,
    features: [
      "Até 300 produtos cadastrados",
      "Simulador de ração",
      "Análise nutricional",
      "Relatórios de sustentabilidade",
      "Integração com veterinários",
      "Dashboard avançado",
      "Suporte especializado"
    ],
    popular: false,
    icon: Building2,
    color: "orange"
  }
];

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSelectPlan = (planId: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    // Aqui você implementaria a lógica de checkout/pagamento
    console.log(`Selecionado plano: ${planId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Escolha o melhor plano para seu negócio
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Planos flexíveis para veterinários, empresas de medicamentos e alimentos. 
            Comece gratuitamente e escale conforme cresce.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <Card 
                key={plan.id} 
                className={`relative ${plan.popular ? 'ring-2 ring-primary shadow-lg scale-105' : ''}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                    Mais Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-6">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-lg bg-${plan.color}-100 flex items-center justify-center`}>
                    <IconComponent className={`w-6 h-6 text-${plan.color}-600`} />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button 
                    onClick={() => handleSelectPlan(plan.id)}
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    Escolher Plano
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            Precisa de um plano personalizado?
          </p>
          <Button variant="outline" size="lg">
            Falar com Especialista
          </Button>
        </div>
      </div>
    </div>
  );
}

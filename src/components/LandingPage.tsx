
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Stethoscope, 
  Brain, 
  Shield, 
  Zap, 
  Users, 
  BarChart3,
  Check,
  ArrowRight,
  Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: Brain,
    title: "IA Veterinária Avançada",
    description: "Diagnósticos precisos com inteligência artificial treinada especificamente para medicina veterinária"
  },
  {
    icon: Stethoscope,
    title: "Gestão Completa de Pacientes",
    description: "Prontuário eletrônico, histórico médico e acompanhamento completo de cada animal"
  },
  {
    icon: Shield,
    title: "Segurança e Conformidade",
    description: "Dados protegidos com criptografia de ponta e conformidade com regulamentações"
  },
  {
    icon: BarChart3,
    title: "Analytics Inteligente",
    description: "Relatórios detalhados e insights para otimizar sua prática veterinária"
  },
  {
    icon: Users,
    title: "Multi-usuário",
    description: "Equipes colaborativas com diferentes níveis de acesso e permissões"
  },
  {
    icon: Zap,
    title: "Performance Otimizada",
    description: "Sistema rápido e responsivo, disponível 24/7 na nuvem"
  }
];

const testimonials = [
  {
    name: "Dr. Ana Silva",
    role: "Veterinária - Clínica Pet Care",
    content: "Revolucionou minha prática! A IA ajuda muito nos diagnósticos e o sistema é muito intuitivo.",
    rating: 5
  },
  {
    name: "Carlos Santos",
    role: "Diretor - MedVet Pharma",
    content: "Excelente para gerenciar nosso catálogo de produtos e acompanhar performance no mercado.",
    rating: 5
  },
  {
    name: "Dra. Maria Costa",
    role: "Veterinária - Hospital Animal Plus",
    content: "O melhor investimento que fiz para minha clínica. Atendimento mais rápido e eficiente.",
    rating: 5
  }
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <Badge className="mb-4" variant="secondary">
            🚀 Plataforma SaaS Veterinária #1 do Brasil
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Revolucione sua Prática Veterinária com IA
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            A plataforma completa para veterinários, empresas de medicamentos e alimentos. 
            Diagnósticos com IA, gestão inteligente e crescimento sustentável.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/pricing")} className="text-lg px-8">
              Começar Gratuitamente
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")} className="text-lg px-8">
              Fazer Login
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="border-muted hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="bg-muted/20 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Para Cada Tipo de Profissional</h2>
            <p className="text-xl text-muted-foreground">
              Soluções específicas para suas necessidades
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-800">Para Veterinários</CardTitle>
                <CardDescription className="text-blue-600">
                  Gestão completa da sua prática veterinária
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-blue-600 mr-3" />
                    <span>Prontuário eletrônico completo</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-blue-600 mr-3" />
                    <span>Diagnósticos com IA</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-blue-600 mr-3" />
                    <span>Receitas digitais</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-blue-600 mr-3" />
                    <span>Gestão de clientes</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="text-2xl text-green-800">Empresas de Medicamentos</CardTitle>
                <CardDescription className="text-green-600">
                  Catálogo digital e análise de mercado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-3" />
                    <span>Catálogo de produtos digital</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-3" />
                    <span>Analytics de performance</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-3" />
                    <span>Integração com veterinários</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-3" />
                    <span>Relatórios de vendas</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50/50">
              <CardHeader>
                <CardTitle className="text-2xl text-orange-800">Empresas de Alimentos</CardTitle>
                <CardDescription className="text-orange-600">
                  Simulação nutricional e sustentabilidade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-orange-600 mr-3" />
                    <span>Simulador de ração</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-orange-600 mr-3" />
                    <span>Análise nutricional</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-orange-600 mr-3" />
                    <span>Relatórios de sustentabilidade</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-orange-600 mr-3" />
                    <span>Marketplace integrado</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">O que nossos clientes dizem</h2>
            <p className="text-xl text-muted-foreground">
              Milhares de profissionais já confiam em nossa plataforma
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-muted">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para revolucionar sua prática?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhares de profissionais que já transformaram seu trabalho
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate("/pricing")} className="text-lg px-8">
              Ver Planos e Preços
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")} className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary">
              Começar Agora
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

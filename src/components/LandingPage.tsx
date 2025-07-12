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
  Star,
  Sparkles,
  Leaf,
  TrendingUp,
  Building2,
  Heart
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: Brain,
    title: "IA Veterinária Avançada",
    description: "Diagnósticos precisos com inteligência artificial treinada especificamente para medicina veterinária",
    color: "text-primary"
  },
  {
    icon: Stethoscope,
    title: "Gestão Completa de Pacientes",
    description: "Prontuário eletrônico, histórico médico e acompanhamento completo de cada animal",
    color: "text-sustainability"
  },
  {
    icon: Shield,
    title: "Segurança e Conformidade",
    description: "Dados protegidos com criptografia de ponta e conformidade com regulamentações",
    color: "text-primary"
  },
  {
    icon: BarChart3,
    title: "Analytics Inteligente",
    description: "Relatórios detalhados e insights para otimizar sua prática veterinária",
    color: "text-sustainability"
  },
  {
    icon: Users,
    title: "Multi-tenant SaaS",
    description: "Equipes colaborativas com diferentes níveis de acesso e permissões por organização",
    color: "text-primary"
  },
  {
    icon: Leaf,
    title: "Sustentabilidade ESG",
    description: "Relatórios de sustentabilidade e gestão ambiental integrados",
    color: "text-sustainability"
  }
];

const useCases = [
  {
    title: "Veterinários & Clínicas",
    subtitle: "Gestão completa da sua prática veterinária",
    description: "Prontuário eletrônico, diagnósticos com IA, receitas digitais e gestão de clientes",
    icon: Stethoscope,
    color: "border-primary bg-primary/5",
    features: [
      "Prontuário eletrônico completo",
      "Diagnósticos com IA",
      "Receitas digitais e PDFs",
      "Gestão de clientes e animais",
      "QR Code para acesso dos tutores"
    ]
  },
  {
    title: "Empresas de Medicamentos",
    subtitle: "Catálogo digital e análise de mercado",
    description: "Gerencie seu portfólio de produtos e acompanhe indicações por veterinários",
    icon: Building2,
    color: "border-sustainability bg-sustainability/5",
    features: [
      "Catálogo de produtos digital",
      "Analytics de performance",
      "Integração com veterinários",
      "Relatórios de vendas e indicações",
      "Dashboard de métricas"
    ]
  },
  {
    title: "Empresas de Alimentos",
    subtitle: "Simulação nutricional e sustentabilidade",
    description: "Simulador de ração, análise nutricional e relatórios de sustentabilidade",
    icon: Leaf,
    color: "border-accent bg-accent/5",
    features: [
      "Simulador de ração avançado",
      "Análise nutricional completa",
      "Relatórios de sustentabilidade ESG",
      "Marketplace integrado",
      "Gestão de fórmulas"
    ]
  },
  {
    title: "Fazendas & Agropecuárias",
    subtitle: "Gestão completa do rebanho",
    description: "Controle de lotes, vacinação, eventos zootécnicos e métricas de performance",
    icon: TrendingUp,
    color: "border-warning bg-warning/5",
    features: [
      "Gestão de lotes e animais",
      "Cartão de vacinação digital",
      "Eventos zootécnicos",
      "Controle de estoque",
      "Relatórios para MAPA"
    ]
  }
];

const testimonials = [
  {
    name: "Dr. Ana Silva",
    role: "Veterinária - Clínica Pet Care",
    content: "O InfinityVet revolucionou minha prática! A IA ajuda muito nos diagnósticos e o sistema é extremamente intuitivo.",
    rating: 5,
    avatar: "AS"
  },
  {
    name: "Carlos Santos",
    role: "Diretor - NutriVet",
    content: "Perfeito para gerenciar nosso catálogo de produtos e acompanhar performance no mercado veterinário.",
    rating: 5,
    avatar: "CS"
  },
  {
    name: "Maria Fazenda",
    role: "Pecuarista - Fazenda Esperança",
    content: "Conseguimos otimizar nossa gestão de rebanho e melhorar significativamente nossos índices zootécnicos.",
    rating: 5,
    avatar: "MF"
  }
];

const stats = [
  { number: "10k+", label: "Animais Cadastrados" },
  { number: "500+", label: "Veterinários Ativos" },
  { number: "50+", label: "Empresas Parceiras" },
  { number: "99.9%", label: "Uptime" }
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-sustainability bg-clip-text text-transparent">
                InfinityVet
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">Gestão inteligente, sustentável e sem limites</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate("/pricing")}>
              Planos
            </Button>
            <Button onClick={() => navigate("/auth")}>
              Entrar
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-5xl mx-auto">
          <Badge className="mb-6 bg-gradient-primary text-white border-0 px-4 py-2" variant="secondary">
            <Sparkles className="w-4 h-4 mr-2" />
            Plataforma SaaS Multi-tenant #1 do Agronegócio
          </Badge>
          
          <h1 className="text-6xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-primary via-sustainability to-primary bg-clip-text text-transparent">
              Gestão inteligente,
            </span>
            <br />
            <span className="bg-gradient-to-r from-sustainability via-primary to-sustainability bg-clip-text text-transparent">
              sustentável e sem limites
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto">
            A plataforma completa para <strong>veterinários</strong>, <strong>empresas de medicamentos</strong>, 
            <strong> alimentos</strong> e <strong>fazendas</strong>. Diagnósticos com IA, gestão multi-tenant 
            e crescimento sustentável em uma única solução.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8 py-4 bg-gradient-primary hover:shadow-glow transition-all">
              Começar Gratuitamente
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/pricing")} className="text-lg px-8 py-4 border-primary text-primary hover:bg-primary/5">
              Ver Planos e Preços
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Recursos Avançados</h2>
          <p className="text-xl text-muted-foreground">
            Tecnologia de ponta para revolucionar seu trabalho
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="border-border/50 hover:shadow-medium transition-all hover:scale-105 bg-gradient-card">
                <CardHeader>
                  <div className={`w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 shadow-soft`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl font-heading">{feature.title}</CardTitle>
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
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Soluções para Cada Segmento</h2>
            <p className="text-xl text-muted-foreground">
              Atendemos toda a cadeia do agronegócio e medicina veterinária
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => {
              const IconComponent = useCase.icon;
              return (
                <Card key={index} className={`${useCase.color} border-2 hover:shadow-strong transition-all`}>
                  <CardHeader>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-soft">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-heading">{useCase.title}</CardTitle>
                        <CardDescription className="text-lg font-medium text-muted-foreground">
                          {useCase.subtitle}
                        </CardDescription>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-6">{useCase.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {useCase.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <Check className="w-5 h-5 text-sustainability mr-3 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Casos de Sucesso</h2>
            <p className="text-xl text-muted-foreground">
              Profissionais de todo o Brasil já confiam no InfinityVet
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border/50 hover:shadow-medium transition-all bg-gradient-card">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic text-lg">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-hero text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">
              Pronto para revolucionar sua gestão?
            </h2>
            <p className="text-xl mb-10 opacity-90 leading-relaxed">
              Junte-se a milhares de profissionais que já transformaram seu trabalho com o InfinityVet. 
              Comece gratuitamente e veja a diferença.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" variant="secondary" onClick={() => navigate("/auth")} className="text-lg px-8 py-4 bg-white text-primary hover:bg-gray-100">
                <Heart className="w-5 h-5 mr-2" />
                Começar Gratuitamente
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/pricing")} className="text-lg px-8 py-4 border-white text-white hover:bg-white/10">
                Ver Planos e Preços
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold bg-gradient-to-r from-primary to-sustainability bg-clip-text text-transparent">
                  InfinityVet
                </span>
                <p className="text-xs text-muted-foreground">Gestão inteligente, sustentável e sem limites</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 InfinityVet. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
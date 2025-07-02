import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Package, Leaf, BarChart3 } from "lucide-react";
import heroImage from "@/assets/hero-agriculture.jpg";

export default function Dashboard() {
  const metrics = [
    {
      title: "Rebanho Monitorado",
      value: "2,847",
      change: "+12%",
      trend: "up",
      icon: TrendingUp,
      description: "animais"
    },
    {
      title: "Conversão Alimentar",
      value: "1.89",
      change: "-5%",
      trend: "down",
      icon: TrendingDown,
      description: "FCR médio"
    },
    {
      title: "Alertas Ativos",
      value: "3",
      change: "2 novos",
      trend: "warning",
      icon: AlertTriangle,
      description: "requerem atenção"
    },
    {
      title: "Formulações OK",
      value: "94%",
      change: "+2%",
      trend: "up",
      icon: CheckCircle,
      description: "em conformidade"
    }
  ];

  const recentAlerts = [
    {
      id: 1,
      type: "warning",
      title: "Queda na conversão alimentar",
      farm: "Fazenda São João",
      time: "há 2 horas"
    },
    {
      id: 2,
      type: "success",
      title: "Formulação otimizada aplicada",
      farm: "Fazenda Santa Maria",
      time: "há 4 horas"
    },
    {
      id: 3,
      type: "info",
      title: "Novo lote de ingredientes disponível",
      farm: "Depósito Central",
      time: "há 6 horas"
    }
  ];

  const quickActions = [
    {
      title: "Novo Diagnóstico",
      description: "Analisar foto ou dados de campo",
      icon: Camera,
      variant: "hero" as const,
      href: "/diagnostico"
    },
    {
      title: "Produtos Alinutri",
      description: "Recomendações personalizadas",
      icon: Package,
      variant: "tech" as const,
      href: "/produtos"
    },
    {
      title: "Relatório Sustentabilidade",
      description: "Impacto ambiental do rebanho",
      icon: Leaf,
      variant: "sustainability" as const,
      href: "/sustentabilidade"
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl">
        <img 
          src={heroImage} 
          alt="Agricultura Inteligente" 
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero/80 flex items-center justify-center">
          <div className="text-center text-primary-foreground">
            <h1 className="text-4xl font-bold mb-4">
              Nutrição Animal Inteligente
            </h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Tecnologia avançada para otimizar a nutrição do seu rebanho, 
              aumentar a produtividade e reduzir custos de forma sustentável.
            </p>
            <div className="mt-6 flex gap-4 justify-center">
              <Button variant="hero" size="lg">
                Começar Diagnóstico
                <Camera className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="bg-background/10 border-primary-foreground/20 text-primary-foreground hover:bg-background/20">
                Ver Relatórios
                <BarChart3 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} variant="gradient">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center space-x-2 text-xs">
                <Badge 
                  variant={metric.trend === "up" ? "default" : metric.trend === "warning" ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  {metric.change}
                </Badge>
                <span className="text-muted-foreground">{metric.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {quickActions.map((action, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-smooth">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <action.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{action.title}</p>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
                <Button variant={action.variant} size="sm">
                  Acessar
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card variant="tech">
          <CardHeader>
            <CardTitle>Alertas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-4 p-3 border rounded-lg">
                  <div className={`p-1 rounded-full ${
                    alert.type === "warning" ? "bg-warning/20" :
                    alert.type === "success" ? "bg-success/20" : "bg-tech-blue/20"
                  }`}>
                    {alert.type === "warning" && <AlertTriangle className="h-4 w-4 text-warning" />}
                    {alert.type === "success" && <CheckCircle className="h-4 w-4 text-success" />}
                    {alert.type === "info" && <BarChart3 className="h-4 w-4 text-tech-blue" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">{alert.farm}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
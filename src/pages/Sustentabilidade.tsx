import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Leaf, Droplets, Zap, Recycle, TrendingDown, Award, BarChart3 } from "lucide-react";

export default function Sustentabilidade() {
  const sustainabilityMetrics = [
    {
      title: "Pegada de Carbono",
      value: "2.8 kg CO₂/kg",
      target: "2.5 kg CO₂/kg",
      progress: 75,
      trend: "down",
      icon: Leaf,
      description: "Emissões por kg de carne produzida"
    },
    {
      title: "Eficiência Hídrica",
      value: "1,240 L/kg",
      target: "1,100 L/kg",
      progress: 68,
      trend: "down",
      icon: Droplets,
      description: "Consumo de água por kg de produto"
    },
    {
      title: "Eficiência Energética",
      value: "4.2 MJ/kg",
      target: "3.8 MJ/kg",
      progress: 82,
      trend: "down",
      icon: Zap,
      description: "Energia consumida por kg produzido"
    },
    {
      title: "Taxa de Reciclagem",
      value: "94%",
      target: "98%",
      progress: 94,
      trend: "up",
      icon: Recycle,
      description: "Aproveitamento de resíduos e subprodutos"
    }
  ];

  const certifications = [
    {
      name: "ISO 14001",
      status: "active",
      description: "Gestão Ambiental",
      validUntil: "2025-12-31"
    },
    {
      name: "Carbon Trust",
      status: "active",
      description: "Pegada de Carbono Verificada",
      validUntil: "2024-08-15"
    },
    {
      name: "SRP - Sustainable Feed",
      status: "pending",
      description: "Ração Sustentável",
      validUntil: "Em processo"
    }
  ];

  const initiatives = [
    {
      title: "Ingredientes Locais",
      description: "87% dos ingredientes provêm de fornecedores locais (< 200km)",
      impact: "Redução de 23% nas emissões de transporte",
      status: "active"
    },
    {
      title: "Energia Renovável",
      description: "Transição para energia solar nas instalações produtivas",
      impact: "Meta: 60% da energia de fontes renováveis até 2025",
      status: "in_progress"
    },
    {
      title: "Economia Circular",
      description: "Reaproveitamento de subprodutos agrícolas",
      impact: "Redução de 15% no desperdício de materiais",
      status: "active"
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Painel de Sustentabilidade</h1>
          <p className="text-muted-foreground">
            Acompanhe o impacto ambiental e iniciativas sustentáveis
          </p>
        </div>
        <Badge variant="outline" className="bg-sustainability/10 text-sustainability border-sustainability/20">
          <Leaf className="w-4 h-4 mr-1" />
          ESG Compliant
        </Badge>
      </div>

      {/* Sustainability Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sustainabilityMetrics.map((metric, index) => (
          <Card key={index} variant="sustainability">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <metric.icon className="w-5 h-5 text-sustainability" />
                <Badge 
                  variant={metric.trend === "down" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {metric.trend === "down" ? <TrendingDown className="w-3 h-3" /> : "↑"}
                </Badge>
              </div>
              <CardTitle className="text-base">{metric.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{metric.value}</span>
                  <span className="text-xs text-muted-foreground">/ {metric.target}</span>
                </div>
                <p className="text-xs text-muted-foreground">{metric.description}</p>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Progresso para meta</span>
                  <span>{metric.progress}%</span>
                </div>
                <Progress value={metric.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Certifications */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Certificações Ambientais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {certifications.map((cert, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{cert.name}</span>
                    <Badge 
                      variant={cert.status === "active" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {cert.status === "active" ? "Ativa" : "Pendente"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{cert.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Válida até: {cert.validUntil}
                  </p>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  cert.status === "active" ? "bg-success" : "bg-warning"
                }`} />
              </div>
            ))}
            
            <Button variant="sustainability" className="w-full">
              <Award className="w-4 h-4 mr-2" />
              Solicitar Nova Certificação
            </Button>
          </CardContent>
        </Card>

        {/* Initiatives */}
        <Card variant="tech">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Recycle className="w-5 h-5" />
              Iniciativas Sustentáveis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {initiatives.map((initiative, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{initiative.title}</span>
                  <Badge 
                    variant={initiative.status === "active" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {initiative.status === "active" ? "Ativo" : "Em Progresso"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {initiative.description}
                </p>
                <div className="bg-sustainability/10 p-2 rounded text-sm">
                  <strong>Impacto:</strong> {initiative.impact}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Carbon Footprint Details */}
      <Card variant="gradient">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Detalhamento da Pegada de Carbono
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Alimentação</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Produção de ração</span>
                  <span>1.8 kg CO₂</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Transporte</span>
                  <span>0.3 kg CO₂</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Processamento</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Energia</span>
                  <span>0.4 kg CO₂</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Equipamentos</span>
                  <span>0.2 kg CO₂</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Outros</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Embalagem</span>
                  <span>0.1 kg CO₂</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Distribuição</span>
                  <span>0.1 kg CO₂</span>
                </div>
                <Progress value={40} className="h-2" />
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex gap-4">
            <Button variant="sustainability">
              <Leaf className="w-4 h-4 mr-2" />
              Relatório Completo
            </Button>
            <Button variant="outline">
              Comparar Períodos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
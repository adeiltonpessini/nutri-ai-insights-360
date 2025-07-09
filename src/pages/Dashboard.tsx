
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  PawPrint, 
  Users, 
  TrendingUp, 
  DollarSign,
  Building2,
  Package,
  Brain,
  Shield,
  ArrowRight,
  Crown
} from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { getUserRole, currentCompany } = useCompany();
  const navigate = useNavigate();
  const userRole = getUserRole();

  // Mock data baseado na role
  const getDashboardData = () => {
    switch (userRole) {
      case "veterinario":
        return {
          title: "Dashboard Veterinário",
          subtitle: "Gerencie seus pacientes e diagnósticos",
          stats: [
            { label: "Animais Cadastrados", value: "47", max: "100", icon: PawPrint, color: "blue" },
            { label: "Clientes Ativos", value: "12", max: "20", icon: Users, color: "green" },
            { label: "Diagnósticos IA", value: "15", change: "+3", icon: Brain, color: "purple" },
            { label: "Receitas Ativas", value: "8", change: "+2", icon: Package, color: "orange" }
          ],
          quickActions: [
            { title: "Nova Consulta", description: "Iniciar atendimento", action: () => navigate("/diagnostico"), icon: Brain },
            { title: "Cadastrar Animal", description: "Novo paciente", action: () => navigate("/veterinario"), icon: PawPrint },
            { title: "Ver Receitas", description: "Receitas ativas", action: () => navigate("/relatorios"), icon: Package }
          ]
        };
      
      case "company_admin":
        return {
          title: "Dashboard Empresa",
          subtitle: "Gerencie produtos e acompanhe performance",
          stats: [
            { label: "Produtos Ativos", value: "23", max: "200", icon: Package, color: "blue" },
            { label: "Visualizações", value: "1.2k", change: "+18%", icon: TrendingUp, color: "green" },
            { label: "Conversões", value: "89", change: "+12%", icon: DollarSign, color: "purple" },
            { label: "Parcerias", value: "34", change: "+5", icon: Building2, color: "orange" }
          ],
          quickActions: [
            { title: "Novo Produto", description: "Cadastrar produto", action: () => navigate("/produtos"), icon: Package },
            { title: "Analytics", description: "Ver relatórios", action: () => navigate("/relatorios"), icon: TrendingUp },
            { title: "Área Empresa", description: "Painel completo", action: () => navigate("/empresa"), icon: Building2 }
          ]
        };
      
      case "super_admin":
        return {
          title: "Dashboard Super Admin",
          subtitle: "Controle total da plataforma SaaS",
          stats: [
            { label: "Total Empresas", value: "34", change: "+5", icon: Building2, color: "blue" },
            { label: "Usuários Ativos", value: "156", change: "+12", icon: Users, color: "green" },
            { label: "Receita Mensal", value: "R$ 145k", change: "+18%", icon: DollarSign, color: "purple" },
            { label: "Uptime", value: "99.9%", change: "Estável", icon: Shield, color: "orange" }
          ],
          quickActions: [
            { title: "Gerir Empresas", description: "Administrar clientes", action: () => navigate("/super-admin"), icon: Building2 },
            { title: "Analytics Global", description: "Métricas da plataforma", action: () => navigate("/relatorios"), icon: TrendingUp },
            { title: "Configurações", description: "Config do sistema", action: () => navigate("/admin"), icon: Shield }
          ]
        };
      
      default:
        return {
          title: "Dashboard",
          subtitle: "Bem-vindo à plataforma",
          stats: [],
          quickActions: []
        };
    }
  };

  const dashboardData = getDashboardData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{dashboardData.title}</h1>
            <p className="text-muted-foreground">{dashboardData.subtitle}</p>
            {currentCompany && (
              <Badge variant="outline" className="mt-2">
                <Building2 className="w-3 h-3 mr-1" />
                {currentCompany.name}
              </Badge>
            )}
          </div>
          
          {userRole === "super_admin" && (
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600">
              <Crown className="w-3 h-3 mr-1" />
              Super Admin
            </Badge>
          )}
        </div>

        {/* Stats Cards */}
        {dashboardData.stats.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardData.stats.map((stat, index) => {
              const IconComponent = stat.icon;
              const hasProgress = stat.max;
              const progressValue = hasProgress ? (parseInt(stat.value) / parseInt(stat.max)) * 100 : 0;
              
              return (
                <Card key={index} className="border-muted hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                    <IconComponent className={`h-4 w-4 text-${stat.color}-600`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    {hasProgress ? (
                      <>
                        <div className="text-xs text-muted-foreground mb-2">
                          de {stat.max} {stat.label.includes("Animais") ? "permitidos" : "disponíveis"}
                        </div>
                        <Progress value={progressValue} className="h-2" />
                      </>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        {stat.change}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Quick Actions */}
        {dashboardData.quickActions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dashboardData.quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Card key={index} className="border-muted hover:shadow-lg transition-all cursor-pointer group" onClick={action.action}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold mb-1">{action.title}</h3>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-5 h-5 text-primary" />
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Welcome Section for new users */}
        {(!userRole || dashboardData.stats.length === 0) && (
          <Card className="border-primary/20 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Bem-vindo à VetSaaS Pro!</h2>
              <p className="text-muted-foreground mb-6">
                Configure sua conta para começar a usar todas as funcionalidades da plataforma.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => navigate("/pricing")}>
                  Ver Planos
                </Button>
                <Button variant="outline" onClick={() => navigate("/configuracoes")}>
                  Configurar Conta
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

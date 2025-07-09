
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Building2, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Shield,
  Settings,
  BarChart3,
  UserCheck,
  Plus,
  Search,
  Filter
} from "lucide-react";

export default function SuperAdminArea() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Mock data - em produção viria do banco
  const stats = {
    totalCompanies: 34,
    activeSubscriptions: 29,
    totalRevenue: 145600,
    monthlyGrowth: 18.5,
    totalUsers: 156,
    activeUsers: 142
  };

  const recentCompanies = [
    { id: 1, name: "Clínica Veterinária São Paulo", type: "Veterinário", plan: "Pro", status: "Ativo", users: 5 },
    { id: 2, name: "MedVet Pharma", type: "Medicamentos", plan: "Enterprise", status: "Ativo", users: 12 },
    { id: 3, name: "NutriPet Foods", type: "Alimentos", plan: "Basic", status: "Pendente", users: 3 }
  ];

  const subscriptionStats = [
    { plan: "Básico", count: 12, revenue: "R$ 35.400", color: "blue" },
    { plan: "Profissional", count: 15, revenue: "R$ 89.250", color: "green" },
    { plan: "Enterprise", count: 7, revenue: "R$ 20.950", color: "purple" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Área de Super Administrador</h1>
          <p className="text-muted-foreground">
            Controle total da plataforma SaaS - empresas, usuários e receitas
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="companies">Empresas</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="billing">Faturamento</TabsTrigger>
            <TabsTrigger value="plans">Planos</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Empresas</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCompanies}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.activeSubscriptions} com assinatura ativa
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeUsers}</div>
                  <div className="text-xs text-muted-foreground mb-2">
                    de {stats.totalUsers} total
                  </div>
                  <Progress value={(stats.activeUsers / stats.totalUsers) * 100} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ {(stats.totalRevenue / 1000).toFixed(0)}k</div>
                  <p className="text-xs text-muted-foreground">
                    Este mês
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Crescimento</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+{stats.monthlyGrowth}%</div>
                  <p className="text-xs text-muted-foreground">
                    vs. mês anterior
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Empresas Recentes</CardTitle>
                  <CardDescription>Últimas empresas cadastradas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentCompanies.map((company) => (
                      <div key={company.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{company.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {company.type} - {company.users} usuários
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={company.status === "Ativo" ? "default" : "secondary"}>
                            {company.plan}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {company.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Ver Todas as Empresas
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas de Planos</CardTitle>
                  <CardDescription>Distribuição por tipo de plano</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subscriptionStats.map((stat, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{stat.plan}</p>
                          <p className="text-sm text-muted-foreground">
                            {stat.count} empresas
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{stat.revenue}</p>
                          <Badge variant="outline">
                            {((stat.count / stats.activeSubscriptions) * 100).toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Relatório Completo
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="companies" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestão de Empresas</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nova Empresa
              </Button>
            </div>

            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <input
                  placeholder="Buscar empresas..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
                  Lista completa de empresas será implementada aqui
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestão de Usuários</h2>
              <Button>
                <UserCheck className="w-4 h-4 mr-2" />
                Novo Usuário
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
                  Lista de usuários será implementada aqui
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <h2 className="text-2xl font-bold">Faturamento e Pagamentos</h2>
            
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
                  Sistema de faturamento será implementado aqui
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plans" className="space-y-6">
            <h2 className="text-2xl font-bold">Gestão de Planos</h2>
            
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
                  Configuração de planos será implementada aqui
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold">Configurações do Sistema</h2>
            
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
                  Configurações gerais serão implementadas aqui
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Package, 
  BarChart3, 
  Users, 
  TrendingUp, 
  Plus,
  Search,
  Filter,
  Eye
} from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";

export default function EmpresaArea() {
  const { currentCompany } = useCompany();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Mock data - em produção viria do banco
  const stats = {
    totalProducts: 23,
    maxProducts: 200,
    activeProducts: 21,
    totalViews: 1247,
    monthlyGrowth: 12.5
  };

  const recentProducts = [
    { id: 1, name: "Antibiótico Premium", category: "Medicamento", status: "Ativo", views: 45 },
    { id: 2, name: "Ração Especial Filhotes", category: "Alimento", status: "Ativo", views: 32 },
    { id: 3, name: "Suplemento Vitamínico", category: "Medicamento", status: "Pendente", views: 18 }
  ];

  const topPerforming = [
    { name: "Antibiótico Premium", category: "Medicamento", sales: 156, growth: "+23%" },
    { name: "Ração Premium Adult", category: "Alimento", sales: 134, growth: "+18%" },
    { name: "Anti-inflamatório", category: "Medicamento", sales: 98, growth: "+15%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Área da Empresa</h1>
          <p className="text-muted-foreground">
            Gerencie seus produtos, analise performance e acompanhe vendas
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="integrations">Integrações</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Produtos Cadastrados</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProducts}</div>
                  <div className="text-xs text-muted-foreground mb-2">
                    de {stats.maxProducts} permitidos
                  </div>
                  <Progress value={(stats.totalProducts / stats.maxProducts) * 100} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Produtos Ativos</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeProducts}</div>
                  <p className="text-xs text-muted-foreground">
                    {((stats.activeProducts / stats.totalProducts) * 100).toFixed(1)}% do total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalViews}</div>
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
                  <CardTitle>Produtos Recentes</CardTitle>
                  <CardDescription>Últimos produtos cadastrados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={product.status === "Ativo" ? "default" : "secondary"}>
                            {product.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {product.views} views
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Ver Todos os Produtos
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performance</CardTitle>
                  <CardDescription>Produtos com melhor desempenho</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPerforming.map((product, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{product.sales} vendas</p>
                          <Badge variant="default" className="text-xs">
                            {product.growth}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Ver Relatório Completo
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestão de Produtos</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Produto
              </Button>
            </div>

            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <input
                  placeholder="Buscar produtos..."
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
                  Lista de produtos será implementada aqui
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics e Relatórios</h2>
            
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
                  Dashboards e relatórios serão implementados aqui
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <h2 className="text-2xl font-bold">Integrações</h2>
            
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
                  Integrações com veterinários serão implementadas aqui
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

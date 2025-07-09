
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Activity,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Calendar,
  Target,
  Zap,
  Shield
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Cell } from 'recharts';
import { useCompany } from "@/contexts/CompanyContext";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const { currentCompany, getUserRole } = useCompany();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalAnimals: 0,
      activeProperties: 0,
      monthlyRevenue: 0,
      efficiency: 0,
      totalUsers: 0,
      totalProducts: 0
    },
    performanceData: [],
    alerts: [],
    recentActivity: []
  });

  const userRole = getUserRole();
  const isSuperAdmin = userRole === 'super_admin';
  const isCompanyAdmin = userRole === 'company_admin';
  const isVeterinario = userRole === 'veterinario';

  useEffect(() => {
    loadDashboardData();
  }, [currentCompany]);

  const loadDashboardData = async () => {
    if (!currentCompany) return;

    try {
      setLoading(true);

      // Carregar estatísticas gerais
      const [animalsRes, propertiesRes, performanceRes, diagnosticsRes, usersRes, productsRes] = await Promise.all([
        supabase.from('animais').select('id').eq('company_id', currentCompany.id),
        supabase.from('propriedades').select('id').eq('company_id', currentCompany.id),
        supabase.from('performance_historico').select('*').eq('company_id', currentCompany.id).order('data_medicao', { ascending: false }).limit(30),
        supabase.from('diagnosticos').select('*').eq('company_id', currentCompany.id).order('created_at', { ascending: false }).limit(10),
        supabase.from('user_roles').select('id').eq('company_id', currentCompany.id).eq('is_active', true),
        supabase.from('company_products').select('id, price').eq('company_id', currentCompany.id).eq('is_active', true)
      ]);

      const totalAnimals = animalsRes.data?.length || 0;
      const activeProperties = propertiesRes.data?.length || 0;
      const totalUsers = usersRes.data?.length || 0;
      const totalProducts = productsRes.data?.length || 0;

      // Calcular receita estimada
      const monthlyRevenue = productsRes.data?.reduce((sum, product) => {
        return sum + (product.price || 0) * 10; // Estimativa simplificada
      }, 0) || 0;

      // Calcular eficiência média
      const recentPerformance = performanceRes.data?.slice(0, 10) || [];
      const avgEfficiency = recentPerformance.length > 0 
        ? recentPerformance.reduce((sum, p) => sum + (p.conversao_alimentar || 0), 0) / recentPerformance.length
        : 0;
      const efficiency = avgEfficiency > 0 ? Math.max(0, 100 - (avgEfficiency * 20)) : 85;

      // Preparar dados de performance para gráfico
      const performanceData = recentPerformance.map((item, index) => ({
        name: `Dia ${index + 1}`,
        conversao: item.conversao_alimentar || 0,
        peso: item.peso_medio || 0,
        ganho: item.ganho_peso_diario || 0
      }));

      // Preparar alertas
      const alerts = [];
      
      if (avgEfficiency > 3.5) {
        alerts.push({
          type: 'warning',
          title: 'Conversão Alimentar Alta',
          description: `Média de ${avgEfficiency.toFixed(2)} - Revisar nutrição`,
          priority: 'high'
        });
      }

      if (totalAnimals > (currentCompany.max_animals || 100) * 0.8) {
        alerts.push({
          type: 'info',
          title: 'Limite de Animais',
          description: `${totalAnimals}/${currentCompany.max_animals} animais cadastrados`,
          priority: 'medium'
        });
      }

      // Atividade recente
      const recentActivity = diagnosticsRes.data?.slice(0, 5).map(d => ({
        id: d.id,
        type: 'diagnostic',
        title: `Diagnóstico ${d.tipo_diagnostico}`,
        time: new Date(d.created_at).toLocaleDateString('pt-BR'),
        status: d.status
      })) || [];

      setDashboardData({
        stats: {
          totalAnimals,
          activeProperties,
          monthlyRevenue,
          efficiency: Math.round(efficiency),
          totalUsers,
          totalProducts
        },
        performanceData,
        alerts,
        recentActivity
      });

    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderSuperAdminStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Empresas</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">34</div>
          <p className="text-xs text-muted-foreground">+12% este mês</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ 145.600</div>
          <p className="text-xs text-muted-foreground">+18% este mês</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1.248</div>
          <p className="text-xs text-muted-foreground">+5% esta semana</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Crescimento</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+23%</div>
          <p className="text-xs text-muted-foreground">Trimestre atual</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderCompanyStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Animais</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dashboardData.stats.totalAnimals}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Progress 
              value={(dashboardData.stats.totalAnimals / (currentCompany?.max_animals || 100)) * 100} 
              className="w-20 h-2 mr-2" 
            />
            {currentCompany?.max_animals || 100} máximo
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Propriedades</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dashboardData.stats.activeProperties}</div>
          <p className="text-xs text-muted-foreground">Propriedades ativas</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Produtos Ativos</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dashboardData.stats.totalProducts}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Progress 
              value={(dashboardData.stats.totalProducts / (currentCompany?.max_products || 50)) * 100} 
              className="w-20 h-2 mr-2" 
            />
            {currentCompany?.max_products || 50} máximo
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Eficiência</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dashboardData.stats.efficiency}%</div>
          <p className="text-xs text-muted-foreground">Performance geral</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {isSuperAdmin ? 'Dashboard Geral' : `Dashboard - ${currentCompany?.name}`}
          </h1>
          <p className="text-muted-foreground">
            {isSuperAdmin 
              ? 'Visão geral de todas as empresas e usuários da plataforma'
              : `Acompanhe a performance e atividades da ${currentCompany?.name}`
            }
          </p>
        </div>

        {isSuperAdmin ? renderSuperAdminStats() : renderCompanyStats()}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="alerts">Alertas</TabsTrigger>
            <TabsTrigger value="activity">Atividade</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Recente</CardTitle>
                  <CardDescription>Conversão alimentar dos últimos 30 dias</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dashboardData.performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="conversao" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resumo do Plano</CardTitle>
                  <CardDescription>Utilização atual dos recursos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Animais</span>
                      <span>{dashboardData.stats.totalAnimals}/{currentCompany?.max_animals || 100}</span>
                    </div>
                    <Progress value={(dashboardData.stats.totalAnimals / (currentCompany?.max_animals || 100)) * 100} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Produtos</span>
                      <span>{dashboardData.stats.totalProducts}/{currentCompany?.max_products || 50}</span>
                    </div>
                    <Progress value={(dashboardData.stats.totalProducts / (currentCompany?.max_products || 50)) * 100} />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Usuários</span>
                      <span>{dashboardData.stats.totalUsers}/{currentCompany?.max_users || 5}</span>
                    </div>
                    <Progress value={(dashboardData.stats.totalUsers / (currentCompany?.max_users || 5)) * 100} />
                  </div>

                  <div className="pt-4">
                    <Badge variant="secondary" className="w-full justify-center">
                      Plano {currentCompany?.subscription_plan?.toUpperCase() || 'BÁSICO'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Performance</CardTitle>
                <CardDescription>Métricas detalhadas de desempenho</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={dashboardData.performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="conversao" fill="#8884d8" name="Conversão Alimentar" />
                    <Bar dataKey="ganho" fill="#82ca9d" name="Ganho de Peso" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="grid gap-4">
              {dashboardData.alerts.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Tudo funcionando bem!</h3>
                    <p className="text-muted-foreground">Não há alertas no momento.</p>
                  </CardContent>
                </Card>
              ) : (
                dashboardData.alerts.map((alert, index) => (
                  <Card key={index} className={`border-l-4 ${
                    alert.type === 'warning' ? 'border-l-orange-500' : 
                    alert.type === 'error' ? 'border-l-red-500' : 'border-l-blue-500'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-orange-500" />}
                        <div>
                          <h4 className="font-semibold">{alert.title}</h4>
                          <p className="text-sm text-muted-foreground">{alert.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
                <CardDescription>Últimas ações realizadas no sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.recentActivity.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhuma atividade recente
                    </p>
                  ) : (
                    dashboardData.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                        <Activity className="w-4 h-4 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.time}</p>
                        </div>
                        <Badge variant={activity.status === 'concluido' ? 'default' : 'secondary'}>
                          {activity.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

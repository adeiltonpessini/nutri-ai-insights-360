import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Users, 
  TrendingUp,
  DollarSign,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Settings
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { supabase } from "@/integrations/supabase/client";

interface SuperAdminStats {
  totalOrganizations: number;
  vetOrganizations: number;
  companyOrganizations: number;
  farmOrganizations: number;
  totalUsers: number;
}

export function SuperAdminDashboard() {
  const [stats, setStats] = useState<SuperAdminStats | null>(null);
  const [planData, setPlanData] = useState<Record<string, number>>({});
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSuperAdminData = async () => {
      try {
        const [orgsRes, usersRes] = await Promise.all([
          supabase.from('companies').select('*'),
          supabase.from('profiles').select('*')
        ]);

        if (orgsRes.data) {
          const vetOrgs = orgsRes.data.filter(org => org.company_type === 'veterinario').length;
          const companyOrgs = orgsRes.data.filter(org => 
            org.company_type === 'empresa_alimento' || org.company_type === 'empresa_medicamento'
          ).length;
          const farmOrgs = orgsRes.data.filter(org => org.company_type === 'geral').length;

          setStats({
            totalOrganizations: orgsRes.data.length,
            vetOrganizations: vetOrgs,
            companyOrganizations: companyOrgs,
            farmOrganizations: farmOrgs,
            totalUsers: usersRes.data?.length || 0
          });

          const planDistribution = orgsRes.data.reduce((acc, org) => {
            const plan = org.subscription_plan || 'basico';
            acc[plan] = (acc[plan] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          setPlanData(planDistribution);

          // Calcular crescimento mensal (últimos 6 meses)
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

          const monthlyGrowth = orgsRes.data
            .filter(org => new Date(org.created_at) >= sixMonthsAgo)
            .reduce((acc, org) => {
              const month = new Date(org.created_at).toLocaleDateString('pt-BR', { 
                month: 'short', 
                year: 'numeric' 
              });
              acc[month] = (acc[month] || 0) + 1;
              return acc;
            }, {} as Record<string, number>);

          setGrowthData(Object.entries(monthlyGrowth).map(([month, count]) => ({
            month,
            organizations: count
          })));
        }
      } catch (error) {
        console.error('Erro ao carregar dados super admin:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSuperAdminData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stats) return null;

  const organizationsByType = [
    { name: 'Clínicas', value: stats.vetOrganizations, color: '#8884d8' },
    { name: 'Empresas', value: stats.companyOrganizations, color: '#82ca9d' },
    { name: 'Fazendas', value: stats.farmOrganizations, color: '#ffc658' }
  ];

  const organizationsByPlan = Object.entries(planData).map(([plan, count]) => ({
    name: plan.toUpperCase(),
    value: count,
    color: plan === 'basico' ? '#ff7300' : plan === 'profissional' ? '#00ff00' : '#0088fe'
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Painel Super Admin</h1>
          <p className="text-muted-foreground">
            Visão geral completa do InfinityVet SaaS
          </p>
        </div>

        {/* Cards de estatísticas principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Organizações</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrganizations}</div>
              <p className="text-xs text-muted-foreground">+12% este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários Totais</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Usuários cadastrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clínicas Veterinárias</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.vetOrganizations}</div>
              <p className="text-xs text-muted-foreground">Clínicas ativas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Crescimento</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+23%</div>
              <p className="text-xs text-muted-foreground">Crescimento mensal</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de crescimento */}
          <Card>
            <CardHeader>
              <CardTitle>Crescimento da Plataforma</CardTitle>
              <CardDescription>Organizações ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="organizations" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Organizações"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribuição por tipo */}
          <Card>
            <CardHeader>
              <CardTitle>Organizações por Tipo</CardTitle>
              <CardDescription>Distribuição dos tipos de organizações</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={organizationsByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    dataKey="value"
                  >
                    {organizationsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-4">
                {organizationsByType.map((entry, index) => (
                  <Badge key={index} variant="outline" className="gap-1">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: entry.color }}
                    />
                    {entry.name}: {entry.value}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Distribuição por plano */}
          <Card>
            <CardHeader>
              <CardTitle>Organizações por Plano</CardTitle>
              <CardDescription>Distribuição dos planos de assinatura</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={organizationsByPlan}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Resumo de métricas */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo Geral</CardTitle>
              <CardDescription>Principais métricas do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-primary" />
                    <span>Total de Organizações</span>
                  </div>
                  <Badge variant="outline">{stats.totalOrganizations}</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-primary" />
                    <span>Usuários Ativos</span>
                  </div>
                  <Badge variant="outline">{stats.totalUsers}</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-primary" />
                    <span>Clínicas Veterinárias</span>
                  </div>
                  <Badge variant="outline">{stats.vetOrganizations}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
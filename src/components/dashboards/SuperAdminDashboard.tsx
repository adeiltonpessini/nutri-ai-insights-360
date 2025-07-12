
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
  totalUsers: number;
  activeUsers: number;
  monthlyRevenue: number;
  organizationsByType: any[];
  organizationsByPlan: any[];
  growthData: any[];
  recentSignups: any[];
}

export function SuperAdminDashboard() {
  const [stats, setStats] = useState<SuperAdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuperAdminData();
  }, []);

  const loadSuperAdminData = async () => {
    try {
      setLoading(true);

      // Carregar dados do super admin
      const [orgsRes, usersRes] = await Promise.all([
        supabase.from('organizations').select('*'),
        supabase.from('user_profiles').select('*')
      ]);

      const organizations = orgsRes.data || [];
      const users = usersRes.data || [];

      // Estatísticas por tipo de organização
      const orgsByType = organizations.reduce((acc: any, org) => {
        acc[org.type] = (acc[org.type] || 0) + 1;
        return acc;
      }, {});

      const organizationsByType = Object.entries(orgsByType).map(([type, count]) => ({
        name: type === 'vet' ? 'Clínicas' : type === 'empresa' ? 'Empresas' : 'Fazendas',
        value: count,
        color: type === 'vet' ? '#8884d8' : type === 'empresa' ? '#82ca9d' : '#ffc658'
      }));

      // Estatísticas por plano
      const orgsByPlan = organizations.reduce((acc: any, org) => {
        acc[org.plan] = (acc[org.plan] || 0) + 1;
        return acc;
      }, {});

      const organizationsByPlan = Object.entries(orgsByPlan).map(([plan, count]) => ({
        name: plan.toUpperCase(),
        value: count,
        color: plan === 'free' ? '#ff7300' : plan === 'pro' ? '#00ff00' : '#0088fe'
      }));

      // Dados de crescimento mockados (implementar com dados reais)
      const growthData = [
        { month: 'Jan', organizations: 12, users: 45 },
        { month: 'Fev', organizations: 18, users: 68 },
        { month: 'Mar', organizations: 25, users: 89 },
        { month: 'Abr', organizations: 32, users: 124 },
        { month: 'Mai', organizations: 41, users: 156 },
        { month: 'Jun', organizations: organizations.length, users: users.length }
      ];

      setStats({
        totalOrganizations: organizations.length,
        totalUsers: users.length,
        activeUsers: users.filter(u => new Date(u.created_at).getMonth() === new Date().getMonth()).length,
        monthlyRevenue: organizations.length * 99.90, // Cálculo simplificado
        organizationsByType,
        organizationsByPlan,
        growthData,
        recentSignups: users.slice(-5).reverse()
      });

    } catch (error) {
      console.error('Erro ao carregar dados do super admin:', error);
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

  if (!stats) return null;

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
              <p className="text-xs text-muted-foreground">{stats.activeUsers} novos este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {stats.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">+18% vs mês anterior</p>
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
              <CardDescription>Organizações e usuários ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.growthData}>
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
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    name="Usuários"
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
                    data={stats.organizationsByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    dataKey="value"
                  >
                    {stats.organizationsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-4">
                {stats.organizationsByType.map((entry, index) => (
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
                <BarChart data={stats.organizationsByPlan}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Cadastros recentes */}
          <Card>
            <CardHeader>
              <CardTitle>Cadastros Recentes</CardTitle>
              <CardDescription>Últimos usuários cadastrados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentSignups.map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Activity className="w-4 h-4 text-primary" />
                      <div>
                        <p className="font-medium">{user.nome}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{user.role}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Building2, 
  Users, 
  CreditCard, 
  TrendingUp, 
  Activity,
  Settings,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Shield,
  DollarSign,
  BarChart3
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Company {
  id: string;
  name: string;
  email: string;
  subscription_plan: string;
  subscription_expires_at: string;
  created_at: string;
  is_active: boolean;
  company_type: string;
}

interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  current_period_end: string;
  created_at: string;
}

interface Analytics {
  totalCompanies: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  churnRate: number;
  newSignups: number;
  totalUsers: number;
}

export default function SuperAdminArea() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalCompanies: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    churnRate: 0,
    newSignups: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadSuperAdminData();
    }
  }, [user]);

  const loadSuperAdminData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Check if user is super admin
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'super_admin')
        .maybeSingle();

      if (!userRole) {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar esta área.",
          variant: "destructive"
        });
        return;
      }

      // Load companies
      const { data: companiesData } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      // Load subscriptions
      const { data: subscriptionsData } = await supabase
        .from('user_subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      // Load user count
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      setCompanies(companiesData || []);
      setSubscriptions(subscriptionsData || []);

      // Calculate analytics
      const activeSubscriptions = subscriptionsData?.filter(s => s.status === 'active').length || 0;
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const newSignups = companiesData?.filter(c => new Date(c.created_at) >= thisMonth).length || 0;

      setAnalytics({
        totalCompanies: companiesData?.length || 0,
        activeSubscriptions,
        monthlyRevenue: activeSubscriptions * 99.90, // Mock calculation
        churnRate: 5.2, // Mock data
        newSignups,
        totalUsers: userCount || 0
      });

    } catch (error) {
      console.error('Error loading super admin data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados administrativos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const revenueData = [
    { month: 'Jan', revenue: 12450 },
    { month: 'Fev', revenue: 15230 },
    { month: 'Mar', revenue: 18650 },
    { month: 'Abr', revenue: 22100 },
    { month: 'Mai', revenue: 25890 },
    { month: 'Jun', revenue: 28340 }
  ];

  const planDistribution = [
    { name: 'Starter', value: 45, color: '#3B82F6' },
    { name: 'Professional', value: 35, color: '#8B5CF6' },
    { name: 'Enterprise', value: 20, color: '#10B981' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Shield className="w-8 h-8 text-purple-600" />
            Super Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Painel de controle e analytics do VetSaaS Pro
          </p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Empresas</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalCompanies}</div>
              <p className="text-xs text-green-600">
                +{analytics.newSignups} este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assinaturas Ativas</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.activeSubscriptions}</div>
              <p className="text-xs text-muted-foreground">
                Taxa de conversão: 85%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {analytics.monthlyRevenue.toFixed(2)}</div>
              <p className="text-xs text-green-600">
                +12% vs mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Churn: {analytics.churnRate}%
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="companies">Empresas</TabsTrigger>
            <TabsTrigger value="subscriptions">Assinaturas</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Receita Mensal</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Planos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={planDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {planDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="companies" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gerenciar Empresas</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Buscar empresas..." className="pl-10 w-64" />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {companies.map((company) => (
                <Card key={company.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{company.name}</h3>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>Email: {company.email}</p>
                          <p>Tipo: {company.company_type}</p>
                          <p>Criado em: {new Date(company.created_at).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={company.is_active ? "default" : "secondary"}>
                          {company.is_active ? "Ativa" : "Inativa"}
                        </Badge>
                        <Badge variant="outline">
                          {company.subscription_plan}
                        </Badge>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="subscriptions" className="space-y-6">
            <h2 className="text-2xl font-bold">Gerenciar Assinaturas</h2>
            
            <div className="grid gap-4">
              {subscriptions.map((subscription) => (
                <Card key={subscription.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{subscription.plan_id}</h3>
                        <p className="text-sm text-muted-foreground">
                          Usuário: {subscription.user_id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Termina em: {subscription.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString('pt-BR') : 'N/A'}
                        </p>
                      </div>
                      <Badge variant={subscription.status === 'active' ? "default" : "secondary"}>
                        {subscription.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics Detalhados</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Métricas de Crescimento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>CAC (Custo de Aquisição)</span>
                    <span className="font-bold">R$ 85,50</span>
                  </div>
                  <div className="flex justify-between">
                    <span>LTV (Lifetime Value)</span>
                    <span className="font-bold">R$ 2.400,00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>LTV/CAC Ratio</span>
                    <span className="font-bold text-green-600">28:1</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payback Period</span>
                    <span className="font-bold">2.1 meses</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Retenção de Clientes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Retenção 30 dias</span>
                    <span className="font-bold text-green-600">94%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Retenção 90 dias</span>
                    <span className="font-bold text-green-600">87%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Retenção 12 meses</span>
                    <span className="font-bold text-yellow-600">72%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Churn Rate Mensal</span>
                    <span className="font-bold text-red-600">5.2%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

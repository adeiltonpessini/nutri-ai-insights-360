
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Activity, 
  FileText,
  Package,
  AlertTriangle,
  Stethoscope,
  PillBottle,
  TrendingUp
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DashboardHeader, PlanSummary } from "./InfinityVetDashboard";

interface VetStats {
  totalAnimals: number;
  totalDiagnostics: number;
  totalPrescriptions: number;
  totalProducts: number;
  totalEmployees: number;
  lowStockItems: number;
  monthlyRevenue: number;
  recentActivity: any[];
  alerts: any[];
}

interface VetDashboardProps {
  stats: VetStats | null;
}

export function VetDashboard({ stats }: VetDashboardProps) {
  if (!stats) return null;

  // Dados mockados para os gráficos (implementar com dados reais posteriormente)
  const chartData = [
    { name: 'Jan', diagnostics: 45, prescriptions: 38 },
    { name: 'Feb', diagnostics: 52, prescriptions: 41 },
    { name: 'Mar', diagnostics: 48, prescriptions: 44 },
    { name: 'Abr', diagnostics: 61, prescriptions: 52 },
    { name: 'Mai', diagnostics: 55, prescriptions: 49 },
    { name: 'Jun', diagnostics: 58, prescriptions: 51 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader />

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Animais em Tratamento</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAnimals}</div>
              <p className="text-xs text-muted-foreground">+12% este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Diagnósticos</CardTitle>
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDiagnostics}</div>
              <p className="text-xs text-muted-foreground">+8% esta semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receitas Emitidas</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPrescriptions}</div>
              <p className="text-xs text-muted-foreground">+15% este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.lowStockItems}</div>
              <p className="text-xs text-muted-foreground">Itens para repor</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de atividades */}
          <Card>
            <CardHeader>
              <CardTitle>Atividades Mensais</CardTitle>
              <CardDescription>Diagnósticos e receitas dos últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="diagnostics" fill="#8884d8" name="Diagnósticos" />
                  <Bar dataKey="prescriptions" fill="#82ca9d" name="Receitas" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Resumo do plano */}
          <PlanSummary />
        </div>

        {/* Alertas e atividades recentes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Alertas</CardTitle>
              <CardDescription>Notificações importantes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.alerts.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum alerta no momento
                  </p>
                ) : (
                  stats.alerts.map((alert, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-orange-200 bg-orange-50">
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="font-medium">{alert.message}</p>
                        <p className="text-sm text-muted-foreground">Verificar estoque</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Produtos Mais Indicados</CardTitle>
              <CardDescription>Top 5 produtos recomendados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Antibiótico A', count: 45, trend: '+12%' },
                  { name: 'Anti-inflamatório B', count: 38, trend: '+8%' },
                  { name: 'Suplemento C', count: 32, trend: '+15%' },
                  { name: 'Vacina D', count: 28, trend: '+5%' },
                  { name: 'Vermífugo E', count: 24, trend: '+3%' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <PillBottle className="w-4 h-4 text-primary" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{item.count}</p>
                      <p className="text-xs text-green-600">{item.trend}</p>
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

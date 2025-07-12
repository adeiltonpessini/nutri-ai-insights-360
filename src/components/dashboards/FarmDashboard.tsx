
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  TrendingUp, 
  Scale,
  Activity,
  Syringe,
  BarChart3,
  AlertCircle,
  Wheat
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DashboardHeader, PlanSummary } from "./InfinityVetDashboard";

interface FarmStats {
  totalAnimals: number;
  totalLots: number;
  totalVaccinations: number;
  totalProducts: number;
  totalEmployees: number;
  avgWeight: number;
  mortalityRate: number;
  monthlyRevenue: number;
  recentActivity: any[];
  alerts: any[];
}

interface FarmDashboardProps {
  stats: FarmStats | null;
}

export function FarmDashboard({ stats }: FarmDashboardProps) {
  if (!stats) return null;

  // Dados mockados para os gráficos
  const weightData = [
    { month: 'Jan', peso: 25.5, ganho: 1.2 },
    { month: 'Fev', peso: 28.3, ganho: 1.4 },
    { month: 'Mar', peso: 31.8, ganho: 1.6 },
    { month: 'Abr', peso: 35.2, ganho: 1.3 },
    { month: 'Mai', peso: 38.9, ganho: 1.5 },
    { month: 'Jun', peso: 42.1, ganho: 1.4 }
  ];

  const lotData = [
    { name: 'Lote A', animais: 150, peso_medio: 42.5, status: 'ativo' },
    { name: 'Lote B', animais: 120, peso_medio: 38.2, status: 'ativo' },
    { name: 'Lote C', animais: 180, peso_medio: 45.8, status: 'ativo' },
    { name: 'Lote D', animais: 95, peso_medio: 35.1, status: 'terminação' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader />

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Animais</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAnimals}</div>
              <p className="text-xs text-muted-foreground">+8% este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lotes Ativos</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLots}</div>
              <p className="text-xs text-muted-foreground">{lotData.filter(l => l.status === 'ativo').length} em produção</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Peso Médio</CardTitle>
              <Scale className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgWeight.toFixed(1)} kg</div>
              <p className="text-xs text-muted-foreground">+5% vs mês anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vacinações</CardTitle>
              <Syringe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVaccinations}</div>
              <p className="text-xs text-muted-foreground">Este mês</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de evolução de peso */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução do Peso Médio</CardTitle>
              <CardDescription>Peso médio e ganho mensal dos últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="peso" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Peso Médio (kg)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ganho" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    name="Ganho Diário (kg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance por lote */}
          <Card>
            <CardHeader>
              <CardTitle>Performance por Lote</CardTitle>
              <CardDescription>Peso médio por lote de animais</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={lotData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="peso_medio" fill="#8884d8" name="Peso Médio (kg)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status dos lotes */}
          <Card>
            <CardHeader>
              <CardTitle>Status dos Lotes</CardTitle>
              <CardDescription>Informações detalhadas por lote</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lotData.map((lote, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Wheat className="w-4 h-4 text-primary" />
                      <div>
                        <p className="font-medium">{lote.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {lote.animais} animais
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{lote.peso_medio} kg</p>
                      <Badge 
                        variant={lote.status === 'ativo' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {lote.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Eventos recentes */}
          <Card>
            <CardHeader>
              <CardTitle>Eventos Zootécnicos Recentes</CardTitle>
              <CardDescription>Últimas atividades registradas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentActivity.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum evento recente
                  </p>
                ) : (
                  stats.recentActivity.slice(0, 5).map((event, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                      <Activity className="w-4 h-4 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">{event.tipo_evento}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.data_evento).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      {event.peso_registrado && (
                        <Badge variant="outline">
                          {event.peso_registrado} kg
                        </Badge>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

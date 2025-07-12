
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  TrendingUp, 
  Users,
  MapPin,
  Target,
  Award,
  Building2
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DashboardHeader, PlanSummary } from "./InfinityVetDashboard";

interface CompanyStats {
  totalAnimals: number;
  totalProducts: number;
  totalEmployees: number;
  totalIndications: number;
  monthlyRevenue: number;
  topVeterinarians: any[];
  topProducts: any[];
  recentActivity: any[];
  alerts: any[];
}

interface CompanyDashboardProps {
  stats: CompanyStats | null;
}

export function CompanyDashboard({ stats }: CompanyDashboardProps) {
  if (!stats) return null;

  // Dados mockados para os gráficos
  const productData = [
    { name: 'Ração Premium', vendas: 450, crescimento: 12 },
    { name: 'Suplemento A', vendas: 380, crescimento: 8 },
    { name: 'Vitamina B', vendas: 320, crescimento: 15 },
    { name: 'Probiótico C', vendas: 280, crescimento: 5 },
    { name: 'Mineral D', vendas: 240, crescimento: 3 }
  ];

  const regionData = [
    { name: 'SP', value: 35, color: '#8884d8' },
    { name: 'MG', value: 25, color: '#82ca9d' },
    { name: 'PR', value: 20, color: '#ffc658' },
    { name: 'RS', value: 12, color: '#ff7300' },
    { name: 'Outros', value: 8, color: '#00ff00' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader />

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos Ativos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">+5% este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Indicações</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalIndications}</div>
              <p className="text-xs text-muted-foreground">+18% este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Veterinários Parceiros</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">248</div>
              <p className="text-xs text-muted-foreground">+12 novos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Crescimento</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+23%</div>
              <p className="text-xs text-muted-foreground">vs mês anterior</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de produtos */}
          <Card>
            <CardHeader>
              <CardTitle>Top Produtos por Indicações</CardTitle>
              <CardDescription>Produtos mais recomendados por veterinários</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="vendas" fill="#8884d8" name="Indicações" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de regiões */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Região</CardTitle>
              <CardDescription>Vendas por estado</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={regionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    dataKey="value"
                  >
                    {regionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-4">
                {regionData.map((entry, index) => (
                  <Badge key={index} variant="outline" className="gap-1">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: entry.color }}
                    />
                    {entry.name}: {entry.value}%
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top veterinários */}
          <Card>
            <CardHeader>
              <CardTitle>Top Veterinários Parceiros</CardTitle>
              <CardDescription>Profissionais que mais indicam produtos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Dr. João Silva', clinic: 'Clínica VetCare', indications: 89 },
                  { name: 'Dra. Maria Santos', clinic: 'Pet Health', indications: 76 },
                  { name: 'Dr. Carlos Lima', clinic: 'Animal Center', indications: 64 },
                  { name: 'Dra. Ana Costa', clinic: 'Vida Animal', indications: 58 },
                  { name: 'Dr. Pedro Oliveira', clinic: 'Pet Plus', indications: 52 }
                ].map((vet, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Award className="w-4 h-4 text-primary" />
                      <div>
                        <p className="font-medium">{vet.name}</p>
                        <p className="text-sm text-muted-foreground">{vet.clinic}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{vet.indications}</p>
                      <p className="text-xs text-muted-foreground">indicações</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resumo do plano */}
          <PlanSummary />
        </div>
      </div>
    </div>
  );
}

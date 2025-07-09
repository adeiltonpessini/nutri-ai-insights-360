
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ClipboardList, AlertTriangle, Package, Calendar } from "lucide-react";

interface DashboardStats {
  totalAnimals: number;
  pendingTasks: number;
  healthAlerts: number;
  lowStockItems: number;
  scheduledEvents: number;
}

interface DashboardProps {
  stats: DashboardStats;
  calendarioVet: any[];
  historicoSaude: any[];
}

export function VeterinarioDashboard({ stats, calendarioVet, historicoSaude }: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* Dashboard de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Animais Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAnimals}</div>
            <p className="text-xs text-muted-foreground">
              Sob seus cuidados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Pendentes</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTasks}</div>
            <p className="text-xs text-muted-foreground">
              Para hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas de Saúde</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.healthAlerts}</div>
            <p className="text-xs text-muted-foreground">
              Última semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <Package className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Itens para repor
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximos Eventos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Próximos Eventos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {calendarioVet.slice(0, 5).map((evento) => (
              <div key={evento.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="font-medium">{evento.titulo}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(evento.data_agendada).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <Badge variant={evento.status === 'agendado' ? 'default' : 'secondary'}>
                  {evento.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Alertas Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Alertas de Saúde
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {historicoSaude.filter(h => h.tipo === 'enfermidade').slice(0, 5).map((registro) => (
              <div key={registro.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="font-medium">{registro.animais?.nome}</p>
                  <p className="text-sm text-muted-foreground">{registro.descricao}</p>
                </div>
                <Badge variant="destructive">
                  {registro.tipo}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

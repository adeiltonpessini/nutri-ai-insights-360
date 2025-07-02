import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { CalendarIcon, Download, TrendingUp, TrendingDown, Activity, DollarSign } from "lucide-react";
import { format, subDays, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface PerformanceData {
  data_medicao: string;
  peso_medio: number;
  ganho_peso_diario: number;
  conversao_alimentar: number;
  consumo_racao_kg: number;
  lote: {
    nome: string;
    especie: string;
  };
}

export default function Relatorios() {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedLote, setSelectedLote] = useState<string>("all");
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [lotes, setLotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLotes();
    fetchPerformanceData();
  }, [user, startDate, endDate, selectedLote]);

  const fetchLotes = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('lotes')
      .select('id, nome, especie')
      .eq('user_id', user.id)
      .eq('status', 'ativo');

    setLotes(data || []);
  };

  const fetchPerformanceData = async () => {
    if (!user) return;

    let query = supabase
      .from('performance_historico')
      .select(`
        data_medicao,
        peso_medio,
        ganho_peso_diario,
        conversao_alimentar,
        consumo_racao_kg,
        lotes!inner(nome, especie)
      `)
      .eq('user_id', user.id)
      .gte('data_medicao', format(startDate, 'yyyy-MM-dd'))
      .lte('data_medicao', format(endDate, 'yyyy-MM-dd'))
      .order('data_medicao', { ascending: true });

    if (selectedLote !== "all") {
      query = query.eq('lote_id', selectedLote);
    }

    const { data } = await query;
    
    if (data) {
      const formattedData = data.map(item => ({
        ...item,
        lote: item.lotes
      }));
      setPerformanceData(formattedData);
    }
    setLoading(false);
  };

  const chartData = performanceData.map(item => ({
    data: format(parseISO(item.data_medicao), 'dd/MM', { locale: ptBR }),
    peso: item.peso_medio,
    ganho: item.ganho_peso_diario,
    conversao: item.conversao_alimentar,
    consumo: item.consumo_racao_kg,
  }));

  const calculateMetrics = () => {
    if (performanceData.length === 0) return null;

    const latest = performanceData[performanceData.length - 1];
    const previous = performanceData[performanceData.length - 2];

    const avgGanho = performanceData.reduce((acc, item) => acc + (item.ganho_peso_diario || 0), 0) / performanceData.length;
    const avgConversao = performanceData.reduce((acc, item) => acc + (item.conversao_alimentar || 0), 0) / performanceData.length;
    const totalConsumo = performanceData.reduce((acc, item) => acc + (item.consumo_racao_kg || 0), 0);

    return {
      pesoAtual: latest.peso_medio,
      ganhoMedio: avgGanho,
      conversaoMedia: avgConversao,
      consumoTotal: totalConsumo,
      tendenciaPeso: previous ? ((latest.peso_medio - previous.peso_medio) / previous.peso_medio) * 100 : 0,
    };
  };

  const metrics = calculateMetrics();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Relatórios de Performance</h1>
          <p className="text-muted-foreground">
            Análise detalhada do desempenho dos seus rebanhos
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar PDF
        </Button>
      </div>

      {/* Filtros */}
      <Card variant="gradient">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "dd/MM/yyyy", { locale: ptBR }) : "Data inicial"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "dd/MM/yyyy", { locale: ptBR }) : "Data final"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => date && setEndDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Lote</label>
              <Select value={selectedLote} onValueChange={setSelectedLote}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Selecionar lote" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os lotes</SelectItem>
                  {lotes.map((lote) => (
                    <SelectItem key={lote.id} value={lote.id}>
                      {lote.nome} ({lote.especie})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Principais */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card variant="elevated">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Peso Médio Atual</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.pesoAtual.toFixed(1)} kg</div>
              <div className="flex items-center gap-1 text-xs">
                {metrics.tendenciaPeso > 0 ? (
                  <TrendingUp className="h-3 w-3 text-success" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span className={metrics.tendenciaPeso > 0 ? "text-success" : "text-destructive"}>
                  {Math.abs(metrics.tendenciaPeso).toFixed(1)}%
                </span>
                <span className="text-muted-foreground">vs período anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ganho Médio Diário</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.ganhoMedio.toFixed(3)} kg</div>
              <Badge variant={metrics.ganhoMedio > 1 ? "default" : "secondary"} className="mt-1">
                {metrics.ganhoMedio > 1 ? "Excelente" : "Regular"}
              </Badge>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversão Alimentar</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.conversaoMedia.toFixed(2)}</div>
              <Badge variant={metrics.conversaoMedia < 3 ? "default" : "secondary"} className="mt-1">
                {metrics.conversaoMedia < 3 ? "Eficiente" : "Pode melhorar"}
              </Badge>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Consumo Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.consumoTotal.toFixed(0)} kg</div>
              <p className="text-xs text-muted-foreground mt-1">
                Média de {(metrics.consumoTotal / performanceData.length).toFixed(1)} kg/dia
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Evolução do Peso Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(1)} kg`, 'Peso']}
                    labelFormatter={(label) => `Data: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="peso" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Ganho de Peso Diário</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(3)} kg`, 'Ganho']}
                    labelFormatter={(label) => `Data: ${label}`}
                  />
                  <Bar dataKey="ganho" fill="hsl(var(--success))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Conversão Alimentar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [value.toFixed(2), 'FCR']}
                    labelFormatter={(label) => `Data: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="conversao" 
                    stroke="hsl(var(--warning))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--warning))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Consumo de Ração</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(1)} kg`, 'Consumo']}
                    labelFormatter={(label) => `Data: ${label}`}
                  />
                  <Bar dataKey="consumo" fill="hsl(var(--tech-blue))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {performanceData.length === 0 && (
        <Card variant="default" className="text-center py-12">
          <CardContent>
            <Activity className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">Nenhum dado encontrado</h3>
            <p className="text-muted-foreground">
              Não há dados de performance para o período selecionado
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
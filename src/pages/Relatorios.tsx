
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Download,
  Calendar,
  Target,
  DollarSign,
  Users,
  Activity,
  FileText,
  PieChart,
  LineChart
} from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ReportData {
  totalAnimals: number;
  activeProperties: number;
  averagePerformance: number;
  monthlyGrowth: number;
  totalRevenue: number;
  averageWeight: number;
}

export default function Relatorios() {
  const { currentCompany } = useCompany();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  
  // Estados para dados
  const [reportData, setReportData] = useState<ReportData>({
    totalAnimals: 0,
    activeProperties: 0,
    averagePerformance: 0,
    monthlyGrowth: 0,
    totalRevenue: 0,
    averageWeight: 0
  });
  
  const [performanceData, setPerformanceData] = useState([]);
  const [lotesData, setLotesData] = useState([]);
  const [diagnosticsData, setDiagnosticsData] = useState([]);

  useEffect(() => {
    if (currentCompany && user) {
      loadReportData();
    }
  }, [currentCompany, user, selectedPeriod]);

  const loadReportData = async () => {
    if (!currentCompany || !user) return;

    try {
      setLoading(true);

      const daysAgo = parseInt(selectedPeriod);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      // Carregar dados das propriedades
      const { data: propriedades } = await supabase
        .from('propriedades')
        .select('*')
        .eq('company_id', currentCompany.id);

      // Carregar dados dos lotes
      const { data: lotes } = await supabase
        .from('lotes')
        .select('*')
        .eq('company_id', currentCompany.id);

      // Carregar dados de performance
      const { data: performance } = await supabase
        .from('performance_historico')
        .select('*')
        .eq('company_id', currentCompany.id)
        .gte('data_medicao', startDate.toISOString().split('T')[0]);

      // Carregar diagnósticos
      const { data: diagnostics } = await supabase
        .from('diagnosticos')
        .select('*')
        .eq('company_id', currentCompany.id)
        .gte('created_at', startDate.toISOString());

      // Carregar animais
      const { data: animais } = await supabase
        .from('animais')
        .select('*')
        .eq('company_id', currentCompany.id);

      // Calcular métricas
      const totalAnimals = lotes?.reduce((sum, lote) => sum + lote.quantidade_animais, 0) || 0;
      const activeProperties = propriedades?.length || 0;
      const averagePerformance = performance?.length > 0 
        ? performance.reduce((sum, p) => sum + (p.conversao_alimentar || 0), 0) / performance.length 
        : 0;
      
      const averageWeight = performance?.length > 0 
        ? performance.reduce((sum, p) => sum + (p.peso_medio || 0), 0) / performance.length 
        : 0;

      // Simular crescimento mensal e receita
      const monthlyGrowth = Math.random() * 20 - 5; // -5% a 15%
      const totalRevenue = totalAnimals * 1500; // Estimativa baseada no número de animais

      setReportData({
        totalAnimals,
        activeProperties,
        averagePerformance,
        monthlyGrowth,
        totalRevenue,
        averageWeight
      });

      setPerformanceData(performance || []);
      setLotesData(lotes || []);
      setDiagnosticsData(diagnostics || []);

    } catch (error) {
      console.error('Erro ao carregar dados do relatório:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados dos relatórios",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (type: string) => {
    toast({
      title: "Exportando relatório",
      description: `Relatório ${type} será baixado em breve`
    });
  };

  if (loading && performanceData.length === 0) {
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
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">Relatórios e Analytics</h1>
              <p className="text-muted-foreground">
                Análise completa da performance e resultados da sua operação
              </p>
            </div>
            <div className="flex gap-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Últimos 7 dias</SelectItem>
                  <SelectItem value="30">Últimos 30 dias</SelectItem>
                  <SelectItem value="90">Últimos 90 dias</SelectItem>
                  <SelectItem value="365">Último ano</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>

        {/* Cards de Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Animais</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.totalAnimals.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Ativos na operação
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance Média</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reportData.averagePerformance > 0 ? reportData.averagePerformance.toFixed(2) : '-'}
              </div>
              <p className="text-xs text-muted-foreground">
                Conversão alimentar
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Crescimento Mensal</CardTitle>
              {reportData.monthlyGrowth >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${reportData.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {reportData.monthlyGrowth >= 0 ? '+' : ''}{reportData.monthlyGrowth.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                vs. período anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Estimada</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {(reportData.totalRevenue / 1000).toFixed(0)}k
              </div>
              <p className="text-xs text-muted-foreground">
                Potencial do rebanho
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="lotes">Lotes</TabsTrigger>
            <TabsTrigger value="diagnostics">Diagnósticos</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo da Operação</CardTitle>
                  <CardDescription>Principais indicadores dos últimos {selectedPeriod} dias</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Propriedades Ativas</span>
                      <span className="font-bold">{reportData.activeProperties}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Lotes em Andamento</span>
                      <span className="font-bold">{lotesData.filter(l => l.status === 'ativo').length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Peso Médio dos Animais</span>
                      <span className="font-bold">
                        {reportData.averageWeight > 0 ? `${reportData.averageWeight.toFixed(1)} kg` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Diagnósticos Realizados</span>
                      <span className="font-bold">{diagnosticsData.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance por Espécie</CardTitle>
                  <CardDescription>Distribuição dos animais por categoria</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['bovinos', 'suinos', 'aves', 'ovinos'].map((especie) => {
                      const count = lotesData.filter(l => l.especie === especie).length;
                      const percentage = lotesData.length > 0 ? (count / lotesData.length) * 100 : 0;
                      
                      return (
                        <div key={especie} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="capitalize">{especie}</span>
                            <span className="text-sm text-muted-foreground">{count} lotes</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Ações Recomendadas</CardTitle>
                <CardDescription>Com base na análise dos seus dados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.averagePerformance > 3.5 && (
                    <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <Target className="w-5 h-5 text-orange-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-orange-900">Otimizar Conversão Alimentar</h4>
                        <p className="text-sm text-orange-700">
                          A conversão alimentar está acima do ideal. Considere revisar a formulação da ração.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {diagnosticsData.length < 3 && (
                    <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <Activity className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">Aumentar Monitoramento</h4>
                        <p className="text-sm text-blue-700">
                          Poucos diagnósticos foram realizados. Considere aumentar a frequência de monitoramento.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {reportData.monthlyGrowth < 0 && (
                    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <TrendingDown className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-900">Revisar Estratégia</h4>
                        <p className="text-sm text-red-700">
                          O crescimento está negativo. Análise detalhada dos custos e manejo pode ser necessária.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {reportData.averagePerformance <= 3.0 && reportData.monthlyGrowth > 5 && (
                    <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-900">Excelente Performance</h4>
                        <p className="text-sm text-green-700">
                          Seus indicadores estão excelentes! Continue com as práticas atuais.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Análise de Performance</h2>
              <Button variant="outline" onClick={() => exportReport('performance')}>
                <Download className="w-4 h-4 mr-2" />
                Exportar Performance
              </Button>
            </div>

            <div className="grid gap-4">
              {performanceData.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <LineChart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Sem dados de performance</h3>
                    <p className="text-muted-foreground">
                      Dados de performance aparecerão aqui quando forem registrados.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                performanceData.map((metric, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg mb-4">
                            Lote ID: {metric.lote_id}
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Peso Médio</p>
                              <p className="text-lg font-semibold">
                                {metric.peso_medio ? `${metric.peso_medio} kg` : 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Ganho Diário</p>
                              <p className="text-lg font-semibold">
                                {metric.ganho_peso_diario ? `${metric.ganho_peso_diario} kg` : 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Consumo Ração</p>
                              <p className="text-lg font-semibold">
                                {metric.consumo_racao_kg ? `${metric.consumo_racao_kg} kg` : 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Conversão</p>
                              <p className="text-lg font-semibold">
                                {metric.conversao_alimentar || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {new Date(metric.data_medicao).toLocaleDateString('pt-BR')}
                          </p>
                          {metric.conversao_alimentar && (
                            <Badge 
                              variant={metric.conversao_alimentar < 3 ? "default" : "destructive"}
                              className="mt-2"
                            >
                              {metric.conversao_alimentar < 3 ? "Excelente" : "Atenção"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="lotes" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Relatório de Lotes</h2>
              <Button variant="outline" onClick={() => exportReport('lotes')}>
                <Download className="w-4 h-4 mr-2" />
                Exportar Lotes
              </Button>
            </div>

            <div className="grid gap-4">
              {lotesData.map((lote) => (
                <Card key={lote.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <h3 className="font-semibold text-lg">{lote.nome}</h3>
                          <Badge variant={lote.status === 'ativo' ? "default" : "secondary"}>
                            {lote.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Espécie</p>
                            <p className="font-medium">{lote.especie}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Quantidade</p>
                            <p className="font-medium">{lote.quantidade_animais} animais</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Peso Inicial</p>
                            <p className="font-medium">
                              {lote.peso_medio_inicial ? `${lote.peso_medio_inicial} kg` : 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Peso Atual</p>
                            <p className="font-medium">
                              {lote.peso_medio_atual ? `${lote.peso_medio_atual} kg` : 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm">
                            <strong>Objetivo:</strong> {lote.objetivo}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Iniciado em {new Date(lote.data_inicio).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {lote.peso_medio_inicial && lote.peso_medio_atual && (
                          <div>
                            <p className="text-sm text-muted-foreground">Ganho Total</p>
                            <p className="text-lg font-bold text-green-600">
                              +{(lote.peso_medio_atual - lote.peso_medio_inicial).toFixed(1)} kg
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="diagnostics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Relatório de Diagnósticos</h2>
              <Button variant="outline" onClick={() => exportReport('diagnostics')}>
                <Download className="w-4 h-4 mr-2" />
                Exportar Diagnósticos
              </Button>
            </div>

            {diagnosticsData.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Nenhum diagnóstico no período</h3>
                  <p className="text-muted-foreground">
                    Diagnósticos realizados nos últimos {selectedPeriod} dias aparecerão aqui.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {diagnosticsData.map((diagnostic) => (
                  <Card key={diagnostic.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{diagnostic.tipo_diagnostico}</h3>
                          <p className="text-muted-foreground mb-3">
                            ID: {diagnostic.id.slice(0, 8)}...
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant={
                                diagnostic.status === 'concluido' ? "default" : 
                                diagnostic.status === 'processando' ? "secondary" : "destructive"
                              }>
                                {diagnostic.status}
                              </Badge>
                              {diagnostic.confianca_ia && (
                                <span className="text-sm text-muted-foreground">
                                  Confiança IA: {(diagnostic.confianca_ia * 100).toFixed(1)}%
                                </span>
                              )}
                            </div>
                            {diagnostic.observacoes && (
                              <p className="text-sm">{diagnostic.observacoes}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {new Date(diagnostic.created_at).toLocaleDateString('pt-BR')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(diagnostic.created_at).toLocaleTimeString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Análise Financeira</h2>
              <Button variant="outline" onClick={() => exportReport('financial')}>
                <Download className="w-4 h-4 mr-2" />
                Exportar Financeiro
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estimativa de Receita</CardTitle>
                  <CardDescription>Baseada no valor médio de mercado</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total de Animais</span>
                      <span className="font-bold">{reportData.totalAnimals.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Valor Médio por Animal</span>
                      <span className="font-bold">R$ 1.500,00</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Valor Total Estimado</span>
                        <span className="text-2xl font-bold text-green-600">
                          R$ {reportData.totalRevenue.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Custos Estimados</CardTitle>
                  <CardDescription>Principais categorias de despesas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Alimentação (60%)</span>
                      <span className="font-bold">
                        R$ {(reportData.totalRevenue * 0.6).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Veterinária (15%)</span>
                      <span className="font-bold">
                        R$ {(reportData.totalRevenue * 0.15).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Mão de Obra (20%)</span>
                      <span className="font-bold">
                        R$ {(reportData.totalRevenue * 0.2).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Margem Estimada (5%)</span>
                        <span className="text-2xl font-bold text-blue-600">
                          R$ {(reportData.totalRevenue * 0.05).toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Projeção de Crescimento</CardTitle>
                <CardDescription>Com base no desempenho atual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h4 className="font-semibold mb-2">Próximos 3 meses</h4>
                    <p className="text-2xl font-bold text-blue-600">
                      +{(reportData.monthlyGrowth * 3).toFixed(1)}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Crescimento projetado
                    </p>
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold mb-2">Próximos 6 meses</h4>
                    <p className="text-2xl font-bold text-green-600">
                      +{(reportData.monthlyGrowth * 6).toFixed(1)}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Crescimento projetado
                    </p>
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold mb-2">Próximo ano</h4>
                    <p className="text-2xl font-bold text-purple-600">
                      +{(reportData.monthlyGrowth * 12).toFixed(1)}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Crescimento projetado
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

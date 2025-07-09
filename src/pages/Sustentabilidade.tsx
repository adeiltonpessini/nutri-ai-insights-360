
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Leaf, 
  Droplets,
  Zap,
  Recycle,
  TrendingDown,
  TrendingUp,
  Plus,
  Target,
  Award,
  BarChart3,
  Calculator,
  Calendar,
  CheckCircle
} from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface SustainabilityData {
  id: string;
  fcr: number;
  pegada_carbono: number;
  uso_agua: number;
  eficiencia_energetica: number;
  residuos_gerados: number;
  periodo_inicio: string;
  periodo_fim: string;
  created_at: string;
  animal_id?: string;
}

export default function Sustentabilidade() {
  const { currentCompany } = useCompany();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  
  // Estados para dados
  const [sustainabilityData, setSustainabilityData] = useState<SustainabilityData[]>([]);
  const [animais, setAnimais] = useState([]);
  
  // Estados para formulários
  const [newSustainabilityRecord, setNewSustainabilityRecord] = useState({
    fcr: '',
    pegada_carbono: '',
    uso_agua: '',
    eficiencia_energetica: '',
    residuos_gerados: '',
    periodo_inicio: '',
    periodo_fim: '',
    animal_id: ''
  });
  
  // Modal states
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  useEffect(() => {
    if (currentCompany && user) {
      loadSustainabilityData();
    }
  }, [currentCompany, user]);

  const loadSustainabilityData = async () => {
    if (!currentCompany || !user) return;

    try {
      setLoading(true);

      // Carregar dados de sustentabilidade
      const { data: sustainabilityData } = await supabase
        .from('sustentabilidade')
        .select('*')
        .eq('company_id', currentCompany.id)
        .order('created_at', { ascending: false });

      // Carregar animais
      const { data: animaisData } = await supabase
        .from('animais')
        .select('*')
        .eq('company_id', currentCompany.id);

      setSustainabilityData(sustainabilityData || []);
      setAnimais(animaisData || []);

    } catch (error) {
      console.error('Erro ao carregar dados de sustentabilidade:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados de sustentabilidade",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRecord = async () => {
    if (!currentCompany || !user || !newSustainabilityRecord.periodo_inicio || !newSustainabilityRecord.periodo_fim) {
      toast({
        title: "Erro",
        description: "Preencha pelo menos os campos de período",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from('sustentabilidade')
        .insert({
          ...newSustainabilityRecord,
          company_id: currentCompany.id,
          fcr: parseFloat(newSustainabilityRecord.fcr) || null,
          pegada_carbono: parseFloat(newSustainabilityRecord.pegada_carbono) || null,
          uso_agua: parseFloat(newSustainabilityRecord.uso_agua) || null,
          eficiencia_energetica: parseFloat(newSustainabilityRecord.eficiencia_energetica) || null,
          residuos_gerados: parseFloat(newSustainabilityRecord.residuos_gerados) || null
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Registro de sustentabilidade criado com sucesso!"
      });

      setIsRecordModalOpen(false);
      setNewSustainabilityRecord({
        fcr: '',
        pegada_carbono: '',
        uso_agua: '',
        eficiencia_energetica: '',
        residuos_gerados: '',
        periodo_inicio: '',
        periodo_fim: '',
        animal_id: ''
      });
      loadSustainabilityData();

    } catch (error) {
      console.error('Erro ao criar registro:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar registro de sustentabilidade",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Calcular métricas
  const stats = {
    avgFCR: sustainabilityData.length > 0 
      ? sustainabilityData.reduce((sum, d) => sum + (d.fcr || 0), 0) / sustainabilityData.filter(d => d.fcr).length 
      : 0,
    avgCarbonFootprint: sustainabilityData.length > 0 
      ? sustainabilityData.reduce((sum, d) => sum + (d.pegada_carbono || 0), 0) / sustainabilityData.filter(d => d.pegada_carbono).length 
      : 0,
    avgWaterUsage: sustainabilityData.length > 0 
      ? sustainabilityData.reduce((sum, d) => sum + (d.uso_agua || 0), 0) / sustainabilityData.filter(d => d.uso_agua).length 
      : 0,
    avgEnergyEfficiency: sustainabilityData.length > 0 
      ? sustainabilityData.reduce((sum, d) => sum + (d.eficiencia_energetica || 0), 0) / sustainabilityData.filter(d => d.eficiencia_energetica).length 
      : 0
  };

  const getSustainabilityScore = () => {
    let score = 0;
    let factors = 0;

    if (stats.avgFCR > 0) {
      score += stats.avgFCR < 2.5 ? 25 : stats.avgFCR < 3.0 ? 20 : 15;
      factors++;
    }

    if (stats.avgCarbonFootprint > 0) {
      score += stats.avgCarbonFootprint < 10 ? 25 : stats.avgCarbonFootprint < 15 ? 20 : 15;
      factors++;
    }

    if (stats.avgWaterUsage > 0) {
      score += stats.avgWaterUsage < 50 ? 25 : stats.avgWaterUsage < 100 ? 20 : 15;
      factors++;
    }

    if (stats.avgEnergyEfficiency > 0) {
      score += stats.avgEnergyEfficiency > 80 ? 25 : stats.avgEnergyEfficiency > 60 ? 20 : 15;
      factors++;
    }

    return factors > 0 ? score / factors : 0;
  };

  const sustainabilityScore = getSustainabilityScore();

  if (loading && sustainabilityData.length === 0) {
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
          <h1 className="text-3xl font-bold mb-2">Sustentabilidade</h1>
          <p className="text-muted-foreground">
            Monitore e melhore os indicadores ambientais da sua operação
          </p>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">FCR Médio</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.avgFCR > 0 ? stats.avgFCR.toFixed(2) : '-'}
              </div>
              <p className="text-xs text-muted-foreground">
                Conversão alimentar
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pegada de Carbono</CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.avgCarbonFootprint > 0 ? stats.avgCarbonFootprint.toFixed(1) : '-'}
              </div>
              <p className="text-xs text-muted-foreground">
                CO2 eq/kg
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uso de Água</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.avgWaterUsage > 0 ? stats.avgWaterUsage.toFixed(0) : '-'}
              </div>
              <p className="text-xs text-muted-foreground">
                Litros/animal/dia
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eficiência Energética</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.avgEnergyEfficiency > 0 ? `${stats.avgEnergyEfficiency.toFixed(1)}%` : '-'}
              </div>
              <p className="text-xs text-muted-foreground">
                Eficiência média
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Score de Sustentabilidade */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Score de Sustentabilidade
            </CardTitle>
            <CardDescription>
              Avaliação geral baseada nos seus indicadores ambientais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Progress value={sustainabilityScore} className="h-3" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{sustainabilityScore.toFixed(0)}</p>
                <p className="text-sm text-muted-foreground">de 100</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className={`p-3 rounded-lg ${sustainabilityScore >= 80 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                <p className="font-medium text-green-800">Excelente (80-100)</p>
                <p className="text-green-600">Operação altamente sustentável</p>
              </div>
              <div className={`p-3 rounded-lg ${sustainabilityScore >= 60 && sustainabilityScore < 80 ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'}`}>
                <p className="font-medium text-yellow-800">Bom (60-79)</p>
                <p className="text-yellow-600">Bons indicadores, com melhorias possíveis</p>
              </div>
              <div className={`p-3 rounded-lg ${sustainabilityScore < 60 ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                <p className="font-medium text-red-800">Precisa Melhorar (&lt;60)</p>
                <p className="text-red-600">Foque em otimizar os indicadores</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="records">Registros</TabsTrigger>
            <TabsTrigger value="goals">Metas</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tendências Ambientais</CardTitle>
                  <CardDescription>Evolução dos principais indicadores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        <span>FCR (Conversão Alimentar)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{stats.avgFCR > 0 ? stats.avgFCR.toFixed(2) : '-'}</span>
                        {stats.avgFCR > 0 && stats.avgFCR < 3.0 ? (
                          <TrendingDown className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Leaf className="w-4 h-4 text-green-600" />
                        <span>Pegada de Carbono</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{stats.avgCarbonFootprint > 0 ? `${stats.avgCarbonFootprint.toFixed(1)} CO2` : '-'}</span>
                        {stats.avgCarbonFootprint > 0 && stats.avgCarbonFootprint < 12 ? (
                          <TrendingDown className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-blue-600" />
                        <span>Uso de Água</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{stats.avgWaterUsage > 0 ? `${stats.avgWaterUsage.toFixed(0)}L` : '-'}</span>
                        {stats.avgWaterUsage > 0 && stats.avgWaterUsage < 80 ? (
                          <TrendingDown className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-600" />
                        <span>Eficiência Energética</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{stats.avgEnergyEfficiency > 0 ? `${stats.avgEnergyEfficiency.toFixed(1)}%` : '-'}</span>
                        {stats.avgEnergyEfficiency > 0 && stats.avgEnergyEfficiency > 70 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recomendações</CardTitle>
                  <CardDescription>Ações para melhorar sua sustentabilidade</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.avgFCR > 3.0 && (
                      <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <Target className="w-5 h-5 text-orange-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-orange-900">Otimizar FCR</h4>
                          <p className="text-sm text-orange-700">
                            FCR acima de 3.0. Revise a formulação da ração e manejo alimentar.
                          </p>
                        </div>
                      </div>
                    )}

                    {stats.avgCarbonFootprint > 15 && (
                      <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <Leaf className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-red-900">Reduzir Emissões</h4>
                          <p className="text-sm text-red-700">
                            Pegada de carbono elevada. Considere práticas de manejo mais sustentáveis.
                          </p>
                        </div>
                      </div>
                    )}

                    {stats.avgWaterUsage > 100 && (
                      <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <Droplets className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900">Conservar Água</h4>
                          <p className="text-sm text-blue-700">
                            Alto consumo de água. Implemente sistemas de reuso e economia.
                          </p>
                        </div>
                      </div>
                    )}

                    {sustainabilityScore >= 80 && (
                      <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <Award className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-green-900">Parabéns!</h4>
                          <p className="text-sm text-green-700">
                            Excelente performance ambiental. Continue com as boas práticas!
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="records" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Registros de Sustentabilidade</h2>
              <Button onClick={() => setIsRecordModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Registro
              </Button>
            </div>

            <div className="grid gap-4">
              {sustainabilityData.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Leaf className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhum registro encontrado</h3>
                    <p className="text-muted-foreground mb-4">
                      Comece registrando dados ambientais da sua operação.
                    </p>
                    <Button onClick={() => setIsRecordModalOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Primeiro Registro
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                sustainabilityData.map((record) => (
                  <Card key={record.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="mb-4">
                            <p className="font-semibold">
                              Período: {new Date(record.periodo_inicio).toLocaleDateString('pt-BR')} - {new Date(record.periodo_fim).toLocaleDateString('pt-BR')}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Registrado em {new Date(record.created_at).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">FCR</p>
                              <p className="font-medium">{record.fcr ? record.fcr.toFixed(2) : 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">CO2 (kg)</p>
                              <p className="font-medium">{record.pegada_carbono ? record.pegada_carbono.toFixed(1) : 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Água (L)</p>
                              <p className="font-medium">{record.uso_agua ? record.uso_agua.toFixed(0) : 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Energia (%)</p>
                              <p className="font-medium">{record.eficiencia_energetica ? `${record.eficiencia_energetica.toFixed(1)}%` : 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Resíduos (kg)</p>
                              <p className="font-medium">{record.residuos_gerados ? record.residuos_gerados.toFixed(1) : 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {record.fcr && record.fcr < 3.0 && (
                            <Badge variant="default">Eficiente</Badge>
                          )}
                          {record.pegada_carbono && record.pegada_carbono < 12 && (
                            <Badge variant="default">Baixo CO2</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <h2 className="text-2xl font-bold">Metas de Sustentabilidade</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Metas Recomendadas</CardTitle>
                  <CardDescription>Baseadas nas melhores práticas do setor</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium">FCR</p>
                        <p className="text-sm text-muted-foreground">Conversão alimentar</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">&lt; 2.5</p>
                        <p className="text-xs text-muted-foreground">Excelente</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium">Pegada de Carbono</p>
                        <p className="text-sm text-muted-foreground">CO2 eq/kg produzido</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">&lt; 10 kg</p>
                        <p className="text-xs text-muted-foreground">Sustentável</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-cyan-50 rounded-lg">
                      <div>
                        <p className="font-medium">Uso de Água</p>
                        <p className="text-sm text-muted-foreground">Litros/animal/dia</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-cyan-600">&lt; 50 L</p>
                        <p className="text-xs text-muted-foreground">Eficiente</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="font-medium">Eficiência Energética</p>
                        <p className="text-sm text-muted-foreground">Aproveitamento</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-yellow-600">&gt; 80%</p>
                        <p className="text-xs text-muted-foreground">Ótimo</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Progresso das Metas</CardTitle>
                  <CardDescription>Seu desempenho atual vs. metas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">FCR</span>
                        <span className="text-sm">{stats.avgFCR > 0 ? stats.avgFCR.toFixed(2) : 'N/A'} / 2.5</span>
                      </div>
                      <Progress 
                        value={stats.avgFCR > 0 ? Math.min((2.5 / stats.avgFCR) * 100, 100) : 0} 
                        className="h-2" 
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Pegada de Carbono</span>
                        <span className="text-sm">{stats.avgCarbonFootprint > 0 ? stats.avgCarbonFootprint.toFixed(1) : 'N/A'} / 10 kg</span>
                      </div>
                      <Progress 
                        value={stats.avgCarbonFootprint > 0 ? Math.min((10 / stats.avgCarbonFootprint) * 100, 100) : 0} 
                        className="h-2" 
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Uso de Água</span>
                        <span className="text-sm">{stats.avgWaterUsage > 0 ? stats.avgWaterUsage.toFixed(0) : 'N/A'} / 50 L</span>
                      </div>
                      <Progress 
                        value={stats.avgWaterUsage > 0 ? Math.min((50 / stats.avgWaterUsage) * 100, 100) : 0} 
                        className="h-2" 
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Eficiência Energética</span>
                        <span className="text-sm">{stats.avgEnergyEfficiency > 0 ? stats.avgEnergyEfficiency.toFixed(1) : 'N/A'} / 80%</span>
                      </div>
                      <Progress 
                        value={stats.avgEnergyEfficiency > 0 ? (stats.avgEnergyEfficiency / 80) * 100 : 0} 
                        className="h-2" 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Relatórios de Sustentabilidade</h2>
              <Button variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                Gerar Relatório
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resumo Mensal</CardTitle>
                  <CardDescription>Indicadores do último mês</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                      <p className="text-3xl font-bold text-green-600">{sustainabilityScore.toFixed(0)}</p>
                      <p className="text-sm text-muted-foreground">Score de Sustentabilidade</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-lg font-bold text-blue-600">{sustainabilityData.length}</p>
                        <p className="text-xs text-muted-foreground">Registros</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-lg font-bold text-green-600">
                          {sustainabilityData.filter(d => d.fcr && d.fcr < 3.0).length}
                        </p>
                        <p className="text-xs text-muted-foreground">Períodos Eficientes</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Certificações Possíveis</CardTitle>
                  <CardDescription>Com base na sua performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className={`flex items-center gap-3 p-3 rounded-lg ${sustainabilityScore >= 80 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                      <Award className={`w-5 h-5 ${sustainabilityScore >= 80 ? 'text-green-600' : 'text-gray-400'}`} />
                      <div className="flex-1">
                        <p className="font-medium">Certificação Sustentável</p>
                        <p className="text-sm text-muted-foreground">Score mínimo: 80</p>
                      </div>
                      {sustainabilityScore >= 80 && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>

                    <div className={`flex items-center gap-3 p-3 rounded-lg ${stats.avgFCR > 0 && stats.avgFCR < 2.5 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                      <Target className={`w-5 h-5 ${stats.avgFCR > 0 && stats.avgFCR < 2.5 ? 'text-green-600' : 'text-gray-400'}`} />
                      <div className="flex-1">
                        <p className="font-medium">Eficiência Alimentar</p>
                        <p className="text-sm text-muted-foreground">FCR &lt; 2.5</p>
                      </div>
                      {stats.avgFCR > 0 && stats.avgFCR < 2.5 && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>

                    <div className={`flex items-center gap-3 p-3 rounded-lg ${stats.avgCarbonFootprint > 0 && stats.avgCarbonFootprint < 10 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                      <Leaf className={`w-5 h-5 ${stats.avgCarbonFootprint > 0 && stats.avgCarbonFootprint < 10 ? 'text-green-600' : 'text-gray-400'}`} />
                      <div className="flex-1">
                        <p className="font-medium">Baixo Carbono</p>
                        <p className="text-sm text-muted-foreground">CO2 &lt; 10 kg/kg</p>
                      </div>
                      {stats.avgCarbonFootprint > 0 && stats.avgCarbonFootprint < 10 && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Modal para Novo Registro */}
        <Dialog open={isRecordModalOpen} onOpenChange={setIsRecordModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Novo Registro de Sustentabilidade</DialogTitle>
              <DialogDescription>
                Registre os indicadores ambientais do período
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="periodo_inicio">Período Início *</Label>
                  <Input
                    id="periodo_inicio"
                    type="date"
                    value={newSustainabilityRecord.periodo_inicio}
                    onChange={(e) => setNewSustainabilityRecord({...newSustainabilityRecord, periodo_inicio: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="periodo_fim">Período Fim *</Label>
                  <Input
                    id="periodo_fim"
                    type="date"
                    value={newSustainabilityRecord.periodo_fim}
                    onChange={(e) => setNewSustainabilityRecord({...newSustainabilityRecord, periodo_fim: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fcr">FCR (Conversão Alimentar)</Label>
                  <Input
                    id="fcr"
                    type="number"
                    step="0.1"
                    value={newSustainabilityRecord.fcr}
                    onChange={(e) => setNewSustainabilityRecord({...newSustainabilityRecord, fcr: e.target.value})}
                    placeholder="Ex: 2.8"
                  />
                </div>
                <div>
                  <Label htmlFor="pegada_carbono">Pegada de Carbono (kg CO2)</Label>
                  <Input
                    id="pegada_carbono"
                    type="number"
                    step="0.1"
                    value={newSustainabilityRecord.pegada_carbono}
                    onChange={(e) => setNewSustainabilityRecord({...newSustainabilityRecord, pegada_carbono: e.target.value})}
                    placeholder="Ex: 12.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="uso_agua">Uso de Água (L/animal/dia)</Label>
                  <Input
                    id="uso_agua"
                    type="number"
                    step="0.1"
                    value={newSustainabilityRecord.uso_agua}
                    onChange={(e) => setNewSustainabilityRecord({...newSustainabilityRecord, uso_agua: e.target.value})}
                    placeholder="Ex: 65.0"
                  />
                </div>
                <div>
                  <Label htmlFor="eficiencia_energetica">Eficiência Energética (%)</Label>
                  <Input
                    id="eficiencia_energetica"
                    type="number"
                    step="0.1"
                    max="100"
                    value={newSustainabilityRecord.eficiencia_energetica}
                    onChange={(e) => setNewSustainabilityRecord({...newSustainabilityRecord, eficiencia_energetica: e.target.value})}
                    placeholder="Ex: 75.0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="residuos_gerados">Resíduos Gerados (kg)</Label>
                <Input
                  id="residuos_gerados"
                  type="number"
                  step="0.1"
                  value={newSustainabilityRecord.residuos_gerados}
                  onChange={(e) => setNewSustainabilityRecord({...newSustainabilityRecord, residuos_gerados: e.target.value})}
                  placeholder="Ex: 150.0"
                />
              </div>

              <div>
                <Label htmlFor="animal_especifico">Animal Específico (opcional)</Label>
                <Select value={newSustainabilityRecord.animal_id} onValueChange={(value) => setNewSustainabilityRecord({...newSustainabilityRecord, animal_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um animal específico" />
                  </SelectTrigger>
                  <SelectContent>
                    {animais.map((animal) => (
                      <SelectItem key={animal.id} value={animal.id}>
                        {animal.nome} - {animal.especie}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRecordModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateRecord} disabled={loading}>
                Registrar Dados
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

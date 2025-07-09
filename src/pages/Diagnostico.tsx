
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Stethoscope, 
  Brain,
  Upload,
  Camera,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  FileText,
  BarChart3,
  Target
} from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Diagnostico {
  id: string;
  tipo_diagnostico: string;
  status: string;
  confianca_ia: number;
  observacoes: string;
  imagem_url: string;
  resultados: any;
  recomendacoes: any;
  created_at: string;
  animal_id?: string;
  lote_id?: string;
  animais?: { nome: string; especie: string };
  lotes?: { nome: string };
}

export default function Diagnostico() {
  const { currentCompany } = useCompany();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("diagnostics");
  const [loading, setLoading] = useState(false);
  
  // Estados para dados
  const [diagnosticos, setDiagnosticos] = useState<Diagnostico[]>([]);
  const [animais, setAnimais] = useState([]);
  const [lotes, setLotes] = useState([]);
  
  // Estados para formulários
  const [newDiagnostico, setNewDiagnostico] = useState({
    tipo_diagnostico: '',
    animal_id: '',
    lote_id: '',
    observacoes: '',
    imagem_url: ''
  });
  
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  
  // Modal states
  const [isDiagnosticoModalOpen, setIsDiagnosticoModalOpen] = useState(false);

  useEffect(() => {
    if (currentCompany && user) {
      loadDiagnosticData();
    }
  }, [currentCompany, user]);

  const loadDiagnosticData = async () => {
    if (!currentCompany || !user) return;

    try {
      setLoading(true);

      // Carregar diagnósticos
      const { data: diagnosticosData } = await supabase
        .from('diagnosticos')
        .select(`
          *,
          animais(nome, especie),
          lotes(nome)
        `)
        .eq('company_id', currentCompany.id)
        .order('created_at', { ascending: false });

      // Carregar animais
      const { data: animaisData } = await supabase
        .from('animais')
        .select('*')
        .eq('company_id', currentCompany.id);

      // Carregar lotes
      const { data: lotesData } = await supabase
        .from('lotes')
        .select('*')
        .eq('company_id', currentCompany.id);

      setDiagnosticos(diagnosticosData || []);
      setAnimais(animaisData || []);
      setLotes(lotesData || []);

    } catch (error) {
      console.error('Erro ao carregar dados de diagnóstico:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados de diagnóstico",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDiagnostico = async () => {
    if (!currentCompany || !user || !newDiagnostico.tipo_diagnostico) {
      toast({
        title: "Erro",
        description: "Preencha pelo menos o tipo de diagnóstico",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      // Simular upload de imagem e processamento IA
      let imageUrl = '';
      if (uploadedImage) {
        // Aqui seria feito o upload real para o Supabase Storage
        imageUrl = URL.createObjectURL(uploadedImage);
      }

      // Simular resultados de IA
      const mockResultados = {
        condicao_identificada: newDiagnostico.tipo_diagnostico === 'nutricional' ? 'Deficiência Nutricional' : 'Análise Comportamental',
        severidade: Math.random() > 0.5 ? 'Moderada' : 'Leve',
        areas_afetadas: ['Sistema digestivo', 'Metabolismo'],
        indicadores: {
          peso: Math.random() * 100 + 200,
          temperatura: Math.random() * 2 + 37,
          atividade: Math.random() * 100
        }
      };

      const mockRecomendacoes = {
        tratamento_imediato: ['Ajustar dieta', 'Monitorar peso'],
        medicamentos: newDiagnostico.tipo_diagnostico === 'clinico' ? ['Suplemento A', 'Vitamina B'] : [],
        acompanhamento: 'Revisar em 7 dias',
        prevencao: ['Manter rotina alimentar', 'Exercícios regulares']
      };

      const confiancaIA = Math.random() * 0.3 + 0.7; // 70% a 100%

      const { error } = await supabase
        .from('diagnosticos')
        .insert({
          ...newDiagnostico,
          company_id: currentCompany.id,
          user_id: user.id,
          imagem_url: imageUrl,
          resultados: mockResultados,
          recomendacoes: mockRecomendacoes,
          confianca_ia: confiancaIA,
          status: 'concluido'
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Diagnóstico processado com sucesso!"
      });

      setIsDiagnosticoModalOpen(false);
      setNewDiagnostico({
        tipo_diagnostico: '',
        animal_id: '',
        lote_id: '',
        observacoes: '',
        imagem_url: ''
      });
      setUploadedImage(null);
      loadDiagnosticData();

    } catch (error) {
      console.error('Erro ao criar diagnóstico:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar diagnóstico",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      toast({
        title: "Imagem carregada",
        description: "Imagem pronta para análise"
      });
    }
  };

  const stats = {
    totalDiagnosticos: diagnosticos.length,
    diagnosticosConcluidos: diagnosticos.filter(d => d.status === 'concluido').length,
    confianciaMedia: diagnosticos.length > 0 
      ? diagnosticos.reduce((sum, d) => sum + (d.confianca_ia || 0), 0) / diagnosticos.length 
      : 0,
    diagnosticosRecentes: diagnosticos.filter(d => 
      new Date(d.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length
  };

  if (loading && diagnosticos.length === 0) {
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
          <h1 className="text-3xl font-bold mb-2">Diagnóstico com IA</h1>
          <p className="text-muted-foreground">
            Sistema inteligente para diagnóstico veterinário e análise de performance
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Diagnósticos</CardTitle>
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDiagnosticos}</div>
              <p className="text-xs text-muted-foreground">
                Realizados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.diagnosticosConcluidos}</div>
              <p className="text-xs text-muted-foreground">
                Processamento completo
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confiança IA</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.confianciaMedia > 0 ? `${(stats.confianciaMedia * 100).toFixed(1)}%` : '-'}
              </div>
              <p className="text-xs text-muted-foreground">
                Precisão média
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.diagnosticosRecentes}</div>
              <p className="text-xs text-muted-foreground">
                Novos diagnósticos
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="diagnostics">Diagnósticos</TabsTrigger>
            <TabsTrigger value="analyze">Nova Análise</TabsTrigger>
            <TabsTrigger value="results">Resultados</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="diagnostics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Histórico de Diagnósticos</h2>
              <Button onClick={() => setIsDiagnosticoModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Diagnóstico
              </Button>
            </div>

            <div className="grid gap-4">
              {diagnosticos.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Stethoscope className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhum diagnóstico realizado</h3>
                    <p className="text-muted-foreground mb-4">
                      Comece realizando diagnósticos com IA para monitorar a saúde dos animais.
                    </p>
                    <Button onClick={() => setIsDiagnosticoModalOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Primeiro Diagnóstico
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                diagnosticos.map((diagnostico) => (
                  <Card key={diagnostico.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{diagnostico.tipo_diagnostico}</h3>
                            <Badge variant={
                              diagnostico.status === 'concluido' ? "default" : 
                              diagnostico.status === 'processando' ? "secondary" : "destructive"
                            }>
                              {diagnostico.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                            <div>
                              <p className="text-muted-foreground">Animal</p>
                              <p className="font-medium">
                                {diagnostico.animais?.nome || 'Não especificado'}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Lote</p>
                              <p className="font-medium">
                                {diagnostico.lotes?.nome || 'Não especificado'}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Confiança IA</p>
                              <p className="font-medium">
                                {diagnostico.confianca_ia ? `${(diagnostico.confianca_ia * 100).toFixed(1)}%` : 'N/A'}
                              </p>
                            </div>
                          </div>

                          {diagnostico.confianca_ia && (
                            <div className="mb-3">
                              <p className="text-xs text-muted-foreground mb-1">Precisão do Diagnóstico</p>
                              <Progress value={diagnostico.confianca_ia * 100} className="h-2" />
                            </div>
                          )}

                          {diagnostico.observacoes && (
                            <p className="text-sm text-muted-foreground">
                              <strong>Observações:</strong> {diagnostico.observacoes}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          <p className="text-xs text-muted-foreground text-right">
                            {new Date(diagnostico.created_at).toLocaleDateString('pt-BR')}
                          </p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Resultados
                            </Button>
                            {diagnostico.imagem_url && (
                              <Button variant="outline" size="sm">
                                <Camera className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="analyze" className="space-y-6">
            <h2 className="text-2xl font-bold">Nova Análise com IA</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload de Imagem</CardTitle>
                  <CardDescription>Faça upload de fotos para análise com IA</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      {uploadedImage ? (
                        <div>
                          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                          <p className="font-medium">{uploadedImage.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(uploadedImage.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground mb-4">
                            Arraste uma imagem ou clique para fazer upload
                          </p>
                        </div>
                      )}
                      
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload">
                        <Button variant="outline" className="cursor-pointer">
                          <Camera className="w-4 h-4 mr-2" />
                          {uploadedImage ? 'Trocar Imagem' : 'Selecionar Imagem'}
                        </Button>
                      </label>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Tipos de análise suportados:</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Análise corporal</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Condição nutricional</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span>Comportamento</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>Lesões visíveis</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informações Adicionais</CardTitle>
                  <CardDescription>Dados complementares para análise</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="tipo_diagnostico">Tipo de Análise</Label>
                    <Select value={newDiagnostico.tipo_diagnostico} onValueChange={(value) => setNewDiagnostico({...newDiagnostico, tipo_diagnostico: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nutricional">Análise Nutricional</SelectItem>
                        <SelectItem value="clinico">Diagnóstico Clínico</SelectItem>
                        <SelectItem value="comportamental">Análise Comportamental</SelectItem>
                        <SelectItem value="performance">Análise de Performance</SelectItem>
                        <SelectItem value="reprodutivo">Estado Reprodutivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="animal_diagnostico">Animal Específico</Label>
                    <Select value={newDiagnostico.animal_id} onValueChange={(value) => setNewDiagnostico({...newDiagnostico, animal_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um animal (opcional)" />
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

                  <div>
                    <Label htmlFor="lote_diagnostico">Lote</Label>
                    <Select value={newDiagnostico.lote_id} onValueChange={(value) => setNewDiagnostico({...newDiagnostico, lote_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um lote (opcional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {lotes.map((lote) => (
                          <SelectItem key={lote.id} value={lote.id}>
                            {lote.nome} - {lote.especie}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="observacoes_diagnostico">Observações</Label>
                    <Textarea
                      id="observacoes_diagnostico"
                      value={newDiagnostico.observacoes}
                      onChange={(e) => setNewDiagnostico({...newDiagnostico, observacoes: e.target.value})}
                      placeholder="Sintomas observados, comportamento, etc..."
                    />
                  </div>

                  <Button 
                    onClick={handleCreateDiagnostico} 
                    disabled={loading || !newDiagnostico.tipo_diagnostico}
                    className="w-full"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    {loading ? 'Processando...' : 'Iniciar Análise com IA'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <h2 className="text-2xl font-bold">Resultados Detalhados</h2>
            
            {diagnosticos.filter(d => d.status === 'concluido').length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Nenhum resultado disponível</h3>
                  <p className="text-muted-foreground">
                    Resultados detalhados aparecerão aqui após a conclusão dos diagnósticos.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {diagnosticos.filter(d => d.status === 'concluido').map((diagnostico) => (
                  <Card key={diagnostico.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{diagnostico.tipo_diagnostico}</CardTitle>
                          <CardDescription>
                            {new Date(diagnostico.created_at).toLocaleDateString('pt-BR')} - 
                            Confiança: {(diagnostico.confianca_ia * 100).toFixed(1)}%
                          </CardDescription>
                        </div>
                        <Badge variant="default">Concluído</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {diagnostico.resultados && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-3">Resultados da Análise</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Condição Identificada:</span>
                                <span className="font-medium">{diagnostico.resultados.condicao_identificada}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Severidade:</span>
                                <Badge variant={diagnostico.resultados.severidade === 'Leve' ? 'default' : 'destructive'}>
                                  {diagnostico.resultados.severidade}
                                </Badge>
                              </div>
                              {diagnostico.resultados.indicadores && (
                                <div className="mt-4">
                                  <p className="font-medium mb-2">Indicadores:</p>
                                  <div className="space-y-1">
                                    <div className="flex justify-between">
                                      <span>Peso:</span>
                                      <span>{diagnostico.resultados.indicadores.peso?.toFixed(1)} kg</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Temperatura:</span>
                                      <span>{diagnostico.resultados.indicadores.temperatura?.toFixed(1)}°C</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Atividade:</span>
                                      <span>{diagnostico.resultados.indicadores.atividade?.toFixed(0)}%</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-3">Recomendações</h4>
                            <div className="space-y-3 text-sm">
                              {diagnostico.recomendacoes.tratamento_imediato && (
                                <div>
                                  <p className="font-medium text-orange-600">Ações Imediatas:</p>
                                  <ul className="list-disc list-inside space-y-1">
                                    {diagnostico.recomendacoes.tratamento_imediato.map((item, index) => (
                                      <li key={index}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {diagnostico.recomendacoes.medicamentos && diagnostico.recomendacoes.medicamentos.length > 0 && (
                                <div>
                                  <p className="font-medium text-blue-600">Medicamentos:</p>
                                  <ul className="list-disc list-inside space-y-1">
                                    {diagnostico.recomendacoes.medicamentos.map((med, index) => (
                                      <li key={index}>{med}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              <div>
                                <p className="font-medium text-green-600">Acompanhamento:</p>
                                <p>{diagnostico.recomendacoes.acompanhamento}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Relatórios de Diagnóstico</h2>
              <Button variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                Gerar Relatório
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas Gerais</CardTitle>
                  <CardDescription>Resumo dos diagnósticos realizados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total de Diagnósticos</span>
                      <span className="font-bold">{stats.totalDiagnosticos}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Taxa de Sucesso</span>
                      <span className="font-bold">
                        {stats.totalDiagnosticos > 0 
                          ? `${((stats.diagnosticosConcluidos / stats.totalDiagnosticos) * 100).toFixed(1)}%`
                          : '0%'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Confiança Média da IA</span>
                      <span className="font-bold">
                        {stats.confianciaMedia > 0 ? `${(stats.confianciaMedia * 100).toFixed(1)}%` : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Diagnósticos Recentes</span>
                      <span className="font-bold">{stats.diagnosticosRecentes}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tipos de Diagnóstico</CardTitle>
                  <CardDescription>Distribuição por categoria</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['nutricional', 'clinico', 'comportamental', 'performance'].map((tipo) => {
                      const count = diagnosticos.filter(d => d.tipo_diagnostico === tipo).length;
                      const percentage = diagnosticos.length > 0 ? (count / diagnosticos.length) * 100 : 0;
                      
                      return (
                        <div key={tipo} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="capitalize">{tipo}</span>
                            <span className="text-sm text-muted-foreground">{count} diagnósticos</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Modal para Novo Diagnóstico */}
        <Dialog open={isDiagnosticoModalOpen} onOpenChange={setIsDiagnosticoModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Diagnóstico</DialogTitle>
              <DialogDescription>
                Inicie um novo diagnóstico com IA
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tipo">Tipo de Diagnóstico *</Label>
                <Select value={newDiagnostico.tipo_diagnostico} onValueChange={(value) => setNewDiagnostico({...newDiagnostico, tipo_diagnostico: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nutricional">Análise Nutricional</SelectItem>
                    <SelectItem value="clinico">Diagnóstico Clínico</SelectItem>
                    <SelectItem value="comportamental">Análise Comportamental</SelectItem>
                    <SelectItem value="performance">Análise de Performance</SelectItem>
                    <SelectItem value="reprodutivo">Estado Reprodutivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={newDiagnostico.observacoes}
                  onChange={(e) => setNewDiagnostico({...newDiagnostico, observacoes: e.target.value})}
                  placeholder="Descreva os sintomas ou comportamentos observados..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDiagnosticoModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateDiagnostico} disabled={loading}>
                <Brain className="w-4 h-4 mr-2" />
                Processar com IA
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Stethoscope, 
  Users, 
  Calendar, 
  TrendingUp, 
  Plus,
  Search,
  Filter,
  Activity,
  ClipboardList,
  Pill,
  ChartBar,
  AlertTriangle,
  CheckCircle,
  FileText,
  Eye,
  QrCode,
  Camera,
  MapPin,
  DollarSign,
  Package,
  Clock,
  UserCheck,
  Leaf,
  Upload,
  BarChart3,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProfileCard } from "@/components/ProfileCard";

export default function VeterinarioArea() {
  const { currentCompany } = useCompany();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  
  // Estados para dados
  const [animals, setAnimals] = useState([]);
  const [receitas, setReceitas] = useState([]);
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [historicoSaude, setHistoricoSaude] = useState([]);
  const [anexos, setAnexos] = useState([]);
  const [calendarioVet, setCalendarioVet] = useState([]);
  const [tarefasDiarias, setTarefasDiarias] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [financeiro, setFinanceiro] = useState([]);
  const [sustentabilidade, setSustentabilidade] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  
  // Estados para formulários
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [newReceita, setNewReceita] = useState({
    nome: '',
    animal_id: '',
    objetivo: '',
    formula: {},
    observacoes: ''
  });
  
  // Estados para novos formulários
  const [newHistoricoSaude, setNewHistoricoSaude] = useState({
    animal_id: '',
    tipo: '',
    descricao: '',
    data_aplicacao: '',
    observacoes: ''
  });

  const [newTarefa, setNewTarefa] = useState({
    titulo: '',
    descricao: '',
    tipo: '',
    prioridade: 'media',
    data_prevista: '',
    responsavel_id: ''
  });

  const [newEventoCalendario, setNewEventoCalendario] = useState({
    animal_id: '',
    tipo_evento: '',
    titulo: '',
    descricao: '',
    data_agendada: ''
  });
  
  // Modal states
  const [isReceitaModalOpen, setIsReceitaModalOpen] = useState(false);
  const [isDiagnosticoModalOpen, setIsDiagnosticoModalOpen] = useState(false);
  const [isHistoricoSaudeModalOpen, setIsHistoricoSaudeModalOpen] = useState(false);
  const [isTarefaModalOpen, setIsTarefaModalOpen] = useState(false);
  const [isEventoModalOpen, setIsEventoModalOpen] = useState(false);

  useEffect(() => {
    if (currentCompany && user) {
      loadVeterinarioData();
    }
  }, [currentCompany, user]);

  const loadVeterinarioData = async () => {
    if (!currentCompany || !user) return;

    try {
      setLoading(true);

      // Carregar animais
      const { data: animalsData } = await supabase
        .from('animais')
        .select(`
          *,
          lotes(nome),
          propriedades(nome)
        `)
        .eq('company_id', currentCompany.id)
        .order('created_at', { ascending: false });

      // Carregar receitas
      const { data: receitasData } = await supabase
        .from('receitas')
        .select(`
          *,
          animais(nome, especie),
          catalog_products(nome)
        `)
        .eq('company_id', currentCompany.id)
        .eq('tecnico_id', user.id)
        .order('created_at', { ascending: false });

      // Carregar diagnósticos
      const { data: diagnosticosData } = await supabase
        .from('diagnosticos')
        .select(`
          *,
          animais(nome, especie)
        `)
        .eq('company_id', currentCompany.id)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Carregar métricas de performance
      const { data: performanceData } = await supabase
        .from('metricas_performance')
        .select(`
          *,
          animais(nome, especie)
        `)
        .eq('company_id', currentCompany.id)
        .order('data_medicao', { ascending: false })
        .limit(20);

      // Carregar histórico de saúde
      const { data: historicoData } = await supabase
        .from('historico_saude')
        .select(`
          *,
          animais(nome, especie),
          profiles(nome)
        `)
        .eq('company_id', currentCompany.id)
        .order('data_aplicacao', { ascending: false })
        .limit(50);

      // Carregar calendário veterinário
      const { data: calendarioData } = await supabase
        .from('calendario_veterinario')
        .select(`
          *,
          animais(nome),
          lotes(nome)
        `)
        .eq('company_id', currentCompany.id)
        .order('data_agendada', { ascending: true });

      // Carregar tarefas diárias
      const { data: tarefasData } = await supabase
        .from('tarefas_diarias')
        .select(`
          *,
          profiles!responsavel_id(nome),
          profiles!executado_por(nome)
        `)
        .eq('company_id', currentCompany.id)
        .gte('data_prevista', new Date().toISOString().split('T')[0])
        .order('data_prevista', { ascending: true });

      // Carregar estoque
      const { data: estoqueData } = await supabase
        .from('estoque_insumos')
        .select('*')
        .eq('company_id', currentCompany.id)
        .eq('ativo', true)
        .order('nome');

      setAnimals(animalsData || []);
      setReceitas(receitasData || []);
      setDiagnosticos(diagnosticosData || []);
      setPerformance(performanceData || []);
      setHistoricoSaude(historicoData || []);
      setCalendarioVet(calendarioData || []);
      setTarefasDiarias(tarefasData || []);
      setEstoque(estoqueData || []);

    } catch (error) {
      console.error('Erro ao carregar dados do veterinário:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do veterinário",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReceita = async () => {
    if (!currentCompany || !user || !newReceita.nome || !newReceita.animal_id) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from('receitas')
        .insert({
          ...newReceita,
          company_id: currentCompany.id,
          tecnico_id: user.id,
          formula: newReceita.formula || {}
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Receita criada com sucesso!"
      });

      setIsReceitaModalOpen(false);
      setNewReceita({
        nome: '',
        animal_id: '',
        objetivo: '',
        formula: {},
        observacoes: ''
      });
      loadVeterinarioData();

    } catch (error) {
      console.error('Erro ao criar receita:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar receita",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHistoricoSaude = async () => {
    if (!currentCompany || !user || !newHistoricoSaude.animal_id || !newHistoricoSaude.tipo || !newHistoricoSaude.descricao) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from('historico_saude')
        .insert({
          ...newHistoricoSaude,
          company_id: currentCompany.id,
          veterinario_responsavel: user.id
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Registro de saúde criado com sucesso!"
      });

      setIsHistoricoSaudeModalOpen(false);
      setNewHistoricoSaude({
        animal_id: '',
        tipo: '',
        descricao: '',
        data_aplicacao: '',
        observacoes: ''
      });
      loadVeterinarioData();

    } catch (error) {
      console.error('Erro ao criar histórico de saúde:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar histórico de saúde",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTarefa = async () => {
    if (!currentCompany || !user || !newTarefa.titulo || !newTarefa.tipo) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from('tarefas_diarias')
        .insert({
          ...newTarefa,
          company_id: currentCompany.id
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Tarefa criada com sucesso!"
      });

      setIsTarefaModalOpen(false);
      setNewTarefa({
        titulo: '',
        descricao: '',
        tipo: '',
        prioridade: 'media',
        data_prevista: '',
        responsavel_id: ''
      });
      loadVeterinarioData();

    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar tarefa",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEventoCalendario = async () => {
    if (!currentCompany || !user || !newEventoCalendario.titulo || !newEventoCalendario.tipo_evento) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from('calendario_veterinario')
        .insert({
          ...newEventoCalendario,
          company_id: currentCompany.id,
          veterinario_responsavel: user.id
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Evento criado com sucesso!"
      });

      setIsEventoModalOpen(false);
      setNewEventoCalendario({
        animal_id: '',
        tipo_evento: '',
        titulo: '',
        descricao: '',
        data_agendada: ''
      });
      loadVeterinarioData();

    } catch (error) {
      console.error('Erro ao criar evento:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar evento",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalAnimals: animals.length,
    activeReceitas: receitas.filter(r => r.ativa).length,
    diagnosticsThisMonth: diagnosticos.filter(d => 
      new Date(d.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length,
    avgPerformance: performance.length > 0 
      ? performance.reduce((sum, p) => sum + (p.conversao_alimentar || 0), 0) / performance.length 
      : 0,
    pendingTasks: tarefasDiarias.filter(t => t.status === 'pendente').length,
    scheduledEvents: calendarioVet.filter(e => e.status === 'agendado').length,
    lowStockItems: estoque.filter(item => item.quantidade_atual <= item.quantidade_minima).length,
    healthAlerts: historicoSaude.filter(h => h.tipo === 'enfermidade' && 
      new Date(h.data_aplicacao) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length
  };

  if (loading && animals.length === 0) {
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
          <h1 className="text-3xl font-bold mb-2">VetSaaS Pro - Área Veterinária</h1>
          <p className="text-muted-foreground">
            Sistema completo de gestão veterinária e agropecuária
          </p>
        </div>

        {/* Dashboard de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="animals">Animais</TabsTrigger>
            <TabsTrigger value="health">Saúde</TabsTrigger>
            <TabsTrigger value="calendar">Calendário</TabsTrigger>
            <TabsTrigger value="tasks">Tarefas</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrição</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="animals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestão Avançada de Animais</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Buscar animais..." className="pl-10 w-64" />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {animals.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="p-6 text-center">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhum animal cadastrado</h3>
                    <p className="text-muted-foreground">
                      Os animais da empresa aparecerão aqui quando forem cadastrados.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                animals.map((animal) => (
                  <Card key={animal.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{animal.nome}</CardTitle>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <QrCode className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Espécie</p>
                          <p className="font-medium">{animal.especie}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Peso</p>
                          <p className="font-medium">{animal.peso ? `${animal.peso} kg` : 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Status</p>
                          <Badge variant={animal.status_saude === 'saudavel' ? 'default' : 'destructive'}>
                            {animal.status_saude}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-muted-foreground">QR Code</p>
                          <p className="font-medium text-xs">{animal.qrcode}</p>
                        </div>
                      </div>
                      {animal.escore_corporal && (
                        <div>
                          <p className="text-sm text-muted-foreground">Escore Corporal</p>
                          <Progress value={animal.escore_corporal * 20} className="h-2" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestão de Saúde</h2>
              <Button onClick={() => setIsHistoricoSaudeModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Registro
              </Button>
            </div>

            <div className="grid gap-4">
              {historicoSaude.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Stethoscope className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhum registro de saúde</h3>
                    <p className="text-muted-foreground">
                      Registros de saúde aparecerão aqui quando forem criados.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                historicoSaude.map((registro) => (
                  <Card key={registro.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{registro.tipo}</h3>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>Animal: {registro.animais?.nome}</p>
                            <p>Descrição: {registro.descricao}</p>
                            <p>Data: {new Date(registro.data_aplicacao).toLocaleDateString('pt-BR')}</p>
                            <p>Veterinário: {registro.profiles?.nome || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            registro.tipo === 'vacina' ? "default" : 
                            registro.tipo === 'enfermidade' ? "destructive" : "secondary"
                          }>
                            {registro.tipo}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Ver
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Calendário Veterinário</h2>
              <Button onClick={() => setIsEventoModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Evento
              </Button>
            </div>

            <div className="grid gap-4">
              {calendarioVet.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhum evento agendado</h3>
                    <p className="text-muted-foreground">
                      Eventos aparecerão aqui quando forem criados.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                calendarioVet.map((evento) => (
                  <Card key={evento.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{evento.titulo}</h3>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>Tipo: {evento.tipo_evento}</p>
                            <p>Data: {new Date(evento.data_agendada).toLocaleDateString('pt-BR')}</p>
                            {evento.animais && <p>Animal: {evento.animais.nome}</p>}
                            {evento.lotes && <p>Lote: {evento.lotes.nome}</p>}
                            {evento.descricao && <p>Descrição: {evento.descricao}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            evento.status === 'agendado' ? "default" : 
                            evento.status === 'realizado' ? "outline" : "destructive"
                          }>
                            {evento.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Ver
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Tarefas Diárias</h2>
              <Button onClick={() => setIsTarefaModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Tarefa
              </Button>
            </div>

            <div className="grid gap-4">
              {tarefasDiarias.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhuma tarefa cadastrada</h3>
                    <p className="text-muted-foreground">
                      Tarefas aparecerão aqui quando forem criadas.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                tarefasDiarias.map((tarefa) => (
                  <Card key={tarefa.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{tarefa.titulo}</h3>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>Tipo: {tarefa.tipo}</p>
                            <p>Data prevista: {new Date(tarefa.data_prevista).toLocaleDateString('pt-BR')}</p>
                            {tarefa.profiles && <p>Responsável: {tarefa.profiles.nome}</p>}
                            {tarefa.descricao && <p>Descrição: {tarefa.descricao}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            tarefa.prioridade === 'alta' ? "destructive" :
                            tarefa.prioridade === 'media' ? "default" : "secondary"
                          }>
                            {tarefa.prioridade}
                          </Badge>
                          <Badge variant={
                            tarefa.status === 'concluida' ? "outline" :
                            tarefa.status === 'em_andamento' ? "default" : "secondary"
                          }>
                            {tarefa.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Nutrição Avançada</h2>
              <Button onClick={() => setIsReceitaModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Receita
              </Button>
            </div>

            <div className="grid gap-4">
              {receitas.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Pill className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhuma receita criada</h3>
                    <p className="text-muted-foreground">
                      Suas receitas aparecerão aqui quando forem criadas.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                receitas.map((receita) => (
                  <Card key={receita.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{receita.nome}</h3>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>Animal: {receita.animais?.nome}</p>
                            <p>Espécie: {receita.animais?.especie}</p>
                            <p>Objetivo: {receita.objetivo}</p>
                            <p>Data: {new Date(receita.created_at).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={receita.ativa ? "default" : "secondary"}>
                            {receita.ativa ? "Ativa" : "Inativa"}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Ver
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <h2 className="text-2xl font-bold">Relatórios e BI</h2>
            
            {/* Análise de Performance */}
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Análise de Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {performance.length === 0 ? (
                    <div className="text-center py-8">
                      <ChartBar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Sem dados de performance</h3>
                      <p className="text-muted-foreground">
                        Dados de performance aparecerão aqui quando forem registrados.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {performance.slice(0, 8).map((metric) => (
                        <div key={metric.id} className="p-4 border rounded">
                          <h4 className="font-medium">{metric.animais?.nome}</h4>
                          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                            <div>
                              <p className="text-muted-foreground">Peso</p>
                              <p className="font-semibold">{metric.peso ? `${metric.peso} kg` : 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Conversão</p>
                              <p className="font-semibold">{metric.conversao_alimentar || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Alertas de Estoque */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Controle de Estoque
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {estoque.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Sem itens em estoque</h3>
                      <p className="text-muted-foreground">
                        Itens de estoque aparecerão aqui quando forem cadastrados.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {estoque.filter(item => item.quantidade_atual <= item.quantidade_minima).map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded">
                          <div>
                            <p className="font-medium">{item.nome}</p>
                            <p className="text-sm text-muted-foreground">
                              Estoque atual: {item.quantidade_atual} {item.unidade_medida}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-orange-600 border-orange-600">
                            Estoque Baixo
                          </Badge>
                        </div>
                      ))}
                      {estoque.filter(item => item.quantidade_atual > item.quantidade_minima).length > 0 && (
                        <p className="text-sm text-muted-foreground text-center pt-4">
                          {estoque.filter(item => item.quantidade_atual > item.quantidade_minima).length} itens com estoque adequado
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold">Configurações do Sistema</h2>
            
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações Gerais</CardTitle>
                  <CardDescription>
                    Personalize as configurações do sistema conforme suas necessidades
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex-col">
                      <QrCode className="w-6 h-6 mb-2" />
                      Gerar QR Codes
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Upload className="w-6 h-6 mb-2" />
                      Backup de Dados
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <FileText className="w-6 h-6 mb-2" />
                      Relatórios MAPA
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Leaf className="w-6 h-6 mb-2" />
                      Config. ESG
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Modal para Novo Histórico de Saúde */}
        <Dialog open={isHistoricoSaudeModalOpen} onOpenChange={setIsHistoricoSaudeModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Registro de Saúde</DialogTitle>
              <DialogDescription>
                Registre procedimentos veterinários, vacinas ou diagnósticos
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="animal">Animal</Label>
                <Select value={newHistoricoSaude.animal_id} onValueChange={(value) => setNewHistoricoSaude({...newHistoricoSaude, animal_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um animal" />
                  </SelectTrigger>
                  <SelectContent>
                    {animals.map((animal) => (
                      <SelectItem key={animal.id} value={animal.id}>
                        {animal.nome} - {animal.especie}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tipo">Tipo de Procedimento</Label>
                <Select value={newHistoricoSaude.tipo} onValueChange={(value) => setNewHistoricoSaude({...newHistoricoSaude, tipo: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vacina">Vacina</SelectItem>
                    <SelectItem value="exame">Exame</SelectItem>
                    <SelectItem value="tratamento">Tratamento</SelectItem>
                    <SelectItem value="enfermidade">Enfermidade</SelectItem>
                    <SelectItem value="cirurgia">Cirurgia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  value={newHistoricoSaude.descricao}
                  onChange={(e) => setNewHistoricoSaude({...newHistoricoSaude, descricao: e.target.value})}
                  placeholder="Descreva o procedimento"
                />
              </div>
              <div>
                <Label htmlFor="data_aplicacao">Data</Label>
                <Input
                  id="data_aplicacao"
                  type="date"
                  value={newHistoricoSaude.data_aplicacao}
                  onChange={(e) => setNewHistoricoSaude({...newHistoricoSaude, data_aplicacao: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={newHistoricoSaude.observacoes}
                  onChange={(e) => setNewHistoricoSaude({...newHistoricoSaude, observacoes: e.target.value})}
                  placeholder="Observações adicionais..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsHistoricoSaudeModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateHistoricoSaude} disabled={loading}>
                Salvar Registro
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal para Nova Tarefa */}
        <Dialog open={isTarefaModalOpen} onOpenChange={setIsTarefaModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Tarefa</DialogTitle>
              <DialogDescription>
                Crie uma nova tarefa para a equipe
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  value={newTarefa.titulo}
                  onChange={(e) => setNewTarefa({...newTarefa, titulo: e.target.value})}
                  placeholder="Título da tarefa"
                />
              </div>
              <div>
                <Label htmlFor="tipo">Tipo</Label>
                <Select value={newTarefa.tipo} onValueChange={(value) => setNewTarefa({...newTarefa, tipo: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ordenha">Ordenha</SelectItem>
                    <SelectItem value="vacinacao">Vacinação</SelectItem>
                    <SelectItem value="limpeza">Limpeza</SelectItem>
                    <SelectItem value="alimentacao">Alimentação</SelectItem>
                    <SelectItem value="manutencao">Manutenção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="prioridade">Prioridade</Label>
                <Select value={newTarefa.prioridade} onValueChange={(value) => setNewTarefa({...newTarefa, prioridade: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="data_prevista">Data Prevista</Label>
                <Input
                  id="data_prevista"
                  type="date"
                  value={newTarefa.data_prevista}
                  onChange={(e) => setNewTarefa({...newTarefa, data_prevista: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={newTarefa.descricao}
                  onChange={(e) => setNewTarefa({...newTarefa, descricao: e.target.value})}
                  placeholder="Descrição da tarefa..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsTarefaModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateTarefa} disabled={loading}>
                Criar Tarefa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal para Novo Evento no Calendário */}
        <Dialog open={isEventoModalOpen} onOpenChange={setIsEventoModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Evento</DialogTitle>
              <DialogDescription>
                Agende um evento no calendário veterinário
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="titulo_evento">Título</Label>
                <Input
                  id="titulo_evento"
                  value={newEventoCalendario.titulo}
                  onChange={(e) => setNewEventoCalendario({...newEventoCalendario, titulo: e.target.value})}
                  placeholder="Título do evento"
                />
              </div>
              <div>
                <Label htmlFor="tipo_evento">Tipo de Evento</Label>
                <Select value={newEventoCalendario.tipo_evento} onValueChange={(value) => setNewEventoCalendario({...newEventoCalendario, tipo_evento: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vacina">Vacinação</SelectItem>
                    <SelectItem value="check-up">Check-up</SelectItem>
                    <SelectItem value="vermifugacao">Vermifugação</SelectItem>
                    <SelectItem value="exame">Exame</SelectItem>
                    <SelectItem value="cirurgia">Cirurgia</SelectItem>
                    <SelectItem value="inseminacao">Inseminação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="animal_evento">Animal (Opcional)</Label>
                <Select value={newEventoCalendario.animal_id} onValueChange={(value) => setNewEventoCalendario({...newEventoCalendario, animal_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um animal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum animal específico</SelectItem>
                    {animals.map((animal) => (
                      <SelectItem key={animal.id} value={animal.id}>
                        {animal.nome} - {animal.especie}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="data_agendada">Data Agendada</Label>
                <Input
                  id="data_agendada"
                  type="date"
                  value={newEventoCalendario.data_agendada}
                  onChange={(e) => setNewEventoCalendario({...newEventoCalendario, data_agendada: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="descricao_evento">Descrição</Label>
                <Textarea
                  id="descricao_evento"
                  value={newEventoCalendario.descricao}
                  onChange={(e) => setNewEventoCalendario({...newEventoCalendario, descricao: e.target.value})}
                  placeholder="Descrição do evento..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEventoModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateEventoCalendario} disabled={loading}>
                Criar Evento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal para Nova Receita - keeping existing one */}
        <Dialog open={isReceitaModalOpen} onOpenChange={setIsReceitaModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Receita</DialogTitle>
              <DialogDescription>
                Crie uma nova receita para um animal
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="animal">Animal</Label>
                <Select value={newReceita.animal_id} onValueChange={(value) => setNewReceita({...newReceita, animal_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um animal" />
                  </SelectTrigger>
                  <SelectContent>
                    {animals.map((animal) => (
                      <SelectItem key={animal.id} value={animal.id}>
                        {animal.nome} - {animal.especie}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="nome">Nome da Receita</Label>
                <Input
                  id="nome"
                  value={newReceita.nome}
                  onChange={(e) => setNewReceita({...newReceita, nome: e.target.value})}
                  placeholder="Ex: Tratamento para crescimento"
                />
              </div>
              <div>
                <Label htmlFor="objetivo">Objetivo</Label>
                <Input
                  id="objetivo"
                  value={newReceita.objetivo}
                  onChange={(e) => setNewReceita({...newReceita, objetivo: e.target.value})}
                  placeholder="Ex: Ganho de peso, tratamento de doença..."
                />
              </div>
              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={newReceita.observacoes}
                  onChange={(e) => setNewReceita({...newReceita, observacoes: e.target.value})}
                  placeholder="Instruções especiais, posologia..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReceitaModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateReceita} disabled={loading}>
                Criar Receita
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

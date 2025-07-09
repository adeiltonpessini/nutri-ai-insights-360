
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCompany } from "@/contexts/CompanyContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { VeterinarioDashboard } from "@/components/veterinario/VeterinarioDashboard";
import { AnimalManagement } from "@/components/veterinario/AnimalManagement";
import { HealthManagement } from "@/components/veterinario/HealthManagement";
import { CalendarManagement } from "@/components/veterinario/CalendarManagement";
import { TaskManagement } from "@/components/veterinario/TaskManagement";
import { NutritionManagement } from "@/components/veterinario/NutritionManagement";
import { ReportsBI } from "@/components/veterinario/ReportsBI";
import { SystemSettings } from "@/components/veterinario/SystemSettings";
import { VeterinarioModals } from "@/components/veterinario/VeterinarioModals";

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
  const [calendarioVet, setCalendarioVet] = useState([]);
  const [tarefasDiarias, setTarefasDiarias] = useState([]);
  const [estoque, setEstoque] = useState([]);
  
  // Estados para formulários
  const [newReceita, setNewReceita] = useState({
    nome: '',
    animal_id: '',
    objetivo: '',
    formula: {},
    observacoes: ''
  });
  
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
            <VeterinarioDashboard 
              stats={stats} 
              calendarioVet={calendarioVet} 
              historicoSaude={historicoSaude} 
            />
          </TabsContent>

          <TabsContent value="animals" className="space-y-6">
            <AnimalManagement animals={animals} />
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <HealthManagement 
              historicoSaude={historicoSaude} 
              onNewRecord={() => setIsHistoricoSaudeModalOpen(true)}
            />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <CalendarManagement 
              calendarioVet={calendarioVet} 
              onNewEvent={() => setIsEventoModalOpen(true)}
            />
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <TaskManagement 
              tarefasDiarias={tarefasDiarias} 
              onNewTask={() => setIsTarefaModalOpen(true)}
            />
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-6">
            <NutritionManagement 
              receitas={receitas} 
              onNewRecipe={() => setIsReceitaModalOpen(true)}
            />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <ReportsBI performance={performance} estoque={estoque} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SystemSettings />
          </TabsContent>
        </Tabs>

        <VeterinarioModals
          isReceitaModalOpen={isReceitaModalOpen}
          setIsReceitaModalOpen={setIsReceitaModalOpen}
          isHistoricoSaudeModalOpen={isHistoricoSaudeModalOpen}
          setIsHistoricoSaudeModalOpen={setIsHistoricoSaudeModalOpen}
          isTarefaModalOpen={isTarefaModalOpen}
          setIsTarefaModalOpen={setIsTarefaModalOpen}
          isEventoModalOpen={isEventoModalOpen}
          setIsEventoModalOpen={setIsEventoModalOpen}
          newReceita={newReceita}
          setNewReceita={setNewReceita}
          newHistoricoSaude={newHistoricoSaude}
          setNewHistoricoSaude={setNewHistoricoSaude}
          newTarefa={newTarefa}
          setNewTarefa={setNewTarefa}
          newEventoCalendario={newEventoCalendario}
          setNewEventoCalendario={setNewEventoCalendario}
          animals={animals}
          loading={loading}
          handleCreateReceita={handleCreateReceita}
          handleCreateHistoricoSaude={handleCreateHistoricoSaude}
          handleCreateTarefa={handleCreateTarefa}
          handleCreateEventoCalendario={handleCreateEventoCalendario}
        />
      </div>
    </div>
  );
}

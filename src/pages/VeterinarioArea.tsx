
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
  Eye
} from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function VeterinarioArea() {
  const { currentCompany } = useCompany();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("animals");
  const [loading, setLoading] = useState(false);
  
  // Estados para dados
  const [animals, setAnimals] = useState([]);
  const [receitas, setReceitas] = useState([]);
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [performance, setPerformance] = useState([]);
  
  // Estados para formulários
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [newReceita, setNewReceita] = useState({
    nome: '',
    animal_id: '',
    objetivo: '',
    formula: {},
    observacoes: ''
  });
  
  // Modal states
  const [isReceitaModalOpen, setIsReceitaModalOpen] = useState(false);
  const [isDiagnosticoModalOpen, setIsDiagnosticoModalOpen] = useState(false);

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

      setAnimals(animalsData || []);
      setReceitas(receitasData || []);
      setDiagnosticos(diagnosticosData || []);
      setPerformance(performanceData || []);

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

  const stats = {
    totalAnimals: animals.length,
    activeReceitas: receitas.filter(r => r.ativa).length,
    diagnosticsThisMonth: diagnosticos.filter(d => 
      new Date(d.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length,
    avgPerformance: performance.length > 0 
      ? performance.reduce((sum, p) => sum + (p.conversao_alimentar || 0), 0) / performance.length 
      : 0
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
          <h1 className="text-3xl font-bold mb-2">Área do Veterinário</h1>
          <p className="text-muted-foreground">
            Gerencie animais, receitas e diagnósticos
          </p>
        </div>

        {/* Cards de Estatísticas */}
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
              <CardTitle className="text-sm font-medium">Receitas Ativas</CardTitle>
              <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeReceitas}</div>
              <p className="text-xs text-muted-foreground">
                Prescrições em andamento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Diagnósticos</CardTitle>
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.diagnosticsThisMonth}</div>
              <p className="text-xs text-muted-foreground">
                Este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance Média</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.avgPerformance > 0 ? stats.avgPerformance.toFixed(1) : '-'}
              </div>
              <p className="text-xs text-muted-foreground">
                Conversão alimentar
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="animals">Animais</TabsTrigger>
            <TabsTrigger value="receitas">Receitas</TabsTrigger>
            <TabsTrigger value="diagnosticos">Diagnósticos</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="agenda">Agenda</TabsTrigger>
          </TabsList>

          <TabsContent value="animals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestão de Animais</h2>
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

            <div className="grid gap-4">
              {animals.length === 0 ? (
                <Card>
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
                  <Card key={animal.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{animal.nome}</h3>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>Espécie: {animal.especie}</p>
                            <p>Raça: {animal.raca || 'Não informado'}</p>
                            <p>Peso: {animal.peso ? `${animal.peso} kg` : 'Não informado'}</p>
                            <p>Lote: {animal.lotes?.nome || 'Não vinculado'}</p>
                            <p>Propriedade: {animal.propriedades?.nome || 'Não informado'}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Detalhes
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Receita
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Nova Receita para {animal.nome}</DialogTitle>
                                <DialogDescription>
                                  Prescreva medicamentos ou alimentos para este animal
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="nome">Nome da Receita</Label>
                                  <Input
                                    id="nome"
                                    value={newReceita.nome}
                                    onChange={(e) => setNewReceita({...newReceita, nome: e.target.value, animal_id: animal.id})}
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
                                <Button onClick={handleCreateReceita} disabled={loading}>
                                  Criar Receita
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="receitas" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Minhas Receitas</h2>
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

          <TabsContent value="diagnosticos" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Histórico de Diagnósticos</h2>
              <Button>
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
                    <p className="text-muted-foreground">
                      Seus diagnósticos aparecerão aqui quando forem realizados.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                diagnosticos.map((diagnostico) => (
                  <Card key={diagnostico.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{diagnostico.tipo_diagnostico}</h3>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>Animal: {diagnostico.animais?.nome}</p>
                            <p>Data: {new Date(diagnostico.created_at).toLocaleDateString('pt-BR')}</p>
                            <p>Confiança IA: {diagnostico.confianca_ia ? `${(diagnostico.confianca_ia * 100).toFixed(1)}%` : 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            diagnostico.status === 'concluido' ? "default" : 
                            diagnostico.status === 'processando' ? "secondary" : "destructive"
                          }>
                            {diagnostico.status}
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

          <TabsContent value="performance" className="space-y-6">
            <h2 className="text-2xl font-bold">Análise de Performance</h2>
            
            <div className="grid gap-4">
              {performance.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <ChartBar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Sem dados de performance</h3>
                    <p className="text-muted-foreground">
                      Dados de performance aparecerão aqui quando forem registrados.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                performance.map((metric) => (
                  <Card key={metric.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{metric.animais?.nome}</h3>
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Peso</p>
                              <p className="font-semibold">{metric.peso ? `${metric.peso} kg` : 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Ganho Diário</p>
                              <p className="font-semibold">{metric.ganho_peso_diario ? `${metric.ganho_peso_diario} kg` : 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Consumo Ração</p>
                              <p className="font-semibold">{metric.consumo_racao ? `${metric.consumo_racao} kg` : 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Conversão</p>
                              <p className="font-semibold">{metric.conversao_alimentar || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {new Date(metric.data_medicao).toLocaleDateString('pt-BR')}
                          </p>
                          {metric.conversao_alimentar && (
                            <Badge variant={metric.conversao_alimentar < 3 ? "default" : "destructive"}>
                              {metric.conversao_alimentar < 3 ? "Boa" : "Atenção"}
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

          <TabsContent value="agenda" className="space-y-6">
            <h2 className="text-2xl font-bold">Agenda Veterinária</h2>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sistema de Agenda em Desenvolvimento</h3>
                <p className="text-muted-foreground">
                  Em breve você poderá agendar consultas e acompanhamentos diretamente no sistema.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal para Nova Receita */}
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

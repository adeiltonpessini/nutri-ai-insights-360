
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
  MapPin, 
  Barn,
  Users,
  TrendingUp,
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  Calendar,
  Target,
  BarChart3
} from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Propriedade {
  id: string;
  nome: string;
  endereco: string;
  tipo_criacao: string;
  area_hectares: number;
  capacidade_animais: number;
  created_at: string;
}

interface Lote {
  id: string;
  nome: string;
  especie: string;
  raca: string;
  quantidade_animais: number;
  peso_medio_inicial: number;
  peso_medio_atual: number;
  data_inicio: string;
  objetivo: string;
  status: string;
  propriedades?: { nome: string };
}

export default function Propriedades() {
  const { currentCompany } = useCompany();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("propriedades");
  const [loading, setLoading] = useState(false);
  
  // Estados para dados
  const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [performance, setPerformance] = useState([]);
  
  // Estados para formulários
  const [newPropriedade, setNewPropriedade] = useState({
    nome: '',
    endereco: '',
    tipo_criacao: '',
    area_hectares: '',
    capacidade_animais: ''
  });
  
  const [newLote, setNewLote] = useState({
    nome: '',
    especie: '',
    raca: '',
    quantidade_animais: '',
    peso_medio_inicial: '',
    data_inicio: '',
    objetivo: '',
    propriedade_id: ''
  });
  
  // Modal states
  const [isPropriedadeModalOpen, setIsPropriedadeModalOpen] = useState(false);
  const [isLoteModalOpen, setIsLoteModalOpen] = useState(false);

  useEffect(() => {
    if (currentCompany && user) {
      loadData();
    }
  }, [currentCompany, user]);

  const loadData = async () => {
    if (!currentCompany || !user) return;

    try {
      setLoading(true);

      // Carregar propriedades
      const { data: propriedadesData } = await supabase
        .from('propriedades')
        .select('*')
        .eq('company_id', currentCompany.id)
        .order('created_at', { ascending: false });

      // Carregar lotes
      const { data: lotesData } = await supabase
        .from('lotes')
        .select(`
          *,
          propriedades(nome)
        `)
        .eq('company_id', currentCompany.id)
        .order('created_at', { ascending: false });

      // Carregar performance
      const { data: performanceData } = await supabase
        .from('performance_historico')
        .select(`
          *,
          lotes(nome)
        `)
        .eq('company_id', currentCompany.id)
        .order('data_medicao', { ascending: false })
        .limit(10);

      setPropriedades(propriedadesData || []);
      setLotes(lotesData || []);
      setPerformance(performanceData || []);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados das propriedades",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePropriedade = async () => {
    if (!currentCompany || !user || !newPropriedade.nome || !newPropriedade.tipo_criacao) {
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
        .from('propriedades')
        .insert({
          ...newPropriedade,
          company_id: currentCompany.id,
          user_id: user.id,
          area_hectares: parseFloat(newPropriedade.area_hectares) || null,
          capacidade_animais: parseInt(newPropriedade.capacidade_animais) || null
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Propriedade criada com sucesso!"
      });

      setIsPropriedadeModalOpen(false);
      setNewPropriedade({
        nome: '',
        endereco: '',
        tipo_criacao: '',
        area_hectares: '',
        capacidade_animais: ''
      });
      loadData();

    } catch (error) {
      console.error('Erro ao criar propriedade:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar propriedade",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLote = async () => {
    if (!currentCompany || !user || !newLote.nome || !newLote.especie || !newLote.propriedade_id) {
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
        .from('lotes')
        .insert({
          ...newLote,
          company_id: currentCompany.id,
          user_id: user.id,
          quantidade_animais: parseInt(newLote.quantidade_animais) || 0,
          peso_medio_inicial: parseFloat(newLote.peso_medio_inicial) || null,
          peso_medio_atual: parseFloat(newLote.peso_medio_inicial) || null
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Lote criado com sucesso!"
      });

      setIsLoteModalOpen(false);
      setNewLote({
        nome: '',
        especie: '',
        raca: '',
        quantidade_animais: '',
        peso_medio_inicial: '',
        data_inicio: '',
        objetivo: '',
        propriedade_id: ''
      });
      loadData();

    } catch (error) {
      console.error('Erro ao criar lote:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar lote",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalPropriedades: propriedades.length,
    totalLotes: lotes.length,
    totalAnimais: lotes.reduce((sum, lote) => sum + lote.quantidade_animais, 0),
    lotesAtivos: lotes.filter(l => l.status === 'ativo').length
  };

  if (loading && propriedades.length === 0) {
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
          <h1 className="text-3xl font-bold mb-2">Propriedades e Lotes</h1>
          <p className="text-muted-foreground">
            Gerencie suas propriedades, lotes e performance dos animais
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Propriedades</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPropriedades}</div>
              <p className="text-xs text-muted-foreground">
                Cadastradas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lotes Ativos</CardTitle>
              <Barn className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.lotesAtivos}</div>
              <p className="text-xs text-muted-foreground">
                de {stats.totalLotes} total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Animais</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAnimais}</div>
              <p className="text-xs text-muted-foreground">
                Em todos os lotes
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
                {performance.length > 0 
                  ? (performance.reduce((sum, p) => sum + (p.conversao_alimentar || 0), 0) / performance.length).toFixed(1)
                  : '-'}
              </div>
              <p className="text-xs text-muted-foreground">
                Conversão alimentar
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="propriedades">Propriedades</TabsTrigger>
            <TabsTrigger value="lotes">Lotes</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="propriedades" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestão de Propriedades</h2>
              <Button onClick={() => setIsPropriedadeModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Propriedade
              </Button>
            </div>

            <div className="grid gap-4">
              {propriedades.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhuma propriedade cadastrada</h3>
                    <p className="text-muted-foreground mb-4">
                      Comece cadastrando suas propriedades para organizar seus lotes.
                    </p>
                    <Button onClick={() => setIsPropriedadeModalOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Cadastrar Primeira Propriedade
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                propriedades.map((propriedade) => (
                  <Card key={propriedade.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{propriedade.nome}</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Endereço</p>
                              <p className="font-medium">{propriedade.endereco || 'Não informado'}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Tipo</p>
                              <p className="font-medium">{propriedade.tipo_criacao}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Área</p>
                              <p className="font-medium">
                                {propriedade.area_hectares ? `${propriedade.area_hectares} ha` : 'Não informado'}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Capacidade</p>
                              <p className="font-medium">
                                {propriedade.capacidade_animais ? `${propriedade.capacidade_animais} animais` : 'Não informado'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Ver
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </Button>
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
              <h2 className="text-2xl font-bold">Gestão de Lotes</h2>
              <Button onClick={() => setIsLoteModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Lote
              </Button>
            </div>

            <div className="grid gap-4">
              {lotes.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Barn className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhum lote cadastrado</h3>
                    <p className="text-muted-foreground mb-4">
                      Crie lotes para organizar seus animais por grupos.
                    </p>
                    <Button onClick={() => setIsLoteModalOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Primeiro Lote
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                lotes.map((lote) => (
                  <Card key={lote.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{lote.nome}</h3>
                            <Badge variant={lote.status === 'ativo' ? "default" : "secondary"}>
                              {lote.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Propriedade</p>
                              <p className="font-medium">{lote.propriedades?.nome || 'Não vinculado'}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Espécie/Raça</p>
                              <p className="font-medium">{lote.especie} - {lote.raca || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Animais</p>
                              <p className="font-medium">{lote.quantidade_animais}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Peso Atual</p>
                              <p className="font-medium">
                                {lote.peso_medio_atual ? `${lote.peso_medio_atual} kg` : 'N/A'}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3">
                            <p className="text-sm text-muted-foreground">
                              <strong>Objetivo:</strong> {lote.objetivo}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <strong>Início:</strong> {new Date(lote.data_inicio).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Performance
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
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
            <h2 className="text-2xl font-bold">Histórico de Performance</h2>
            
            <div className="grid gap-4">
              {performance.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhum dado de performance</h3>
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
                          <h3 className="font-semibold text-lg">{metric.lotes?.nome}</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Peso Médio</p>
                              <p className="font-semibold">{metric.peso_medio ? `${metric.peso_medio} kg` : 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Ganho Diário</p>
                              <p className="font-semibold">{metric.ganho_peso_diario ? `${metric.ganho_peso_diario} kg` : 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Consumo Ração</p>
                              <p className="font-semibold">{metric.consumo_racao_kg ? `${metric.consumo_racao_kg} kg` : 'N/A'}</p>
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
        </Tabs>

        {/* Modal para Nova Propriedade */}
        <Dialog open={isPropriedadeModalOpen} onOpenChange={setIsPropriedadeModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Propriedade</DialogTitle>
              <DialogDescription>
                Cadastre uma nova propriedade para organizar seus lotes
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome da Propriedade *</Label>
                <Input
                  id="nome"
                  value={newPropriedade.nome}
                  onChange={(e) => setNewPropriedade({...newPropriedade, nome: e.target.value})}
                  placeholder="Ex: Fazenda São João"
                />
              </div>
              <div>
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={newPropriedade.endereco}
                  onChange={(e) => setNewPropriedade({...newPropriedade, endereco: e.target.value})}
                  placeholder="Endereço completo"
                />
              </div>
              <div>
                <Label htmlFor="tipo_criacao">Tipo de Criação *</Label>
                <Select value={newPropriedade.tipo_criacao} onValueChange={(value) => setNewPropriedade({...newPropriedade, tipo_criacao: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bovinos">Bovinos</SelectItem>
                    <SelectItem value="suinos">Suínos</SelectItem>
                    <SelectItem value="aves">Aves</SelectItem>
                    <SelectItem value="ovinos">Ovinos</SelectItem>
                    <SelectItem value="caprinos">Caprinos</SelectItem>
                    <SelectItem value="misto">Misto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="area_hectares">Área (hectares)</Label>
                  <Input
                    id="area_hectares"
                    type="number"
                    step="0.1"
                    value={newPropriedade.area_hectares}
                    onChange={(e) => setNewPropriedade({...newPropriedade, area_hectares: e.target.value})}
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <Label htmlFor="capacidade_animais">Capacidade (animais)</Label>
                  <Input
                    id="capacidade_animais"
                    type="number"
                    value={newPropriedade.capacidade_animais}
                    onChange={(e) => setNewPropriedade({...newPropriedade, capacidade_animais: e.target.value})}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPropriedadeModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreatePropriedade} disabled={loading}>
                Cadastrar Propriedade
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal para Novo Lote */}
        <Dialog open={isLoteModalOpen} onOpenChange={setIsLoteModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Novo Lote</DialogTitle>
              <DialogDescription>
                Crie um novo lote para organizar seus animais
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lote_nome">Nome do Lote *</Label>
                  <Input
                    id="lote_nome"
                    value={newLote.nome}
                    onChange={(e) => setNewLote({...newLote, nome: e.target.value})}
                    placeholder="Ex: Lote A - 2024"
                  />
                </div>
                <div>
                  <Label htmlFor="propriedade">Propriedade *</Label>
                  <Select value={newLote.propriedade_id} onValueChange={(value) => setNewLote({...newLote, propriedade_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a propriedade" />
                    </SelectTrigger>
                    <SelectContent>
                      {propriedades.map((prop) => (
                        <SelectItem key={prop.id} value={prop.id}>
                          {prop.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="especie">Espécie *</Label>
                  <Select value={newLote.especie} onValueChange={(value) => setNewLote({...newLote, especie: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a espécie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bovinos">Bovinos</SelectItem>
                      <SelectItem value="suinos">Suínos</SelectItem>
                      <SelectItem value="aves">Aves</SelectItem>
                      <SelectItem value="ovinos">Ovinos</SelectItem>
                      <SelectItem value="caprinos">Caprinos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="raca">Raça</Label>
                  <Input
                    id="raca"
                    value={newLote.raca}
                    onChange={(e) => setNewLote({...newLote, raca: e.target.value})}
                    placeholder="Ex: Nelore, Duroc..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantidade">Quantidade de Animais *</Label>
                  <Input
                    id="quantidade"
                    type="number"
                    value={newLote.quantidade_animais}
                    onChange={(e) => setNewLote({...newLote, quantidade_animais: e.target.value})}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="peso_inicial">Peso Médio Inicial (kg)</Label>
                  <Input
                    id="peso_inicial"
                    type="number"
                    step="0.1"
                    value={newLote.peso_medio_inicial}
                    onChange={(e) => setNewLote({...newLote, peso_medio_inicial: e.target.value})}
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="data_inicio">Data de Início *</Label>
                <Input
                  id="data_inicio"
                  type="date"
                  value={newLote.data_inicio}
                  onChange={(e) => setNewLote({...newLote, data_inicio: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="objetivo">Objetivo *</Label>
                <Input
                  id="objetivo"
                  value={newLote.objetivo}
                  onChange={(e) => setNewLote({...newLote, objetivo: e.target.value})}
                  placeholder="Ex: Engorda, Reprodução, Recria..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsLoteModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateLote} disabled={loading}>
                Criar Lote
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

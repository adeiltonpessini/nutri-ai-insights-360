
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Pill, 
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  CheckCircle,
  Clock,
  Target,
  Beaker,
  Calculator
} from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Receita {
  id: string;
  nome: string;
  objetivo: string;
  formula: any;
  observacoes: string;
  ativa: boolean;
  eficiencia_esperada: number;
  custo_estimado: number;
  created_at: string;
  animais?: { nome: string; especie: string };
}

export default function Simulador() {
  const { currentCompany } = useCompany();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("receitas");
  const [loading, setLoading] = useState(false);
  
  // Estados para dados
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [animais, setAnimais] = useState([]);
  const [products, setProducts] = useState([]);
  
  // Estados para formulários
  const [newReceita, setNewReceita] = useState({
    nome: '',
    animal_id: '',
    objetivo: '',
    observacoes: '',
    eficiencia_esperada: '',
    custo_estimado: ''
  });
  
  // Simulação states
  const [simulationData, setSimulationData] = useState({
    animalWeight: '',
    targetGain: '',
    feedType: '',
    period: '',
    estimatedCost: 0,
    estimatedGain: 0,
    efficiency: 0
  });
  
  // Modal states
  const [isReceitaModalOpen, setIsReceitaModalOpen] = useState(false);

  useEffect(() => {
    if (currentCompany && user) {
      loadData();
    }
  }, [currentCompany, user]);

  const loadData = async () => {
    if (!currentCompany || !user) return;

    try {
      setLoading(true);

      // Carregar receitas
      const { data: receitasData } = await supabase
        .from('receitas')
        .select(`
          *,
          animais(nome, especie)
        `)
        .eq('company_id', currentCompany.id)
        .order('created_at', { ascending: false });

      // Carregar animais
      const { data: animaisData } = await supabase
        .from('animais')
        .select('*')
        .eq('company_id', currentCompany.id);

      // Carregar produtos
      const { data: productsData } = await supabase
        .from('catalog_products')
        .select('*')
        .eq('ativo', true)
        .limit(10);

      setReceitas(receitasData || []);
      setAnimais(animaisData || []);
      setProducts(productsData || []);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReceita = async () => {
    if (!currentCompany || !user || !newReceita.nome || !newReceita.objetivo) {
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
          formula: {},
          eficiencia_esperada: parseFloat(newReceita.eficiencia_esperada) || null,
          custo_estimado: parseFloat(newReceita.custo_estimado) || null
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
        observacoes: '',
        eficiencia_esperada: '',
        custo_estimado: ''
      });
      loadData();

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

  const calculateSimulation = () => {
    const weight = parseFloat(simulationData.animalWeight) || 0;
    const targetGain = parseFloat(simulationData.targetGain) || 0;
    const period = parseInt(simulationData.period) || 1;

    // Cálculos simplificados para simulação
    const dailyFeed = weight * 0.03; // 3% do peso corporal
    const totalFeed = dailyFeed * period;
    const feedCostPerKg = 2.5; // R$ 2,50 por kg
    const estimatedCost = totalFeed * feedCostPerKg;
    
    const efficiency = targetGain > 0 ? totalFeed / targetGain : 0;
    const estimatedGain = totalFeed / 3; // Conversão alimentar de 3:1

    setSimulationData(prev => ({
      ...prev,
      estimatedCost,
      estimatedGain,
      efficiency
    }));

    toast({
      title: "Simulação calculada",
      description: "Resultados atualizados com base nos parâmetros informados"
    });
  };

  const stats = {
    totalReceitas: receitas.length,
    receitasAtivas: receitas.filter(r => r.ativa).length,
    eficienciaMedia: receitas.length > 0 
      ? receitas.reduce((sum, r) => sum + (r.eficiencia_esperada || 0), 0) / receitas.length 
      : 0,
    custoMedio: receitas.length > 0 
      ? receitas.reduce((sum, r) => sum + (r.custo_estimado || 0), 0) / receitas.length 
      : 0
  };

  if (loading && receitas.length === 0) {
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
          <h1 className="text-3xl font-bold mb-2">Receitas e Simulações</h1>
          <p className="text-muted-foreground">
            Gerencie receitas veterinárias e simule diferentes cenários nutricionais
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receitas Criadas</CardTitle>
              <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReceitas}</div>
              <p className="text-xs text-muted-foreground">
                Total no sistema
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receitas Ativas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.receitasAtivas}</div>
              <p className="text-xs text-muted-foreground">
                Em uso atualmente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eficiência Média</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.eficienciaMedia > 0 ? stats.eficienciaMedia.toFixed(1) : '-'}
              </div>
              <p className="text-xs text-muted-foreground">
                Conversão esperada
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Custo Médio</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {stats.custoMedio > 0 ? stats.custoMedio.toFixed(2) : '0.00'}
              </div>
              <p className="text-xs text-muted-foreground">
                Por receita
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="receitas">Receitas</TabsTrigger>
            <TabsTrigger value="simulator">Simulador</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
          </TabsList>

          <TabsContent value="receitas" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestão de Receitas</h2>
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
                    <h3 className="text-lg font-semibold mb-2">Nenhuma receita cadastrada</h3>
                    <p className="text-muted-foreground mb-4">
                      Crie receitas veterinárias para organizar tratamentos e protocolos.
                    </p>
                    <Button onClick={() => setIsReceitaModalOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Primeira Receita
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                receitas.map((receita) => (
                  <Card key={receita.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{receita.nome}</h3>
                            <Badge variant={receita.ativa ? "default" : "secondary"}>
                              {receita.ativa ? "Ativa" : "Inativa"}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                            <div>
                              <p className="text-muted-foreground">Animal</p>
                              <p className="font-medium">
                                {receita.animais?.nome || 'Não especificado'}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Eficiência Esperada</p>
                              <p className="font-medium">
                                {receita.eficiencia_esperada ? receita.eficiencia_esperada.toFixed(1) : 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Custo Estimado</p>
                              <p className="font-medium">
                                {receita.custo_estimado ? `R$ ${receita.custo_estimado.toFixed(2)}` : 'N/A'}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm">
                              <strong>Objetivo:</strong> {receita.objetivo}
                            </p>
                            {receita.observacoes && (
                              <p className="text-sm text-muted-foreground">
                                <strong>Observações:</strong> {receita.observacoes}
                              </p>
                            )}
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

          <TabsContent value="simulator" className="space-y-6">
            <h2 className="text-2xl font-bold">Simulador Nutricional</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Parâmetros da Simulação</CardTitle>
                  <CardDescription>Configure os dados para calcular a performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="animalWeight">Peso Atual (kg)</Label>
                      <Input
                        id="animalWeight"
                        type="number"
                        step="0.1"
                        value={simulationData.animalWeight}
                        onChange={(e) => setSimulationData({...simulationData, animalWeight: e.target.value})}
                        placeholder="Ex: 450"
                      />
                    </div>
                    <div>
                      <Label htmlFor="targetGain">Ganho Desejado (kg)</Label>
                      <Input
                        id="targetGain"
                        type="number"
                        step="0.1"
                        value={simulationData.targetGain}
                        onChange={(e) => setSimulationData({...simulationData, targetGain: e.target.value})}
                        placeholder="Ex: 50"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="feedType">Tipo de Ração</Label>
                    <Select value={simulationData.feedType} onValueChange={(value) => setSimulationData({...simulationData, feedType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de ração" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="crescimento">Crescimento</SelectItem>
                        <SelectItem value="engorda">Engorda</SelectItem>
                        <SelectItem value="manutencao">Manutenção</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="period">Período (dias)</Label>
                    <Input
                      id="period"
                      type="number"
                      value={simulationData.period}
                      onChange={(e) => setSimulationData({...simulationData, period: e.target.value})}
                      placeholder="Ex: 90"
                    />
                  </div>

                  <Button onClick={calculateSimulation} className="w-full">
                    <Beaker className="w-4 h-4 mr-2" />
                    Calcular Simulação
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resultados da Simulação</CardTitle>
                  <CardDescription>Projeções baseadas nos parâmetros informados</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Consumo Estimado</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {simulationData.estimatedGain > 0 ? `${(simulationData.estimatedGain * 3).toFixed(0)} kg` : '-'}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Ganho Projetado</p>
                      <p className="text-2xl font-bold text-green-600">
                        {simulationData.estimatedGain > 0 ? `${simulationData.estimatedGain.toFixed(1)} kg` : '-'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Custo Estimado</p>
                      <p className="text-2xl font-bold text-orange-600">
                        R$ {simulationData.estimatedCost > 0 ? simulationData.estimatedCost.toFixed(2) : '0.00'}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Conversão Alimentar</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {simulationData.efficiency > 0 ? simulationData.efficiency.toFixed(2) : '-'}
                      </p>
                    </div>
                  </div>

                  {simulationData.estimatedCost > 0 && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Análise</h4>
                      <div className="space-y-2 text-sm">
                        <p>• Custo por kg de ganho: R$ {(simulationData.estimatedCost / simulationData.estimatedGain).toFixed(2)}</p>
                        <p>• Período para meta: {simulationData.period} dias</p>
                        <p>• Eficiência: {simulationData.efficiency < 3.5 ? 'Boa' : 'Pode melhorar'}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <h2 className="text-2xl font-bold">Produtos Recomendados</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{product.nome}</h3>
                        <p className="text-sm text-muted-foreground">{product.categoria}</p>
                      </div>

                      {product.beneficios && product.beneficios.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Principais benefícios:</p>
                          <div className="flex gap-1 flex-wrap">
                            {product.beneficios.slice(0, 3).map((beneficio, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {beneficio}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {product.especie_alvo && product.especie_alvo.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Espécies:</p>
                          <div className="flex gap-1 flex-wrap">
                            {product.especie_alvo.map((especie, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {especie}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {product.preco_por_kg && (
                        <div className="pt-2 border-t">
                          <p className="text-lg font-bold text-green-600">
                            R$ {product.preco_por_kg.toFixed(2)}/kg
                          </p>
                        </div>
                      )}

                      <Button variant="outline" className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar à Receita
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Modal para Nova Receita */}
        <Dialog open={isReceitaModalOpen} onOpenChange={setIsReceitaModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Receita</DialogTitle>
              <DialogDescription>
                Crie uma nova receita veterinária
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome da Receita *</Label>
                <Input
                  id="nome"
                  value={newReceita.nome}
                  onChange={(e) => setNewReceita({...newReceita, nome: e.target.value})}
                  placeholder="Ex: Protocolo de Engorda - Bovinos"
                />
              </div>

              <div>
                <Label htmlFor="animal">Animal (opcional)</Label>
                <Select value={newReceita.animal_id} onValueChange={(value) => setNewReceita({...newReceita, animal_id: value})}>
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

              <div>
                <Label htmlFor="objetivo">Objetivo *</Label>
                <Input
                  id="objetivo"
                  value={newReceita.objetivo}
                  onChange={(e) => setNewReceita({...newReceita, objetivo: e.target.value})}
                  placeholder="Ex: Ganho de peso, tratamento nutricional..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="eficiencia">Eficiência Esperada</Label>
                  <Input
                    id="eficiencia"
                    type="number"
                    step="0.1"
                    value={newReceita.eficiencia_esperada}
                    onChange={(e) => setNewReceita({...newReceita, eficiencia_esperada: e.target.value})}
                    placeholder="Ex: 2.8"
                  />
                </div>
                <div>
                  <Label htmlFor="custo">Custo Estimado (R$)</Label>
                  <Input
                    id="custo"
                    type="number"
                    step="0.01"
                    value={newReceita.custo_estimado}
                    onChange={(e) => setNewReceita({...newReceita, custo_estimado: e.target.value})}
                    placeholder="Ex: 150.00"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={newReceita.observacoes}
                  onChange={(e) => setNewReceita({...newReceita, observacoes: e.target.value})}
                  placeholder="Instruções especiais, posologia, cuidados..."
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

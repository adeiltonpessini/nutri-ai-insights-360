
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DollarSign, Plus, TrendingUp, TrendingDown, PieChart, BarChart3 } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function GestaoFinanceira() {
  const { currentCompany } = useCompany();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [planoContas, setPlanoContas] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [isContaModalOpen, setIsContaModalOpen] = useState(false);
  const [isMovimentacaoModalOpen, setIsMovimentacaoModalOpen] = useState(false);
  
  const [newConta, setNewConta] = useState({
    codigo: '',
    nome: '',
    categoria: '',
    tipo: 'despesa'
  });
  
  const [newMovimentacao, setNewMovimentacao] = useState({
    conta_id: '',
    tipo: 'saida',
    valor: '',
    descricao: '',
    data_movimentacao: '',
    documento: '',
    observacoes: ''
  });

  useEffect(() => {
    if (currentCompany) {
      loadFinanceiroData();
    }
  }, [currentCompany]);

  const loadFinanceiroData = async () => {
    if (!currentCompany) return;

    try {
      setLoading(true);

      const { data: contasData } = await supabase
        .from('plano_contas')
        .select('*')
        .eq('company_id', currentCompany.id)
        .eq('ativo', true)
        .order('codigo');

      const { data: movimentacoesData } = await supabase
        .from('movimentacoes_financeiras')
        .select(`
          *,
          plano_contas(nome, categoria)
        `)
        .eq('company_id', currentCompany.id)
        .order('data_movimentacao', { ascending: false })
        .limit(50);

      setPlanoContas(contasData || []);
      setMovimentacoes(movimentacoesData || []);

    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados financeiros",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateConta = async () => {
    if (!currentCompany || !newConta.nome || !newConta.codigo) {
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
        .from('plano_contas')
        .insert({
          ...newConta,
          company_id: currentCompany.id
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Conta criada com sucesso!"
      });

      setIsContaModalOpen(false);
      setNewConta({
        codigo: '',
        nome: '',
        categoria: '',
        tipo: 'despesa'
      });
      loadFinanceiroData();

    } catch (error) {
      console.error('Erro ao criar conta:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar conta",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMovimentacao = async () => {
    if (!currentCompany || !newMovimentacao.conta_id || !newMovimentacao.valor || !newMovimentacao.descricao) {
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
        .from('movimentacoes_financeiras')
        .insert({
          ...newMovimentacao,
          valor: parseFloat(newMovimentacao.valor),
          company_id: currentCompany.id,
          created_by: user?.id
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Movimentação registrada com sucesso!"
      });

      setIsMovimentacaoModalOpen(false);
      setNewMovimentacao({
        conta_id: '',
        tipo: 'saida',
        valor: '',
        descricao: '',
        data_movimentacao: '',
        documento: '',
        observacoes: ''
      });
      loadFinanceiroData();

    } catch (error) {
      console.error('Erro ao criar movimentação:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar movimentação",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const totalReceitas = movimentacoes
    .filter(m => m.tipo === 'entrada')
    .reduce((sum, m) => sum + parseFloat(m.valor), 0);
  
  const totalDespesas = movimentacoes
    .filter(m => m.tipo === 'saida')
    .reduce((sum, m) => sum + parseFloat(m.valor), 0);
  
  const saldo = totalReceitas - totalDespesas;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestão Financeira</h2>
        <div className="flex gap-2">
          <Button onClick={() => setIsContaModalOpen(true)} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Nova Conta
          </Button>
          <Button onClick={() => setIsMovimentacaoModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Movimentação
          </Button>
        </div>
      </div>

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plano de Contas */}
      <Card>
        <CardHeader>
          <CardTitle>Plano de Contas</CardTitle>
          <CardDescription>
            Estrutura contábil rural personalizada
          </CardDescription>
        </CardHeader>
        <CardContent>
          {planoContas.length === 0 ? (
            <div className="text-center py-8">
              <PieChart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma conta cadastrada</h3>
              <p className="text-muted-foreground">
                Crie contas para organizar suas finanças
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {planoContas.map((conta) => (
                <div key={conta.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{conta.codigo} - {conta.nome}</p>
                    <p className="text-sm text-muted-foreground">{conta.categoria}</p>
                  </div>
                  <Badge variant={conta.tipo === 'receita' ? 'default' : 'secondary'}>
                    {conta.tipo}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Movimentações Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Movimentações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {movimentacoes.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma movimentação registrada</h3>
              <p className="text-muted-foreground">
                Registre receitas e despesas para acompanhar o fluxo financeiro
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {movimentacoes.map((mov) => (
                <div key={mov.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{mov.descricao}</p>
                    <p className="text-sm text-muted-foreground">
                      {mov.plano_contas?.nome} • {new Date(mov.data_movimentacao).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${mov.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                      {mov.tipo === 'entrada' ? '+' : '-'} R$ {parseFloat(mov.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <Badge variant={mov.tipo === 'entrada' ? 'default' : 'secondary'}>
                      {mov.tipo}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal para Nova Conta */}
      <Dialog open={isContaModalOpen} onOpenChange={setIsContaModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Conta</DialogTitle>
            <DialogDescription>
              Adicione uma nova conta ao plano de contas
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                value={newConta.codigo}
                onChange={(e) => setNewConta({...newConta, codigo: e.target.value})}
                placeholder="Ex: 1.1.01"
              />
            </div>
            <div>
              <Label htmlFor="nome_conta">Nome da Conta</Label>
              <Input
                id="nome_conta"
                value={newConta.nome}
                onChange={(e) => setNewConta({...newConta, nome: e.target.value})}
                placeholder="Ex: Compra de Ração"
              />
            </div>
            <div>
              <Label htmlFor="categoria">Categoria</Label>
              <Select value={newConta.categoria} onValueChange={(value) => setNewConta({...newConta, categoria: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="racao">Ração</SelectItem>
                  <SelectItem value="medicamentos">Medicamentos</SelectItem>
                  <SelectItem value="energia">Energia</SelectItem>
                  <SelectItem value="funcionarios">Funcionários</SelectItem>
                  <SelectItem value="manutencao">Manutenção</SelectItem>
                  <SelectItem value="vendas">Vendas</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tipo_conta">Tipo</Label>
              <Select value={newConta.tipo} onValueChange={(value) => setNewConta({...newConta, tipo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsContaModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateConta} disabled={loading}>
              Criar Conta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para Nova Movimentação */}
      <Dialog open={isMovimentacaoModalOpen} onOpenChange={setIsMovimentacaoModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Movimentação</DialogTitle>
            <DialogDescription>
              Registre uma receita ou despesa
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="conta_mov">Conta</Label>
              <Select value={newMovimentacao.conta_id} onValueChange={(value) => setNewMovimentacao({...newMovimentacao, conta_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a conta" />
                </SelectTrigger>
                <SelectContent>
                  {planoContas.map((conta) => (
                    <SelectItem key={conta.id} value={conta.id}>
                      {conta.codigo} - {conta.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tipo_mov">Tipo</Label>
              <Select value={newMovimentacao.tipo} onValueChange={(value) => setNewMovimentacao({...newMovimentacao, tipo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada (Receita)</SelectItem>
                  <SelectItem value="saida">Saída (Despesa)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={newMovimentacao.valor}
                onChange={(e) => setNewMovimentacao({...newMovimentacao, valor: e.target.value})}
                placeholder="0,00"
              />
            </div>
            <div>
              <Label htmlFor="descricao_mov">Descrição</Label>
              <Input
                id="descricao_mov"
                value={newMovimentacao.descricao}
                onChange={(e) => setNewMovimentacao({...newMovimentacao, descricao: e.target.value})}
                placeholder="Descrição da movimentação"
              />
            </div>
            <div>
              <Label htmlFor="data_mov">Data</Label>
              <Input
                id="data_mov"
                type="date"
                value={newMovimentacao.data_movimentacao}
                onChange={(e) => setNewMovimentacao({...newMovimentacao, data_movimentacao: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="documento">Documento</Label>
              <Input
                id="documento"
                value={newMovimentacao.documento}
                onChange={(e) => setNewMovimentacao({...newMovimentacao, documento: e.target.value})}
                placeholder="Número do documento/nota fiscal"
              />
            </div>
            <div>
              <Label htmlFor="observacoes_mov">Observações</Label>
              <Textarea
                id="observacoes_mov"
                value={newMovimentacao.observacoes}
                onChange={(e) => setNewMovimentacao({...newMovimentacao, observacoes: e.target.value})}
                placeholder="Observações adicionais..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMovimentacaoModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateMovimentacao} disabled={loading}>
              Registrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

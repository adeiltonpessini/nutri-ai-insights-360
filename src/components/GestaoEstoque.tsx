
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Package, Plus, AlertTriangle, TrendingDown, TrendingUp, Clock } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function GestaoEstoque() {
  const { currentCompany } = useCompany();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [estoque, setEstoque] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [isInsumoModalOpen, setIsInsumoModalOpen] = useState(false);
  const [isMovimentacaoModalOpen, setIsMovimentacaoModalOpen] = useState(false);
  
  const [newInsumo, setNewInsumo] = useState({
    nome: '',
    categoria: '',
    marca: '',
    codigo_produto: '',
    unidade_medida: '',
    quantidade_atual: '',
    quantidade_minima: '',
    preco_unitario: '',
    data_validade: '',
    lote_fornecedor: '',
    fornecedor: '',
    localizacao: ''
  });
  
  const [newMovimentacao, setNewMovimentacao] = useState({
    insumo_id: '',
    tipo_movimentacao: 'entrada',
    quantidade: '',
    motivo: '',
    documento: '',
    data_movimentacao: '',
    observacoes: ''
  });

  useEffect(() => {
    if (currentCompany) {
      loadEstoqueData();
    }
  }, [currentCompany]);

  const loadEstoqueData = async () => {
    if (!currentCompany) return;

    try {
      setLoading(true);

      const { data: estoqueData } = await supabase
        .from('estoque_insumos')
        .select('*')
        .eq('company_id', currentCompany.id)
        .eq('ativo', true)
        .order('nome');

      const { data: movimentacoesData } = await supabase
        .from('movimentacoes_estoque')
        .select(`
          *,
          estoque_insumos(nome, unidade_medida),
          profiles(nome)
        `)
        .eq('company_id', currentCompany.id)
        .order('data_movimentacao', { ascending: false })
        .limit(50);

      setEstoque(estoqueData || []);
      setMovimentacoes(movimentacoesData || []);

    } catch (error) {
      console.error('Erro ao carregar dados de estoque:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados de estoque",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInsumo = async () => {
    if (!currentCompany || !newInsumo.nome || !newInsumo.categoria || !newInsumo.unidade_medida) {
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
        .from('estoque_insumos')
        .insert({
          ...newInsumo,
          quantidade_atual: parseFloat(newInsumo.quantidade_atual) || 0,
          quantidade_minima: parseFloat(newInsumo.quantidade_minima) || 0,
          preco_unitario: parseFloat(newInsumo.preco_unitario) || null,
          company_id: currentCompany.id
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Insumo criado com sucesso!"
      });

      setIsInsumoModalOpen(false);
      setNewInsumo({
        nome: '',
        categoria: '',
        marca: '',
        codigo_produto: '',
        unidade_medida: '',
        quantidade_atual: '',
        quantidade_minima: '',
        preco_unitario: '',
        data_validade: '',
        lote_fornecedor: '',
        fornecedor: '',
        localizacao: ''
      });
      loadEstoqueData();

    } catch (error) {
      console.error('Erro ao criar insumo:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar insumo",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMovimentacao = async () => {
    if (!currentCompany || !newMovimentacao.insumo_id || !newMovimentacao.quantidade || !newMovimentacao.motivo) {
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
        .from('movimentacoes_estoque')
        .insert({
          ...newMovimentacao,
          quantidade: parseFloat(newMovimentacao.quantidade),
          company_id: currentCompany.id,
          responsavel_id: user?.id
        });

      if (error) throw error;

      // Atualizar quantidade no estoque
      const quantidadeMovimentacao = parseFloat(newMovimentacao.quantidade);
      const insumoAtual = estoque.find(item => item.id === newMovimentacao.insumo_id);
      
      if (insumoAtual) {
        const novaQuantidade = newMovimentacao.tipo_movimentacao === 'entrada' 
          ? insumoAtual.quantidade_atual + quantidadeMovimentacao
          : insumoAtual.quantidade_atual - quantidadeMovimentacao;

        await supabase
          .from('estoque_insumos')
          .update({ quantidade_atual: Math.max(0, novaQuantidade) })
          .eq('id', newMovimentacao.insumo_id);
      }

      toast({
        title: "Sucesso",
        description: "Movimentação registrada com sucesso!"
      });

      setIsMovimentacaoModalOpen(false);
      setNewMovimentacao({
        insumo_id: '',
        tipo_movimentacao: 'entrada',
        quantidade: '',
        motivo: '',
        documento: '',
        data_movimentacao: '',
        observacoes: ''
      });
      loadEstoqueData();

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

  const itensEstoqueBaixo = estoque.filter(item => item.quantidade_atual <= item.quantidade_minima);
  const itensVencendo = estoque.filter(item => {
    if (!item.data_validade) return false;
    const dataValidade = new Date(item.data_validade);
    const hoje = new Date();
    const diferenca = dataValidade.getTime() - hoje.getTime();
    const diasParaVencer = Math.ceil(diferenca / (1000 * 3600 * 24));
    return diasParaVencer <= 30 && diasParaVencer >= 0;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestão de Estoque</h2>
        <div className="flex gap-2">
          <Button onClick={() => setIsInsumoModalOpen(true)} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Novo Insumo
          </Button>
          <Button onClick={() => setIsMovimentacaoModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Movimentação
          </Button>
        </div>
      </div>

      {/* Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <AlertTriangle className="w-5 h-5" />
              Estoque Baixo
            </CardTitle>
            <CardDescription>
              {itensEstoqueBaixo.length} itens com estoque abaixo do mínimo
            </CardDescription>
          </CardHeader>
          <CardContent>
            {itensEstoqueBaixo.length === 0 ? (
              <p className="text-sm text-muted-foreground">Todos os itens estão com estoque adequado</p>
            ) : (
              <div className="space-y-2">
                {itensEstoqueBaixo.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.nome}</span>
                    <Badge variant="outline" className="text-orange-600 border-orange-600">
                      {item.quantidade_atual} {item.unidade_medida}
                    </Badge>
                  </div>
                ))}
                {itensEstoqueBaixo.length > 3 && (
                  <p className="text-xs text-muted-foreground">
                    +{itensEstoqueBaixo.length - 3} outros itens
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <Clock className="w-5 h-5" />
              Próximos ao Vencimento
            </CardTitle>
            <CardDescription>
              {itensVencendo.length} itens vencem em até 30 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            {itensVencendo.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum item próximo ao vencimento</p>
            ) : (
              <div className="space-y-2">
                {itensVencendo.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.nome}</span>
                    <Badge variant="outline" className="text-red-600 border-red-600">
                      {new Date(item.data_validade).toLocaleDateString('pt-BR')}
                    </Badge>
                  </div>
                ))}
                {itensVencendo.length > 3 && (
                  <p className="text-xs text-muted-foreground">
                    +{itensVencendo.length - 3} outros itens
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lista de Insumos */}
      <Card>
        <CardHeader>
          <CardTitle>Insumos em Estoque</CardTitle>
          <CardDescription>
            Controle de insumos, medicamentos e rações
          </CardDescription>
        </CardHeader>
        <CardContent>
          {estoque.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum insumo cadastrado</h3>
              <p className="text-muted-foreground">
                Cadastre insumos para controlar o estoque
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {estoque.map((item) => (
                <Card key={item.id} className="relative">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{item.nome}</CardTitle>
                      {item.quantidade_atual <= item.quantidade_minima && (
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          Baixo
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Categoria</p>
                        <p className="font-medium">{item.categoria}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Marca</p>
                        <p className="font-medium">{item.marca || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Quantidade</p>
                        <p className="font-medium">
                          {item.quantidade_atual} {item.unidade_medida}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Mínimo</p>
                        <p className="font-medium">
                          {item.quantidade_minima} {item.unidade_medida}
                        </p>
                      </div>
                      {item.data_validade && (
                        <div className="col-span-2">
                          <p className="text-muted-foreground">Validade</p>
                          <p className="font-medium">
                            {new Date(item.data_validade).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      )}
                      {item.localizacao && (
                        <div className="col-span-2">
                          <p className="text-muted-foreground">Localização</p>
                          <p className="font-medium">{item.localizacao}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
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
              <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma movimentação registrada</h3>
              <p className="text-muted-foreground">
                Movimentações aparecerão aqui quando forem registradas
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {movimentacoes.map((mov) => (
                <div key={mov.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{mov.estoque_insumos?.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      {mov.motivo} • {new Date(mov.data_movimentacao).toLocaleDateString('pt-BR')}
                    </p>
                    {mov.profiles && (
                      <p className="text-xs text-muted-foreground">
                        Por: {mov.profiles.nome}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${mov.tipo_movimentacao === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                      {mov.tipo_movimentacao === 'entrada' ? '+' : '-'} {mov.quantidade} {mov.estoque_insumos?.unidade_medida}
                    </p>
                    <Badge variant={mov.tipo_movimentacao === 'entrada' ? 'default' : 'secondary'}>
                      {mov.tipo_movimentacao}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal para Novo Insumo */}
      <Dialog open={isInsumoModalOpen} onOpenChange={setIsInsumoModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo Insumo</DialogTitle>
            <DialogDescription>
              Cadastre um novo insumo no estoque
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome_insumo">Nome do Insumo</Label>
              <Input
                id="nome_insumo"
                value={newInsumo.nome}
                onChange={(e) => setNewInsumo({...newInsumo, nome: e.target.value})}
                placeholder="Nome do produto"
              />
            </div>
            <div>
              <Label htmlFor="categoria_insumo">Categoria</Label>
              <Select value={newInsumo.categoria} onValueChange={(value) => setNewInsumo({...newInsumo, categoria: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="racao">Ração</SelectItem>
                  <SelectItem value="medicamento">Medicamento</SelectItem>
                  <SelectItem value="vacina">Vacina</SelectItem>
                  <SelectItem value="suplemento">Suplemento</SelectItem>
                  <SelectItem value="equipamento">Equipamento</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="marca">Marca</Label>
              <Input
                id="marca"
                value={newInsumo.marca}
                onChange={(e) => setNewInsumo({...newInsumo, marca: e.target.value})}
                placeholder="Marca do produto"
              />
            </div>
            <div>
              <Label htmlFor="codigo_produto">Código do Produto</Label>
              <Input
                id="codigo_produto"
                value={newInsumo.codigo_produto}
                onChange={(e) => setNewInsumo({...newInsumo, codigo_produto: e.target.value})}
                placeholder="Código/SKU"
              />
            </div>
            <div>
              <Label htmlFor="unidade_medida">Unidade de Medida</Label>
              <Select value={newInsumo.unidade_medida} onValueChange={(value) => setNewInsumo({...newInsumo, unidade_medida: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a unidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Quilograma (kg)</SelectItem>
                  <SelectItem value="litro">Litro (L)</SelectItem>
                  <SelectItem value="unidade">Unidade</SelectItem>
                  <SelectItem value="ml">Mililitro (ml)</SelectItem>
                  <SelectItem value="g">Grama (g)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quantidade_atual">Quantidade Atual</Label>
              <Input
                id="quantidade_atual"
                type="number"
                step="0.01"
                value={newInsumo.quantidade_atual}
                onChange={(e) => setNewInsumo({...newInsumo, quantidade_atual: e.target.value})}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="quantidade_minima">Quantidade Mínima</Label>
              <Input
                id="quantidade_minima"
                type="number"
                step="0.01"
                value={newInsumo.quantidade_minima}
                onChange={(e) => setNewInsumo({...newInsumo, quantidade_minima: e.target.value})}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="preco_unitario">Preço Unitário (R$)</Label>
              <Input
                id="preco_unitario"
                type="number"
                step="0.01"
                value={newInsumo.preco_unitario}
                onChange={(e) => setNewInsumo({...newInsumo, preco_unitario: e.target.value})}
                placeholder="0,00"
              />
            </div>
            <div>
              <Label htmlFor="data_validade">Data de Validade</Label>
              <Input
                id="data_validade"
                type="date"
                value={newInsumo.data_validade}
                onChange={(e) => setNewInsumo({...newInsumo, data_validade: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="lote_fornecedor">Lote do Fornecedor</Label>
              <Input
                id="lote_fornecedor"
                value={newInsumo.lote_fornecedor}
                onChange={(e) => setNewInsumo({...newInsumo, lote_fornecedor: e.target.value})}
                placeholder="Número do lote"
              />
            </div>
            <div>
              <Label htmlFor="fornecedor">Fornecedor</Label>
              <Input
                id="fornecedor"
                value={newInsumo.fornecedor}
                onChange={(e) => setNewInsumo({...newInsumo, fornecedor: e.target.value})}
                placeholder="Nome do fornecedor"
              />
            </div>
            <div>
              <Label htmlFor="localizacao">Localização</Label>
              <Input
                id="localizacao"
                value={newInsumo.localizacao}
                onChange={(e) => setNewInsumo({...newInsumo, localizacao: e.target.value})}
                placeholder="Local de armazenamento"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInsumoModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateInsumo} disabled={loading}>
              Cadastrar Insumo
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
              Registre entrada ou saída de insumos
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="insumo">Insumo</Label>
              <Select value={newMovimentacao.insumo_id} onValueChange={(value) => setNewMovimentacao({...newMovimentacao, insumo_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o insumo" />
                </SelectTrigger>
                <SelectContent>
                  {estoque.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.nome} - {item.quantidade_atual} {item.unidade_medida}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tipo_movimentacao">Tipo de Movimentação</Label>
              <Select value={newMovimentacao.tipo_movimentacao} onValueChange={(value) => setNewMovimentacao({...newMovimentacao, tipo_movimentacao: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="saida">Saída</SelectItem>
                  <SelectItem value="ajuste">Ajuste</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quantidade_mov">Quantidade</Label>
              <Input
                id="quantidade_mov"
                type="number"
                step="0.01"
                value={newMovimentacao.quantidade}
                onChange={(e) => setNewMovimentacao({...newMovimentacao, quantidade: e.target.value})}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="motivo">Motivo</Label>
              <Input
                id="motivo"
                value={newMovimentacao.motivo}
                onChange={(e) => setNewMovimentacao({...newMovimentacao, motivo: e.target.value})}
                placeholder="Ex: Compra, Uso na propriedade, Ajuste de inventário"
              />
            </div>
            <div>
              <Label htmlFor="documento_mov">Documento</Label>
              <Input
                id="documento_mov"
                value={newMovimentacao.documento}
                onChange={(e) => setNewMovimentacao({...newMovimentacao, documento: e.target.value})}
                placeholder="Número da nota fiscal ou documento"
              />
            </div>
            <div>
              <Label htmlFor="data_movimentacao_est">Data</Label>
              <Input
                id="data_movimentacao_est"
                type="date"
                value={newMovimentacao.data_movimentacao}
                onChange={(e) => setNewMovimentacao({...newMovimentacao, data_movimentacao: e.target.value})}
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
              Registrar Movimentação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

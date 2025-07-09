
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
  Package, 
  TrendingUp, 
  Users, 
  Star,
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  BarChart3,
  Target,
  Award,
  ShoppingCart,
  Truck
} from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AnalyticsData {
  totalProducts: number;
  activeProducts: number;
  featuredProducts: number;
  totalRevenue: number;
}

export default function EmpresaArea() {
  const { currentCompany } = useCompany();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("products");
  const [loading, setLoading] = useState(false);
  
  // Estados para dados
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalProducts: 0,
    activeProducts: 0,
    featuredProducts: 0,
    totalRevenue: 0
  });
  
  // Estados para formulários
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    unit: '',
    target_species: [],
    target_phase: [],
    composition: {},
    benefits: []
  });
  
  // Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (currentCompany && user) {
      loadEmpresaData();
    }
  }, [currentCompany, user]);

  const loadEmpresaData = async () => {
    if (!currentCompany || !user) return;

    try {
      setLoading(true);

      // Carregar produtos da empresa
      const { data: productsData } = await supabase
        .from('company_products')
        .select('*')
        .eq('company_id', currentCompany.id)
        .order('created_at', { ascending: false });

      // Simular dados de pedidos (seria de uma tabela de pedidos real)
      const mockOrders = [
        {
          id: '1',
          client: 'Fazenda São João',
          product: productsData?.[0]?.name || 'Produto A',
          quantity: 500,
          value: 2500,
          status: 'entregue',
          date: '2024-01-15'
        },
        {
          id: '2',
          client: 'Clínica Veterinária XYZ',
          product: productsData?.[1]?.name || 'Produto B',
          quantity: 100,
          value: 800,
          status: 'processando',
          date: '2024-01-10'
        }
      ];

      setProducts(productsData || []);
      setOrders(mockOrders);

      // Calcular analytics
      const totalProducts = productsData?.length || 0;
      const activeProducts = productsData?.filter(p => p.is_active).length || 0;
      const featuredProducts = productsData?.filter(p => p.is_featured).length || 0;
      const totalRevenue = mockOrders.reduce((sum, order) => sum + order.value, 0);

      setAnalytics({
        totalProducts,
        activeProducts,
        featuredProducts,
        totalRevenue
      });

    } catch (error) {
      console.error('Erro ao carregar dados da empresa:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados da empresa",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async () => {
    if (!currentCompany || !user || !newProduct.name || !newProduct.category) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      const productData = {
        ...newProduct,
        company_id: currentCompany.id,
        price: parseFloat(newProduct.price) || null,
        target_species: newProduct.target_species,
        target_phase: newProduct.target_phase,
        composition: newProduct.composition || {},
        benefits: newProduct.benefits || []
      };

      const { error } = await supabase
        .from('company_products')
        .insert(productData);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Produto criado com sucesso!"
      });

      setIsProductModalOpen(false);
      setNewProduct({
        name: '',
        description: '',
        category: '',
        price: '',
        unit: '',
        target_species: [],
        target_phase: [],
        composition: {},
        benefits: []
      });
      loadEmpresaData();

    } catch (error) {
      console.error('Erro ao criar produto:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar produto",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleProductStatus = async (productId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('company_products')
        .update({ is_active: !currentStatus })
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Produto ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`
      });

      loadEmpresaData();

    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar produto",
        variant: "destructive"
      });
    }
  };

  if (loading && products.length === 0) {
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
          <h1 className="text-3xl font-bold mb-2">Área da Empresa</h1>
          <p className="text-muted-foreground">
            Gerencie seus produtos, vendas e relacionamento com clientes
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalProducts}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Progress 
                  value={(analytics.totalProducts) / (currentCompany?.max_products || 50) * 100} 
                  className="w-20 h-2 mr-2" 
                />
                {currentCompany?.max_products || 50} máximo
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos Ativos</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.activeProducts}</div>
              <p className="text-xs text-muted-foreground">
                Disponíveis para venda
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos Destacados</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.featuredProducts}</div>
              <p className="text-xs text-muted-foreground">
                Em destaque
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Estimada</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {analytics.totalRevenue.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-muted-foreground">
                Vendas recentes
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestão de Produtos</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Buscar produtos..." className="pl-10 w-64" />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
                <Button onClick={() => setIsProductModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Produto
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {products.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhum produto cadastrado</h3>
                    <p className="text-muted-foreground mb-4">
                      Comece cadastrando seus produtos para que veterinários possam encontrá-los.
                    </p>
                    <Button onClick={() => setIsProductModalOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Cadastrar Primeiro Produto
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                products.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            {product.is_featured && (
                              <Badge variant="secondary">
                                <Star className="w-3 h-3 mr-1" />
                                Destaque
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground mb-3">{product.description}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Categoria</p>
                              <p className="font-medium">{product.category}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Preço</p>
                              <p className="font-medium">
                                {product.price ? `R$ ${product.price.toFixed(2)}` : 'Não informado'}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Unidade</p>
                              <p className="font-medium">{product.unit}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Estoque</p>
                              <p className="font-medium">{product.stock_quantity || 'Ilimitado'}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Badge variant={product.is_active ? "default" : "secondary"}>
                            {product.is_active ? "Ativo" : "Inativo"}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Ver
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toggleProductStatus(product.id, product.is_active)}
                          >
                            {product.is_active ? 'Desativar' : 'Ativar'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Pedidos e Vendas</h2>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrar
                </Button>
                <Button variant="outline">
                  <Truck className="w-4 h-4 mr-2" />
                  Entregas
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {orders.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhum pedido encontrado</h3>
                    <p className="text-muted-foreground">
                      Pedidos de seus produtos aparecerão aqui.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                orders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{order.client}</h3>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>Produto: {order.product}</p>
                            <p>Quantidade: {order.quantity} unidades</p>
                            <p>Data: {new Date(order.date).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            R$ {order.value.toLocaleString('pt-BR')}
                          </p>
                          <Badge variant={
                            order.status === 'entregue' ? "default" : 
                            order.status === 'processando' ? "secondary" : "destructive"
                          }>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <h2 className="text-2xl font-bold">Relacionamento com Clientes</h2>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sistema de CRM em Desenvolvimento</h3>
                <p className="text-muted-foreground">
                  Em breve você poderá gerenciar todos os seus clientes diretamente no sistema.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics e Relatórios</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance de Vendas</CardTitle>
                  <CardDescription>Estatísticas dos últimos 30 dias</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total de Pedidos</span>
                      <span className="font-bold">{orders.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Receita Total</span>
                      <span className="font-bold">R$ {analytics.totalRevenue.toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ticket Médio</span>
                      <span className="font-bold">
                        R$ {orders.length > 0 ? (analytics.totalRevenue / orders.length).toFixed(2) : '0.00'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Produtos Mais Vendidos</CardTitle>
                  <CardDescription>Top produtos do mês</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{order.product}</p>
                          <p className="text-sm text-muted-foreground">{order.quantity} unidades</p>
                        </div>
                        <Badge variant="outline">#{index + 1}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="marketing" className="space-y-6">
            <h2 className="text-2xl font-bold">Marketing e Promoções</h2>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Ferramentas de Marketing em Desenvolvimento</h3>
                <p className="text-muted-foreground">
                  Em breve você poderá criar campanhas e promoções para seus produtos.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal para Novo Produto */}
        <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Novo Produto</DialogTitle>
              <DialogDescription>
                Cadastre um novo produto para seu catálogo
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome do Produto *</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="Ex: Ração Super Premium"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoria *</Label>
                  <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="racao">Ração</SelectItem>
                      <SelectItem value="medicamento">Medicamento</SelectItem>
                      <SelectItem value="suplemento">Suplemento</SelectItem>
                      <SelectItem value="vacina">Vacina</SelectItem>
                      <SelectItem value="equipamento">Equipamento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  placeholder="Descreva as características e benefícios do produto"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unidade</Label>
                  <Select value={newProduct.unit} onValueChange={(value) => setNewProduct({...newProduct, unit: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a unidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Quilograma (kg)</SelectItem>
                      <SelectItem value="saco_25kg">Saco 25kg</SelectItem>
                      <SelectItem value="litro">Litro (L)</SelectItem>
                      <SelectItem value="unidade">Unidade</SelectItem>
                      <SelectItem value="caixa">Caixa</SelectItem>
                      <SelectItem value="frasco">Frasco</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsProductModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateProduct} disabled={loading}>
                Cadastrar Produto
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

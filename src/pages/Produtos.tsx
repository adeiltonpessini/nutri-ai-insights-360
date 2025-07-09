
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Package, 
  Search, 
  Filter, 
  Star,
  ShoppingCart,
  Eye,
  Heart,
  Truck,
  CheckCircle
} from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Product {
  id: string;
  nome: string;
  categoria: string;
  linha: string;
  preco_por_kg: number;
  composicao: any;
  beneficios: string[];
  especie_alvo: string[];
  fase_alvo: string[];
  ativo: boolean;
  company_id: string;
  companies?: { name: string };
}

export default function Produtos() {
  const { currentCompany } = useCompany();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("catalog");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  
  // Estados para dados
  const [products, setProducts] = useState<Product[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<string[]>([]);

  useEffect(() => {
    if (currentCompany && user) {
      loadProducts();
    }
  }, [currentCompany, user]);

  const loadProducts = async () => {
    if (!currentCompany || !user) return;

    try {
      setLoading(true);

      // Carregar produtos do catálogo (de todas as empresas)
      const { data: productsData } = await supabase
        .from('catalog_products')
        .select(`
          *,
          companies(name)
        `)
        .eq('ativo', true)
        .order('nome', { ascending: true });

      setProducts(productsData || []);

    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar catálogo de produtos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (productId: string) => {
    setFavoriteProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
    
    toast({
      title: favoriteProducts.includes(productId) ? "Removido dos favoritos" : "Adicionado aos favoritos",
      description: "Produto atualizado em sua lista de favoritos"
    });
  };

  const toggleCart = (productId: string) => {
    setCartItems(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
    
    toast({
      title: cartItems.includes(productId) ? "Removido do carrinho" : "Adicionado ao carrinho",
      description: "Carrinho atualizado com sucesso"
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.categoria))];

  const stats = {
    totalProducts: products.length,
    favoriteCount: favoriteProducts.length,
    cartCount: cartItems.length,
    categoriesCount: categories.length
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
          <h1 className="text-3xl font-bold mb-2">Catálogo de Produtos</h1>
          <p className="text-muted-foreground">
            Explore produtos de nutrição animal de empresas parceiras
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos Disponíveis</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                No catálogo
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categorias</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.categoriesCount}</div>
              <p className="text-xs text-muted-foreground">
                Diferentes tipos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Favoritos</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.favoriteCount}</div>
              <p className="text-xs text-muted-foreground">
                Produtos salvos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Carrinho</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.cartCount}</div>
              <p className="text-xs text-muted-foreground">
                Itens selecionados
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="catalog">Catálogo</TabsTrigger>
            <TabsTrigger value="favorites">Favoritos</TabsTrigger>
            <TabsTrigger value="cart">Carrinho</TabsTrigger>
          </TabsList>

          <TabsContent value="catalog" className="space-y-6">
            {/* Filtros */}
            <div className="flex gap-4 flex-wrap">
              <div className="relative flex-1 min-w-64">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-background"
              >
                <option value="">Todas as categorias</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Grid de Produtos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full">
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Nenhum produto encontrado</h3>
                      <p className="text-muted-foreground">
                        Tente ajustar os filtros ou termos de busca.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gradient-to-r from-blue-100 to-green-100 flex items-center justify-center">
                      <Package className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg line-clamp-1">{product.nome}</h3>
                          <p className="text-sm text-muted-foreground">{product.companies?.name}</p>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="outline">{product.categoria}</Badge>
                          {product.linha && (
                            <Badge variant="secondary">{product.linha}</Badge>
                          )}
                        </div>

                        {product.especie_alvo && product.especie_alvo.length > 0 && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Espécies:</p>
                            <div className="flex gap-1 flex-wrap">
                              {product.especie_alvo.slice(0, 3).map((especie, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {especie}
                                </Badge>
                              ))}
                              {product.especie_alvo.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{product.especie_alvo.length - 3}
                                </Badge>
                              )}
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

                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleFavorite(product.id)}
                            className={favoriteProducts.includes(product.id) ? "bg-red-50 border-red-200" : ""}
                          >
                            <Heart 
                              className={`w-4 h-4 ${favoriteProducts.includes(product.id) ? "fill-red-500 text-red-500" : ""}`} 
                            />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Detalhes
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => toggleCart(product.id)}
                            className={cartItems.includes(product.id) ? "bg-green-600 hover:bg-green-700" : ""}
                          >
                            {cartItems.includes(product.id) ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <ShoppingCart className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <h2 className="text-2xl font-bold">Produtos Favoritos</h2>
            
            {favoriteProducts.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Nenhum produto favorito</h3>
                  <p className="text-muted-foreground">
                    Adicione produtos aos favoritos para acessá-los rapidamente.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products
                  .filter(product => favoriteProducts.includes(product.id))
                  .map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="aspect-video bg-gradient-to-r from-blue-100 to-green-100 flex items-center justify-center">
                        <Package className="w-12 h-12 text-muted-foreground" />
                      </div>
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div>
                            <h3 className="font-semibold text-lg">{product.nome}</h3>
                            <p className="text-sm text-muted-foreground">{product.companies?.name}</p>
                          </div>

                          <Badge variant="outline">{product.categoria}</Badge>

                          {product.preco_por_kg && (
                            <p className="text-lg font-bold text-green-600">
                              R$ {product.preco_por_kg.toFixed(2)}/kg
                            </p>
                          )}

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleFavorite(product.id)}
                              className="bg-red-50 border-red-200"
                            >
                              <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Detalhes
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="cart" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Carrinho de Compras</h2>
              {cartItems.length > 0 && (
                <Button>
                  <Truck className="w-4 h-4 mr-2" />
                  Solicitar Cotação
                </Button>
              )}
            </div>
            
            {cartItems.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Carrinho vazio</h3>
                  <p className="text-muted-foreground">
                    Adicione produtos ao carrinho para solicitar cotações.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {products
                  .filter(product => cartItems.includes(product.id))
                  .map((product) => (
                    <Card key={product.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{product.nome}</h3>
                            <p className="text-muted-foreground">{product.companies?.name}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline">{product.categoria}</Badge>
                              {product.linha && (
                                <Badge variant="secondary">{product.linha}</Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            {product.preco_por_kg && (
                              <p className="text-lg font-bold text-green-600">
                                R$ {product.preco_por_kg.toFixed(2)}/kg
                              </p>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleCart(product.id)}
                              className="mt-2"
                            >
                              Remover
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg mb-2">Pronto para solicitar cotação?</h3>
                      <p className="text-muted-foreground mb-4">
                        Você tem {cartItems.length} produtos selecionados
                      </p>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Truck className="w-4 h-4 mr-2" />
                        Solicitar Cotação Completa
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

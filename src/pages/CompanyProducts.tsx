import { useState, useEffect } from "react";
import { useCompany } from "@/contexts/CompanyContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Search, 
  Filter,
  Star,
  ShoppingCart,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CompanyProduct {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number | null;
  unit: string;
  target_species: any;
  target_phase: any;
  is_active: boolean;
  is_featured: boolean;
  company_id: string;
  companies: {
    name: string;
    logo_url: string | null;
  };
}

export default function CompanyProducts() {
  const { currentCompany } = useCompany();
  const { toast } = useToast();
  const [products, setProducts] = useState<CompanyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    loadProducts();
  }, [currentCompany]);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const { data: productsData, error } = await supabase
        .from('company_products')
        .select(`
          *,
          companies (
            name,
            logo_url
          )
        `)
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (productsData) {
        setProducts(productsData);
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar produtos das empresas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category))];

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Produtos das Empresas</h1>
        <p className="text-muted-foreground">
          Descubra produtos nutricionais de empresas parceiras
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedCategory === "" ? "default" : "outline"}
            onClick={() => setSelectedCategory("")}
            size="sm"
          >
            Todos
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid de Produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {product.companies.logo_url ? (
                    <img
                      src={product.companies.logo_url}
                      alt={product.companies.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {product.companies.name}
                    </p>
                  </div>
                </div>
                {product.is_featured && (
                  <Badge variant="secondary" className="gap-1">
                    <Star className="h-3 w-3" />
                    Destaque
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {product.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
              )}
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{product.category}</Badge>
                <Badge variant="outline">{product.unit}</Badge>
              </div>

              {product.target_species && Array.isArray(product.target_species) && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Espécies:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {product.target_species.map((species: string) => (
                      <Badge key={species} variant="secondary" className="text-xs">
                        {species}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {product.target_phase && Array.isArray(product.target_phase) && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Fases:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {product.target_phase.map((phase: string) => (
                      <Badge key={phase} variant="secondary" className="text-xs">
                        {phase}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                {product.price && (
                  <div className="text-lg font-bold text-primary">
                    R$ {product.price.toFixed(2)}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    Detalhes
                  </Button>
                  <Button size="sm">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Contatar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhum produto encontrado</h3>
          <p className="text-muted-foreground">
            Tente ajustar os filtros de busca ou categoria.
          </p>
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from "react";
import { useCompany } from "@/contexts/CompanyContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Users, 
  Package, 
  Plus, 
  Edit, 
  Trash2,
  UserPlus 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CompanyProduct {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number | null;
  unit: string;
  is_active: boolean;
  is_featured: boolean;
}

interface CompanyUser {
  id: string;
  user_id: string;
  role: string;
  is_active: boolean;
  profiles: {
    nome: string;
    email?: string;
  };
}

export default function Admin() {
  const { currentCompany, getUserRole } = useCompany();
  const { toast } = useToast();
  const [products, setProducts] = useState<CompanyProduct[]>([]);
  const [users, setUsers] = useState<CompanyUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    unit: "",
  });

  const userRole = getUserRole();
  const isCompanyAdmin = userRole === 'company_admin';
  const isSuperAdmin = userRole === 'super_admin';

  useEffect(() => {
    if (currentCompany && (isCompanyAdmin || isSuperAdmin)) {
      loadData();
    }
  }, [currentCompany, isCompanyAdmin, isSuperAdmin]);

  const loadData = async () => {
    if (!currentCompany) return;

    try {
      setLoading(true);

      // Carregar produtos da empresa
      const { data: productsData } = await supabase
        .from('company_products')
        .select('*')
        .eq('company_id', currentCompany.id)
        .order('created_at', { ascending: false });

      if (productsData) setProducts(productsData);

      // Carregar usuários da empresa
      const { data: usersData } = await supabase
        .from('user_roles')
        .select(`
          id,
          user_id,
          role,
          is_active,
          profiles!inner(nome)
        `)
        .eq('company_id', currentCompany.id);

      if (usersData) setUsers(usersData as any);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar dados do painel administrativo",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCompany) return;

    try {
      const { error } = await supabase
        .from('company_products')
        .insert({
          company_id: currentCompany.id,
          name: productForm.name,
          description: productForm.description,
          category: productForm.category,
          price: productForm.price ? parseFloat(productForm.price) : null,
          unit: productForm.unit,
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Produto criado com sucesso!"
      });

      setProductForm({
        name: "",
        description: "",
        category: "",
        price: "",
        unit: "",
      });

      loadData();
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      toast({
        title: "Erro",
        description: "Falha ao criar produto",
        variant: "destructive"
      });
    }
  };

  if (!isCompanyAdmin && !isSuperAdmin) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Acesso negado. Apenas administradores podem acessar este painel.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <p className="text-muted-foreground">
            Gerencie produtos e usuários da {currentCompany?.name}
          </p>
        </div>
        <Badge variant="secondary" className="gap-2">
          <Building2 className="h-4 w-4" />
          {currentCompany?.name}
        </Badge>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products" className="gap-2">
            <Package className="h-4 w-4" />
            Produtos
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            Usuários
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form para criar produto */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Novo Produto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateProduct} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome do Produto</Label>
                    <Input
                      id="name"
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Input
                      id="category"
                      value={productForm.category}
                      onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                      placeholder="ex: ração, suplemento, medicamento"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Preço</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="unit">Unidade</Label>
                      <Input
                        id="unit"
                        value={productForm.unit}
                        onChange={(e) => setProductForm({...productForm, unit: e.target.value})}
                        placeholder="ex: kg, saco_25kg"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      rows={3}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Criar Produto
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Lista de produtos */}
            <Card>
              <CardHeader>
                <CardTitle>Produtos Cadastrados ({products.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.category} • {product.unit}
                        </div>
                        {product.price && (
                          <div className="text-sm font-medium text-primary">
                            R$ {product.price.toFixed(2)}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={product.is_active ? "default" : "secondary"}>
                          {product.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {products.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhum produto cadastrado ainda.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Usuários da Empresa ({users.length})</span>
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Convidar Usuário
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{user.profiles.nome}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.role.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={user.is_active ? "default" : "secondary"}>
                        {user.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {users.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum usuário encontrado.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
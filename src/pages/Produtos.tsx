import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Package2, Search, Star, Award, Zap, Leaf, Heart, Eye, BarChart3, Filter, ArrowUpDown, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Produtos() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [compareList, setCompareList] = useState<number[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [minRating, setMinRating] = useState(0);

  const productLines = [
    {
      id: 1,
      name: "Probionutri Digestivo",
      line: "Probionutri",
      category: "probiotico",
      rating: 4.8,
      price: "R$ 45,00/kg",
      priceValue: 45,
      description: "Probiótico avançado para melhoria da digestibilidade e saúde intestinal",
      benefits: ["Melhora FCR", "Reduz mortalidade", "Fortalece imunidade"],
      species: ["Suínos", "Aves", "Bovinos"],
      icon: Zap,
      color: "tech-blue",
      details: {
        composition: "Lactobacillus acidophilus, Bacillus subtilis, Enzimas digestivas",
        dosage: "0.5-1.0 kg/ton de ração",
        storage: "Local seco e arejado, temperatura até 25°C",
        validity: "24 meses"
      }
    },
    {
      id: 2,
      name: "Receita Especial Crescimento",
      line: "Receita Especial",
      category: "nutricional",
      rating: 4.9,
      price: "R$ 38,00/kg",
      priceValue: 38,
      description: "Fórmula balanceada para maximizar ganho de peso em fase de crescimento",
      benefits: ["Acelera crescimento", "Melhora conversão", "Reduz custos"],
      species: ["Suínos", "Bovinos"],
      icon: Award,
      color: "success",
      details: {
        composition: "Proteína 18%, Gordura 4%, Fibra 6%, Minerais 8%",
        dosage: "2-3% do peso vivo/dia",
        storage: "Local seco, protegido da luz solar",
        validity: "12 meses"
      }
    },
    {
      id: 3,
      name: "EcoNutri Sustentável",
      line: "EcoNutri",
      category: "sustentavel",
      rating: 4.7,
      price: "R$ 42,00/kg",
      priceValue: 42,
      description: "Nutrição sustentável com ingredientes de baixo impacto ambiental",
      benefits: ["Menor pegada carbono", "Ingredientes locais", "Certificação verde"],
      species: ["Aves", "Bovinos", "Ovinos"],
      icon: Leaf,
      color: "sustainability",
      details: {
        composition: "Ingredientes orgânicos certificados, sem transgênicos",
        dosage: "1.5-2.5% do peso vivo/dia",
        storage: "Ambiente controlado, umidade < 70%",
        validity: "18 meses"
      }
    },
    {
      id: 4,
      name: "Probionutri Lactação",
      line: "Probionutri",
      category: "probiotico",
      rating: 4.8,
      price: "R$ 52,00/kg",
      priceValue: 52,
      description: "Especializado para fêmeas em lactação, melhora produção de leite",
      benefits: ["Aumenta produção", "Melhora qualidade", "Reduz estresse"],
      species: ["Bovinos", "Suínos"],
      icon: Star,
      color: "primary",
      details: {
        composition: "Probióticos específicos, Vitaminas A,D,E, Cálcio quelado",
        dosage: "1-2 kg/ton de ração",
        storage: "Refrigeração recomendada após abertura",
        validity: "18 meses"
      }
    },
    {
      id: 5,
      name: "Receita Especial Terminação",
      line: "Receita Especial",
      category: "nutricional",
      rating: 4.6,
      price: "R$ 35,00/kg",
      priceValue: 35,
      description: "Otimizado para fase de terminação com foco em acabamento",
      benefits: ["Melhora acabamento", "Reduz tempo", "Qualidade carcaça"],
      species: ["Suínos", "Bovinos"],
      icon: Package2,
      color: "warning",
      details: {
        composition: "Alto teor energético, Aminoácidos essenciais, Minerais quelatados",
        dosage: "3-4% do peso vivo/dia",
        storage: "Local seco e ventilado",
        validity: "15 meses"
      }
    }
  ];

  const allSpecies = Array.from(new Set(productLines.flatMap(p => p.species)));

  const filteredProducts = productLines.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecies = selectedSpecies.length === 0 || 
                          selectedSpecies.some(species => product.species.includes(species));
    const matchesPrice = product.priceValue >= priceRange.min && product.priceValue <= priceRange.max;
    const matchesRating = product.rating >= minRating;
    
    return matchesCategory && matchesSearch && matchesSpecies && matchesPrice && matchesRating;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "price":
        return a.priceValue - b.priceValue;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => {
      const isAlreadyFavorite = prev.includes(productId);
      const newFavorites = isAlreadyFavorite 
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      
      toast({
        title: isAlreadyFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
        description: isAlreadyFavorite 
          ? "Produto removido da sua lista de favoritos"
          : "Produto adicionado à sua lista de favoritos"
      });
      
      return newFavorites;
    });
  };

  const toggleCompare = (productId: number) => {
    setCompareList(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else if (prev.length < 3) {
        toast({
          title: "Produto adicionado à comparação",
          description: "Você pode comparar até 3 produtos"
        });
        return [...prev, productId];
      } else {
        toast({
          title: "Limite de comparação atingido",
          description: "Você só pode comparar até 3 produtos por vez",
          variant: "destructive"
        });
        return prev;
      }
    });
  };

  const getColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      "tech-blue": "border-tech-blue/20 bg-tech-blue/5",
      "success": "border-success/20 bg-success/5",
      "sustainability": "border-sustainability/20 bg-sustainability/5",
      "primary": "border-primary/20 bg-primary/5",
      "warning": "border-warning/20 bg-warning/5"
    };
    return colorMap[color] || "border-border bg-background";
  };

  const compareProducts = productLines.filter(p => compareList.includes(p.id));

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Produtos Alinutri</h1>
          <p className="text-muted-foreground">
            Soluções nutricionais personalizadas para seu rebanho
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <Package2 className="w-4 h-4 mr-1" />
            {sortedProducts.length} produtos
          </Badge>
          {compareList.length > 0 && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Comparar ({compareList.length})
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Comparação de Produtos</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {compareProducts.map(product => (
                    <Card key={product.id} variant="elevated">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{product.name}</CardTitle>
                          <Button
                            variant="ghost" 
                            size="sm"
                            onClick={() => toggleCompare(product.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <Badge variant="outline">{product.line}</Badge>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 fill-warning text-warning" />
                          <span className="font-medium">{product.rating}</span>
                        </div>
                        <p className="text-lg font-bold text-primary">{product.price}</p>
                        <div>
                          <p className="text-sm font-medium mb-1">Benefícios:</p>
                          {product.benefits.map(benefit => (
                            <Badge key={benefit} variant="secondary" className="text-xs mr-1 mb-1">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Espécies:</p>
                          {product.species.map(species => (
                            <Badge key={species} variant="outline" className="text-xs mr-1">
                              {species}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card variant="gradient">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  <SelectItem value="probiotico">Probióticos</SelectItem>
                  <SelectItem value="nutricional">Nutricionais</SelectItem>
                  <SelectItem value="sustentavel">Sustentáveis</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nome</SelectItem>
                  <SelectItem value="price">Preço</SelectItem>
                  <SelectItem value="rating">Avaliação</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filtros
              </Button>
            </div>

            {showAdvancedFilters && (
              <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Espécies</label>
                  <div className="space-y-2">
                    {allSpecies.map(species => (
                      <div key={species} className="flex items-center space-x-2">
                        <Checkbox
                          id={species}
                          checked={selectedSpecies.includes(species)}
                          onCheckedChange={(checked) => {
                            setSelectedSpecies(prev =>
                              checked
                                ? [...prev, species]
                                : prev.filter(s => s !== species)
                            );
                          }}
                        />
                        <label htmlFor={species} className="text-sm">{species}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Faixa de Preço (R$/kg)</label>
                  <div className="space-y-2">
                    <Input
                      type="number"
                      placeholder="Mín"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                    />
                    <Input
                      type="number"
                      placeholder="Máx"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Avaliação Mínima</label>
                  <Select value={minRating.toString()} onValueChange={(value) => setMinRating(Number(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Todas</SelectItem>
                      <SelectItem value="4">4+ estrelas</SelectItem>
                      <SelectItem value="4.5">4.5+ estrelas</SelectItem>
                      <SelectItem value="4.8">4.8+ estrelas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProducts.map((product) => (
          <Card key={product.id} variant="elevated" className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-lg ${getColorClass(product.color)}`}>
                  <product.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(product.id)}
                    className="p-1 h-8 w-8"
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-warning text-warning" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                </div>
              </div>
              <div>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <Badge variant="outline" className="mt-1 text-xs">
                  {product.line}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {product.description}
              </p>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Benefícios principais:</p>
                <div className="flex flex-wrap gap-1">
                  {product.benefits.map((benefit, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Espécies:</p>
                <div className="flex flex-wrap gap-1">
                  {product.species.map((specie, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {specie}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-lg font-bold text-primary">{product.price}</p>
                  <p className="text-xs text-muted-foreground">Preço sugerido</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleCompare(product.id)}
                    className={compareList.includes(product.id) ? "bg-primary/10 border-primary" : ""}
                  >
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="tech" size="sm" onClick={() => setSelectedProduct(product)}>
                        <Eye className="w-4 h-4 mr-1" />
                        Detalhes
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${getColorClass(product.color)}`}>
                            <product.icon className="w-5 h-5" />
                          </div>
                          {product.name}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 fill-warning text-warning" />
                            <span className="font-medium">{product.rating}</span>
                            <Badge variant="outline">{product.line}</Badge>
                          </div>
                          <p className="text-2xl font-bold text-primary">{product.price}</p>
                        </div>
                        
                        <p className="text-muted-foreground">{product.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium mb-2">Benefícios</h4>
                            <div className="space-y-1">
                              {product.benefits.map(benefit => (
                                <div key={benefit} className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-success rounded-full" />
                                  <span className="text-sm">{benefit}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Espécies</h4>
                            <div className="flex flex-wrap gap-1">
                              {product.species.map(species => (
                                <Badge key={species} variant="outline" className="text-xs">
                                  {species}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-medium">Informações Técnicas</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Composição:</span>
                              <p className="text-muted-foreground">{product.details.composition}</p>
                            </div>
                            <div>
                              <span className="font-medium">Dosagem:</span>
                              <p className="text-muted-foreground">{product.details.dosage}</p>
                            </div>
                            <div>
                              <span className="font-medium">Armazenamento:</span>
                              <p className="text-muted-foreground">{product.details.storage}</p>
                            </div>
                            <div>
                              <span className="font-medium">Validade:</span>
                              <p className="text-muted-foreground">{product.details.validity}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedProducts.length === 0 && (
        <Card variant="default">
          <CardContent className="text-center py-12">
            <Package2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">
              Nenhum produto encontrado com os filtros selecionados
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSelectedCategory("all");
                setSearchTerm("");
                setSelectedSpecies([]);
                setPriceRange({ min: 0, max: 100 });
                setMinRating(0);
              }}
            >
              Limpar filtros
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
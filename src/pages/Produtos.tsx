import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package2, Search, Star, Award, Zap, Leaf } from "lucide-react";

export default function Produtos() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const productLines = [
    {
      id: 1,
      name: "Probionutri Digestivo",
      line: "Probionutri",
      category: "probiotico",
      rating: 4.8,
      price: "R$ 45,00/kg",
      description: "Probiótico avançado para melhoria da digestibilidade e saúde intestinal",
      benefits: ["Melhora FCR", "Reduz mortalidade", "Fortalece imunidade"],
      species: ["Suínos", "Aves", "Bovinos"],
      icon: Zap,
      color: "tech-blue"
    },
    {
      id: 2,
      name: "Receita Especial Crescimento",
      line: "Receita Especial",
      category: "nutricional",
      rating: 4.9,
      price: "R$ 38,00/kg",
      description: "Fórmula balanceada para maximizar ganho de peso em fase de crescimento",
      benefits: ["Acelera crescimento", "Melhora conversão", "Reduz custos"],
      species: ["Suínos", "Bovinos"],
      icon: Award,
      color: "success"
    },
    {
      id: 3,
      name: "EcoNutri Sustentável",
      line: "EcoNutri",
      category: "sustentavel",
      rating: 4.7,
      price: "R$ 42,00/kg",
      description: "Nutrição sustentável com ingredientes de baixo impacto ambiental",
      benefits: ["Menor pegada carbono", "Ingredientes locais", "Certificação verde"],
      species: ["Aves", "Bovinos", "Ovinos"],
      icon: Leaf,
      color: "sustainability"
    },
    {
      id: 4,
      name: "Probionutri Lactação",
      line: "Probionutri",
      category: "probiotico",
      rating: 4.8,
      price: "R$ 52,00/kg",
      description: "Especializado para fêmeas em lactação, melhora produção de leite",
      benefits: ["Aumenta produção", "Melhora qualidade", "Reduz estresse"],
      species: ["Bovinos", "Suínos"],
      icon: Star,
      color: "primary"
    },
    {
      id: 5,
      name: "Receita Especial Terminação",
      line: "Receita Especial",
      category: "nutricional",
      rating: 4.6,
      price: "R$ 35,00/kg",
      description: "Otimizado para fase de terminação com foco em acabamento",
      benefits: ["Melhora acabamento", "Reduz tempo", "Qualidade carcaça"],
      species: ["Suínos", "Bovinos"],
      icon: Package2,
      color: "warning"
    }
  ];

  const filteredProducts = productLines.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Produtos Alinutri</h1>
          <p className="text-muted-foreground">
            Soluções nutricionais personalizadas para seu rebanho
          </p>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
          <Package2 className="w-4 h-4 mr-1" />
          {filteredProducts.length} produtos
        </Badge>
      </div>

      {/* Filters */}
      <Card variant="gradient">
        <CardContent className="pt-6">
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
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} variant="elevated" className="group">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-lg ${getColorClass(product.color)}`}>
                  <product.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-warning text-warning" />
                  <span className="text-sm font-medium">{product.rating}</span>
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
                <Button variant="tech" size="sm">
                  Ver Detalhes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card variant="default">
          <CardContent className="text-center py-12">
            <Package2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">
              Nenhum produto encontrado com os filtros selecionados
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
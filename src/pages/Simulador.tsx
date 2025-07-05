import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { FlaskConical, TrendingUp, Calculator, Target, AlertCircle, CheckCircle, Zap, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Ingredient {
  name: string;
  protein: number;
  energy: number;
  cost: number;
  maxPercent: number;
  minPercent: number;
}

interface Formulation {
  ingredients: { [key: string]: number };
  totalProtein: number;
  totalEnergy: number;
  totalCost: number;
  isValid: boolean;
  efficiency: number;
}

const ingredients: Ingredient[] = [
  { name: "Milho", protein: 8.5, energy: 3350, cost: 0.65, maxPercent: 70, minPercent: 0 },
  { name: "Farelo de Soja", protein: 46, energy: 2230, cost: 1.85, maxPercent: 35, minPercent: 0 },
  { name: "Farelo de Trigo", protein: 17, energy: 1900, cost: 0.55, maxPercent: 20, minPercent: 0 },
  { name: "Calcário", protein: 0, energy: 0, cost: 0.12, maxPercent: 2, minPercent: 0.5 },
  { name: "Fosfato Bicálcico", protein: 0, energy: 0, cost: 2.50, maxPercent: 2.5, minPercent: 0.8 },
  { name: "Sal Comum", protein: 0, energy: 0, cost: 0.45, maxPercent: 0.8, minPercent: 0.3 },
  { name: "Premix Vitamínico", protein: 0, energy: 0, cost: 8.50, maxPercent: 0.5, minPercent: 0.25 },
];

export default function Simulador() {
  const [animalType, setAnimalType] = useState("suinos");
  const [phase, setPhase] = useState("crescimento");
  const [targetProtein, setTargetProtein] = useState(16);
  const [targetEnergy, setTargetEnergy] = useState(3200);
  const [maxCost, setMaxCost] = useState(1.20);
  const [formulation, setFormulation] = useState<Formulation | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [ingredientPercentages, setIngredientPercentages] = useState<{ [key: string]: number }>({});
  const { toast } = useToast();

  // Inicializar porcentagens dos ingredientes
  useEffect(() => {
    const initialPercentages: { [key: string]: number } = {};
    ingredients.forEach(ing => {
      initialPercentages[ing.name] = ing.minPercent;
    });
    setIngredientPercentages(initialPercentages);
  }, []);

  const calculateFormulation = (): Formulation => {
    const total = Object.values(ingredientPercentages).reduce((sum, val) => sum + val, 0);
    
    if (Math.abs(total - 100) > 0.1) {
      return {
        ingredients: ingredientPercentages,
        totalProtein: 0,
        totalEnergy: 0,
        totalCost: 0,
        isValid: false,
        efficiency: 0
      };
    }

    let totalProtein = 0;
    let totalEnergy = 0;
    let totalCost = 0;

    ingredients.forEach(ingredient => {
      const percentage = ingredientPercentages[ingredient.name] || 0;
      totalProtein += (ingredient.protein * percentage) / 100;
      totalEnergy += (ingredient.energy * percentage) / 100;
      totalCost += (ingredient.cost * percentage) / 100;
    });

    const proteinDiff = Math.abs(totalProtein - targetProtein);
    const energyDiff = Math.abs(totalEnergy - targetEnergy);
    const isValid = proteinDiff <= 1 && energyDiff <= 100 && totalCost <= maxCost;
    
    const efficiency = isValid ? 
      Math.max(0, 100 - (proteinDiff * 10) - (energyDiff / 20) - (totalCost / maxCost * 20)) : 0;

    return {
      ingredients: ingredientPercentages,
      totalProtein,
      totalEnergy,
      totalCost,
      isValid,
      efficiency
    };
  };

  const optimizeFormulation = async () => {
    setIsOptimizing(true);
    
    // Simulação de otimização
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Algoritmo simples de otimização
    const optimized: { [key: string]: number } = {};
    let remainingPercent = 100;
    
    // Ingredientes obrigatórios primeiro
    ingredients.forEach(ing => {
      if (ing.minPercent > 0) {
        optimized[ing.name] = ing.minPercent;
        remainingPercent -= ing.minPercent;
      } else {
        optimized[ing.name] = 0;
      }
    });

    // Distribuir o restante baseado na eficiência nutricional
    const mainIngredients = ["Milho", "Farelo de Soja", "Farelo de Trigo"];
    const proteinNeed = targetProtein;
    
    // Ajuste inteligente baseado nas necessidades
    if (proteinNeed > 18) {
      optimized["Farelo de Soja"] = Math.min(25, optimized["Farelo de Soja"] + remainingPercent * 0.4);
      optimized["Milho"] = Math.min(60, optimized["Milho"] + remainingPercent * 0.5);
      optimized["Farelo de Trigo"] = Math.min(15, optimized["Farelo de Trigo"] + remainingPercent * 0.1);
    } else {
      optimized["Milho"] = Math.min(65, optimized["Milho"] + remainingPercent * 0.6);
      optimized["Farelo de Soja"] = Math.min(20, optimized["Farelo de Soja"] + remainingPercent * 0.3);
      optimized["Farelo de Trigo"] = Math.min(15, optimized["Farelo de Trigo"] + remainingPercent * 0.1);
    }

    // Normalizar para 100%
    const currentTotal = Object.values(optimized).reduce((sum, val) => sum + val, 0);
    Object.keys(optimized).forEach(key => {
      optimized[key] = (optimized[key] / currentTotal) * 100;
    });

    setIngredientPercentages(optimized);
    setIsOptimizing(false);
    
    toast({
      title: "Otimização concluída",
      description: "Formulação otimizada para suas especificações",
    });
  };

  const updateIngredientPercentage = (ingredient: string, value: number[]) => {
    setIngredientPercentages(prev => ({
      ...prev,
      [ingredient]: value[0]
    }));
  };

  const currentFormulation = calculateFormulation();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Simulador de Ração</h1>
          <p className="text-muted-foreground">
            Otimização inteligente de formulações nutricionais
          </p>
        </div>
        <Badge variant="outline" className="bg-tech-blue/10 text-tech-blue border-tech-blue/20">
          <FlaskConical className="w-4 h-4 mr-1" />
          IA Formulação
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configurações */}
        <Card variant="tech">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Especificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Animal</Label>
                <Select value={animalType} onValueChange={setAnimalType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="suinos">Suínos</SelectItem>
                    <SelectItem value="aves">Aves</SelectItem>
                    <SelectItem value="bovinos">Bovinos</SelectItem>
                    <SelectItem value="aquicultura">Aquicultura</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Fase</Label>
                <Select value={phase} onValueChange={setPhase}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inicial">Inicial</SelectItem>
                    <SelectItem value="crescimento">Crescimento</SelectItem>
                    <SelectItem value="terminacao">Terminação</SelectItem>
                    <SelectItem value="reproducao">Reprodução</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Proteína Bruta (%)</Label>
                <div className="flex items-center space-x-4">
                  <Slider
                    value={[targetProtein]}
                    onValueChange={(value) => setTargetProtein(value[0])}
                    max={25}
                    min={10}
                    step={0.5}
                    className="flex-1"
                  />
                  <span className="w-12 text-sm font-medium">{targetProtein}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Energia (kcal/kg)</Label>
                <div className="flex items-center space-x-4">
                  <Slider
                    value={[targetEnergy]}
                    onValueChange={(value) => setTargetEnergy(value[0])}
                    max={3500}
                    min={2800}
                    step={50}
                    className="flex-1"
                  />
                  <span className="w-16 text-sm font-medium">{targetEnergy}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Custo Máximo (R$/kg)</Label>
                <div className="flex items-center space-x-4">
                  <Slider
                    value={[maxCost]}
                    onValueChange={(value) => setMaxCost(value[0])}
                    max={2.0}
                    min={0.8}
                    step={0.05}
                    className="flex-1"
                  />
                  <span className="w-12 text-sm font-medium">R${maxCost.toFixed(2)}</span>
                </div>
              </div>

              <Button 
                variant="hero" 
                className="w-full"
                onClick={optimizeFormulation}
                disabled={isOptimizing}
              >
                {isOptimizing ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-pulse" />
                    Otimizando...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Otimizar Automaticamente
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Formulação */}
        <Card variant="gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Formulação Manual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ingredients.map((ingredient) => (
                <div key={ingredient.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium">{ingredient.name}</Label>
                    <span className="text-xs text-muted-foreground">
                      {(ingredientPercentages[ingredient.name] || 0).toFixed(1)}%
                    </span>
                  </div>
                  <Slider
                    value={[ingredientPercentages[ingredient.name] || 0]}
                    onValueChange={(value) => updateIngredientPercentage(ingredient.name, value)}
                    max={ingredient.maxPercent}
                    min={ingredient.minPercent}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Min: {ingredient.minPercent}%</span>
                    <span>Max: {ingredient.maxPercent}%</span>
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total:</span>
                  <span className={`font-bold ${
                    Math.abs(Object.values(ingredientPercentages).reduce((sum, val) => sum + val, 0) - 100) <= 0.1 
                      ? "text-success" : "text-destructive"
                  }`}>
                    {Object.values(ingredientPercentages).reduce((sum, val) => sum + val, 0).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        <Card variant={currentFormulation.isValid ? "gradient" : "default"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Análise Nutricional
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status da Formulação</span>
                {currentFormulation.isValid ? (
                  <Badge variant="default" className="bg-success">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Válida
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Ajustar
                  </Badge>
                )}
              </div>

              {currentFormulation.isValid && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Eficiência</span>
                    <span className="font-medium">{currentFormulation.efficiency.toFixed(0)}%</span>
                  </div>
                  <Progress value={currentFormulation.efficiency} className="h-2" />
                </div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-accent/20 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Proteína Bruta</p>
                    <p className="text-xs text-muted-foreground">
                      Meta: {targetProtein}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      Math.abs(currentFormulation.totalProtein - targetProtein) <= 1 
                        ? "text-success" : "text-destructive"
                    }`}>
                      {currentFormulation.totalProtein.toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {currentFormulation.totalProtein > targetProtein ? "+" : ""}
                      {(currentFormulation.totalProtein - targetProtein).toFixed(1)}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-tech-blue/10 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Energia Metabólica</p>
                    <p className="text-xs text-muted-foreground">
                      Meta: {targetEnergy} kcal/kg
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      Math.abs(currentFormulation.totalEnergy - targetEnergy) <= 100 
                        ? "text-success" : "text-destructive"
                    }`}>
                      {currentFormulation.totalEnergy.toFixed(0)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {currentFormulation.totalEnergy > targetEnergy ? "+" : ""}
                      {(currentFormulation.totalEnergy - targetEnergy).toFixed(0)} kcal/kg
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-warning/10 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Custo Estimado</p>
                    <p className="text-xs text-muted-foreground">
                      Máximo: R$ {maxCost.toFixed(2)}/kg
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      currentFormulation.totalCost <= maxCost 
                        ? "text-success" : "text-destructive"
                    }`}>
                      R$ {currentFormulation.totalCost.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {((currentFormulation.totalCost / maxCost - 1) * 100).toFixed(0)}% do limite
                    </p>
                  </div>
                </div>
              </div>

              {currentFormulation.isValid && (
                <div className="pt-4 border-t">
                  <h4 className="font-medium text-sm mb-3">Produtos Recomendados</h4>
                  <div className="space-y-2">
                    <div className="p-2 bg-primary/5 rounded border border-primary/20">
                      <p className="text-sm font-medium">Premix Suínos Plus</p>
                      <p className="text-xs text-muted-foreground">
                        Complemento vitamínico ideal para esta formulação
                      </p>
                    </div>
                    <div className="p-2 bg-sustainability/5 rounded border border-sustainability/20">
                      <p className="text-sm font-medium">Probionutri Digestivo</p>
                      <p className="text-xs text-muted-foreground">
                        Melhora conversão alimentar em 5-8%
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
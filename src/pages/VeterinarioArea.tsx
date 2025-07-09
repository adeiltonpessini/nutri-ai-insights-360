
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  PawPrint, 
  Users, 
  FileText, 
  TrendingUp, 
  Calendar,
  Plus,
  Search,
  Filter
} from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";

export default function VeterinarioArea() {
  const { currentCompany } = useCompany();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Mock data - em produção viria do banco
  const stats = {
    totalAnimals: 47,
    maxAnimals: 100,
    totalClients: 12,
    maxClients: 20,
    activeRecipes: 8,
    diagnosticsThisMonth: 15
  };

  const recentAnimals = [
    { id: 1, name: "Luna", species: "Cão", owner: "João Silva", lastVisit: "2024-01-08" },
    { id: 2, name: "Mel", species: "Gato", owner: "Maria Santos", lastVisit: "2024-01-07" },
    { id: 3, name: "Thor", species: "Cão", owner: "Pedro Costa", lastVisit: "2024-01-06" }
  ];

  const recentDiagnostics = [
    { id: 1, animal: "Luna", type: "Dermatológico", confidence: 94, date: "2024-01-08" },
    { id: 2, animal: "Max", type: "Nutricional", confidence: 87, date: "2024-01-07" },
    { id: 3, animal: "Bella", type: "Respiratório", confidence: 91, date: "2024-01-06" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Área do Veterinário</h1>
          <p className="text-muted-foreground">
            Gerencie seus pacientes, clientes e diagnósticos em um só lugar
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="animals">Animais</TabsTrigger>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="recipes">Receitas</TabsTrigger>
            <TabsTrigger value="diagnostics">Diagnósticos</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Animais Cadastrados</CardTitle>
                  <PawPrint className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalAnimals}</div>
                  <div className="text-xs text-muted-foreground mb-2">
                    de {stats.maxAnimals} permitidos
                  </div>
                  <Progress value={(stats.totalAnimals / stats.maxAnimals) * 100} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalClients}</div>
                  <div className="text-xs text-muted-foreground mb-2">
                    de {stats.maxClients} permitidos
                  </div>
                  <Progress value={(stats.totalClients / stats.maxClients) * 100} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receitas Ativas</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeRecipes}</div>
                  <p className="text-xs text-muted-foreground">
                    +3 este mês
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Diagnósticos IA</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.diagnosticsThisMonth}</div>
                  <p className="text-xs text-muted-foreground">
                    Este mês
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Animais Recentes</CardTitle>
                  <CardDescription>Últimos animais cadastrados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentAnimals.map((animal) => (
                      <div key={animal.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{animal.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {animal.species} - {animal.owner}
                          </p>
                        </div>
                        <Badge variant="outline">{animal.lastVisit}</Badge>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Ver Todos os Animais
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Diagnósticos Recentes</CardTitle>
                  <CardDescription>Últimos diagnósticos com IA</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentDiagnostics.map((diagnostic) => (
                      <div key={diagnostic.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{diagnostic.animal}</p>
                          <p className="text-sm text-muted-foreground">
                            {diagnostic.type}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={diagnostic.confidence > 90 ? "default" : "secondary"}>
                            {diagnostic.confidence}%
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {diagnostic.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Ver Todos os Diagnósticos
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="animals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestão de Animais</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Animal
              </Button>
            </div>

            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <input
                  placeholder="Buscar animais..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
                  Lista de animais será implementada aqui
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestão de Clientes</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Cliente
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
                  Lista de clientes será implementada aqui
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recipes" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Receitas Digitais</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nova Receita
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
                  Sistema de receitas será implementado aqui
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diagnostics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Diagnósticos com IA</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Diagnóstico
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
                  Sistema de diagnósticos será implementado aqui
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

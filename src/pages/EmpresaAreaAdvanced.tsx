
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  Users, 
  Package, 
  DollarSign, 
  Leaf, 
  BarChart3, 
  FileText, 
  Settings,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Calendar
} from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { useAuth } from "@/contexts/AuthContext";
import { GestaoFinanceira } from "@/components/GestaoFinanceira";
import { GestaoEstoque } from "@/components/GestaoEstoque";
import { SustentabilidadeESG } from "@/components/SustentabilidadeESG";

export default function EmpresaAreaAdvanced() {
  const { currentCompany } = useCompany();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (!currentCompany) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Empresa não selecionada</h3>
          <p className="text-muted-foreground">
            Selecione uma empresa para acessar a área empresarial.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {currentCompany.name} - Gestão Empresarial
          </h1>
          <p className="text-muted-foreground">
            Plataforma completa de gestão agropecuária e veterinária
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="animals">Animais</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
            <TabsTrigger value="inventory">Estoque</TabsTrigger>
            <TabsTrigger value="sustainability">ESG</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
            <TabsTrigger value="team">Equipe</TabsTrigger>
            <TabsTrigger value="settings">Config.</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Animais Ativos</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,247</div>
                  <p className="text-xs text-muted-foreground">
                    +20 desde o último mês
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 87.450</div>
                  <p className="text-xs text-muted-foreground">
                    +12% em relação ao mês anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pontuação ESG</CardTitle>
                  <Leaf className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78.5</div>
                  <p className="text-xs text-muted-foreground">
                    Classificação: Excelente
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Eficiência Operacional</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">94%</div>
                  <p className="text-xs text-muted-foreground">
                    +3% este mês
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Alertas e Notificações */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Alertas Importantes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded">
                    <div>
                      <p className="font-medium">Estoque de Ração Baixo</p>
                      <p className="text-sm text-muted-foreground">5 itens precisam ser repostos</p>
                    </div>
                    <Badge variant="outline" className="text-orange-600 border-orange-600">
                      Urgente
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded">
                    <div>
                      <p className="font-medium">Vacinação Pendente</p>
                      <p className="text-sm text-muted-foreground">23 animais precisam ser vacinados</p>
                    </div>
                    <Badge variant="outline" className="text-red-600 border-red-600">
                      Crítico
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <div>
                      <p className="font-medium">Manutenção Equipamentos</p>
                      <p className="text-sm text-muted-foreground">Revisão programada para esta semana</p>
                    </div>
                    <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                      Agendado
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    Agenda do Dia
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">Check-up Lote A</p>
                      <p className="text-sm text-muted-foreground">09:00 - Dr. Silva</p>
                    </div>
                    <Badge variant="default">
                      Hoje
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">Entrega de Ração</p>
                      <p className="text-sm text-muted-foreground">14:00 - Fornecedor ABC</p>
                    </div>
                    <Badge variant="secondary">
                      Agendado
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">Reunião Equipe</p>
                      <p className="text-sm text-muted-foreground">16:30 - Sala de reuniões</p>
                    </div>
                    <Badge variant="outline">
                      Semanal
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Métricas de Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Performance da Propriedade</CardTitle>
                <CardDescription>
                  Indicadores chave de desempenho
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">2.3</div>
                    <p className="text-sm text-muted-foreground">Conversão Alimentar Média</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">1.2kg</div>
                    <p className="text-sm text-muted-foreground">Ganho Peso Diário</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">97.5%</div>
                    <p className="text-sm text-muted-foreground">Taxa de Sobrevivência</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="animals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestão Avançada de Animais</CardTitle>
                <CardDescription>
                  Sistema completo para gestão do rebanho com QR Code, rastreabilidade e IA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 border rounded">
                    <h3 className="font-semibold mb-2">🏷️ Identificação por QR Code</h3>
                    <p className="text-sm text-muted-foreground">
                      Cada animal possui QR Code único para acesso rápido via celular
                    </p>
                  </div>
                  <div className="p-4 border rounded">
                    <h3 className="font-semibold mb-2">🧬 Registro Genético</h3>
                    <p className="text-sm text-muted-foreground">
                      Linhagem genética, raça, origem e histórico de cruzamentos
                    </p>
                  </div>
                  <div className="p-4 border rounded">
                    <h3 className="font-semibold mb-2">🩺 Histórico de Saúde</h3>
                    <p className="text-sm text-muted-foreground">
                      Vacinas, diagnósticos, tratamentos e anexos médicos
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <GestaoFinanceira />
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <GestaoEstoque />
          </TabsContent>

          <TabsContent value="sustainability" className="space-y-6">
            <SustentabilidadeESG />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  BI e Inteligência de Dados
                </CardTitle>
                <CardDescription>
                  Relatórios preditivos e análises avançadas com IA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-4 border rounded">
                    <h3 className="font-semibold mb-2">📈 Relatórios Preditivos</h3>
                    <p className="text-sm text-muted-foreground">
                      Previsão de ganho de peso, consumo de ração e taxa de mortalidade
                    </p>
                  </div>
                  <div className="p-4 border rounded">
                    <h3 className="font-semibold mb-2">📉 Alertas de Performance</h3>
                    <p className="text-sm text-muted-foreground">
                      Detecção automática de queda de desempenho em lotes
                    </p>
                  </div>
                  <div className="p-4 border rounded">
                    <h3 className="font-semibold mb-2">📊 Benchmarking</h3>
                    <p className="text-sm text-muted-foreground">
                      Compare dados com média de propriedades similares
                    </p>
                  </div>
                  <div className="p-4 border rounded">
                    <h3 className="font-semibold mb-2">⚗️ Comparador de Receitas</h3>
                    <p className="text-sm text-muted-foreground">
                      Análise comparativa de formulações nutricionais
                    </p>
                  </div>
                  <div className="p-4 border rounded">
                    <h3 className="font-semibold mb-2">🧮 Análise Custo-Benefício</h3>
                    <p className="text-sm text-muted-foreground">
                      Cálculo de ROI por receita e estratégia nutricional
                    </p>
                  </div>
                  <div className="p-4 border rounded">
                    <h3 className="font-semibold mb-2">📝 Relatórios MAPA</h3>
                    <p className="text-sm text-muted-foreground">
                      Geração automática para fiscalização oficial
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Gestão de Pessoas e Equipes
                </CardTitle>
                <CardDescription>
                  Controle de funcionários, permissões e produtividade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-4 border rounded">
                    <h3 className="font-semibold mb-2">👤 Cadastro de Funcionários</h3>
                    <p className="text-sm text-muted-foreground">
                      Nome, cargo, contato e funções específicas
                    </p>
                  </div>
                  <div className="p-4 border rounded">
                    <h3 className="font-semibold mb-2">📈 Performance Individual</h3>
                    <p className="text-sm text-muted-foreground">
                      Acompanhamento de produtividade por tarefas registradas
                    </p>
                  </div>
                  <div className="p-4 border rounded">
                    <h3 className="font-semibold mb-2">🔐 Permissões por Função</h3>
                    <p className="text-sm text-muted-foreground">
                      Veterinário, Operador, Financeiro, Gestor com acessos limitados
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configurações Avançadas
                </CardTitle>
                <CardDescription>
                  Personalize o sistema conforme suas necessidades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-4 border rounded">
                    <h3 className="font-semibold mb-2">🔒 Segurança e Confiabilidade</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Log de alterações completo</li>
                      <li>• Backup automático mensal</li>
                      <li>• Autenticação dois fatores (2FA)</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded">
                    <h3 className="font-semibold mb-2">🌍 Internacionalização</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Português, Espanhol, Inglês</li>
                      <li>• Configuração automática por região</li>
                      <li>• Moedas e formatos locais</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded">
                    <h3 className="font-semibold mb-2">🧩 Módulos Personalizados</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Ativar/desativar funcionalidades</li>
                      <li>• Configuração por plano</li>
                      <li>• Webhooks e integrações</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded">
                    <h3 className="font-semibold mb-2">🧪 IA e Visão Computacional</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Reconhecimento de feridas</li>
                      <li>• Detecção de escore corporal</li>
                      <li>• Diagnóstico preditivo</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded">
                    <h3 className="font-semibold mb-2">🗺️ Geolocalização</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Mapa de propriedades/lotes</li>
                      <li>• Geotag em diagnósticos</li>
                      <li>• Rastreabilidade por GPS</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded">
                    <h3 className="font-semibold mb-2">🧵 Integrações Externas</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• ERPs e sistemas externos</li>
                      <li>• WhatsApp Business</li>
                      <li>• Power BI e Zapier</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

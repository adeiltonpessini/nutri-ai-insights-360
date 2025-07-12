
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Activity, 
  Package,
  AlertTriangle,
  TrendingUp,
  Stethoscope,
  Building2,
  Tractor
} from "lucide-react";
import { useOrganization } from "@/contexts/OrganizationContext";
import { useOrganizationData, VetStats, CompanyStats, FarmStats } from "@/hooks/useOrganizationData";
import { VetDashboard } from "./VetDashboard";
import { CompanyDashboard } from "./CompanyDashboard";
import { FarmDashboard } from "./FarmDashboard";
import { SuperAdminDashboard } from "./SuperAdminDashboard";

export default function InfinityVetDashboard() {
  const { currentOrg, userProfile, isLoading, isSuperAdmin } = useOrganization();
  const { loading: dataLoading, stats } = useOrganizationData();

  if (isLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isSuperAdmin) {
    return <SuperAdminDashboard />;
  }

  if (!currentOrg || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Configuração Necessária
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Você precisa estar associado a uma organização para acessar o sistema.
            </p>
            <p className="text-sm text-muted-foreground">
              Entre em contato com o administrador do sistema.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Renderizar dashboard específico por tipo de organização
  switch (currentOrg.company_type) {
    case 'veterinario':
      return <VetDashboard stats={stats as VetStats} />;
    case 'empresa_alimento':
    case 'empresa_medicamento':
      return <CompanyDashboard stats={stats as CompanyStats} />;
    default:
      return <FarmDashboard stats={stats as FarmStats} />;
  }
}

// Componente de cabeçalho comum
export function DashboardHeader() {
  const { currentOrg, userProfile } = useOrganization();

  const getOrgIcon = (type: string | null) => {
    switch (type) {
      case 'veterinario':
        return <Stethoscope className="h-5 w-5" />;
      case 'empresa_alimento':
      case 'empresa_medicamento':
        return <Building2 className="h-5 w-5" />;
      default:
        return <Tractor className="h-5 w-5" />;
    }
  };

  const getOrgTypeLabel = (type: string | null) => {
    switch (type) {
      case 'veterinario':
        return 'Clínica Veterinária';
      case 'empresa_alimento':
        return 'Empresa de Alimentos';
      case 'empresa_medicamento':
        return 'Empresa de Medicamentos';
      default:
        return 'Agropecuária';
    }
  };

  return (
    <div className="mb-8 p-6 bg-gradient-card rounded-2xl border border-border/50 shadow-medium">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-soft">
          {currentOrg && getOrgIcon(currentOrg.company_type)}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-sustainability bg-clip-text text-transparent">
            {currentOrg?.name || 'InfinityVet'}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            {currentOrg && (
              <Badge className="bg-gradient-sustainability text-white border-0">
                {getOrgTypeLabel(currentOrg.company_type)}
              </Badge>
            )}
            {currentOrg && (
              <Badge variant="outline" className="border-primary text-primary">
                Plano {currentOrg.subscription_plan?.toUpperCase()}
              </Badge>
            )}
          </div>
        </div>
      </div>
      <p className="text-muted-foreground text-lg">
        Bem-vindo, <span className="font-semibold text-foreground">{userProfile?.nome}</span>! 
        Gestão inteligente, sustentável e sem limites.
      </p>
    </div>
  );
}

// Componente de resumo do plano
export function PlanSummary() {
  const { currentOrg } = useOrganization();
  const { stats } = useOrganizationData();

  if (!currentOrg || !stats) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo do Plano</CardTitle>
        <CardDescription>Utilização atual dos recursos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Animais</span>
            <span>{stats.totalAnimals}/{currentOrg.max_animals || 100}</span>
          </div>
          <Progress value={(stats.totalAnimals / (currentOrg.max_animals || 100)) * 100} />
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Produtos</span>
            <span>{stats.totalProducts}/{currentOrg.max_products || 50}</span>
          </div>
          <Progress value={(stats.totalProducts / (currentOrg.max_products || 50)) * 100} />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Funcionários</span>
            <span>{stats.totalEmployees}/{currentOrg.max_users || 5}</span>
          </div>
          <Progress value={(stats.totalEmployees / (currentOrg.max_users || 5)) * 100} />
        </div>

        <div className="pt-4">
          <Badge variant="secondary" className="w-full justify-center">
            Plano {currentOrg.subscription_plan?.toUpperCase() || 'BÁSICO'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}


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
import { useOrganizationData } from "@/hooks/useOrganizationData";
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
  switch (currentOrg.type) {
    case 'vet':
      return <VetDashboard stats={stats} />;
    case 'empresa':
      return <CompanyDashboard stats={stats} />;
    case 'fazenda':
      return <FarmDashboard stats={stats} />;
    default:
      return (
        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>Tipo de organização não reconhecido</CardTitle>
            </CardHeader>
            <CardContent>
              <p>O tipo de organização "{currentOrg.type}" não é suportado.</p>
            </CardContent>
          </Card>
        </div>
      );
  }
}

// Componente de cabeçalho comum
export function DashboardHeader() {
  const { currentOrg, userProfile } = useOrganization();

  const getOrgIcon = (type: string) => {
    switch (type) {
      case 'vet':
        return <Stethoscope className="h-5 w-5" />;
      case 'empresa':
        return <Building2 className="h-5 w-5" />;
      case 'fazenda':
        return <Tractor className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getOrgTypeLabel = (type: string) => {
    switch (type) {
      case 'vet':
        return 'Clínica Veterinária';
      case 'empresa':
        return 'Empresa de Nutrição';
      case 'fazenda':
        return 'Fazenda/Agropecuária';
      default:
        return type;
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        {currentOrg && getOrgIcon(currentOrg.type)}
        <h1 className="text-3xl font-bold">
          {currentOrg?.name || 'InfinityVet'}
        </h1>
        {currentOrg && (
          <Badge variant="secondary">
            {getOrgTypeLabel(currentOrg.type)}
          </Badge>
        )}
      </div>
      <p className="text-muted-foreground">
        Bem-vindo, {userProfile?.nome}! 
        {currentOrg && ` Plano ${currentOrg.plan.toUpperCase()}`}
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
            <span>{stats.totalAnimals}/{currentOrg.limite_animais}</span>
          </div>
          <Progress value={(stats.totalAnimals / currentOrg.limite_animais) * 100} />
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Produtos</span>
            <span>{stats.totalProducts}/{currentOrg.limite_produtos}</span>
          </div>
          <Progress value={(stats.totalProducts / currentOrg.limite_produtos) * 100} />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Funcionários</span>
            <span>{stats.totalEmployees}/{currentOrg.limite_funcionarios}</span>
          </div>
          <Progress value={(stats.totalEmployees / currentOrg.limite_funcionarios) * 100} />
        </div>

        <div className="pt-4">
          <Badge variant="secondary" className="w-full justify-center">
            Plano {currentOrg.plan.toUpperCase()}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}


import {
  LayoutDashboard,
  Building2,
  Users,
  Package,
  Stethoscope,
  Camera,
  BarChart3,
  FileText,
  Settings,
  Shield,
  Building,
  MapPin,
  Calculator,
  Leaf,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useOrganization } from "@/contexts/OrganizationContext";
import { NavLink } from "react-router-dom";

const veterinarioItems = [
  {
    title: "Dashboard",
    url: "/veterinario",
    icon: LayoutDashboard,
  },
  {
    title: "Animais",
    url: "/veterinario/animais",
    icon: Package,
  },
  {
    title: "Saúde",
    url: "/veterinario/saude",
    icon: Stethoscope,
  },
  {
    title: "Diagnóstico",
    url: "/diagnostico",
    icon: Camera,
  },
];

const empresaItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Propriedades",
    url: "/propriedades",
    icon: MapPin,
  },
  {
    title: "Produtos",
    url: "/produtos",
    icon: Package,
  },
  {
    title: "Empresa Avançado",
    url: "/empresa-advanced",
    icon: Building2,
  },
  {
    title: "Relatórios",
    url: "/relatorios",
    icon: BarChart3,
  },
  {
    title: "Simulador",
    url: "/simulador",
    icon: Calculator,
  },
  {
    title: "Sustentabilidade",
    url: "/sustentabilidade",
    icon: Leaf,
  },
  {
    title: "Configurações",
    url: "/configuracoes",
    icon: Settings,
  },
];

const adminItems = [
  {
    title: "Administração",
    url: "/admin",
    icon: Shield,
  },
  {
    title: "Super Admin",
    url: "/super-admin",
    icon: Building,
  },
];

export function AppSidebar() {
  const { currentOrg } = useOrganization();

  const getMenuItems = () => {
    if (!currentOrg) return [];
    
    switch (currentOrg.company_type) {
      case "veterinario":
        return veterinarioItems;
      case "empresa_alimento":
      case "empresa_medicamento":
      case "geral":
        return empresaItems;
      default:
        return empresaItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-tech-blue rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">VS</span>
          </div>
          <div>
            <h2 className="font-bold text-sm">VetSaaS Pro</h2>
            {currentOrg && (
              <p className="text-xs text-muted-foreground truncate">
                {currentOrg.name}
              </p>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-2 p-2 rounded-md transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {currentOrg?.company_type === "geral" && (
          <SidebarGroup>
            <SidebarGroupLabel>Administração</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          `flex items-center gap-2 p-2 rounded-md transition-colors ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="text-xs text-muted-foreground">
          © 2024 VetSaaS Pro
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}


import { Home, Camera, Package2, FlaskConical, Leaf, BarChart3, Settings, Shield, LogOut, Building2, Users, DollarSign } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCompany } from "@/contexts/CompanyContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/", icon: Home, roles: ["all"] },
  { title: "Diagnóstico Nutricional", url: "/diagnostico", icon: Camera, roles: ["veterinario", "super_admin"] },
  { title: "Produtos Empresas", url: "/produtos", icon: Package2, roles: ["company_admin", "super_admin"] },
  { title: "Simulador de Ração", url: "/simulador", icon: FlaskConical, roles: ["veterinario", "company_admin", "super_admin"] },
  { title: "Sustentabilidade", url: "/sustentabilidade", icon: Leaf, roles: ["company_admin", "super_admin"] },
  { title: "Relatórios", url: "/relatorios", icon: BarChart3, roles: ["all"] },
];

const areaItems = [
  { title: "Área Veterinário", url: "/veterinario", icon: Home, roles: ["veterinario"] },
  { title: "Área Empresa", url: "/empresa", icon: Building2, roles: ["company_admin"] },
  { title: "Super Admin", url: "/super-admin", icon: Shield, roles: ["super_admin"] },
];

const configItems = [
  { title: "Administrador", url: "/admin", icon: Shield, roles: ["company_admin", "super_admin"] },
  { title: "Configurações", url: "/configuracoes", icon: Settings, roles: ["all"] },
];

export function AppSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();
  const { getUserRole } = useCompany();
  const currentPath = location.pathname;

  const userRole = getUserRole();
  const isActive = (path: string) => currentPath === path;
  
  const getNavClass = (path: string) => 
    isActive(path) 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-accent/50 transition-smooth";

  const hasPermission = (roles: string[]) => {
    if (roles.includes("all")) return true;
    return userRole ? roles.includes(userRole) : false;
  };

  // Filtrar itens baseado na role do usuário
  const filteredMainItems = mainItems.filter(item => hasPermission(item.roles));
  const filteredAreaItems = areaItems.filter(item => hasPermission(item.roles));
  const filteredConfigItems = configItems.filter(item => hasPermission(item.roles));

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarContent>
        {/* Áreas Específicas */}
        {filteredAreaItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-muted-foreground font-medium">Minha Área</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredAreaItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={getNavClass(item.url)}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Itens Principais */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-medium">Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavClass(item.url)}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Sistema */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-medium">Sistema</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredConfigItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavClass(item.url)}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => signOut()}>
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

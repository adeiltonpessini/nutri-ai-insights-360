
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { NotificationToast } from "@/components/ui/notification-toast";
import { Button } from "@/components/ui/button";
import { useOrganization } from "@/contexts/OrganizationContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { OrganizationSelector } from "@/components/OrganizationSelector";
import { Sparkles } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { currentOrg, userProfile, isLoading } = useOrganization();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center justify-between px-6 border-b bg-gradient-to-r from-background to-muted/30 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 shadow-soft">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-xl bg-gradient-to-r from-primary to-sustainability bg-clip-text text-transparent">
                    InfinityVet
                  </h1>
                  <p className="text-xs text-muted-foreground -mt-1">Gestão inteligente</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate("/pricing")}>
                Planos
              </Button>
              <OrganizationSelector />
              <NotificationToast />
              <div className="text-sm text-muted-foreground">
                Bem-vindo, <span className="font-medium text-foreground">
                  {userProfile?.nome || user?.email}
                </span>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

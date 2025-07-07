import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { NotificationToast } from "@/components/ui/notification-toast";
import { CompanySelector } from "@/components/CompanySelector";
import { useCompany } from "@/contexts/CompanyContext";

export function Layout() {
  const { currentCompany, isLoading } = useCompany();

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
          <header className="h-14 flex items-center justify-between px-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">N</span>
                </div>
                <h1 className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
                  NutriScan360
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <CompanySelector />
              <NotificationToast />
              <div className="text-sm text-muted-foreground">
                Bem-vindo, <span className="font-medium text-foreground">Dr. João Silva</span>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
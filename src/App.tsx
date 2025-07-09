
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AuthProvider } from "@/contexts/AuthContext";
import { CompanyProvider } from "@/contexts/CompanyContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Diagnostico from "./pages/Diagnostico";
import CompanyProducts from "./pages/CompanyProducts";
import Sustentabilidade from "./pages/Sustentabilidade";
import Simulador from "./pages/Simulador";
import Auth from "./pages/Auth";
import Propriedades from "./pages/Propriedades";
import Relatorios from "./pages/Relatorios";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Pricing from "./pages/Pricing";
import VeterinarioArea from "./pages/VeterinarioArea";
import EmpresaArea from "./pages/EmpresaArea";
import SuperAdminArea from "./pages/SuperAdminArea";
import LandingPage from "./components/LandingPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CompanyProvider>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="diagnostico" element={<Diagnostico />} />
              <Route path="produtos" element={<CompanyProducts />} />
              <Route path="sustentabilidade" element={<Sustentabilidade />} />
              <Route path="propriedades" element={<Propriedades />} />
              <Route path="simulador" element={<Simulador />} />
              <Route path="relatorios" element={<Relatorios />} />
              <Route path="admin" element={<Admin />} />
              
              {/* Áreas específicas por tipo de usuário */}
              <Route path="veterinario" element={<VeterinarioArea />} />
              <Route path="empresa" element={<EmpresaArea />} />
              <Route path="super-admin" element={<SuperAdminArea />} />
              
              <Route path="configuracoes" element={<div className="p-6"><h1 className="text-2xl font-bold">Configurações</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div>} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </CompanyProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

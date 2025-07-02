import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import Diagnostico from "./pages/Diagnostico";
import Produtos from "./pages/Produtos";
import Sustentabilidade from "./pages/Sustentabilidade";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="diagnostico" element={<Diagnostico />} />
            <Route path="produtos" element={<Produtos />} />
            <Route path="sustentabilidade" element={<Sustentabilidade />} />
            <Route path="simulador" element={<div className="p-6"><h1 className="text-2xl font-bold">Simulador de Ração</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div>} />
            <Route path="relatorios" element={<div className="p-6"><h1 className="text-2xl font-bold">Relatórios</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div>} />
            <Route path="configuracoes" element={<div className="p-6"><h1 className="text-2xl font-bold">Configurações</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div>} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

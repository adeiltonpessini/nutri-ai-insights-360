
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { OrganizationProvider } from './contexts/OrganizationContext';
import LandingPage from './components/LandingPage';
import Auth from './pages/Auth';
import Pricing from './pages/Pricing';
import AcceptInvitation from './pages/AcceptInvitation';
import InfinityVetDashboard from './components/dashboards/InfinityVetDashboard';
import Propriedades from './pages/Propriedades';
import Produtos from './pages/Produtos';
import Configuracoes from './pages/Configuracoes';
import VeterinarioArea from './pages/VeterinarioArea';
import EmpresaArea from './pages/EmpresaArea';
import Simulador from './pages/Simulador';
import Diagnostico from './pages/Diagnostico';
import Sustentabilidade from './pages/Sustentabilidade';
import Relatorios from './pages/Relatorios';
import CompanyProducts from './pages/CompanyProducts';
import Admin from './pages/Admin';
import SuperAdminArea from './pages/SuperAdminArea';
import NotFound from './pages/NotFound';
import { Toaster } from "@/components/ui/toaster"
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnboardingModal } from './components/OnboardingModal';
import EmpresaAreaAdvanced from './pages/EmpresaAreaAdvanced';

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <AuthProvider>
        <OrganizationProvider>
          <QueryClientProvider client={queryClient}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/accept-invitation/:token" element={<AcceptInvitation />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout>
                    <InfinityVetDashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/propriedades" element={
                <ProtectedRoute>
                  <Layout>
                    <Propriedades />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/produtos" element={
                <ProtectedRoute>
                  <Layout>
                    <Produtos />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/configuracoes" element={
                <ProtectedRoute>
                  <Layout>
                    <Configuracoes />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/veterinario" element={
                <ProtectedRoute>
                  <Layout>
                    <VeterinarioArea />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/empresa-advanced" element={
                <ProtectedRoute>
                  <Layout>
                    <EmpresaAreaAdvanced />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/empresa" element={
                <ProtectedRoute>
                  <Layout>
                    <EmpresaArea />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/simulador" element={
                <ProtectedRoute>
                  <Layout>
                    <Simulador />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/diagnostico" element={
                <ProtectedRoute>
                  <Layout>
                    <Diagnostico />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/sustentabilidade" element={
                <ProtectedRoute>
                  <Layout>
                    <Sustentabilidade />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/relatorios" element={
                <ProtectedRoute>
                  <Layout>
                    <Relatorios />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/company-products" element={
                <ProtectedRoute>
                  <Layout>
                    <CompanyProducts />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Layout>
                    <Admin />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/super-admin" element={
                <ProtectedRoute>
                  <Layout>
                    <SuperAdminArea />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <OnboardingModal />
          </QueryClientProvider>
        </OrganizationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

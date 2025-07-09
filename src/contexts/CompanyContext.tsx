
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface Company {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  is_active: boolean;
}

interface UserRole {
  id: string;
  user_id: string;
  company_id: string;
  role: 'super_admin' | 'company_admin' | 'veterinario' | 'cliente' | 'tecnico';
  is_active: boolean;
}

interface CompanyContextType {
  currentCompany: Company | null;
  userRoles: UserRole[];
  companies: Company[];
  setCurrentCompany: (company: Company) => void;
  getUserRole: (companyId?: string) => string | null;
  isLoading: boolean;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      setCurrentCompany(null);
      setUserRoles([]);
      setCompanies([]);
      setIsLoading(false);
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Carregar roles do usuário
      const { data: roles } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (roles) {
        setUserRoles(roles);

        // Carregar empresas que o usuário tem acesso
        const companyIds = roles.map(role => role.company_id);
        if (companyIds.length > 0) {
          const { data: companiesData } = await supabase
            .from('companies')
            .select('*')
            .in('id', companyIds)
            .eq('is_active', true);

          if (companiesData) {
            setCompanies(companiesData);
            
            // Definir empresa atual (primeira encontrada ou a salva no localStorage)
            const savedCompanyId = localStorage.getItem('current_company_id');
            const savedCompany = companiesData.find(c => c.id === savedCompanyId);
            setCurrentCompany(savedCompany || companiesData[0]);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados da empresa:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetCurrentCompany = (company: Company) => {
    setCurrentCompany(company);
    localStorage.setItem('current_company_id', company.id);
  };

  const getUserRole = (companyId?: string) => {
    const targetCompanyId = companyId || currentCompany?.id;
    if (!targetCompanyId) return null;

    const role = userRoles.find(r => r.company_id === targetCompanyId);
    return role?.role || null;
  };

  const value = {
    currentCompany,
    userRoles,
    companies,
    setCurrentCompany: handleSetCurrentCompany,
    getUserRole,
    isLoading,
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany deve ser usado dentro de um CompanyProvider');
  }
  return context;
}

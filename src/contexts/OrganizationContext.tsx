
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

export type OrganizationType = 'veterinario' | 'empresa_alimento' | 'empresa_medicamento' | 'geral';
export type OrganizationPlan = 'basico' | 'profissional' | 'enterprise';
export type UserRoleType = 'super_admin' | 'company_admin' | 'veterinario' | 'cliente' | 'tecnico';

interface Organization {
  id: string;
  name: string;
  company_type: OrganizationType | null;
  subscription_plan: OrganizationPlan | null;
  max_animals: number | null;
  max_users: number | null;
  max_products: number | null;
  created_at: string;
  updated_at: string;
}

interface UserProfile {
  id: string;
  user_id: string;
  nome: string;
  empresa: string | null;
  avatar_url: string | null;
  company_id: string | null;
}

interface UserRoleData {
  user_id: string;
  company_id: string | null;
  role: UserRoleType;
  is_active: boolean | null;
}

interface OrganizationContextType {
  currentOrg: Organization | null;
  userProfile: UserProfile | null;
  userRole: UserRoleData | null;
  organizations: Organization[];
  setCurrentOrg: (org: Organization) => void;
  isLoading: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isVet: boolean;
  canManageAnimals: boolean;
  canManageProducts: boolean;
  canManageUsers: boolean;
  refreshData: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<UserRoleData | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      setCurrentOrg(null);
      setUserProfile(null);
      setOrganizations([]);
      setIsLoading(false);
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Carregar perfil do usuário
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        setUserProfile(profile);

        // Carregar role do usuário
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single();

        if (roleData) {
          setUserRole(roleData);

          // Se é super admin, carregar todas as empresas
          if (roleData.role === 'super_admin') {
            const { data: allOrgs } = await supabase
              .from('companies')
              .select('*')
              .order('created_at', { ascending: false });

            if (allOrgs) {
              setOrganizations(allOrgs);
              
              // Definir org atual (salva no localStorage ou primeira encontrada)
              const savedOrgId = localStorage.getItem('current_org_id');
              const savedOrg = allOrgs.find(o => o.id === savedOrgId);
              setCurrentOrg(savedOrg || allOrgs[0]);
            }
          } else if (profile.company_id) {
            // Carregar apenas a empresa do usuário
            const { data: userOrg } = await supabase
              .from('companies')
              .select('*')
              .eq('id', profile.company_id)
              .single();

            if (userOrg) {
              setCurrentOrg(userOrg);
              setOrganizations([userOrg]);
            }
          }
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados da organização:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetCurrentOrg = (org: Organization) => {
    setCurrentOrg(org);
    localStorage.setItem('current_org_id', org.id);
  };

  const refreshData = async () => {
    await loadUserData();
  };

  // Computed properties
  const isSuperAdmin = userRole?.role === 'super_admin';
  const isAdmin = userRole?.role === 'company_admin' || isSuperAdmin;
  const isVet = userRole?.role === 'veterinario' || isAdmin;
  const canManageAnimals = isVet || userRole?.role === 'cliente';
  const canManageProducts = userRole?.role === 'company_admin' || isAdmin;
  const canManageUsers = isAdmin;

  const value = {
    currentOrg,
    userProfile,
    userRole,
    organizations,
    setCurrentOrg: handleSetCurrentOrg,
    isLoading,
    isSuperAdmin,
    isAdmin,
    isVet,
    canManageAnimals,
    canManageProducts,
    canManageUsers,
    refreshData,
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization deve ser usado dentro de um OrganizationProvider');
  }
  return context;
}

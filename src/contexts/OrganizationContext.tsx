
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

export type OrganizationType = 'vet' | 'empresa' | 'fazenda';
export type OrganizationPlan = 'free' | 'pro' | 'enterprise';
export type UserRole = 'admin' | 'vet' | 'colaborador' | 'empresa_admin' | 'fazendeiro' | 'super_admin';

interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  plan: OrganizationPlan;
  limite_animais: number;
  limite_funcionarios: number;
  limite_produtos: number;
  created_at: string;
  updated_at: string;
}

interface UserProfile {
  id: string;
  user_id: string;
  org_id: string | null;
  role: UserRole;
  nome: string;
  email: string;
  avatar_url: string | null;
}

interface OrganizationContextType {
  currentOrg: Organization | null;
  userProfile: UserProfile | null;
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
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        setUserProfile(profile);

        // Se é super admin, carregar todas as organizações
        if (profile.role === 'super_admin') {
          const { data: allOrgs } = await supabase
            .from('organizations')
            .select('*')
            .order('created_at', { ascending: false });

          if (allOrgs) {
            setOrganizations(allOrgs);
            
            // Definir org atual (salva no localStorage ou primeira encontrada)
            const savedOrgId = localStorage.getItem('current_org_id');
            const savedOrg = allOrgs.find(o => o.id === savedOrgId);
            setCurrentOrg(savedOrg || allOrgs[0]);
          }
        } else if (profile.org_id) {
          // Carregar apenas a organização do usuário
          const { data: userOrg } = await supabase
            .from('organizations')
            .select('*')
            .eq('id', profile.org_id)
            .single();

          if (userOrg) {
            setCurrentOrg(userOrg);
            setOrganizations([userOrg]);
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
  const isSuperAdmin = userProfile?.role === 'super_admin';
  const isAdmin = userProfile?.role === 'admin' || isSuperAdmin;
  const isVet = userProfile?.role === 'vet' || isAdmin;
  const canManageAnimals = isVet || userProfile?.role === 'fazendeiro';
  const canManageProducts = userProfile?.role === 'empresa_admin' || isAdmin;
  const canManageUsers = isAdmin;

  const value = {
    currentOrg,
    userProfile,
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

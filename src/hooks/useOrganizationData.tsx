
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useOrganization } from '@/contexts/OrganizationContext';

interface DashboardStats {
  totalAnimals: number;
  totalProducts: number;
  totalEmployees: number;
  monthlyRevenue: number;
  recentActivity: any[];
  alerts: any[];
}

interface VetStats extends DashboardStats {
  totalDiagnostics: number;
  totalPrescriptions: number;
  lowStockItems: number;
}

interface CompanyStats extends DashboardStats {
  totalIndications: number;
  topVeterinarians: any[];
  topProducts: any[];
}

interface FarmStats extends DashboardStats {
  totalLots: number;
  totalVaccinations: number;
  avgWeight: number;
  mortalityRate: number;
}

export function useOrganizationData() {
  const { currentOrg, userProfile } = useOrganization();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<VetStats | CompanyStats | FarmStats | null>(null);

  useEffect(() => {
    if (currentOrg && userProfile) {
      loadData();
    }
  }, [currentOrg, userProfile]);

  const loadData = async () => {
    if (!currentOrg) return;

    try {
      setLoading(true);

      switch (currentOrg.type) {
        case 'vet':
          await loadVetData();
          break;
        case 'empresa':
          await loadCompanyData();
          break;
        case 'fazenda':
          await loadFarmData();
          break;
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadVetData = async () => {
    const [
      animalsRes,
      diagnosticsRes,
      prescriptionsRes,
      productsRes,
      stockRes,
      employeesRes
    ] = await Promise.all([
      supabase.from('animais').select('id').eq('org_id', currentOrg!.id),
      supabase.from('diagnosticos').select('id').eq('org_id', currentOrg!.id),
      supabase.from('receitas').select('id').eq('org_id', currentOrg!.id),
      supabase.from('produtos').select('id').eq('org_id', currentOrg!.id).eq('ativo', true),
      supabase.from('estoque_clinica').select('*').eq('org_id', currentOrg!.id),
      supabase.from('user_profiles').select('id').eq('org_id', currentOrg!.id)
    ]);

    const lowStockItems = stockRes.data?.filter(item => 
      item.quantidade <= item.alerta_minimo
    ).length || 0;

    setStats({
      totalAnimals: animalsRes.data?.length || 0,
      totalDiagnostics: diagnosticsRes.data?.length || 0,
      totalPrescriptions: prescriptionsRes.data?.length || 0,
      totalProducts: productsRes.data?.length || 0,
      totalEmployees: employeesRes.data?.length || 0,
      lowStockItems,
      monthlyRevenue: 0, // Implementar cálculo específico
      recentActivity: [],
      alerts: lowStockItems > 0 ? [{
        type: 'warning',
        message: `${lowStockItems} itens com estoque baixo`
      }] : []
    } as VetStats);
  };

  const loadCompanyData = async () => {
    const [
      productsRes,
      indicationsRes,
      employeesRes
    ] = await Promise.all([
      supabase.from('produtos').select('id').eq('org_id', currentOrg!.id).eq('ativo', true),
      supabase.from('indicacoes_produto').select('*').eq('org_id', currentOrg!.id),
      supabase.from('user_profiles').select('id').eq('org_id', currentOrg!.id)
    ]);

    setStats({
      totalAnimals: 0,
      totalProducts: productsRes.data?.length || 0,
      totalEmployees: employeesRes.data?.length || 0,
      totalIndications: indicationsRes.data?.length || 0,
      monthlyRevenue: 0, // Implementar cálculo específico
      topVeterinarians: [],
      topProducts: [],
      recentActivity: [],
      alerts: []
    } as CompanyStats);
  };

  const loadFarmData = async () => {
    const [
      lotsRes,
      animalsRes,
      vaccinationsRes,
      employeesRes,
      eventsRes
    ] = await Promise.all([
      supabase.from('lotes').select('id').eq('org_id', currentOrg!.id),
      supabase.from('animais_fazenda').select('peso').eq('org_id', currentOrg!.id),
      supabase.from('vacinacoes').select('id').eq('org_id', currentOrg!.id),
      supabase.from('user_profiles').select('id').eq('org_id', currentOrg!.id),
      supabase.from('eventos_zootecnicos').select('*').eq('org_id', currentOrg!.id).order('created_at', { ascending: false }).limit(10)
    ]);

    const avgWeight = animalsRes.data?.reduce((sum, animal) => 
      sum + (animal.peso || 0), 0
    ) / (animalsRes.data?.length || 1) || 0;

    setStats({
      totalAnimals: animalsRes.data?.length || 0,
      totalLots: lotsRes.data?.length || 0,
      totalVaccinations: vaccinationsRes.data?.length || 0,
      totalProducts: 0,
      totalEmployees: employeesRes.data?.length || 0,
      avgWeight,
      mortalityRate: 0, // Implementar cálculo específico
      monthlyRevenue: 0,
      recentActivity: eventsRes.data || [],
      alerts: []
    } as FarmStats);
  };

  return {
    loading,
    stats,
    refreshData: loadData
  };
}

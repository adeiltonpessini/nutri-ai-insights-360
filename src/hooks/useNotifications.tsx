
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/contexts/CompanyContext';
import { useAuth } from '@/contexts/AuthContext';

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'performance' | 'alert';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: any;
  action?: {
    label: string;
    href: string;
  };
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentCompany } = useCompany();
  const { user } = useAuth();

  const generateNotifications = async () => {
    if (!currentCompany || !user) return;

    const newNotifications: Notification[] = [];

    try {
      // Verificar animais com problemas de conversão alimentar
      const { data: performanceData } = await supabase
        .from('performance_historico')
        .select('*, lotes(nome)')
        .eq('company_id', currentCompany.id)
        .gte('data_medicao', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('data_medicao', { ascending: false });

      if (performanceData) {
        const poorPerformance = performanceData.filter(p => 
          p.conversao_alimentar && p.conversao_alimentar > 3.5
        );

        poorPerformance.slice(0, 2).forEach(p => {
          newNotifications.push({
            id: `performance-${p.id}`,
            type: 'warning',
            title: 'Conversão alimentar em alerta',
            message: `Lote ${p.lotes?.nome} apresentou conversão de ${p.conversao_alimentar?.toFixed(2)}`,
            timestamp: new Date(p.data_medicao),
            read: false,
            action: {
              label: 'Ver detalhes',
              href: '/propriedades'
            }
          });
        });
      }

      // Verificar formulações recentes
      const { data: formulacoes } = await supabase
        .from('formulacoes')
        .select('*')
        .eq('company_id', currentCompany.id)
        .eq('is_favorita', true)
        .order('created_at', { ascending: false })
        .limit(2);

      if (formulacoes && formulacoes.length > 0) {
        formulacoes.forEach(f => {
          newNotifications.push({
            id: `formula-${f.id}`,
            type: 'success',
            title: 'Nova formulação otimizada',
            message: `Formulação ${f.nome} para ${f.especie} aprovada`,
            timestamp: new Date(f.created_at),
            read: false,
            action: {
              label: 'Ver formulação',
              href: '/simulador'
            }
          });
        });
      }

      // Verificar diagnósticos recentes
      const { data: diagnosticos } = await supabase
        .from('diagnosticos')
        .select('*')
        .eq('company_id', currentCompany.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (diagnosticos && diagnosticos.length > 0) {
        const recentDiagnostics = diagnosticos.filter(d => 
          new Date(d.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
        );

        recentDiagnostics.forEach(d => {
          newNotifications.push({
            id: `diagnostic-${d.id}`,
            type: 'info',
            title: 'Novo diagnóstico disponível',
            message: `Diagnóstico ${d.tipo_diagnostico} processado com sucesso`,
            timestamp: new Date(d.created_at),
            read: false,
            action: {
              label: 'Ver diagnóstico',
              href: '/diagnostico'
            }
          });
        });
      }

      // Verificar sustentabilidade
      const { data: sustainability } = await supabase
        .from('sustentabilidade')
        .select('*')
        .eq('company_id', currentCompany.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (sustainability && sustainability.length > 0) {
        const latest = sustainability[0];
        if (latest.fcr && latest.fcr < 2.0) {
          newNotifications.push({
            id: `sustainability-${latest.id}`,
            type: 'performance',
            title: 'Meta de eficiência atingida',
            message: `FCR de ${latest.fcr.toFixed(2)} alcançado - Excelente resultado!`,
            timestamp: new Date(latest.created_at || ''),
            read: false,
            action: {
              label: 'Ver relatório',
              href: '/sustentabilidade'
            }
          });
        }
      }

      // Ordenar por timestamp
      newNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      setNotifications(newNotifications.slice(0, 10));
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  useEffect(() => {
    if (currentCompany && user) {
      generateNotifications();
      
      // Atualizar notificações a cada 5 minutos
      const interval = setInterval(generateNotifications, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [currentCompany, user]);

  return {
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
    removeNotification,
    refreshNotifications: generateNotifications
  };
}


import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UserSubscription } from '@/types/subscription';

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSubscription();
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [user]);

  const loadSubscription = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (error) {
        console.error('Error loading subscription:', error);
        setSubscription(null);
        return;
      }

      // Cast the data to UserSubscription type to ensure status compatibility
      setSubscription(data as UserSubscription);
    } catch (error) {
      console.error('Error loading subscription:', error);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshSubscription = () => {
    loadSubscription();
  };

  const hasFeature = (feature: string): boolean => {
    if (!subscription) return false;
    
    // Define features by plan
    const planFeatures = {
      starter: ['basic_reports', 'animal_management', 'basic_diagnostics'],
      professional: ['basic_reports', 'animal_management', 'basic_diagnostics', 'ai_diagnostics', 'advanced_reports', 'financial_management'],
      enterprise: ['basic_reports', 'animal_management', 'basic_diagnostics', 'ai_diagnostics', 'advanced_reports', 'financial_management', 'api_access', 'custom_integrations']
    };

    return planFeatures[subscription.plan_id as keyof typeof planFeatures]?.includes(feature) || false;
  };

  const isWithinLimits = (type: 'animals' | 'users' | 'properties', current: number): boolean => {
    if (!subscription) return false;

    const limits = {
      starter: { animals: 100, users: 2, properties: 1 },
      professional: { animals: 500, users: 5, properties: 3 },
      enterprise: { animals: -1, users: 20, properties: 10 } // -1 = unlimited
    };

    const limit = limits[subscription.plan_id as keyof typeof limits]?.[type];
    return limit === -1 || current < limit;
  };

  return {
    subscription,
    loading,
    refreshSubscription,
    hasFeature,
    isWithinLimits,
    isActive: subscription?.status === 'active',
    plan: subscription?.plan_id || 'free'
  };
}

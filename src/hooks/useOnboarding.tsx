
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  component?: React.ComponentType;
}

export function useOnboarding() {
  const { user } = useAuth();
  const [onboarding, setOnboarding] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Bem-vindo ao VetSaaS Pro',
      description: 'Vamos configurar sua conta em alguns passos simples',
      completed: false
    },
    {
      id: 'profile',
      title: 'Complete seu perfil',
      description: 'Adicione informações básicas sobre você e sua empresa',
      completed: false
    },
    {
      id: 'company',
      title: 'Configurar empresa',
      description: 'Configure os dados da sua empresa veterinária',
      completed: false
    },
    {
      id: 'team',
      title: 'Convidar equipe',
      description: 'Convide outros membros para colaborar',
      completed: false
    },
    {
      id: 'subscription',
      title: 'Escolher plano',
      description: 'Selecione o plano ideal para suas necessidades',
      completed: false
    }
  ];

  useEffect(() => {
    if (user) {
      loadOnboarding();
    }
  }, [user]);

  const loadOnboarding = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_onboarding')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading onboarding:', error);
        return;
      }

      setOnboarding(data);
    } catch (error) {
      console.error('Error loading onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeStep = async (stepId: string) => {
    if (!user || !onboarding) return;

    const updatedSteps = [...(onboarding.completed_steps || [])];
    if (!updatedSteps.includes(stepId)) {
      updatedSteps.push(stepId);
    }

    const nextStepIndex = steps.findIndex(step => step.id === stepId) + 1;
    const nextStep = steps[nextStepIndex]?.id || 'completed';
    const isCompleted = nextStep === 'completed';

    try {
      const { error } = await supabase
        .from('user_onboarding')
        .update({
          completed_steps: updatedSteps,
          current_step: nextStep,
          completed: isCompleted,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      await loadOnboarding();
    } catch (error) {
      console.error('Error completing step:', error);
    }
  };

  const getStepsWithCompletion = () => {
    if (!onboarding) return steps;

    return steps.map(step => ({
      ...step,
      completed: onboarding.completed_steps?.includes(step.id) || false
    }));
  };

  const getCurrentStep = () => {
    return onboarding?.current_step || 'welcome';
  };

  const isOnboardingComplete = () => {
    return onboarding?.completed || false;
  };

  const resetOnboarding = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_onboarding')
        .update({
          completed_steps: [],
          current_step: 'welcome',
          completed: false,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;
      await loadOnboarding();
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  };

  return {
    onboarding,
    loading,
    steps: getStepsWithCompletion(),
    currentStep: getCurrentStep(),
    isComplete: isOnboardingComplete(),
    completeStep,
    resetOnboarding,
    refreshOnboarding: loadOnboarding
  };
}

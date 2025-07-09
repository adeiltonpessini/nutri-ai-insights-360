
import { useState } from 'react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, ArrowRight, ArrowLeft } from 'lucide-react';
import { OnboardingWelcome } from './onboarding/OnboardingWelcome';
import { OnboardingProfile } from './onboarding/OnboardingProfile';
import { OnboardingCompany } from './onboarding/OnboardingCompany';
import { OnboardingTeam } from './onboarding/OnboardingTeam';
import { OnboardingSubscription } from './onboarding/OnboardingSubscription';

export function OnboardingModal() {
  const { steps, currentStep, isComplete, completeStep } = useOnboarding();
  const [isOpen, setIsOpen] = useState(!isComplete);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const currentStepData = steps.find(step => step.id === currentStep);
  const progressPercentage = (steps.filter(step => step.completed).length / steps.length) * 100;

  const handleNext = async () => {
    const currentStepId = steps[activeStepIndex].id;
    await completeStep(currentStepId);
    
    if (activeStepIndex < steps.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
    } else {
      setIsOpen(false);
    }
  };

  const handlePrevious = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(activeStepIndex - 1);
    }
  };

  const handleSkipOnboarding = () => {
    setIsOpen(false);
  };

  const renderStepContent = () => {
    const stepId = steps[activeStepIndex]?.id;
    
    switch (stepId) {
      case 'welcome':
        return <OnboardingWelcome onNext={handleNext} />;
      case 'profile':
        return <OnboardingProfile onNext={handleNext} />;
      case 'company':
        return <OnboardingCompany onNext={handleNext} />;
      case 'team':
        return <OnboardingTeam onNext={handleNext} />;
      case 'subscription':
        return <OnboardingSubscription onNext={handleNext} />;
      default:
        return <OnboardingWelcome onNext={handleNext} />;
    }
  };

  if (isComplete || !isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            Configuração Inicial - VetSaaS Pro
          </DialogTitle>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              Progresso do Setup
            </span>
            <span className="text-sm font-medium">
              {Math.round(progressPercentage)}% concluído
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Steps Navigation */}
        <div className="flex justify-between mb-6 px-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col items-center cursor-pointer transition-all ${
                index === activeStepIndex ? 'text-primary' : 'text-muted-foreground'
              }`}
              onClick={() => setActiveStepIndex(index)}
            >
              {step.completed ? (
                <CheckCircle className="w-8 h-8 text-green-500 mb-1" />
              ) : (
                <Circle className={`w-8 h-8 mb-1 ${
                  index === activeStepIndex ? 'text-primary' : 'text-muted-foreground'
                }`} />
              )}
              <span className="text-xs text-center max-w-16 leading-tight">
                {step.title}
              </span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[400px] mb-6">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handleSkipOnboarding}
            className="text-muted-foreground"
          >
            Pular configuração
          </Button>

          <div className="flex gap-2">
            {activeStepIndex > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
            )}
            
            <Button onClick={handleNext}>
              {activeStepIndex === steps.length - 1 ? 'Finalizar' : 'Próximo'}
              {activeStepIndex !== steps.length - 1 && (
                <ArrowRight className="w-4 h-4 ml-2" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

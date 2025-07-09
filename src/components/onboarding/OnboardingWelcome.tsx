
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, BarChart3, Zap } from 'lucide-react';

interface OnboardingWelcomeProps {
  onNext: () => void;
}

export function OnboardingWelcome({ onNext }: OnboardingWelcomeProps) {
  const features = [
    {
      icon: Shield,
      title: 'Gestão Veterinária Completa',
      description: 'Acompanhe animais, propriedades e diagnósticos em um só lugar'
    },
    {
      icon: Users,
      title: 'Colaboração em Equipe',
      description: 'Convide veterinários e técnicos para trabalhar juntos'
    },
    {
      icon: BarChart3,
      title: 'Relatórios Inteligentes',
      description: 'Insights baseados em dados para melhores decisões'
    },
    {
      icon: Zap,
      title: 'IA Avançada',
      description: 'Diagnósticos assistidos por inteligência artificial'
    }
  ];

  return (
    <div className="text-center space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Bem-vindo ao VetSaaS Pro!</h2>
        <p className="text-lg text-muted-foreground">
          A plataforma mais avançada para gestão veterinária
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
        {features.map((feature, index) => (
          <Card key={index} className="border border-border/50">
            <CardHeader className="text-center pb-2">
              <feature.icon className="w-8 h-8 mx-auto text-primary mb-2" />
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-gradient-to-r from-primary/10 to-tech-blue/10 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-2">Vamos começar?</h3>
        <p className="text-muted-foreground mb-4">
          Em apenas alguns passos, você terá sua conta configurada e pronta para uso.
          O processo leva menos de 5 minutos!
        </p>
        <Button onClick={onNext} className="bg-gradient-to-r from-primary to-tech-blue">
          Iniciar Configuração
        </Button>
      </div>
    </div>
  );
}

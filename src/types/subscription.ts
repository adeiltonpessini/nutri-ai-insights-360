
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  maxAnimals: number;
  maxUsers: number;
  maxProperties: number;
  stripePriceId: string;
  popular?: boolean;
  color: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  status: 'active' | 'inactive' | 'canceled' | 'past_due' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  trial_end?: string;
  created_at: string;
  updated_at: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Ideal para pequenas propriedades',
    price: 49.90,
    interval: 'month',
    stripePriceId: 'price_starter_monthly',
    maxAnimals: 100,
    maxUsers: 2,
    maxProperties: 1,
    color: 'from-blue-500 to-blue-600',
    features: [
      'Até 100 animais',
      'Até 2 usuários',
      '1 propriedade',
      'Diagnóstico básico',
      'Relatórios essenciais',
      'Suporte por email'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Para propriedades em crescimento',
    price: 99.90,
    interval: 'month',
    stripePriceId: 'price_professional_monthly',
    maxAnimals: 500,
    maxUsers: 5,
    maxProperties: 3,
    popular: true,
    color: 'from-purple-500 to-purple-600',
    features: [
      'Até 500 animais',
      'Até 5 usuários',
      '3 propriedades',
      'IA para diagnóstico',
      'Relatórios avançados',
      'Dashboard analytics',
      'Gestão financeira',
      'Alertas inteligentes',
      'Suporte prioritário'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Para grandes operações',
    price: 199.90,
    interval: 'month',
    stripePriceId: 'price_enterprise_monthly',
    maxAnimals: -1, // Ilimitado
    maxUsers: 20,
    maxProperties: 10,
    color: 'from-green-500 to-green-600',
    features: [
      'Animais ilimitados',
      'Até 20 usuários',
      '10 propriedades',
      'IA avançada',
      'Relatórios personalizados',
      'API completa',
      'Integrações avançadas',
      'Backup automático',
      'Suporte 24/7',
      'Treinamento incluso'
    ]
  }
];

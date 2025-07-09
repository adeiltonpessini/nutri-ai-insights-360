
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import { SUBSCRIPTION_PLANS, SubscriptionPlan } from "@/types/subscription";
import { cn } from "@/lib/utils";

interface SubscriptionPlansProps {
  currentPlan?: string;
  onSelectPlan: (plan: SubscriptionPlan) => void;
  loading?: boolean;
}

export function SubscriptionPlans({ currentPlan, onSelectPlan, loading }: SubscriptionPlansProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {SUBSCRIPTION_PLANS.map((plan) => (
        <Card 
          key={plan.id} 
          className={cn(
            "relative transition-all duration-300 hover:shadow-lg",
            plan.popular && "border-2 border-purple-500 shadow-lg scale-105",
            currentPlan === plan.id && "ring-2 ring-green-500"
          )}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-purple-500 text-white px-3 py-1">
                <Star className="w-3 h-3 mr-1" />
                Mais Popular
              </Badge>
            </div>
          )}
          
          <CardHeader className="text-center pb-4">
            <div className={cn("w-16 h-16 mx-auto rounded-full bg-gradient-to-r flex items-center justify-center text-white text-2xl font-bold mb-4", plan.color)}>
              {plan.name.charAt(0)}
            </div>
            <CardTitle className="text-2xl">{plan.name}</CardTitle>
            <CardDescription className="text-gray-600">{plan.description}</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">R$ {plan.price.toFixed(2)}</span>
              <span className="text-gray-600">/{plan.interval === 'month' ? 'mês' : 'ano'}</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Button 
              onClick={() => onSelectPlan(plan)}
              disabled={loading || currentPlan === plan.id}
              className={cn(
                "w-full mt-6",
                plan.popular && "bg-purple-600 hover:bg-purple-700",
                currentPlan === plan.id && "bg-green-600 hover:bg-green-700"
              )}
            >
              {loading ? (
                "Processando..."
              ) : currentPlan === plan.id ? (
                "Plano Atual"
              ) : (
                "Escolher Plano"
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

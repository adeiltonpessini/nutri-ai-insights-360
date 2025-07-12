import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Sparkles, 
  Building2, 
  Stethoscope, 
  Tractor,
  Leaf,
  ArrowRight,
  Check
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const organizationTypes = [
  {
    type: 'veterinario',
    title: 'Clínica Veterinária',
    subtitle: 'Gestão completa de animais e pacientes',
    description: 'Prontuário eletrônico, diagnósticos com IA, receitas digitais',
    icon: Stethoscope,
    color: 'border-primary bg-primary/5',
    features: ['Prontuário Eletrônico', 'Diagnósticos com IA', 'Receitas Digitais', 'Gestão de Clientes']
  },
  {
    type: 'empresa_medicamento',
    title: 'Empresa de Medicamentos',
    subtitle: 'Catálogo e análise de produtos veterinários',
    description: 'Gerencie produtos e acompanhe indicações por veterinários',
    icon: Building2,
    color: 'border-sustainability bg-sustainability/5',
    features: ['Catálogo Digital', 'Analytics de Performance', 'Relatórios de Vendas', 'Integração com Vets']
  },
  {
    type: 'empresa_alimento',
    title: 'Empresa de Alimentos',
    subtitle: 'Nutrição animal e sustentabilidade',
    description: 'Simulador de ração, análise nutricional e relatórios ESG',
    icon: Leaf,
    color: 'border-accent bg-accent/5',
    features: ['Simulador de Ração', 'Análise Nutricional', 'Relatórios ESG', 'Marketplace']
  },
  {
    type: 'geral',
    title: 'Fazenda/Agropecuária',
    subtitle: 'Gestão completa do rebanho',
    description: 'Controle de lotes, vacinação e eventos zootécnicos',
    icon: Tractor,
    color: 'border-warning bg-warning/5',
    features: ['Gestão de Lotes', 'Cartão de Vacinação', 'Eventos Zootécnicos', 'Relatórios MAPA']
  }
];

interface OnboardingData {
  organizationName: string;
  organizationType: string;
  description: string;
}

export default function OnboardingWelcome() {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState('');
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    organizationName: '',
    organizationType: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setOnboardingData({ ...onboardingData, organizationType: type });
  };

  const handleCreateOrganization = async () => {
    if (!user || !onboardingData.organizationName || !onboardingData.organizationType) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      // Create organization
      const { data: org, error: orgError } = await supabase
        .from('companies')
        .insert({
          name: onboardingData.organizationName,
          slug: onboardingData.organizationName.toLowerCase().replace(/\s+/g, '-'),
          company_type: onboardingData.organizationType as any,
          description: onboardingData.description || null,
          subscription_plan: 'basico'
        })
        .select()
        .single();

      if (orgError) throw orgError;

      // Update user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          company_id: org.id
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Create user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          company_id: org.id,
          role: 'company_admin'
        });

      if (roleError) throw roleError;

      toast({
        title: 'Organização criada!',
        description: 'Bem-vindo ao InfinityVet',
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error creating organization:', error);
      toast({
        title: 'Erro ao criar organização',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-sustainability/5 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center shadow-glow mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-sustainability bg-clip-text text-transparent mb-4">
            Bem-vindo ao InfinityVet
          </h1>
          <p className="text-muted-foreground text-lg mb-2">
            Gestão inteligente, sustentável e sem limites
          </p>
          <Badge className="bg-gradient-primary text-white border-0">
            Configuração Inicial
          </Badge>
        </div>

        {step === 1 && (
          <Card className="shadow-strong bg-gradient-card border-border/50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Qual é o seu tipo de negócio?</CardTitle>
              <p className="text-muted-foreground">
                Escolha o tipo que melhor descreve sua organização
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {organizationTypes.map((org) => {
                  const IconComponent = org.icon;
                  const isSelected = selectedType === org.type;
                  
                  return (
                    <Card 
                      key={org.type}
                      className={`cursor-pointer transition-all hover:shadow-medium ${org.color} ${
                        isSelected ? 'ring-2 ring-primary shadow-glow' : ''
                      }`}
                      onClick={() => handleTypeSelect(org.type)}
                    >
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-gradient-primary' : 'bg-muted'
                          }`}>
                            <IconComponent className={`w-6 h-6 ${
                              isSelected ? 'text-white' : 'text-muted-foreground'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg">{org.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">{org.subtitle}</p>
                          </div>
                          {isSelected && (
                            <Check className="w-6 h-6 text-primary" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{org.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {org.features.map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={() => setStep(2)}
                  disabled={!selectedType}
                  className="bg-gradient-primary hover:shadow-glow"
                  size="lg"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="shadow-strong bg-gradient-card border-border/50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Configure sua organização</CardTitle>
              <p className="text-muted-foreground">
                Vamos criar sua organização no InfinityVet
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="orgName">Nome da Organização *</Label>
                <Input
                  id="orgName"
                  placeholder="Ex: Clínica Veterinária São Francisco"
                  value={onboardingData.organizationName}
                  onChange={(e) => setOnboardingData({ 
                    ...onboardingData, 
                    organizationName: e.target.value 
                  })}
                  className="focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva um pouco sobre sua organização..."
                  value={onboardingData.description}
                  onChange={(e) => setOnboardingData({ 
                    ...onboardingData, 
                    description: e.target.value 
                  })}
                  className="focus:ring-2 focus:ring-primary/20"
                  rows={3}
                />
              </div>

              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Tipo Selecionado:</h4>
                <div className="flex items-center gap-3">
                  {organizationTypes.find(org => org.type === selectedType) && (
                    <>
                      <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                        {(() => {
                          const selectedOrg = organizationTypes.find(org => org.type === selectedType);
                          const IconComponent = selectedOrg?.icon;
                          return IconComponent ? <IconComponent className="w-5 h-5 text-white" /> : null;
                        })()}
                      </div>
                      <span className="font-medium">
                        {organizationTypes.find(org => org.type === selectedType)?.title}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Voltar
                </Button>
                <Button 
                  onClick={handleCreateOrganization}
                  disabled={loading || !onboardingData.organizationName}
                  className="flex-1 bg-gradient-sustainability hover:shadow-glow"
                >
                  {loading ? 'Criando...' : 'Criar Organização'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
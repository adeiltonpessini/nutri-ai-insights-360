
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OnboardingProfileProps {
  onNext: () => void;
}

export function OnboardingProfile({ onNext }: OnboardingProfileProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    empresa: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);

      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          nome: formData.nome,
          telefone: formData.telefone,
          empresa: formData.empresa,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso."
      });

      onNext();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Complete seu perfil</h2>
        <p className="text-muted-foreground">
          Adicione algumas informações básicas sobre você
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações pessoais</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa/Clínica</Label>
              <Input
                id="empresa"
                value={formData.empresa}
                onChange={(e) => setFormData({...formData, empresa: e.target.value})}
                placeholder="Nome da sua empresa ou clínica"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading || !formData.nome}>
              {loading ? 'Salvando...' : 'Salvar e Continuar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

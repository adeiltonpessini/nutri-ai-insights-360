
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OnboardingCompanyProps {
  onNext: () => void;
}

export function OnboardingCompany({ onNext }: OnboardingCompanyProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    company_type: 'veterinario' as const,
    description: '',
    website: '',
    phone: '',
    address: ''
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);

      // Check if slug is unique
      const { data: existingCompany } = await supabase
        .from('companies')
        .select('id')
        .eq('slug', formData.slug)
        .single();

      if (existingCompany) {
        toast({
          title: "Erro",
          description: "Este nome já está em uso. Tente um nome diferente.",
          variant: "destructive"
        });
        return;
      }

      // Create company
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({
          ...formData,
          subscription_plan: 'basico'
        })
        .select()
        .single();

      if (companyError) throw companyError;

      // Add user as company admin
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          company_id: company.id,
          role: 'company_admin'
        });

      if (roleError) throw roleError;

      // Update user profile with company
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          company_id: company.id,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      toast({
        title: "Empresa criada!",
        description: "Sua empresa foi configurada com sucesso."
      });

      onNext();
    } catch (error) {
      console.error('Error creating company:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a empresa. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Configure sua empresa</h2>
        <p className="text-muted-foreground">
          Crie o perfil da sua empresa veterinária
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados da empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da empresa *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Clínica Veterinária ABC"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL da empresa</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  placeholder="clinica-abc"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Será usado na URL: vetsaas.com/{formData.slug}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_type">Tipo de empresa</Label>
              <Select 
                value={formData.company_type} 
                onValueChange={(value) => setFormData({...formData, company_type: value as any})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="veterinario">Clínica/Hospital Veterinário</SelectItem>
                  <SelectItem value="empresa_alimento">Empresa de Alimentos</SelectItem>
                  <SelectItem value="empresa_medicamento">Empresa de Medicamentos</SelectItem>
                  <SelectItem value="geral">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descreva sua empresa..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="(11) 3333-4444"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  placeholder="https://www.exemplo.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Rua Example, 123 - São Paulo, SP"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading || !formData.name || !formData.slug}>
              {loading ? 'Criando empresa...' : 'Criar Empresa'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

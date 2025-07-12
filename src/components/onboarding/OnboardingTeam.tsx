
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useOrganization } from '@/contexts/OrganizationContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Mail, Plus, X } from 'lucide-react';

interface OnboardingTeamProps {
  onNext: () => void;
}

export function OnboardingTeam({ onNext }: OnboardingTeamProps) {
  const { user } = useAuth();
  const { currentOrg } = useOrganization();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [invitations, setInvitations] = useState<Array<{email: string, role: string}>>([]);
  const [newInvitation, setNewInvitation] = useState({ email: '', role: 'veterinario' });

  const addInvitation = () => {
    if (!newInvitation.email || !newInvitation.role) return;
    
    if (invitations.some(inv => inv.email === newInvitation.email)) {
      toast({
        title: "Erro",
        description: "Este email já foi adicionado à lista",
        variant: "destructive"
      });
      return;
    }

    setInvitations([...invitations, newInvitation]);
    setNewInvitation({ email: '', role: 'veterinario' });
  };

  const removeInvitation = (index: number) => {
    setInvitations(invitations.filter((_, i) => i !== index));
  };

  const sendInvitations = async () => {
    if (!currentOrg || !user) return;

    try {
      setLoading(true);

      for (const invitation of invitations) {
        const { error } = await supabase.functions.invoke('send-team-invitation', {
          body: {
            email: invitation.email,
            role: invitation.role,
            companyId: currentOrg.id
          }
        });

        if (error) {
          console.error('Error sending invitation:', error);
          toast({
            title: "Erro",
            description: `Erro ao enviar convite para ${invitation.email}`,
            variant: "destructive"
          });
        }
      }

      if (invitations.length > 0) {
        toast({
          title: "Convites enviados!",
          description: `${invitations.length} convite(s) foram enviados com sucesso.`
        });
      }

      onNext();
    } catch (error) {
      console.error('Error sending invitations:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar os convites.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const roleLabels = {
    'veterinario': 'Veterinário',
    'tecnico': 'Técnico',
    'cliente': 'Cliente'
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Convide sua equipe</h2>
        <p className="text-muted-foreground">
          Adicione outros membros para colaborar na sua empresa
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enviar convites</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 space-y-2">
              <Label htmlFor="email">Email do membro</Label>
              <Input
                id="email"
                type="email"
                value={newInvitation.email}
                onChange={(e) => setNewInvitation({...newInvitation, email: e.target.value})}
                placeholder="exemplo@email.com"
              />
            </div>
            
            <div className="w-48 space-y-2">
              <Label htmlFor="role">Função</Label>
              <Select 
                value={newInvitation.role} 
                onValueChange={(value) => setNewInvitation({...newInvitation, role: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="veterinario">Veterinário</SelectItem>
                  <SelectItem value="tecnico">Técnico</SelectItem>
                  <SelectItem value="cliente">Cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button onClick={addInvitation} disabled={!newInvitation.email}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {invitations.length > 0 && (
            <div className="space-y-2">
              <Label>Convites a enviar:</Label>
              <div className="space-y-2">
                {invitations.map((invitation, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{invitation.email}</span>
                      <Badge variant="secondary">
                        {roleLabels[invitation.role as keyof typeof roleLabels]}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeInvitation(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-muted/50 rounded-lg p-6 text-center">
        <h3 className="font-semibold mb-2">Você pode pular esta etapa</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Convites podem ser enviados a qualquer momento através do painel de administração.
        </p>
        
        <div className="flex gap-2 justify-center">
          <Button variant="outline" onClick={onNext}>
            Pular por enquanto
          </Button>
          
          {invitations.length > 0 && (
            <Button onClick={sendInvitations} disabled={loading}>
              {loading ? 'Enviando...' : `Enviar ${invitations.length} convite(s)`}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

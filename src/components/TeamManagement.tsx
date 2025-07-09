
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/contexts/CompanyContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Mail, Users, Trash2, Copy } from 'lucide-react';

export function TeamManagement() {
  const { user } = useAuth();
  const { currentCompany } = useCompany();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [newInvitation, setNewInvitation] = useState({ email: '', role: 'veterinario' });

  useEffect(() => {
    if (currentCompany) {
      loadTeamData();
    }
  }, [currentCompany]);

  const loadTeamData = async () => {
    if (!currentCompany) return;

    try {
      setLoading(true);

      // Load team members
      const { data: members } = await supabase
        .from('user_roles')
        .select(`
          *,
          profiles!inner(*)
        `)
        .eq('company_id', currentCompany.id)
        .eq('is_active', true);

      setTeamMembers(members || []);

      // Load pending invitations
      const { data: pendingInvitations } = await supabase
        .from('team_invitations')
        .select('*')
        .eq('company_id', currentCompany.id)
        .eq('status', 'pending');

      setInvitations(pendingInvitations || []);
    } catch (error) {
      console.error('Error loading team data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendInvitation = async () => {
    if (!currentCompany || !newInvitation.email) return;

    try {
      setLoading(true);

      const { data, error } = await supabase.functions.invoke('send-team-invitation', {
        body: {
          email: newInvitation.email,
          role: newInvitation.role,
          companyId: currentCompany.id
        }
      });

      if (error) throw error;

      toast({
        title: "Convite enviado!",
        description: `Convite enviado para ${newInvitation.email}`
      });

      setNewInvitation({ email: '', role: 'veterinario' });
      setIsInviteModalOpen(false);
      loadTeamData();
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o convite.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (userId: string) => {
    if (!currentCompany) return;

    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('company_id', currentCompany.id);

      if (error) throw error;

      toast({
        title: "Membro removido",
        description: "O membro foi removido da equipe."
      });

      loadTeamData();
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o membro.",
        variant: "destructive"
      });
    }
  };

  const cancelInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('team_invitations')
        .update({ status: 'expired' })
        .eq('id', invitationId);

      if (error) throw error;

      toast({
        title: "Convite cancelado",
        description: "O convite foi cancelado."
      });

      loadTeamData();
    } catch (error) {
      console.error('Error canceling invitation:', error);
      toast({
        title: "Erro",
        description: "Não foi possível cancelar o convite.",
        variant: "destructive"
      });
    }
  };

  const copyInvitationLink = (token: string) => {
    const invitationUrl = `${window.location.origin}/accept-invitation?token=${token}`;
    navigator.clipboard.writeText(invitationUrl);
    toast({
      title: "Link copiado!",
      description: "O link do convite foi copiado para a área de transferência."
    });
  };

  const roleLabels = {
    'super_admin': 'Super Admin',
    'company_admin': 'Administrador',
    'veterinario': 'Veterinário',
    'tecnico': 'Técnico',
    'cliente': 'Cliente'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Equipe</h2>
          <p className="text-muted-foreground">
            Gerencie os membros da sua equipe e envie convites
          </p>
        </div>
        
        <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Convidar Membro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Convidar novo membro</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newInvitation.email}
                  onChange={(e) => setNewInvitation({...newInvitation, email: e.target.value})}
                  placeholder="exemplo@email.com"
                />
              </div>
              
              <div className="space-y-2">
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
              
              <Button 
                onClick={sendInvitation} 
                disabled={loading || !newInvitation.email}
                className="w-full"
              >
                {loading ? 'Enviando...' : 'Enviar Convite'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Membros da Equipe ({teamMembers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {teamMembers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum membro na equipe ainda.
            </p>
          ) : (
            <div className="space-y-3">
              {teamMembers.map((member: any) => (
                <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="font-medium text-primary">
                        {member.profiles.nome.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{member.profiles.nome}</p>
                      <p className="text-sm text-muted-foreground">{member.profiles.user_id}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {roleLabels[member.role as keyof typeof roleLabels]}
                    </Badge>
                    
                    {member.user_id !== user?.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMember(member.user_id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Convites Pendentes ({invitations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invitations.map((invitation: any) => (
                <div key={invitation.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{invitation.email}</p>
                    <p className="text-sm text-muted-foreground">
                      Convidado como {roleLabels[invitation.role as keyof typeof roleLabels]}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Expira em: {new Date(invitation.expires_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyInvitationLink(invitation.token)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => cancelInvitation(invitation.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

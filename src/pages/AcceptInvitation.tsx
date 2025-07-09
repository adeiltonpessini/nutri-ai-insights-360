
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function AcceptInvitation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'invalid'>('loading');
  const [invitation, setInvitation] = useState<any>(null);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!authLoading && !user) {
      // Redirect to auth page with return URL
      navigate(`/auth?returnUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }

    if (user && token) {
      checkInvitation();
    }
  }, [user, token, authLoading]);

  const checkInvitation = async () => {
    if (!token) {
      setStatus('invalid');
      return;
    }

    try {
      setLoading(true);

      // Check if invitation exists and is valid
      const { data, error } = await supabase
        .from('team_invitations')
        .select(`
          *,
          companies(name)
        `)
        .eq('token', token)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !data) {
        setStatus('invalid');
        return;
      }

      setInvitation(data);
      setStatus('success');
    } catch (error) {
      console.error('Error checking invitation:', error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const acceptInvitation = async () => {
    if (!token) return;

    try {
      setLoading(true);

      const { data, error } = await supabase.rpc('accept_team_invitation', {
        invitation_token: token
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Convite aceito!",
          description: "Você foi adicionado à equipe com sucesso."
        });
        navigate('/dashboard');
      } else {
        throw new Error(data.error || 'Erro ao aceitar convite');
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
      toast({
        title: "Erro",
        description: "Não foi possível aceitar o convite.",
        variant: "destructive"
      });
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-sustainability/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Convite para Equipe</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === 'loading' && (
            <>
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
              <p>Verificando convite...</p>
            </>
          )}

          {status === 'success' && invitation && (
            <>
              <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
              <div className="space-y-2">
                <h3 className="font-semibold">Você foi convidado para:</h3>
                <p className="text-lg font-bold">{invitation.companies?.name}</p>
                <p className="text-sm text-muted-foreground">
                  Como: <span className="font-medium">{invitation.role}</span>
                </p>
              </div>
              <Button onClick={acceptInvitation} disabled={loading} className="w-full">
                {loading ? 'Aceitando...' : 'Aceitar Convite'}
              </Button>
            </>
          )}

          {status === 'invalid' && (
            <>
              <XCircle className="w-12 h-12 mx-auto text-red-500" />
              <div className="space-y-2">
                <h3 className="font-semibold">Convite inválido</h3>
                <p className="text-sm text-muted-foreground">
                  Este convite pode ter expirado ou já foi usado.
                </p>
              </div>
              <Button onClick={() => navigate('/dashboard')} variant="outline">
                Ir para Dashboard
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-12 h-12 mx-auto text-red-500" />
              <div className="space-y-2">
                <h3 className="font-semibold">Erro ao processar convite</h3>
                <p className="text-sm text-muted-foreground">
                  Ocorreu um erro ao processar seu convite. Tente novamente.
                </p>
              </div>
              <Button onClick={checkInvitation} variant="outline">
                Tentar Novamente
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

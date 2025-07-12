import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, UserPlus, LogIn, ArrowLeft } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nome: '',
    empresa: '',
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(loginData.email, loginData.password);
      
      if (error) {
        toast({
          title: 'Erro no login',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Login realizado!',
          description: 'Bem-vindo ao InfinityVet',
        });
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        title: 'Erro inesperado',
        description: 'Tente novamente em alguns momentos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: 'Erro',
        description: 'As senhas não coincidem',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    if (signupData.password.length < 6) {
      toast({
        title: 'Erro',
        description: 'A senha deve ter pelo menos 6 caracteres',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    try {
      const { error } = await signUp(signupData.email, signupData.password, {
        nome: signupData.nome,
        empresa: signupData.empresa,
      });
      
      if (error) {
        toast({
          title: 'Erro no cadastro',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Cadastro realizado!',
          description: 'Verifique seu email para confirmar a conta',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro inesperado',
        description: 'Tente novamente em alguns momentos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-sustainability/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back to Home */}
        <div className="text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao início
          </Button>
        </div>

        {/* Logo */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center shadow-glow">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-sustainability bg-clip-text text-transparent">
              InfinityVet
            </h1>
            <p className="text-muted-foreground mt-2">
              Gestão inteligente, sustentável e sem limites
            </p>
          </div>
        </div>

        <Card className="border border-border/50 shadow-medium bg-gradient-card">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-heading text-foreground">
              Acesse sua conta
            </CardTitle>
            <p className="text-muted-foreground">
              Entre ou crie sua conta para começar
            </p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                <TabsTrigger value="login" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <LogIn className="w-4 h-4" />
                  Entrar
                </TabsTrigger>
                <TabsTrigger value="signup" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <UserPlus className="w-4 h-4" />
                  Cadastrar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                      className="transition-smooth focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-sm font-medium">Senha</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                      className="transition-smooth focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full transition-smooth bg-gradient-primary hover:shadow-glow" 
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-6">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-nome" className="text-sm font-medium">Nome completo</Label>
                    <Input
                      id="signup-nome"
                      placeholder="Seu nome completo"
                      value={signupData.nome}
                      onChange={(e) => setSignupData({ ...signupData, nome: e.target.value })}
                      required
                      className="transition-smooth focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-empresa" className="text-sm font-medium">Empresa/Clínica (opcional)</Label>
                    <Input
                      id="signup-empresa"
                      placeholder="Nome da sua empresa ou clínica"
                      value={signupData.empresa}
                      onChange={(e) => setSignupData({ ...signupData, empresa: e.target.value })}
                      className="transition-smooth focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required
                      className="transition-smooth focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-medium">Senha</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      required
                      className="transition-smooth focus:ring-2 focus:ring-primary/20"
                    />
                    <p className="text-xs text-muted-foreground">Mínimo de 6 caracteres</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm" className="text-sm font-medium">Confirmar senha</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      placeholder="••••••••"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      required
                      className="transition-smooth focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full transition-smooth bg-gradient-sustainability hover:shadow-glow" 
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? 'Cadastrando...' : 'Criar Conta'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            © 2024 InfinityVet. Todos os direitos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Gestão inteligente, sustentável e sem limites
          </p>
        </div>
      </div>
    </div>
  );
}
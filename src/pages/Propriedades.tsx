import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Plus, Building, Users, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Propriedade {
  id: string;
  nome: string;
  endereco: string;
  area_hectares: number;
  tipo_criacao: string;
  capacidade_animais: number;
  created_at: string;
}

interface Lote {
  id: string;
  nome: string;
  especie: string;
  quantidade_animais: number;
  peso_medio_atual: number;
  status: string;
}

export default function Propriedades() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
  const [lotes, setLotes] = useState<{ [key: string]: Lote[] }>({});
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [novaPropriedade, setNovaPropriedade] = useState({
    nome: '',
    endereco: '',
    area_hectares: '',
    tipo_criacao: '',
    capacidade_animais: '',
  });

  useEffect(() => {
    fetchPropriedades();
  }, [user]);

  const fetchPropriedades = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('propriedades')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao carregar propriedades',
        variant: 'destructive',
      });
    } else {
      setPropriedades(data || []);
      
      // Buscar lotes para cada propriedade
      for (const propriedade of data || []) {
        fetchLotes(propriedade.id);
      }
    }
    setLoading(false);
  };

  const fetchLotes = async (propriedadeId: string) => {
    const { data } = await supabase
      .from('lotes')
      .select('id, nome, especie, quantidade_animais, peso_medio_atual, status')
      .eq('propriedade_id', propriedadeId)
      .eq('status', 'ativo');

    if (data) {
      setLotes(prev => ({ ...prev, [propriedadeId]: data }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase
      .from('propriedades')
      .insert({
        user_id: user.id,
        nome: novaPropriedade.nome,
        endereco: novaPropriedade.endereco,
        area_hectares: parseFloat(novaPropriedade.area_hectares),
        tipo_criacao: novaPropriedade.tipo_criacao,
        capacidade_animais: parseInt(novaPropriedade.capacidade_animais),
      });

    if (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao criar propriedade',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Sucesso',
        description: 'Propriedade criada com sucesso',
      });
      setIsDialogOpen(false);
      setNovaPropriedade({
        nome: '',
        endereco: '',
        area_hectares: '',
        tipo_criacao: '',
        capacidade_animais: '',
      });
      fetchPropriedades();
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'bovinos': return '🐄';
      case 'suinos': return '🐷';
      case 'aves': return '🐔';
      case 'ovinos': return '🐑';
      default: return '🏭';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Minhas Propriedades</h1>
          <p className="text-muted-foreground">
            Gerencie suas fazendas e propriedades rurais
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="tech" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nova Propriedade
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Propriedade</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Propriedade</Label>
                <Input
                  id="nome"
                  value={novaPropriedade.nome}
                  onChange={(e) => setNovaPropriedade({ ...novaPropriedade, nome: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Textarea
                  id="endereco"
                  value={novaPropriedade.endereco}
                  onChange={(e) => setNovaPropriedade({ ...novaPropriedade, endereco: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="area">Área (hectares)</Label>
                  <Input
                    id="area"
                    type="number"
                    step="0.01"
                    value={novaPropriedade.area_hectares}
                    onChange={(e) => setNovaPropriedade({ ...novaPropriedade, area_hectares: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacidade">Capacidade (animais)</Label>
                  <Input
                    id="capacidade"
                    type="number"
                    value={novaPropriedade.capacidade_animais}
                    onChange={(e) => setNovaPropriedade({ ...novaPropriedade, capacidade_animais: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Criação</Label>
                <Select
                  value={novaPropriedade.tipo_criacao}
                  onValueChange={(value) => setNovaPropriedade({ ...novaPropriedade, tipo_criacao: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bovinos">Bovinos</SelectItem>
                    <SelectItem value="suinos">Suínos</SelectItem>
                    <SelectItem value="aves">Aves</SelectItem>
                    <SelectItem value="ovinos">Ovinos</SelectItem>
                    <SelectItem value="misto">Misto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                Criar Propriedade
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {propriedades.length === 0 ? (
        <Card variant="default" className="text-center py-12">
          <CardContent>
            <Building className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">Nenhuma propriedade cadastrada</h3>
            <p className="text-muted-foreground mb-4">
              Comece criando sua primeira propriedade para gerenciar seus rebanhos
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              Criar Primeira Propriedade
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {propriedades.map((propriedade) => (
            <Card key={propriedade.id} variant="elevated" className="group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {getTipoIcon(propriedade.tipo_criacao)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{propriedade.nome}</CardTitle>
                      <Badge variant="outline" className="mt-1 text-xs capitalize">
                        {propriedade.tipo_criacao}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {propriedade.endereco && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <p className="text-sm text-muted-foreground">{propriedade.endereco}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold text-primary">
                      {propriedade.area_hectares || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Hectares</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold text-success">
                      {propriedade.capacidade_animais || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Capacidade</div>
                  </div>
                </div>

                {lotes[propriedade.id] && lotes[propriedade.id].length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-medium">Lotes Ativos</span>
                    </div>
                    <div className="space-y-1">
                      {lotes[propriedade.id].slice(0, 3).map((lote) => (
                        <div key={lote.id} className="flex items-center justify-between text-xs">
                          <span>{lote.nome}</span>
                          <span className="text-muted-foreground">
                            {lote.quantidade_animais} {lote.especie}
                          </span>
                        </div>
                      ))}
                      {lotes[propriedade.id].length > 3 && (
                        <div className="text-xs text-muted-foreground text-center">
                          +{lotes[propriedade.id].length - 3} mais lotes
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
                    Ver Detalhes
                  </Button>
                  <Button variant="tech" size="sm" className="flex-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Performance
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
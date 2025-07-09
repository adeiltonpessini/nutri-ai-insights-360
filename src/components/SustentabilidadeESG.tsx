
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Leaf, Droplets, Zap, Recycle, Award, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { useCompany } from "@/contexts/CompanyContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function SustentabilidadeESG() {
  const { currentCompany } = useCompany();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [dadosSustentabilidade, setDadosSustentabilidade] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newRegistro, setNewRegistro] = useState({
    animal_id: '',
    periodo_inicio: '',
    periodo_fim: '',
    emissao_metano: '',
    consumo_agua_litros: '',
    pegada_carbono: '',
    eficiencia_energetica: '',
    residuos_gerados: '',
    uso_agua: '',
    fcr: '',
    pontuacao_esg: ''
  });

  useEffect(() => {
    if (currentCompany) {
      loadSustentabilidadeData();
    }
  }, [currentCompany]);

  const loadSustentabilidadeData = async () => {
    if (!currentCompany) return;

    try {
      setLoading(true);

      const { data: sustentabilidadeData } = await supabase
        .from('sustentabilidade')
        .select(`
          *,
          animais(nome, especie)
        `)
        .eq('company_id', currentCompany.id)
        .order('periodo_inicio', { ascending: false });

      const { data: animalsData } = await supabase
        .from('animais')
        .select('id, nome, especie')
        .eq('company_id', currentCompany.id)
        .order('nome');

      setDadosSustentabilidade(sustentabilidadeData || []);
      setAnimals(animalsData || []);

    } catch (error) {
      console.error('Erro ao carregar dados de sustentabilidade:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados de sustentabilidade",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRegistro = async () => {
    if (!currentCompany || !newRegistro.periodo_inicio || !newRegistro.periodo_fim) {
      toast({
        title: "Erro",
        description: "Preencha os períodos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      // Calcular pontuação ESG baseada nos dados
      const pontuacaoESG = calcularPontuacaoESG(newRegistro);

      const { error } = await supabase
        .from('sustentabilidade')
        .insert({
          ...newRegistro,
          emissao_metano: parseFloat(newRegistro.emissao_metano) || null,
          consumo_agua_litros: parseFloat(newRegistro.consumo_agua_litros) || null,
          pegada_carbono: parseFloat(newRegistro.pegada_carbono) || null,
          eficiencia_energetica: parseFloat(newRegistro.eficiencia_energetica) || null,
          residuos_gerados: parseFloat(newRegistro.residuos_gerados) || null,
          uso_agua: parseFloat(newRegistro.uso_agua) || null,
          fcr: parseFloat(newRegistro.fcr) || null,
          pontuacao_esg: pontuacaoESG,
          company_id: currentCompany.id
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Registro de sustentabilidade criado com sucesso!"
      });

      setIsModalOpen(false);
      setNewRegistro({
        animal_id: '',
        periodo_inicio: '',
        periodo_fim: '',
        emissao_metano: '',
        consumo_agua_litros: '',
        pegada_carbono: '',
        eficiencia_energetica: '',
        residuos_gerados: '',
        uso_agua: '',
        fcr: '',
        pontuacao_esg: ''
      });
      loadSustentabilidadeData();

    } catch (error) {
      console.error('Erro ao criar registro:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar registro de sustentabilidade",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calcularPontuacaoESG = (dados) => {
    let pontuacao = 50; // Base

    // Fatores positivos
    if (dados.eficiencia_energetica && parseFloat(dados.eficiencia_energetica) > 80) {
      pontuacao += 15;
    }
    if (dados.fcr && parseFloat(dados.fcr) < 2.5) {
      pontuacao += 10;
    }
    if (dados.uso_agua && parseFloat(dados.uso_agua) < 50) {
      pontuacao += 10;
    }

    // Fatores negativos
    if (dados.emissao_metano && parseFloat(dados.emissao_metano) > 100) {
      pontuacao -= 15;
    }
    if (dados.residuos_gerados && parseFloat(dados.residuos_gerados) > 50) {
      pontuacao -= 10;
    }

    return Math.max(0, Math.min(100, pontuacao));
  };

  const calcularResumoESG = () => {
    if (dadosSustentabilidade.length === 0) return null;

    const ultimosRegistros = dadosSustentabilidade.slice(0, 10);
    
    const pontuacaoMedia = ultimosRegistros.reduce((sum, reg) => sum + (reg.pontuacao_esg || 0), 0) / ultimosRegistros.length;
    const emissaoMetanoTotal = ultimosRegistros.reduce((sum, reg) => sum + (reg.emissao_metano || 0), 0);
    const consumoAguaTotal = ultimosRegistros.reduce((sum, reg) => sum + (reg.consumo_agua_litros || 0), 0);
    const eficienciaMedia = ultimosRegistros.reduce((sum, reg) => sum + (reg.eficiencia_energetica || 0), 0) / ultimosRegistros.length;

    return {
      pontuacaoMedia: pontuacaoMedia.toFixed(1),
      emissaoMetanoTotal: emissaoMetanoTotal.toFixed(1),
      consumoAguaTotal: consumoAguaTotal.toFixed(1),
      eficienciaMedia: eficienciaMedia.toFixed(1)
    };
  };

  const resumoESG = calcularResumoESG();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sustentabilidade e ESG</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Registro
        </Button>
      </div>

      {/* Resumo ESG */}
      {resumoESG && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pontuação ESG</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resumoESG.pontuacaoMedia}</div>
              <Progress value={parseFloat(resumoESG.pontuacaoMedia)} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {parseFloat(resumoESG.pontuacaoMedia) >= 70 ? 'Excelente' : 
                 parseFloat(resumoESG.pontuacaoMedia) >= 50 ? 'Bom' : 'Precisa Melhorar'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Emissão Metano</CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resumoESG.emissaoMetanoTotal}</div>
              <p className="text-xs text-muted-foreground">
                kg CO2 eq
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Consumo de Água</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resumoESG.consumoAguaTotal}</div>
              <p className="text-xs text-muted-foreground">
                litros totais
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eficiência Energética</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resumoESG.eficienciaMedia}%</div>
              <p className="text-xs text-muted-foreground">
                média da propriedade
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Registros de Sustentabilidade */}
      <Card>
        <CardHeader>
          <CardTitle>Registros de Sustentabilidade</CardTitle>
          <CardDescription>
            Acompanhe indicadores ambientais e de sustentabilidade
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dadosSustentabilidade.length === 0 ? (
            <div className="text-center py-8">
              <Leaf className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum registro de sustentabilidade</h3>
              <p className="text-muted-foreground">
                Comece a registrar dados para acompanhar o impacto ambiental
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {dadosSustentabilidade.map((registro) => (
                <Card key={registro.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {registro.animais ? `${registro.animais.nome} (${registro.animais.especie})` : 'Registro Geral'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(registro.periodo_inicio).toLocaleDateString('pt-BR')} - {new Date(registro.periodo_fim).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          registro.pontuacao_esg >= 70 ? 'default' :
                          registro.pontuacao_esg >= 50 ? 'secondary' : 'destructive'
                        }>
                          ESG: {registro.pontuacao_esg?.toFixed(1) || 'N/A'}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {registro.emissao_metano && (
                        <div className="flex items-center gap-2">
                          <Leaf className="w-4 h-4 text-green-600" />
                          <div>
                            <p className="text-sm text-muted-foreground">Emissão Metano</p>
                            <p className="font-medium">{registro.emissao_metano} kg</p>
                          </div>
                        </div>
                      )}

                      {registro.consumo_agua_litros && (
                        <div className="flex items-center gap-2">
                          <Droplets className="w-4 h-4 text-blue-600" />
                          <div>
                            <p className="text-sm text-muted-foreground">Consumo Água</p>
                            <p className="font-medium">{registro.consumo_agua_litros} L</p>
                          </div>
                        </div>
                      )}

                      {registro.eficiencia_energetica && (
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-600" />
                          <div>
                            <p className="text-sm text-muted-foreground">Eficiência Energética</p>
                            <p className="font-medium">{registro.eficiencia_energetica}%</p>
                          </div>
                        </div>
                      )}

                      {registro.residuos_gerados && (
                        <div className="flex items-center gap-2">
                          <Recycle className="w-4 h-4 text-orange-600" />
                          <div>
                            <p className="text-sm text-muted-foreground">Resíduos</p>
                            <p className="font-medium">{registro.residuos_gerados} kg</p>
                          </div>
                        </div>
                      )}

                      {registro.pegada_carbono && (
                        <div className="flex items-center gap-2">
                          <Leaf className="w-4 h-4 text-gray-600" />
                          <div>
                            <p className="text-sm text-muted-foreground">Pegada de Carbono</p>
                            <p className="font-medium">{registro.pegada_carbono} kg CO2</p>
                          </div>
                        </div>
                      )}

                      {registro.fcr && (
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-purple-600" />
                          <div>
                            <p className="text-sm text-muted-foreground">FCR</p>
                            <p className="font-medium">{registro.fcr}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal para Novo Registro */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Novo Registro de Sustentabilidade</DialogTitle>
            <DialogDescription>
              Registre dados ambientais e de sustentabilidade
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="animal_sust">Animal (Opcional)</Label>
              <Select value={newRegistro.animal_id} onValueChange={(value) => setNewRegistro({...newRegistro, animal_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um animal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Registro geral da propriedade</SelectItem>
                  {animals.map((animal) => (
                    <SelectItem key={animal.id} value={animal.id}>
                      {animal.nome} - {animal.especie}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div></div>
            <div>
              <Label htmlFor="periodo_inicio">Período Início</Label>
              <Input
                id="periodo_inicio"
                type="date"
                value={newRegistro.periodo_inicio}
                onChange={(e) => setNewRegistro({...newRegistro, periodo_inicio: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="periodo_fim">Período Fim</Label>
              <Input
                id="periodo_fim"
                type="date"
                value={newRegistro.periodo_fim}
                onChange={(e) => setNewRegistro({...newRegistro, periodo_fim: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="emissao_metano">Emissão de Metano (kg)</Label>
              <Input
                id="emissao_metano"
                type="number"
                step="0.01"
                value={newRegistro.emissao_metano}
                onChange={(e) => setNewRegistro({...newRegistro, emissao_metano: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="consumo_agua_litros">Consumo de Água (L)</Label>
              <Input
                id="consumo_agua_litros"
                type="number"
                step="0.01"
                value={newRegistro.consumo_agua_litros}
                onChange={(e) => setNewRegistro({...newRegistro, consumo_agua_litros: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="pegada_carbono">Pegada de Carbono (kg CO2)</Label>
              <Input
                id="pegada_carbono"
                type="number"
                step="0.01"
                value={newRegistro.pegada_carbono}
                onChange={(e) => setNewRegistro({...newRegistro, pegada_carbono: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="eficiencia_energetica">Eficiência Energética (%)</Label>
              <Input
                id="eficiencia_energetica"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={newRegistro.eficiencia_energetica}
                onChange={(e) => setNewRegistro({...newRegistro, eficiencia_energetica: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="residuos_gerados">Resíduos Gerados (kg)</Label>
              <Input
                id="residuos_gerados"
                type="number"
                step="0.01"
                value={newRegistro.residuos_gerados}
                onChange={(e) => setNewRegistro({...newRegistro, residuos_gerados: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="uso_agua">Uso de Água (eficiência %)</Label>
              <Input
                id="uso_agua"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={newRegistro.uso_agua}
                onChange={(e) => setNewRegistro({...newRegistro, uso_agua: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="fcr">FCR (Feed Conversion Ratio)</Label>
              <Input
                id="fcr"
                type="number"
                step="0.01"
                value={newRegistro.fcr}
                onChange={(e) => setNewRegistro({...newRegistro, fcr: e.target.value})}
                placeholder="0.00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateRegistro} disabled={loading}>
              Salvar Registro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

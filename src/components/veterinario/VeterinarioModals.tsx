
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VeterinarioModalsProps {
  // Modal states
  isReceitaModalOpen: boolean;
  setIsReceitaModalOpen: (open: boolean) => void;
  isHistoricoSaudeModalOpen: boolean;
  setIsHistoricoSaudeModalOpen: (open: boolean) => void;
  isTarefaModalOpen: boolean;
  setIsTarefaModalOpen: (open: boolean) => void;
  isEventoModalOpen: boolean;
  setIsEventoModalOpen: (open: boolean) => void;

  // Form states
  newReceita: any;
  setNewReceita: (receita: any) => void;
  newHistoricoSaude: any;
  setNewHistoricoSaude: (historico: any) => void;
  newTarefa: any;
  setNewTarefa: (tarefa: any) => void;
  newEventoCalendario: any;
  setNewEventoCalendario: (evento: any) => void;

  // Data
  animals: any[];
  loading: boolean;

  // Handlers
  handleCreateReceita: () => void;
  handleCreateHistoricoSaude: () => void;
  handleCreateTarefa: () => void;
  handleCreateEventoCalendario: () => void;
}

export function VeterinarioModals({
  isReceitaModalOpen,
  setIsReceitaModalOpen,
  isHistoricoSaudeModalOpen,
  setIsHistoricoSaudeModalOpen,
  isTarefaModalOpen,
  setIsTarefaModalOpen,
  isEventoModalOpen,
  setIsEventoModalOpen,
  newReceita,
  setNewReceita,
  newHistoricoSaude,
  setNewHistoricoSaude,
  newTarefa,
  setNewTarefa,
  newEventoCalendario,
  setNewEventoCalendario,
  animals,
  loading,
  handleCreateReceita,
  handleCreateHistoricoSaude,
  handleCreateTarefa,
  handleCreateEventoCalendario
}: VeterinarioModalsProps) {
  return (
    <>
      {/* Modal para Novo Histórico de Saúde */}
      <Dialog open={isHistoricoSaudeModalOpen} onOpenChange={setIsHistoricoSaudeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Registro de Saúde</DialogTitle>
            <DialogDescription>
              Registre procedimentos veterinários, vacinas ou diagnósticos
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="animal">Animal</Label>
              <Select value={newHistoricoSaude.animal_id} onValueChange={(value) => setNewHistoricoSaude({...newHistoricoSaude, animal_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um animal" />
                </SelectTrigger>
                <SelectContent>
                  {animals.map((animal) => (
                    <SelectItem key={animal.id} value={animal.id}>
                      {animal.nome} - {animal.especie}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tipo">Tipo de Procedimento</Label>
              <Select value={newHistoricoSaude.tipo} onValueChange={(value) => setNewHistoricoSaude({...newHistoricoSaude, tipo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vacina">Vacina</SelectItem>
                  <SelectItem value="exame">Exame</SelectItem>
                  <SelectItem value="tratamento">Tratamento</SelectItem>
                  <SelectItem value="enfermidade">Enfermidade</SelectItem>
                  <SelectItem value="cirurgia">Cirurgia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                value={newHistoricoSaude.descricao}
                onChange={(e) => setNewHistoricoSaude({...newHistoricoSaude, descricao: e.target.value})}
                placeholder="Descreva o procedimento"
              />
            </div>
            <div>
              <Label htmlFor="data_aplicacao">Data</Label>
              <Input
                id="data_aplicacao"
                type="date"
                value={newHistoricoSaude.data_aplicacao}
                onChange={(e) => setNewHistoricoSaude({...newHistoricoSaude, data_aplicacao: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={newHistoricoSaude.observacoes}
                onChange={(e) => setNewHistoricoSaude({...newHistoricoSaude, observacoes: e.target.value})}
                placeholder="Observações adicionais..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsHistoricoSaudeModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateHistoricoSaude} disabled={loading}>
              Salvar Registro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para Nova Tarefa */}
      <Dialog open={isTarefaModalOpen} onOpenChange={setIsTarefaModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Tarefa</DialogTitle>
            <DialogDescription>
              Crie uma nova tarefa para a equipe
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={newTarefa.titulo}
                onChange={(e) => setNewTarefa({...newTarefa, titulo: e.target.value})}
                placeholder="Título da tarefa"
              />
            </div>
            <div>
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={newTarefa.tipo} onValueChange={(value) => setNewTarefa({...newTarefa, tipo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ordenha">Ordenha</SelectItem>
                  <SelectItem value="vacinacao">Vacinação</SelectItem>
                  <SelectItem value="limpeza">Limpeza</SelectItem>
                  <SelectItem value="alimentacao">Alimentação</SelectItem>
                  <SelectItem value="manutencao">Manutenção</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="prioridade">Prioridade</Label>
              <Select value={newTarefa.prioridade} onValueChange={(value) => setNewTarefa({...newTarefa, prioridade: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="data_prevista">Data Prevista</Label>
              <Input
                id="data_prevista"
                type="date"
                value={newTarefa.data_prevista}
                onChange={(e) => setNewTarefa({...newTarefa, data_prevista: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={newTarefa.descricao}
                onChange={(e) => setNewTarefa({...newTarefa, descricao: e.target.value})}
                placeholder="Descrição da tarefa..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTarefaModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateTarefa} disabled={loading}>
              Criar Tarefa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para Novo Evento no Calendário */}
      <Dialog open={isEventoModalOpen} onOpenChange={setIsEventoModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Evento</DialogTitle>
            <DialogDescription>
              Agende um evento no calendário veterinário
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="titulo_evento">Título</Label>
              <Input
                id="titulo_evento"
                value={newEventoCalendario.titulo}
                onChange={(e) => setNewEventoCalendario({...newEventoCalendario, titulo: e.target.value})}
                placeholder="Título do evento"
              />
            </div>
            <div>
              <Label htmlFor="tipo_evento">Tipo de Evento</Label>
              <Select value={newEventoCalendario.tipo_evento} onValueChange={(value) => setNewEventoCalendario({...newEventoCalendario, tipo_evento: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vacina">Vacinação</SelectItem>
                  <SelectItem value="check-up">Check-up</SelectItem>
                  <SelectItem value="vermifugacao">Vermifugação</SelectItem>
                  <SelectItem value="exame">Exame</SelectItem>
                  <SelectItem value="cirurgia">Cirurgia</SelectItem>
                  <SelectItem value="inseminacao">Inseminação</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="animal_evento">Animal (Opcional)</Label>
              <Select value={newEventoCalendario.animal_id} onValueChange={(value) => setNewEventoCalendario({...newEventoCalendario, animal_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um animal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum animal específico</SelectItem>
                  {animals.map((animal) => (
                    <SelectItem key={animal.id} value={animal.id}>
                      {animal.nome} - {animal.especie}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="data_agendada">Data Agendada</Label>
              <Input
                id="data_agendada"
                type="date"
                value={newEventoCalendario.data_agendada}
                onChange={(e) => setNewEventoCalendario({...newEventoCalendario, data_agendada: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="descricao_evento">Descrição</Label>
              <Textarea
                id="descricao_evento"
                value={newEventoCalendario.descricao}
                onChange={(e) => setNewEventoCalendario({...newEventoCalendario, descricao: e.target.value})}
                placeholder="Descrição do evento..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEventoModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateEventoCalendario} disabled={loading}>
              Criar Evento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para Nova Receita */}
      <Dialog open={isReceitaModalOpen} onOpenChange={setIsReceitaModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Receita</DialogTitle>
            <DialogDescription>
              Crie uma nova receita para um animal
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="animal">Animal</Label>
              <Select value={newReceita.animal_id} onValueChange={(value) => setNewReceita({...newReceita, animal_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um animal" />
                </SelectTrigger>
                <SelectContent>
                  {animals.map((animal) => (
                    <SelectItem key={animal.id} value={animal.id}>
                      {animal.nome} - {animal.especie}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="nome">Nome da Receita</Label>
              <Input
                id="nome"
                value={newReceita.nome}
                onChange={(e) => setNewReceita({...newReceita, nome: e.target.value})}
                placeholder="Ex: Tratamento para crescimento"
              />
            </div>
            <div>
              <Label htmlFor="objetivo">Objetivo</Label>
              <Input
                id="objetivo"
                value={newReceita.objetivo}
                onChange={(e) => setNewReceita({...newReceita, objetivo: e.target.value})}
                placeholder="Ex: Ganho de peso, tratamento de doença..."
              />
            </div>
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={newReceita.observacoes}
                onChange={(e) => setNewReceita({...newReceita, observacoes: e.target.value})}
                placeholder="Instruções especiais, posologia..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReceitaModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateReceita} disabled={loading}>
              Criar Receita
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

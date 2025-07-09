
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Plus } from "lucide-react";

interface TaskManagementProps {
  tarefasDiarias: any[];
  onNewTask: () => void;
}

export function TaskManagement({ tarefasDiarias, onNewTask }: TaskManagementProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tarefas Diárias</h2>
        <Button onClick={onNewTask}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Tarefa
        </Button>
      </div>

      <div className="grid gap-4">
        {tarefasDiarias.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma tarefa cadastrada</h3>
              <p className="text-muted-foreground">
                Tarefas aparecerão aqui quando forem criadas.
              </p>
            </CardContent>
          </Card>
        ) : (
          tarefasDiarias.map((tarefa) => (
            <Card key={tarefa.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{tarefa.titulo}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Tipo: {tarefa.tipo}</p>
                      <p>Data prevista: {new Date(tarefa.data_prevista).toLocaleDateString('pt-BR')}</p>
                      {tarefa.profiles && <p>Responsável: {tarefa.profiles.nome}</p>}
                      {tarefa.descricao && <p>Descrição: {tarefa.descricao}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      tarefa.prioridade === 'alta' ? "destructive" :
                      tarefa.prioridade === 'media' ? "default" : "secondary"
                    }>
                      {tarefa.prioridade}
                    </Badge>
                    <Badge variant={
                      tarefa.status === 'concluida' ? "outline" :
                      tarefa.status === 'em_andamento' ? "default" : "secondary"
                    }>
                      {tarefa.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

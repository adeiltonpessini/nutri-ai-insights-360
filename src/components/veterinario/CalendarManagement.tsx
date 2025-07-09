
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Eye } from "lucide-react";

interface CalendarManagementProps {
  calendarioVet: any[];
  onNewEvent: () => void;
}

export function CalendarManagement({ calendarioVet, onNewEvent }: CalendarManagementProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Calendário Veterinário</h2>
        <Button onClick={onNewEvent}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Evento
        </Button>
      </div>

      <div className="grid gap-4">
        {calendarioVet.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum evento agendado</h3>
              <p className="text-muted-foreground">
                Eventos aparecerão aqui quando forem criados.
              </p>
            </CardContent>
          </Card>
        ) : (
          calendarioVet.map((evento) => (
            <Card key={evento.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{evento.titulo}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Tipo: {evento.tipo_evento}</p>
                      <p>Data: {new Date(evento.data_agendada).toLocaleDateString('pt-BR')}</p>
                      {evento.animais && <p>Animal: {evento.animais.nome}</p>}
                      {evento.lotes && <p>Lote: {evento.lotes.nome}</p>}
                      {evento.descricao && <p>Descrição: {evento.descricao}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      evento.status === 'agendado' ? "default" : 
                      evento.status === 'realizado' ? "outline" : "destructive"
                    }>
                      {evento.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver
                    </Button>
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

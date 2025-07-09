
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Plus, Eye } from "lucide-react";

interface HealthManagementProps {
  historicoSaude: any[];
  onNewRecord: () => void;
}

export function HealthManagement({ historicoSaude, onNewRecord }: HealthManagementProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestão de Saúde</h2>
        <Button onClick={onNewRecord}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Registro
        </Button>
      </div>

      <div className="grid gap-4">
        {historicoSaude.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Stethoscope className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum registro de saúde</h3>
              <p className="text-muted-foreground">
                Registros de saúde aparecerão aqui quando forem criados.
              </p>
            </CardContent>
          </Card>
        ) : (
          historicoSaude.map((registro) => (
            <Card key={registro.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{registro.tipo}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Animal: {registro.animais?.nome}</p>
                      <p>Descrição: {registro.descricao}</p>
                      <p>Data: {new Date(registro.data_aplicacao).toLocaleDateString('pt-BR')}</p>
                      <p>Veterinário: {registro.profiles?.nome || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      registro.tipo === 'vacina' ? "default" : 
                      registro.tipo === 'enfermidade' ? "destructive" : "secondary"
                    }>
                      {registro.tipo}
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

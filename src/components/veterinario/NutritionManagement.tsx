
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pill, Plus, Eye } from "lucide-react";

interface NutritionManagementProps {
  receitas: any[];
  onNewRecipe: () => void;
}

export function NutritionManagement({ receitas, onNewRecipe }: NutritionManagementProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Nutrição Avançada</h2>
        <Button onClick={onNewRecipe}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Receita
        </Button>
      </div>

      <div className="grid gap-4">
        {receitas.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Pill className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma receita criada</h3>
              <p className="text-muted-foreground">
                Suas receitas aparecerão aqui quando forem criadas.
              </p>
            </CardContent>
          </Card>
        ) : (
          receitas.map((receita) => (
            <Card key={receita.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{receita.nome}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Animal: {receita.animais?.nome}</p>
                      <p>Espécie: {receita.animais?.especie}</p>
                      <p>Objetivo: {receita.objetivo}</p>
                      <p>Data: {new Date(receita.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={receita.ativa ? "default" : "secondary"}>
                      {receita.ativa ? "Ativa" : "Inativa"}
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

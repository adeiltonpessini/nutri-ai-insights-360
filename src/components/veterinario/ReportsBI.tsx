
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, ChartBar, Package } from "lucide-react";

interface ReportsBIProps {
  performance: any[];
  estoque: any[];
}

export function ReportsBI({ performance, estoque }: ReportsBIProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Relatórios e BI</h2>
      
      {/* Análise de Performance */}
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Análise de Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {performance.length === 0 ? (
              <div className="text-center py-8">
                <ChartBar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sem dados de performance</h3>
                <p className="text-muted-foreground">
                  Dados de performance aparecerão aqui quando forem registrados.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {performance.slice(0, 8).map((metric) => (
                  <div key={metric.id} className="p-4 border rounded">
                    <h4 className="font-medium">{metric.animais?.nome}</h4>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Peso</p>
                        <p className="font-semibold">{metric.peso ? `${metric.peso} kg` : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Conversão</p>
                        <p className="font-semibold">{metric.conversao_alimentar || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alertas de Estoque */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Controle de Estoque
            </CardTitle>
          </CardHeader>
          <CardContent>
            {estoque.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sem itens em estoque</h3>
                <p className="text-muted-foreground">
                  Itens de estoque aparecerão aqui quando forem cadastrados.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {estoque.filter(item => item.quantidade_atual <= item.quantidade_minima).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded">
                    <div>
                      <p className="font-medium">{item.nome}</p>
                      <p className="text-sm text-muted-foreground">
                        Estoque atual: {item.quantidade_atual} {item.unidade_medida}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-orange-600 border-orange-600">
                      Estoque Baixo
                    </Badge>
                  </div>
                ))}
                {estoque.filter(item => item.quantidade_atual > item.quantidade_minima).length > 0 && (
                  <p className="text-sm text-muted-foreground text-center pt-4">
                    {estoque.filter(item => item.quantidade_atual > item.quantidade_minima).length} itens com estoque adequado
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Users, Search, Filter, QrCode, Eye } from "lucide-react";

interface AnimalManagementProps {
  animals: any[];
}

export function AnimalManagement({ animals }: AnimalManagementProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestão Avançada de Animais</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar animais..." className="pl-10 w-64" />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {animals.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum animal cadastrado</h3>
              <p className="text-muted-foreground">
                Os animais da empresa aparecerão aqui quando forem cadastrados.
              </p>
            </CardContent>
          </Card>
        ) : (
          animals.map((animal) => (
            <Card key={animal.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{animal.nome}</CardTitle>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline">
                      <QrCode className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Espécie</p>
                    <p className="font-medium">{animal.especie}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Peso</p>
                    <p className="font-medium">{animal.peso ? `${animal.peso} kg` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge variant={animal.status_saude === 'saudavel' ? 'default' : 'destructive'}>
                      {animal.status_saude}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">QR Code</p>
                    <p className="font-medium text-xs">{animal.qrcode}</p>
                  </div>
                </div>
                {animal.escore_corporal && (
                  <div>
                    <p className="text-sm text-muted-foreground">Escore Corporal</p>
                    <Progress value={animal.escore_corporal * 20} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}


import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Upload, FileText, Leaf } from "lucide-react";

export function SystemSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Configurações do Sistema</h2>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurações Gerais</CardTitle>
            <CardDescription>
              Personalize as configurações do sistema conforme suas necessidades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex-col">
                <QrCode className="w-6 h-6 mb-2" />
                Gerar QR Codes
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Upload className="w-6 h-6 mb-2" />
                Backup de Dados
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <FileText className="w-6 h-6 mb-2" />
                Relatórios MAPA
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Leaf className="w-6 h-6 mb-2" />
                Config. ESG
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

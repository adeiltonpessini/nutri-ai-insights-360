
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Camera, FileText, Stethoscope, Activity, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import QRCode from 'qrcode';

interface Animal {
  id: string;
  nome: string;
  especie: string;
  raca?: string;
  peso?: number;
  data_nascimento?: string;
  foto_url?: string;
  qrcode?: string;
  fase_produtiva?: string;
  observacoes?: string;
}

interface ProfileCardProps {
  animal: Animal;
  onEdit?: (animal: Animal) => void;
}

export function ProfileCard({ animal, onEdit }: ProfileCardProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [showQR, setShowQR] = useState(false);

  const generateQRCode = async () => {
    try {
      const animalData = {
        id: animal.id,
        nome: animal.nome,
        especie: animal.especie,
        url: `${window.location.origin}/animal/${animal.id}`
      };
      
      const qrUrl = await QRCode.toDataURL(JSON.stringify(animalData), {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setQrCodeUrl(qrUrl);
      setShowQR(true);
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
    }
  };

  const getAge = () => {
    if (!animal.data_nascimento) return 'N/A';
    const birth = new Date(animal.data_nascimento);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} dias`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} meses`;
    return `${Math.floor(diffDays / 365)} anos`;
  };

  const getPhaseColor = (fase: string) => {
    const colors = {
      'cria': 'bg-blue-100 text-blue-800',
      'recria': 'bg-yellow-100 text-yellow-800',
      'engorda': 'bg-green-100 text-green-800',
      'reproducao': 'bg-purple-100 text-purple-800',
      'lactacao': 'bg-pink-100 text-pink-800',
      'manutencao': 'bg-gray-100 text-gray-800'
    };
    return colors[fase as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative">
          {animal.foto_url ? (
            <img 
              src={animal.foto_url} 
              alt={animal.nome}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <Camera className="w-12 h-12 text-gray-400" />
            </div>
          )}
          
          <div className="absolute top-2 right-2 flex gap-2">
            {animal.fase_produtiva && (
              <Badge className={getPhaseColor(animal.fase_produtiva)}>
                {animal.fase_produtiva}
              </Badge>
            )}
          </div>
        </div>

        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{animal.nome}</CardTitle>
              <CardDescription>
                {animal.especie} {animal.raca && `• ${animal.raca}`}
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={generateQRCode}
              className="shrink-0"
            >
              <QrCode className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Idade:</span>
              <p className="font-medium">{getAge()}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Peso:</span>
              <p className="font-medium">{animal.peso ? `${animal.peso} kg` : 'N/A'}</p>
            </div>
          </div>

          {animal.observacoes && (
            <div>
              <span className="text-muted-foreground text-sm">Observações:</span>
              <p className="text-sm mt-1 line-clamp-2">{animal.observacoes}</p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onEdit?.(animal)}
            >
              <FileText className="w-4 h-4 mr-1" />
              Perfil
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Stethoscope className="w-4 h-4 mr-1" />
              Saúde
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Activity className="w-4 h-4 mr-1" />
              Performance
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code - {animal.nome}</DialogTitle>
            <DialogDescription>
              Escaneie este código para acessar rapidamente as informações do animal
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center p-6">
            {qrCodeUrl && (
              <img src={qrCodeUrl} alt="QR Code" className="border rounded-lg" />
            )}
          </div>
          
          <DialogFooter>
            <Button 
              onClick={() => {
                const link = document.createElement('a');
                link.download = `qrcode-${animal.nome}.png`;
                link.href = qrCodeUrl;
                link.click();
              }}
            >
              Baixar QR Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

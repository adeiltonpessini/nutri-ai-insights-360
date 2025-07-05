import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Camera, Upload, Brain, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Diagnostico() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fieldNotes, setFieldNotes] = useState("");
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeWithAI = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('/supabase/functions/v1/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: selectedImage,
          fieldNotes: fieldNotes,
          animalType: 'suinos'
        }),
      });

      const data = await response.json();
      
      if (data.success && data.analysis) {
        setAnalysisResult({
          status: "completed",
          confidence: data.analysis.confidence,
          findings: data.analysis.findings,
          products: data.analysis.products,
          summary: data.analysis.summary
        });
        
        toast({
          title: "Análise concluída",
          description: "Diagnóstico nutricional processado com sucesso",
        });
      } else {
        throw new Error(data.error || 'Erro na análise');
      }
    } catch (error) {
      console.error('Erro na análise:', error);
      
      // Fallback para análise simulada
      setAnalysisResult({
        status: "completed",
        confidence: 75,
        findings: [
          {
            type: "warning",
            title: "Análise básica realizada",
            description: "Sistema funcionando em modo simulado. Integração com IA será ativada em breve.",
            recommendation: "Continue monitorando e consulte um especialista",
            severity: "medium"
          }
        ],
        products: [
          {
            name: "Probionutri Digestivo",
            line: "Probionutri",
            dosage: "2g/kg de ração",
            benefit: "Melhora digestibilidade da fibra"
          }
        ]
      });
      
      toast({
        title: "Análise em modo simulado",
        description: "Funcionalidade completa será ativada em breve",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Diagnóstico Nutricional</h1>
          <p className="text-muted-foreground">
            Análise inteligente baseada em fotos e dados de campo
          </p>
        </div>
        <Badge variant="outline" className="bg-tech-blue/10 text-tech-blue border-tech-blue/20">
          <Brain className="w-4 h-4 mr-1" />
          IA Nutricional
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card variant="tech">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Captura e Upload
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              {selectedImage ? (
                <div className="space-y-4">
                  <img 
                    src={selectedImage} 
                    alt="Imagem selecionada" 
                    className="max-h-48 mx-auto rounded-lg shadow-medium"
                  />
                  <p className="text-sm text-muted-foreground">
                    Imagem carregada com sucesso
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div>
                    <p className="font-medium">Faça upload de uma foto</p>
                    <p className="text-sm text-muted-foreground">
                      Fezes, ração, animal ou instalações
                    </p>
                  </div>
                </div>
              )}
              
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button variant="outline" className="mt-4" asChild>
                  <span className="cursor-pointer">
                    <Camera className="w-4 h-4 mr-2" />
                    Selecionar Imagem
                  </span>
                </Button>
              </label>
            </div>

            <div className="space-y-4">
              <Label htmlFor="field-notes">Observações de Campo (Opcional)</Label>
              <Textarea
                id="field-notes"
                placeholder="Descreva sintomas observados, comportamento dos animais, condições ambientais..."
                value={fieldNotes}
                onChange={(e) => setFieldNotes(e.target.value)}
                rows={4}
              />
            </div>

            <Button 
              variant="hero" 
              className="w-full" 
              disabled={!selectedImage || isAnalyzing}
              onClick={analyzeWithAI}
            >
              {isAnalyzing ? (
                <>
                  <Brain className="w-4 h-4 mr-2 animate-pulse" />
                  Analisando...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Iniciar Análise
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card variant={analysisResult ? "gradient" : "default"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Resultados da Análise
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!analysisResult ? (
              <div className="text-center py-12 text-muted-foreground">
                <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Faça upload de uma imagem para iniciar a análise</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Confiança da Análise</span>
                  <Badge variant="default" className="bg-success">
                    {analysisResult.confidence}%
                  </Badge>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Diagnósticos Identificados</h4>
                  {analysisResult.findings.map((finding: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        {finding.type === "warning" && <AlertTriangle className="w-4 h-4 text-warning" />}
                        {finding.type === "success" && <CheckCircle className="w-4 h-4 text-success" />}
                        {finding.type === "info" && <TrendingUp className="w-4 h-4 text-tech-blue" />}
                        <span className="font-medium text-sm">{finding.title}</span>
                        <Badge 
                          variant={finding.severity === "medium" ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {finding.severity === "medium" ? "Atenção" : "Normal"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{finding.description}</p>
                      <p className="text-sm font-medium text-primary">{finding.recommendation}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Produtos Recomendados</h4>
                  {analysisResult.products.map((product: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{product.name}</span>
                        <Badge variant="outline">{product.line}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Dosagem: {product.dosage}
                      </p>
                      <p className="text-sm text-primary">{product.benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
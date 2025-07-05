import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { imageBase64, fieldNotes, animalType = 'suinos' } = await req.json();

    if (!imageBase64) {
      throw new Error('Image data is required');
    }

    // Prepare the system prompt for nutritional analysis
    const systemPrompt = `Você é um especialista em nutrição animal com foco em ${animalType}. 
    Analise a imagem fornecida e forneça um diagnóstico nutricional detalhado.
    
    Foque em:
    - Análise de fezes (cor, consistência, odor aparente)
    - Condição corporal do animal (se visível)
    - Sinais de deficiências nutricionais
    - Problemas digestivos aparentes
    
    Responda SEMPRE em JSON com esta estrutura exata:
    {
      "confidence": 85,
      "findings": [
        {
          "type": "warning|success|info",
          "title": "Título do achado",
          "description": "Descrição detalhada",
          "recommendation": "Recomendação específica",
          "severity": "low|medium|high"
        }
      ],
      "products": [
        {
          "name": "Nome do produto",
          "line": "Linha do produto",
          "dosage": "Dosagem recomendada",
          "benefit": "Benefício específico"
        }
      ],
      "summary": "Resumo geral da análise"
    }`;

    const userPrompt = `Analise esta imagem relacionada à nutrição animal.
    ${fieldNotes ? `Observações de campo: ${fieldNotes}` : ''}
    
    Forneça um diagnóstico nutricional completo em JSON.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: userPrompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from OpenAI API');
    }

    let analysisResult;
    try {
      analysisResult = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', data.choices[0].message.content);
      
      // Fallback response if JSON parsing fails
      analysisResult = {
        confidence: 75,
        findings: [
          {
            type: "info",
            title: "Análise realizada",
            description: data.choices[0].message.content.substring(0, 200) + "...",
            recommendation: "Consulte um veterinário para análise mais detalhada",
            severity: "medium"
          }
        ],
        products: [
          {
            name: "Probionutri Digestivo",
            line: "Probionutri",
            dosage: "2g/kg de ração",
            benefit: "Melhora saúde digestiva geral"
          }
        ],
        summary: "Análise básica completada. Recomenda-se análise veterinária complementar."
      };
    }

    // Log the analysis for monitoring
    console.log('Analysis completed:', {
      confidence: analysisResult.confidence,
      findingsCount: analysisResult.findings?.length || 0,
      productsCount: analysisResult.products?.length || 0
    });

    return new Response(
      JSON.stringify({
        success: true,
        analysis: analysisResult
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in analyze-image function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'An unexpected error occurred',
        details: error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      animais: {
        Row: {
          company_id: string
          created_at: string | null
          data_nascimento: string | null
          especie: Database["public"]["Enums"]["animal_species"]
          fase_produtiva: Database["public"]["Enums"]["production_phase"] | null
          foto_url: string | null
          id: string
          lote_id: string | null
          nome: string
          observacoes: string | null
          peso: number | null
          propriedade_id: string | null
          proprietario_id: string | null
          qrcode: string | null
          raca: string | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          data_nascimento?: string | null
          especie: Database["public"]["Enums"]["animal_species"]
          fase_produtiva?:
            | Database["public"]["Enums"]["production_phase"]
            | null
          foto_url?: string | null
          id?: string
          lote_id?: string | null
          nome: string
          observacoes?: string | null
          peso?: number | null
          propriedade_id?: string | null
          proprietario_id?: string | null
          qrcode?: string | null
          raca?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          data_nascimento?: string | null
          especie?: Database["public"]["Enums"]["animal_species"]
          fase_produtiva?:
            | Database["public"]["Enums"]["production_phase"]
            | null
          foto_url?: string | null
          id?: string
          lote_id?: string | null
          nome?: string
          observacoes?: string | null
          peso?: number | null
          propriedade_id?: string | null
          proprietario_id?: string | null
          qrcode?: string | null
          raca?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "animais_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animais_lote_id_fkey"
            columns: ["lote_id"]
            isOneToOne: false
            referencedRelation: "lotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animais_proprietario_id_fkey"
            columns: ["proprietario_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_lote"
            columns: ["lote_id"]
            isOneToOne: false
            referencedRelation: "lotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_propriedade"
            columns: ["propriedade_id"]
            isOneToOne: false
            referencedRelation: "propriedades"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_products: {
        Row: {
          ativo: boolean | null
          beneficios: string[] | null
          categoria: string | null
          company_id: string
          composicao: Json | null
          created_at: string | null
          especie_alvo: Database["public"]["Enums"]["animal_species"][] | null
          fase_alvo: Database["public"]["Enums"]["production_phase"][] | null
          id: string
          imagem_url: string | null
          linha: string | null
          nome: string
          objetivo: string | null
          preco_por_kg: number | null
          restricoes: string[] | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          beneficios?: string[] | null
          categoria?: string | null
          company_id: string
          composicao?: Json | null
          created_at?: string | null
          especie_alvo?: Database["public"]["Enums"]["animal_species"][] | null
          fase_alvo?: Database["public"]["Enums"]["production_phase"][] | null
          id?: string
          imagem_url?: string | null
          linha?: string | null
          nome: string
          objetivo?: string | null
          preco_por_kg?: number | null
          restricoes?: string[] | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          beneficios?: string[] | null
          categoria?: string | null
          company_id?: string
          composicao?: Json | null
          created_at?: string | null
          especie_alvo?: Database["public"]["Enums"]["animal_species"][] | null
          fase_alvo?: Database["public"]["Enums"]["production_phase"][] | null
          id?: string
          imagem_url?: string | null
          linha?: string | null
          nome?: string
          objetivo?: string | null
          preco_por_kg?: number | null
          restricoes?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "produtos_anutri_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          company_type: Database["public"]["Enums"]["company_type"] | null
          created_at: string
          description: string | null
          email: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          max_animals: number | null
          max_products: number | null
          max_users: number | null
          name: string
          phone: string | null
          slug: string
          subscription_expires_at: string | null
          subscription_plan:
            | Database["public"]["Enums"]["subscription_plan"]
            | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          company_type?: Database["public"]["Enums"]["company_type"] | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          max_animals?: number | null
          max_products?: number | null
          max_users?: number | null
          name: string
          phone?: string | null
          slug: string
          subscription_expires_at?: string | null
          subscription_plan?:
            | Database["public"]["Enums"]["subscription_plan"]
            | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          company_type?: Database["public"]["Enums"]["company_type"] | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          max_animals?: number | null
          max_products?: number | null
          max_users?: number | null
          name?: string
          phone?: string | null
          slug?: string
          subscription_expires_at?: string | null
          subscription_plan?:
            | Database["public"]["Enums"]["subscription_plan"]
            | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      company_products: {
        Row: {
          benefits: Json | null
          category: string
          certifications: Json | null
          company_id: string
          composition: Json | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          images: Json | null
          is_active: boolean | null
          is_featured: boolean | null
          min_order_quantity: number | null
          name: string
          price: number | null
          product_type: Database["public"]["Enums"]["product_type"] | null
          specifications: Json | null
          stock_quantity: number | null
          storage_instructions: string | null
          subcategory: string | null
          target_phase: Json | null
          target_species: Json | null
          unit: string
          updated_at: string
          usage_instructions: string | null
        }
        Insert: {
          benefits?: Json | null
          category: string
          certifications?: Json | null
          company_id: string
          composition?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          images?: Json | null
          is_active?: boolean | null
          is_featured?: boolean | null
          min_order_quantity?: number | null
          name: string
          price?: number | null
          product_type?: Database["public"]["Enums"]["product_type"] | null
          specifications?: Json | null
          stock_quantity?: number | null
          storage_instructions?: string | null
          subcategory?: string | null
          target_phase?: Json | null
          target_species?: Json | null
          unit: string
          updated_at?: string
          usage_instructions?: string | null
        }
        Update: {
          benefits?: Json | null
          category?: string
          certifications?: Json | null
          company_id?: string
          composition?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          images?: Json | null
          is_active?: boolean | null
          is_featured?: boolean | null
          min_order_quantity?: number | null
          name?: string
          price?: number | null
          product_type?: Database["public"]["Enums"]["product_type"] | null
          specifications?: Json | null
          stock_quantity?: number | null
          storage_instructions?: string | null
          subcategory?: string | null
          target_phase?: Json | null
          target_species?: Json | null
          unit?: string
          updated_at?: string
          usage_instructions?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_products_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnosticos: {
        Row: {
          animal_id: string | null
          company_id: string | null
          confianca_ia: number | null
          created_at: string
          id: string
          imagem_url: string | null
          lote_id: string | null
          observacoes: string | null
          recomendacoes: Json | null
          resultados: Json | null
          status: string
          tipo_diagnostico: string
          user_id: string
        }
        Insert: {
          animal_id?: string | null
          company_id?: string | null
          confianca_ia?: number | null
          created_at?: string
          id?: string
          imagem_url?: string | null
          lote_id?: string | null
          observacoes?: string | null
          recomendacoes?: Json | null
          resultados?: Json | null
          status?: string
          tipo_diagnostico: string
          user_id: string
        }
        Update: {
          animal_id?: string | null
          company_id?: string | null
          confianca_ia?: number | null
          created_at?: string
          id?: string
          imagem_url?: string | null
          lote_id?: string | null
          observacoes?: string | null
          recomendacoes?: Json | null
          resultados?: Json | null
          status?: string
          tipo_diagnostico?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diagnosticos_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnosticos_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnosticos_lote_id_fkey"
            columns: ["lote_id"]
            isOneToOne: false
            referencedRelation: "lotes"
            referencedColumns: ["id"]
          },
        ]
      }
      formulacoes: {
        Row: {
          company_id: string | null
          created_at: string
          custo_por_kg: number | null
          especie: string
          fase: string
          id: string
          ingredientes: Json
          is_favorita: boolean | null
          nome: string
          observacoes: string | null
          updated_at: string
          user_id: string
          valores_nutricionais: Json
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          custo_por_kg?: number | null
          especie: string
          fase: string
          id?: string
          ingredientes: Json
          is_favorita?: boolean | null
          nome: string
          observacoes?: string | null
          updated_at?: string
          user_id: string
          valores_nutricionais: Json
        }
        Update: {
          company_id?: string | null
          created_at?: string
          custo_por_kg?: number | null
          especie?: string
          fase?: string
          id?: string
          ingredientes?: Json
          is_favorita?: boolean | null
          nome?: string
          observacoes?: string | null
          updated_at?: string
          user_id?: string
          valores_nutricionais?: Json
        }
        Relationships: [
          {
            foreignKeyName: "formulacoes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      lotes: {
        Row: {
          company_id: string | null
          created_at: string
          data_inicio: string
          especie: string
          id: string
          idade_media_dias: number | null
          nome: string
          objetivo: string
          peso_medio_atual: number | null
          peso_medio_inicial: number | null
          propriedade_id: string
          quantidade_animais: number
          raca: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          data_inicio: string
          especie: string
          id?: string
          idade_media_dias?: number | null
          nome: string
          objetivo: string
          peso_medio_atual?: number | null
          peso_medio_inicial?: number | null
          propriedade_id: string
          quantidade_animais: number
          raca?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          data_inicio?: string
          especie?: string
          id?: string
          idade_media_dias?: number | null
          nome?: string
          objetivo?: string
          peso_medio_atual?: number | null
          peso_medio_inicial?: number | null
          propriedade_id?: string
          quantidade_animais?: number
          raca?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lotes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lotes_propriedade_id_fkey"
            columns: ["propriedade_id"]
            isOneToOne: false
            referencedRelation: "propriedades"
            referencedColumns: ["id"]
          },
        ]
      }
      metricas_performance: {
        Row: {
          animal_id: string
          company_id: string
          consumo_racao: number | null
          conversao_alimentar: number | null
          created_at: string | null
          data_medicao: string
          ganho_peso_diario: number | null
          id: string
          observacoes: string | null
          peso: number | null
          receita_id: string | null
        }
        Insert: {
          animal_id: string
          company_id: string
          consumo_racao?: number | null
          conversao_alimentar?: number | null
          created_at?: string | null
          data_medicao: string
          ganho_peso_diario?: number | null
          id?: string
          observacoes?: string | null
          peso?: number | null
          receita_id?: string | null
        }
        Update: {
          animal_id?: string
          company_id?: string
          consumo_racao?: number | null
          conversao_alimentar?: number | null
          created_at?: string | null
          data_medicao?: string
          ganho_peso_diario?: number | null
          id?: string
          observacoes?: string | null
          peso?: number | null
          receita_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "metricas_performance_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metricas_performance_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metricas_performance_receita_id_fkey"
            columns: ["receita_id"]
            isOneToOne: false
            referencedRelation: "receitas"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_historico: {
        Row: {
          company_id: string | null
          consumo_racao_kg: number | null
          conversao_alimentar: number | null
          created_at: string
          data_medicao: string
          ganho_peso_diario: number | null
          id: string
          lote_id: string
          mortalidade_periodo: number | null
          observacoes: string | null
          peso_medio: number | null
          user_id: string
        }
        Insert: {
          company_id?: string | null
          consumo_racao_kg?: number | null
          conversao_alimentar?: number | null
          created_at?: string
          data_medicao: string
          ganho_peso_diario?: number | null
          id?: string
          lote_id: string
          mortalidade_periodo?: number | null
          observacoes?: string | null
          peso_medio?: number | null
          user_id: string
        }
        Update: {
          company_id?: string | null
          consumo_racao_kg?: number | null
          conversao_alimentar?: number | null
          created_at?: string
          data_medicao?: string
          ganho_peso_diario?: number | null
          id?: string
          lote_id?: string
          mortalidade_periodo?: number | null
          observacoes?: string | null
          peso_medio?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "performance_historico_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_historico_lote_id_fkey"
            columns: ["lote_id"]
            isOneToOne: false
            referencedRelation: "lotes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          created_at: string
          empresa: string | null
          id: string
          nome: string
          telefone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string
          empresa?: string | null
          id?: string
          nome: string
          telefone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string
          empresa?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      propriedades: {
        Row: {
          area_hectares: number | null
          capacidade_animais: number | null
          company_id: string | null
          created_at: string
          endereco: string | null
          id: string
          nome: string
          tipo_criacao: string
          updated_at: string
          user_id: string
        }
        Insert: {
          area_hectares?: number | null
          capacidade_animais?: number | null
          company_id?: string | null
          created_at?: string
          endereco?: string | null
          id?: string
          nome: string
          tipo_criacao: string
          updated_at?: string
          user_id: string
        }
        Update: {
          area_hectares?: number | null
          capacidade_animais?: number | null
          company_id?: string | null
          created_at?: string
          endereco?: string | null
          id?: string
          nome?: string
          tipo_criacao?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "propriedades_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      receitas: {
        Row: {
          animal_id: string | null
          ativa: boolean | null
          company_id: string
          created_at: string | null
          custo_estimado: number | null
          eficiencia_esperada: number | null
          formula: Json
          id: string
          nome: string
          objetivo: string | null
          observacoes: string | null
          produto_sugerido_id: string | null
          tecnico_id: string
          updated_at: string | null
        }
        Insert: {
          animal_id?: string | null
          ativa?: boolean | null
          company_id: string
          created_at?: string | null
          custo_estimado?: number | null
          eficiencia_esperada?: number | null
          formula: Json
          id?: string
          nome: string
          objetivo?: string | null
          observacoes?: string | null
          produto_sugerido_id?: string | null
          tecnico_id: string
          updated_at?: string | null
        }
        Update: {
          animal_id?: string | null
          ativa?: boolean | null
          company_id?: string
          created_at?: string | null
          custo_estimado?: number | null
          eficiencia_esperada?: number | null
          formula?: Json
          id?: string
          nome?: string
          objetivo?: string | null
          observacoes?: string | null
          produto_sugerido_id?: string | null
          tecnico_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "receitas_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receitas_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receitas_produto_sugerido_id_fkey"
            columns: ["produto_sugerido_id"]
            isOneToOne: false
            referencedRelation: "catalog_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receitas_tecnico_id_fkey"
            columns: ["tecnico_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      simulacoes_racao: {
        Row: {
          animal_id: string | null
          company_id: string
          created_at: string | null
          custo_por_kg: number | null
          custo_total: number | null
          eficiencia_estimada: number | null
          formula: Json
          id: string
          impacto_ambiental: Json | null
          nome_simulacao: string
          substituicoes: Json | null
          usuario_id: string
        }
        Insert: {
          animal_id?: string | null
          company_id: string
          created_at?: string | null
          custo_por_kg?: number | null
          custo_total?: number | null
          eficiencia_estimada?: number | null
          formula: Json
          id?: string
          impacto_ambiental?: Json | null
          nome_simulacao: string
          substituicoes?: Json | null
          usuario_id: string
        }
        Update: {
          animal_id?: string | null
          company_id?: string
          created_at?: string | null
          custo_por_kg?: number | null
          custo_total?: number | null
          eficiencia_estimada?: number | null
          formula?: Json
          id?: string
          impacto_ambiental?: Json | null
          nome_simulacao?: string
          substituicoes?: Json | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "simulacoes_racao_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "simulacoes_racao_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "simulacoes_racao_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      sustentabilidade: {
        Row: {
          animal_id: string | null
          company_id: string
          created_at: string | null
          eficiencia_energetica: number | null
          fcr: number | null
          id: string
          pegada_carbono: number | null
          periodo_fim: string
          periodo_inicio: string
          residuos_gerados: number | null
          uso_agua: number | null
        }
        Insert: {
          animal_id?: string | null
          company_id: string
          created_at?: string | null
          eficiencia_energetica?: number | null
          fcr?: number | null
          id?: string
          pegada_carbono?: number | null
          periodo_fim: string
          periodo_inicio: string
          residuos_gerados?: number | null
          uso_agua?: number | null
        }
        Update: {
          animal_id?: string | null
          company_id?: string
          created_at?: string | null
          eficiencia_energetica?: number | null
          fcr?: number | null
          id?: string
          pegada_carbono?: number | null
          periodo_fim?: string
          periodo_inicio?: string
          residuos_gerados?: number | null
          uso_agua?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sustentabilidade_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sustentabilidade_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          is_active: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_end: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_uuid: string; comp_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      user_has_company_access: {
        Args: { user_uuid: string; comp_id: string }
        Returns: boolean
      }
    }
    Enums: {
      animal_species:
        | "bovino"
        | "suino"
        | "aves"
        | "caprino"
        | "ovino"
        | "equino"
        | "outros"
      company_type:
        | "veterinario"
        | "empresa_alimento"
        | "empresa_medicamento"
        | "geral"
      product_type: "alimento" | "medicamento" | "geral"
      production_phase:
        | "cria"
        | "recria"
        | "engorda"
        | "reproducao"
        | "lactacao"
        | "manutencao"
      subscription_plan: "basico" | "profissional" | "enterprise"
      user_role:
        | "super_admin"
        | "company_admin"
        | "veterinario"
        | "cliente"
        | "tecnico"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      animal_species: [
        "bovino",
        "suino",
        "aves",
        "caprino",
        "ovino",
        "equino",
        "outros",
      ],
      company_type: [
        "veterinario",
        "empresa_alimento",
        "empresa_medicamento",
        "geral",
      ],
      product_type: ["alimento", "medicamento", "geral"],
      production_phase: [
        "cria",
        "recria",
        "engorda",
        "reproducao",
        "lactacao",
        "manutencao",
      ],
      subscription_plan: ["basico", "profissional", "enterprise"],
      user_role: [
        "super_admin",
        "company_admin",
        "veterinario",
        "cliente",
        "tecnico",
      ],
    },
  },
} as const

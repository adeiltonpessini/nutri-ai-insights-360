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
          escore_corporal: number | null
          especie: Database["public"]["Enums"]["animal_species"]
          fase_produtiva: Database["public"]["Enums"]["production_phase"] | null
          foto_url: string | null
          geolocalizacao: unknown | null
          id: string
          linhagem_genetica: string | null
          lote_id: string | null
          maes_id: string | null
          nome: string
          observacoes: string | null
          origem: string | null
          pais_id: string | null
          peso: number | null
          propriedade_id: string | null
          proprietario_id: string | null
          qrcode: string | null
          raca: string | null
          status_saude: string | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          data_nascimento?: string | null
          escore_corporal?: number | null
          especie: Database["public"]["Enums"]["animal_species"]
          fase_produtiva?:
            | Database["public"]["Enums"]["production_phase"]
            | null
          foto_url?: string | null
          geolocalizacao?: unknown | null
          id?: string
          linhagem_genetica?: string | null
          lote_id?: string | null
          maes_id?: string | null
          nome: string
          observacoes?: string | null
          origem?: string | null
          pais_id?: string | null
          peso?: number | null
          propriedade_id?: string | null
          proprietario_id?: string | null
          qrcode?: string | null
          raca?: string | null
          status_saude?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          data_nascimento?: string | null
          escore_corporal?: number | null
          especie?: Database["public"]["Enums"]["animal_species"]
          fase_produtiva?:
            | Database["public"]["Enums"]["production_phase"]
            | null
          foto_url?: string | null
          geolocalizacao?: unknown | null
          id?: string
          linhagem_genetica?: string | null
          lote_id?: string | null
          maes_id?: string | null
          nome?: string
          observacoes?: string | null
          origem?: string | null
          pais_id?: string | null
          peso?: number | null
          propriedade_id?: string | null
          proprietario_id?: string | null
          qrcode?: string | null
          raca?: string | null
          status_saude?: string | null
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
            foreignKeyName: "animais_maes_id_fkey"
            columns: ["maes_id"]
            isOneToOne: false
            referencedRelation: "animais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animais_pais_id_fkey"
            columns: ["pais_id"]
            isOneToOne: false
            referencedRelation: "animais"
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
      animal_anexos: {
        Row: {
          animal_id: string
          company_id: string
          created_at: string
          id: string
          nome_arquivo: string
          tamanho_bytes: number | null
          tipo: string
          tipo_mime: string | null
          uploaded_by: string | null
          url_arquivo: string
        }
        Insert: {
          animal_id: string
          company_id: string
          created_at?: string
          id?: string
          nome_arquivo: string
          tamanho_bytes?: number | null
          tipo: string
          tipo_mime?: string | null
          uploaded_by?: string | null
          url_arquivo: string
        }
        Update: {
          animal_id?: string
          company_id?: string
          created_at?: string
          id?: string
          nome_arquivo?: string
          tamanho_bytes?: number | null
          tipo?: string
          tipo_mime?: string | null
          uploaded_by?: string | null
          url_arquivo?: string
        }
        Relationships: [
          {
            foreignKeyName: "animal_anexos_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animal_anexos_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "animal_anexos_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      audit_log: {
        Row: {
          acao: string
          company_id: string
          dados_anteriores: Json | null
          dados_novos: Json | null
          id: string
          registro_id: string
          tabela: string
          timestamp: string
          user_id: string
        }
        Insert: {
          acao: string
          company_id: string
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          id?: string
          registro_id: string
          tabela: string
          timestamp?: string
          user_id: string
        }
        Update: {
          acao?: string
          company_id?: string
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          id?: string
          registro_id?: string
          tabela?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      calendario_veterinario: {
        Row: {
          animal_id: string | null
          company_id: string
          created_at: string
          data_agendada: string
          data_realizada: string | null
          descricao: string | null
          id: string
          lote_id: string | null
          observacoes: string | null
          status: string | null
          tipo_evento: string
          titulo: string
          veterinario_responsavel: string | null
        }
        Insert: {
          animal_id?: string | null
          company_id: string
          created_at?: string
          data_agendada: string
          data_realizada?: string | null
          descricao?: string | null
          id?: string
          lote_id?: string | null
          observacoes?: string | null
          status?: string | null
          tipo_evento: string
          titulo: string
          veterinario_responsavel?: string | null
        }
        Update: {
          animal_id?: string | null
          company_id?: string
          created_at?: string
          data_agendada?: string
          data_realizada?: string | null
          descricao?: string | null
          id?: string
          lote_id?: string | null
          observacoes?: string | null
          status?: string | null
          tipo_evento?: string
          titulo?: string
          veterinario_responsavel?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendario_veterinario_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendario_veterinario_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendario_veterinario_lote_id_fkey"
            columns: ["lote_id"]
            isOneToOne: false
            referencedRelation: "lotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendario_veterinario_veterinario_responsavel_fkey"
            columns: ["veterinario_responsavel"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
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
      comparacao_receitas: {
        Row: {
          company_id: string
          created_at: string
          created_by: string | null
          id: string
          nome_comparacao: string
          receita_a_id: string | null
          receita_b_id: string | null
          resultado_analise: Json | null
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          nome_comparacao: string
          receita_a_id?: string | null
          receita_b_id?: string | null
          resultado_analise?: Json | null
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          nome_comparacao?: string
          receita_a_id?: string | null
          receita_b_id?: string | null
          resultado_analise?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "comparacao_receitas_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comparacao_receitas_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "comparacao_receitas_receita_a_id_fkey"
            columns: ["receita_a_id"]
            isOneToOne: false
            referencedRelation: "receitas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comparacao_receitas_receita_b_id_fkey"
            columns: ["receita_b_id"]
            isOneToOne: false
            referencedRelation: "receitas"
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
      estoque_insumos: {
        Row: {
          ativo: boolean | null
          categoria: string
          codigo_produto: string | null
          company_id: string
          created_at: string
          data_validade: string | null
          fornecedor: string | null
          id: string
          localizacao: string | null
          lote_fornecedor: string | null
          marca: string | null
          nome: string
          preco_unitario: number | null
          quantidade_atual: number | null
          quantidade_minima: number | null
          unidade_medida: string
        }
        Insert: {
          ativo?: boolean | null
          categoria: string
          codigo_produto?: string | null
          company_id: string
          created_at?: string
          data_validade?: string | null
          fornecedor?: string | null
          id?: string
          localizacao?: string | null
          lote_fornecedor?: string | null
          marca?: string | null
          nome: string
          preco_unitario?: number | null
          quantidade_atual?: number | null
          quantidade_minima?: number | null
          unidade_medida: string
        }
        Update: {
          ativo?: boolean | null
          categoria?: string
          codigo_produto?: string | null
          company_id?: string
          created_at?: string
          data_validade?: string | null
          fornecedor?: string | null
          id?: string
          localizacao?: string | null
          lote_fornecedor?: string | null
          marca?: string | null
          nome?: string
          preco_unitario?: number | null
          quantidade_atual?: number | null
          quantidade_minima?: number | null
          unidade_medida?: string
        }
        Relationships: [
          {
            foreignKeyName: "estoque_insumos_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
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
      funcionarios: {
        Row: {
          ativo: boolean | null
          cargo: string
          company_id: string
          created_at: string
          data_admissao: string | null
          data_demissao: string | null
          email: string | null
          id: string
          nome: string
          salario: number | null
          telefone: string | null
        }
        Insert: {
          ativo?: boolean | null
          cargo: string
          company_id: string
          created_at?: string
          data_admissao?: string | null
          data_demissao?: string | null
          email?: string | null
          id?: string
          nome: string
          salario?: number | null
          telefone?: string | null
        }
        Update: {
          ativo?: boolean | null
          cargo?: string
          company_id?: string
          created_at?: string
          data_admissao?: string | null
          data_demissao?: string | null
          email?: string | null
          id?: string
          nome?: string
          salario?: number | null
          telefone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "funcionarios_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      historico_saude: {
        Row: {
          animal_id: string
          company_id: string
          created_at: string
          data_aplicacao: string
          descricao: string
          id: string
          observacoes: string | null
          tipo: string
          updated_at: string
          veterinario_responsavel: string | null
        }
        Insert: {
          animal_id: string
          company_id: string
          created_at?: string
          data_aplicacao: string
          descricao: string
          id?: string
          observacoes?: string | null
          tipo: string
          updated_at?: string
          veterinario_responsavel?: string | null
        }
        Update: {
          animal_id?: string
          company_id?: string
          created_at?: string
          data_aplicacao?: string
          descricao?: string
          id?: string
          observacoes?: string | null
          tipo?: string
          updated_at?: string
          veterinario_responsavel?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "historico_saude_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historico_saude_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historico_saude_veterinario_responsavel_fkey"
            columns: ["veterinario_responsavel"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
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
      movimentacoes_estoque: {
        Row: {
          company_id: string
          created_at: string
          data_movimentacao: string
          documento: string | null
          id: string
          insumo_id: string
          motivo: string
          observacoes: string | null
          quantidade: number
          responsavel_id: string | null
          tipo_movimentacao: string
        }
        Insert: {
          company_id: string
          created_at?: string
          data_movimentacao: string
          documento?: string | null
          id?: string
          insumo_id: string
          motivo: string
          observacoes?: string | null
          quantidade: number
          responsavel_id?: string | null
          tipo_movimentacao: string
        }
        Update: {
          company_id?: string
          created_at?: string
          data_movimentacao?: string
          documento?: string | null
          id?: string
          insumo_id?: string
          motivo?: string
          observacoes?: string | null
          quantidade?: number
          responsavel_id?: string | null
          tipo_movimentacao?: string
        }
        Relationships: [
          {
            foreignKeyName: "movimentacoes_estoque_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimentacoes_estoque_insumo_id_fkey"
            columns: ["insumo_id"]
            isOneToOne: false
            referencedRelation: "estoque_insumos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimentacoes_estoque_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      movimentacoes_financeiras: {
        Row: {
          animal_id: string | null
          company_id: string
          conta_id: string
          created_at: string
          created_by: string | null
          data_movimentacao: string
          descricao: string
          documento: string | null
          id: string
          lote_id: string | null
          observacoes: string | null
          tipo: string
          valor: number
        }
        Insert: {
          animal_id?: string | null
          company_id: string
          conta_id: string
          created_at?: string
          created_by?: string | null
          data_movimentacao: string
          descricao: string
          documento?: string | null
          id?: string
          lote_id?: string | null
          observacoes?: string | null
          tipo: string
          valor: number
        }
        Update: {
          animal_id?: string | null
          company_id?: string
          conta_id?: string
          created_at?: string
          created_by?: string | null
          data_movimentacao?: string
          descricao?: string
          documento?: string | null
          id?: string
          lote_id?: string | null
          observacoes?: string | null
          tipo?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "movimentacoes_financeiras_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimentacoes_financeiras_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimentacoes_financeiras_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "plano_contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimentacoes_financeiras_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "movimentacoes_financeiras_lote_id_fkey"
            columns: ["lote_id"]
            isOneToOne: false
            referencedRelation: "lotes"
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
      plano_contas: {
        Row: {
          ativo: boolean | null
          categoria: string
          codigo: string
          company_id: string
          conta_pai_id: string | null
          created_at: string
          id: string
          nome: string
          tipo: string
        }
        Insert: {
          ativo?: boolean | null
          categoria: string
          codigo: string
          company_id: string
          conta_pai_id?: string | null
          created_at?: string
          id?: string
          nome: string
          tipo: string
        }
        Update: {
          ativo?: boolean | null
          categoria?: string
          codigo?: string
          company_id?: string
          conta_pai_id?: string | null
          created_at?: string
          id?: string
          nome?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "plano_contas_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plano_contas_conta_pai_id_fkey"
            columns: ["conta_pai_id"]
            isOneToOne: false
            referencedRelation: "plano_contas"
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
      stripe_webhook_events: {
        Row: {
          created_at: string
          data: Json
          event_type: string
          id: string
          processed: boolean
          stripe_event_id: string
        }
        Insert: {
          created_at?: string
          data: Json
          event_type: string
          id?: string
          processed?: boolean
          stripe_event_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          event_type?: string
          id?: string
          processed?: boolean
          stripe_event_id?: string
        }
        Relationships: []
      }
      sustentabilidade: {
        Row: {
          animal_id: string | null
          company_id: string
          consumo_agua_litros: number | null
          created_at: string | null
          eficiencia_energetica: number | null
          emissao_metano: number | null
          fcr: number | null
          id: string
          pegada_carbono: number | null
          periodo_fim: string
          periodo_inicio: string
          pontuacao_esg: number | null
          residuos_gerados: number | null
          uso_agua: number | null
        }
        Insert: {
          animal_id?: string | null
          company_id: string
          consumo_agua_litros?: number | null
          created_at?: string | null
          eficiencia_energetica?: number | null
          emissao_metano?: number | null
          fcr?: number | null
          id?: string
          pegada_carbono?: number | null
          periodo_fim: string
          periodo_inicio: string
          pontuacao_esg?: number | null
          residuos_gerados?: number | null
          uso_agua?: number | null
        }
        Update: {
          animal_id?: string | null
          company_id?: string
          consumo_agua_litros?: number | null
          created_at?: string | null
          eficiencia_energetica?: number | null
          emissao_metano?: number | null
          fcr?: number | null
          id?: string
          pegada_carbono?: number | null
          periodo_fim?: string
          periodo_inicio?: string
          pontuacao_esg?: number | null
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
      tarefas_diarias: {
        Row: {
          company_id: string
          created_at: string
          data_concluida: string | null
          data_prevista: string
          descricao: string | null
          executado_por: string | null
          id: string
          observacoes: string | null
          prioridade: string | null
          responsavel_id: string | null
          status: string | null
          tempo_estimado: number | null
          tempo_real: number | null
          tipo: string
          titulo: string
        }
        Insert: {
          company_id: string
          created_at?: string
          data_concluida?: string | null
          data_prevista: string
          descricao?: string | null
          executado_por?: string | null
          id?: string
          observacoes?: string | null
          prioridade?: string | null
          responsavel_id?: string | null
          status?: string | null
          tempo_estimado?: number | null
          tempo_real?: number | null
          tipo: string
          titulo: string
        }
        Update: {
          company_id?: string
          created_at?: string
          data_concluida?: string | null
          data_prevista?: string
          descricao?: string | null
          executado_por?: string | null
          id?: string
          observacoes?: string | null
          prioridade?: string | null
          responsavel_id?: string | null
          status?: string | null
          tempo_estimado?: number | null
          tempo_real?: number | null
          tipo?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "tarefas_diarias_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tarefas_diarias_executado_por_fkey"
            columns: ["executado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "tarefas_diarias_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      team_invitations: {
        Row: {
          company_id: string
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string
          role: Database["public"]["Enums"]["user_role"]
          status: string
          token: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by: string
          role?: Database["public"]["Enums"]["user_role"]
          status?: string
          token?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          role?: Database["public"]["Enums"]["user_role"]
          status?: string
          token?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_invitations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_onboarding: {
        Row: {
          completed: boolean
          completed_steps: string[]
          created_at: string
          current_step: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_steps?: string[]
          created_at?: string
          current_step?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_steps?: string[]
          created_at?: string
          current_step?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      accept_team_invitation: {
        Args: { invitation_token: string }
        Returns: Json
      }
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

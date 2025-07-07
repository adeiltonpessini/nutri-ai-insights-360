export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          address: string | null
          created_at: string
          description: string | null
          email: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          phone: string | null
          slug: string
          subscription_expires_at: string | null
          subscription_plan: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          phone?: string | null
          slug: string
          subscription_expires_at?: string | null
          subscription_plan?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          slug?: string
          subscription_expires_at?: string | null
          subscription_plan?: string | null
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
        ]
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
      user_role: "super_admin" | "company_admin" | "veterinario" | "cliente"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["super_admin", "company_admin", "veterinario", "cliente"],
    },
  },
} as const

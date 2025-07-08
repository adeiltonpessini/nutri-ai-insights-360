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
          created_at: string | null
          id: string
          idade: number | null
          nome: string
          peso: number | null
          proprietario_id: string | null
          raca: string | null
          status_saude: Database["public"]["Enums"]["health_status"] | null
          tipo: Database["public"]["Enums"]["animal_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          idade?: number | null
          nome: string
          peso?: number | null
          proprietario_id?: string | null
          raca?: string | null
          status_saude?: Database["public"]["Enums"]["health_status"] | null
          tipo: Database["public"]["Enums"]["animal_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          idade?: number | null
          nome?: string
          peso?: number | null
          proprietario_id?: string | null
          raca?: string | null
          status_saude?: Database["public"]["Enums"]["health_status"] | null
          tipo?: Database["public"]["Enums"]["animal_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "animais_proprietario_id_fkey"
            columns: ["proprietario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          cnpj: string
          created_at: string | null
          id: string
          nome: string
          tipo_empresa: string
          updated_at: string | null
        }
        Insert: {
          cnpj: string
          created_at?: string | null
          id?: string
          nome: string
          tipo_empresa: string
          updated_at?: string | null
        }
        Update: {
          cnpj?: string
          created_at?: string | null
          id?: string
          nome?: string
          tipo_empresa?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      historico_medico: {
        Row: {
          animal_id: string | null
          created_at: string | null
          data_consulta: string
          diagnostico: string | null
          id: string
          observacoes: string | null
          peso_atual: number | null
          veterinario_id: string | null
        }
        Insert: {
          animal_id?: string | null
          created_at?: string | null
          data_consulta: string
          diagnostico?: string | null
          id?: string
          observacoes?: string | null
          peso_atual?: number | null
          veterinario_id?: string | null
        }
        Update: {
          animal_id?: string | null
          created_at?: string | null
          data_consulta?: string
          diagnostico?: string | null
          id?: string
          observacoes?: string | null
          peso_atual?: number | null
          veterinario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "historico_medico_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historico_medico_veterinario_id_fkey"
            columns: ["veterinario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      metricas_saude: {
        Row: {
          animal_id: string | null
          condicao_corporal: number | null
          created_at: string | null
          data_medicao: string
          id: string
          nivel_atividade: string | null
          observacoes: string | null
          peso: number | null
        }
        Insert: {
          animal_id?: string | null
          condicao_corporal?: number | null
          created_at?: string | null
          data_medicao: string
          id?: string
          nivel_atividade?: string | null
          observacoes?: string | null
          peso?: number | null
        }
        Update: {
          animal_id?: string | null
          condicao_corporal?: number | null
          created_at?: string | null
          data_medicao?: string
          id?: string
          nivel_atividade?: string | null
          observacoes?: string | null
          peso?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "metricas_saude_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animais"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          categoria: Database["public"]["Enums"]["produto_categoria"]
          composicao: Json | null
          created_at: string | null
          descricao: string | null
          empresa_id: string | null
          id: string
          nome: string
          preco: number
          updated_at: string | null
        }
        Insert: {
          categoria: Database["public"]["Enums"]["produto_categoria"]
          composicao?: Json | null
          created_at?: string | null
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          nome: string
          preco: number
          updated_at?: string | null
        }
        Update: {
          categoria?: Database["public"]["Enums"]["produto_categoria"]
          composicao?: Json | null
          created_at?: string | null
          descricao?: string | null
          empresa_id?: string | null
          id?: string
          nome?: string
          preco?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "produtos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      recomendacoes_nutricionais: {
        Row: {
          animal_id: string | null
          created_at: string | null
          data_fim: string | null
          data_inicio: string
          id: string
          observacoes: string | null
          produto_id: string | null
          quantidade_diaria: number | null
          veterinario_id: string | null
        }
        Insert: {
          animal_id?: string | null
          created_at?: string | null
          data_fim?: string | null
          data_inicio: string
          id?: string
          observacoes?: string | null
          produto_id?: string | null
          quantidade_diaria?: number | null
          veterinario_id?: string | null
        }
        Update: {
          animal_id?: string | null
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string
          id?: string
          observacoes?: string | null
          produto_id?: string | null
          quantidade_diaria?: number | null
          veterinario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recomendacoes_nutricionais_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recomendacoes_nutricionais_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recomendacoes_nutricionais_veterinario_id_fkey"
            columns: ["veterinario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          created_at: string | null
          email: string
          empresa_id: string | null
          id: string
          nome: string
          role: Database["public"]["Enums"]["user_role"]
          senha: string
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          empresa_id?: string | null
          id?: string
          nome: string
          role: Database["public"]["Enums"]["user_role"]
          senha: string
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          empresa_id?: string | null
          id?: string
          nome?: string
          role?: Database["public"]["Enums"]["user_role"]
          senha?: string
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      user_has_company_access: {
        Args: { user_uuid: string; comp_id: string }
        Returns: boolean
      }
    }
    Enums: {
      animal_type: "cao" | "gato" | "cavalo" | "outros"
      health_status: "saudavel" | "sobrepeso" | "baixo_peso" | "convalescente"
      produto_categoria: "racao" | "suplemento" | "medicamento" | "acessorio"
      user_role: "admin" | "veterinario" | "empresa" | "cliente"
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
      animal_type: ["cao", "gato", "cavalo", "outros"],
      health_status: ["saudavel", "sobrepeso", "baixo_peso", "convalescente"],
      produto_categoria: ["racao", "suplemento", "medicamento", "acessorio"],
      user_role: ["admin", "veterinario", "empresa", "cliente"],
    },
  },
} as const

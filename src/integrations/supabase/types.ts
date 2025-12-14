export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      diet_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      diets: {
        Row: {
          created_at: string
          diet_type_id: string
          end_date: string | null
          feeding_time: string | null
          food_name: string
          id: string
          notes: string | null
          pet_id: string
          quantity: string | null
          start_date: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          diet_type_id: string
          end_date?: string | null
          feeding_time?: string | null
          food_name: string
          id?: string
          notes?: string | null
          pet_id: string
          quantity?: string | null
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          diet_type_id?: string
          end_date?: string | null
          feeding_time?: string | null
          food_name?: string
          id?: string
          notes?: string | null
          pet_id?: string
          quantity?: string | null
          start_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "diets_diet_type_id_fkey"
            columns: ["diet_type_id"]
            isOneToOne: false
            referencedRelation: "diet_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diets_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          created_at: string
          email: string
          first_name: string
          hire_date: string
          id: string
          is_active: boolean | null
          last_name: string
          phone: string | null
          role: Database["public"]["Enums"]["employee_role"]
          specialization: string | null
          spouse_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          hire_date: string
          id?: string
          is_active?: boolean | null
          last_name: string
          phone?: string | null
          role: Database["public"]["Enums"]["employee_role"]
          specialization?: string | null
          spouse_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          hire_date?: string
          id?: string
          is_active?: boolean | null
          last_name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["employee_role"]
          specialization?: string | null
          spouse_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_spouse_id_fkey"
            columns: ["spouse_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_checks: {
        Row: {
          check_date: string
          created_at: string
          diagnosis: string | null
          id: string
          next_check_date: string | null
          notes: string | null
          pet_id: string
          treatment: string | null
          vet_id: string | null
        }
        Insert: {
          check_date: string
          created_at?: string
          diagnosis?: string | null
          id?: string
          next_check_date?: string | null
          notes?: string | null
          pet_id: string
          treatment?: string | null
          vet_id?: string | null
        }
        Update: {
          check_date?: string
          created_at?: string
          diagnosis?: string | null
          id?: string
          next_check_date?: string | null
          notes?: string | null
          pet_id?: string
          treatment?: string | null
          vet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_checks_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_checks_vet_id_fkey"
            columns: ["vet_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          created_at: string
          date_of_birth: string | null
          enclosure: string | null
          gender: string | null
          health_status: Database["public"]["Enums"]["health_status"] | null
          hibernation_end: string | null
          hibernation_start: string | null
          id: string
          name: string
          notes: string | null
          species: string
          species_type: Database["public"]["Enums"]["species_type"]
          updated_at: string
          weight: number | null
          wintering_location: string | null
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          enclosure?: string | null
          gender?: string | null
          health_status?: Database["public"]["Enums"]["health_status"] | null
          hibernation_end?: string | null
          hibernation_start?: string | null
          id?: string
          name: string
          notes?: string | null
          species: string
          species_type: Database["public"]["Enums"]["species_type"]
          updated_at?: string
          weight?: number | null
          wintering_location?: string | null
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          enclosure?: string | null
          gender?: string | null
          health_status?: Database["public"]["Enums"]["health_status"] | null
          hibernation_end?: string | null
          hibernation_start?: string | null
          id?: string
          name?: string
          notes?: string | null
          species?: string
          species_type?: Database["public"]["Enums"]["species_type"]
          updated_at?: string
          weight?: number | null
          wintering_location?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_diet: {
        Args: {
          p_diet_type_id: string
          p_end_date?: string
          p_feeding_time?: string
          p_food_name: string
          p_notes?: string
          p_pet_id: string
          p_quantity?: string
          p_start_date?: string
        }
        Returns: string
      }
      add_diet_type: {
        Args: { p_description?: string; p_name: string }
        Returns: string
      }
      add_employee: {
        Args: {
          p_email: string
          p_first_name: string
          p_hire_date?: string
          p_last_name: string
          p_phone?: string
          p_role?: Database["public"]["Enums"]["employee_role"]
          p_specialization?: string
          p_spouse_id?: string
        }
        Returns: string
      }
      add_medical_check: {
        Args: {
          p_check_date: string
          p_diagnosis?: string
          p_next_check_date?: string
          p_notes?: string
          p_pet_id: string
          p_treatment?: string
          p_vet_id: string
        }
        Returns: string
      }
      add_pet: {
        Args: {
          p_date_of_birth?: string
          p_enclosure?: string
          p_gender?: string
          p_health_status?: Database["public"]["Enums"]["health_status"]
          p_hibernation_end?: string
          p_hibernation_start?: string
          p_name: string
          p_notes?: string
          p_species: string
          p_species_type: Database["public"]["Enums"]["species_type"]
          p_weight?: number
          p_wintering_location?: string
        }
        Returns: string
      }
      delete_diet: { Args: { p_id: string }; Returns: boolean }
      delete_employee: { Args: { p_id: string }; Returns: boolean }
      delete_pet: { Args: { p_id: string }; Returns: boolean }
      get_married_couples: {
        Args: never
        Returns: {
          employee1_id: string
          employee1_name: string
          employee1_role: Database["public"]["Enums"]["employee_role"]
          employee2_id: string
          employee2_name: string
          employee2_role: Database["public"]["Enums"]["employee_role"]
        }[]
      }
      get_pet_full_info: {
        Args: { search_term?: string }
        Returns: {
          current_diet: string
          date_of_birth: string
          enclosure: string
          gender: string
          health_status: Database["public"]["Enums"]["health_status"]
          hibernation_end: string
          hibernation_start: string
          id: string
          last_medical_check: string
          last_vet: string
          name: string
          notes: string
          species: string
          species_type: Database["public"]["Enums"]["species_type"]
          weight: number
          wintering_location: string
        }[]
      }
      get_pets_with_diets: {
        Args: never
        Returns: {
          diet_type: string
          feeding_time: string
          food_name: string
          pet_id: string
          pet_name: string
          quantity: string
          species: string
        }[]
      }
      update_diet: {
        Args: {
          p_diet_type_id?: string
          p_end_date?: string
          p_feeding_time?: string
          p_food_name?: string
          p_id: string
          p_notes?: string
          p_quantity?: string
          p_start_date?: string
        }
        Returns: boolean
      }
      update_employee: {
        Args: {
          p_email?: string
          p_first_name?: string
          p_hire_date?: string
          p_id: string
          p_is_active?: boolean
          p_last_name?: string
          p_phone?: string
          p_role?: Database["public"]["Enums"]["employee_role"]
          p_specialization?: string
          p_spouse_id?: string
        }
        Returns: boolean
      }
      update_pet: {
        Args: {
          p_date_of_birth?: string
          p_enclosure?: string
          p_gender?: string
          p_health_status?: Database["public"]["Enums"]["health_status"]
          p_hibernation_end?: string
          p_hibernation_start?: string
          p_id: string
          p_name?: string
          p_notes?: string
          p_species?: string
          p_species_type?: Database["public"]["Enums"]["species_type"]
          p_weight?: number
          p_wintering_location?: string
        }
        Returns: boolean
      }
    }
    Enums: {
      employee_role: "Keeper" | "Veterinarian"
      health_status:
        | "Healthy"
        | "Sick"
        | "Under Treatment"
        | "Recovering"
        | "Critical"
      species_type:
        | "Mammal"
        | "Bird"
        | "Reptile"
        | "Amphibian"
        | "Fish"
        | "Invertebrate"
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
      employee_role: ["Keeper", "Veterinarian"],
      health_status: [
        "Healthy",
        "Sick",
        "Under Treatment",
        "Recovering",
        "Critical",
      ],
      species_type: [
        "Mammal",
        "Bird",
        "Reptile",
        "Amphibian",
        "Fish",
        "Invertebrate",
      ],
    },
  },
} as const

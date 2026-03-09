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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      chapters: {
        Row: {
          created_at: string
          description: string | null
          display_name: string
          id: string
          is_active: boolean
          name: string
          position: number
          subject_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_name: string
          id?: string
          is_active?: boolean
          name: string
          position?: number
          subject_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_name?: string
          id?: string
          is_active?: boolean
          name?: string
          position?: number
          subject_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapters_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          created_at: string
          description: string | null
          display_name: string
          id: string
          is_active: boolean
          name: string
          position: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_name: string
          id?: string
          is_active?: boolean
          name: string
          position?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_name?: string
          id?: string
          is_active?: boolean
          name?: string
          position?: number
          updated_at?: string
        }
        Relationships: []
      }
      cqs: {
        Row: {
          answer_a: string | null
          answer_b: string | null
          answer_c: string | null
          answer_d: string | null
          context: string
          created_at: string
          created_by: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          id: string
          is_active: boolean
          position: number
          question_a: string
          question_b: string
          question_c: string
          question_d: string
          sub_topic_id: string
          updated_at: string
        }
        Insert: {
          answer_a?: string | null
          answer_b?: string | null
          answer_c?: string | null
          answer_d?: string | null
          context: string
          created_at?: string
          created_by?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          id?: string
          is_active?: boolean
          position?: number
          question_a: string
          question_b: string
          question_c: string
          question_d: string
          sub_topic_id: string
          updated_at?: string
        }
        Update: {
          answer_a?: string | null
          answer_b?: string | null
          answer_c?: string | null
          answer_d?: string | null
          context?: string
          created_at?: string
          created_by?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          id?: string
          is_active?: boolean
          position?: number
          question_a?: string
          question_b?: string
          question_c?: string
          question_d?: string
          sub_topic_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cqs_sub_topic_id_fkey"
            columns: ["sub_topic_id"]
            isOneToOne: false
            referencedRelation: "sub_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      mcqs: {
        Row: {
          correct_answer: number
          created_at: string
          created_by: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          explanation: string | null
          id: string
          is_active: boolean
          options: Json
          position: number
          question: string
          sub_topic_id: string
          updated_at: string
        }
        Insert: {
          correct_answer: number
          created_at?: string
          created_by?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          explanation?: string | null
          id?: string
          is_active?: boolean
          options?: Json
          position?: number
          question: string
          sub_topic_id: string
          updated_at?: string
        }
        Update: {
          correct_answer?: number
          created_at?: string
          created_by?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          explanation?: string | null
          id?: string
          is_active?: boolean
          options?: Json
          position?: number
          question?: string
          sub_topic_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mcqs_sub_topic_id_fkey"
            columns: ["sub_topic_id"]
            isOneToOne: false
            referencedRelation: "sub_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      question_bookmarks: {
        Row: {
          created_at: string
          id: string
          question_id: string
          question_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_id: string
          question_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string
          question_type?: string
          user_id?: string
        }
        Relationships: []
      }
      question_types: {
        Row: {
          chapter_id: string | null
          created_at: string
          display_name: string
          id: string
          is_active: boolean
          name: string
          subject_id: string
          updated_at: string
        }
        Insert: {
          chapter_id?: string | null
          created_at?: string
          display_name: string
          id?: string
          is_active?: boolean
          name: string
          subject_id: string
          updated_at?: string
        }
        Update: {
          chapter_id?: string | null
          created_at?: string
          display_name?: string
          id?: string
          is_active?: boolean
          name?: string
          subject_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_types_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_types_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      sub_topics: {
        Row: {
          created_at: string
          description: string | null
          display_name: string
          id: string
          is_active: boolean
          name: string
          position: number
          topic_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_name: string
          id?: string
          is_active?: boolean
          name: string
          position?: number
          topic_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_name?: string
          id?: string
          is_active?: boolean
          name?: string
          position?: number
          topic_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_topics_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          class_id: string
          created_at: string
          description: string | null
          display_name: string
          id: string
          is_active: boolean
          name: string
          position: number
          updated_at: string
        }
        Insert: {
          class_id: string
          created_at?: string
          description?: string | null
          display_name: string
          id?: string
          is_active?: boolean
          name: string
          position?: number
          updated_at?: string
        }
        Update: {
          class_id?: string
          created_at?: string
          description?: string | null
          display_name?: string
          id?: string
          is_active?: boolean
          name?: string
          position?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subjects_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_history: {
        Row: {
          created_at: string
          description: string | null
          event_type: Database["public"]["Enums"]["subscription_event_type"]
          id: string
          metadata: Json
          new_billing_cycle: string | null
          new_period_end: string | null
          new_status: string | null
          new_tier: string | null
          previous_billing_cycle: string | null
          previous_period_end: string | null
          previous_status: string | null
          previous_tier: string | null
          subscription_id: string
          tenant_id: string
          triggered_by: string | null
          triggered_by_ip: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_type: Database["public"]["Enums"]["subscription_event_type"]
          id?: string
          metadata?: Json
          new_billing_cycle?: string | null
          new_period_end?: string | null
          new_status?: string | null
          new_tier?: string | null
          previous_billing_cycle?: string | null
          previous_period_end?: string | null
          previous_status?: string | null
          previous_tier?: string | null
          subscription_id: string
          tenant_id: string
          triggered_by?: string | null
          triggered_by_ip?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          event_type?: Database["public"]["Enums"]["subscription_event_type"]
          id?: string
          metadata?: Json
          new_billing_cycle?: string | null
          new_period_end?: string | null
          new_status?: string | null
          new_tier?: string | null
          previous_billing_cycle?: string | null
          previous_period_end?: string | null
          previous_status?: string | null
          previous_tier?: string | null
          subscription_id?: string
          tenant_id?: string
          triggered_by?: string | null
          triggered_by_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_history_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string
          description: string | null
          display_name: string
          exam_limit: number
          features: Json
          id: string
          is_active: boolean
          is_popular: boolean
          monthly_price_bdt: number
          monthly_price_usd: number
          name: string
          position: number
          storage_limit: number
          student_limit: number
          teacher_limit: number
          updated_at: string
          yearly_price_bdt: number
          yearly_price_usd: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_name: string
          exam_limit?: number
          features?: Json
          id?: string
          is_active?: boolean
          is_popular?: boolean
          monthly_price_bdt?: number
          monthly_price_usd?: number
          name: string
          position?: number
          storage_limit?: number
          student_limit?: number
          teacher_limit?: number
          updated_at?: string
          yearly_price_bdt?: number
          yearly_price_usd?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          display_name?: string
          exam_limit?: number
          features?: Json
          id?: string
          is_active?: boolean
          is_popular?: boolean
          monthly_price_bdt?: number
          monthly_price_usd?: number
          name?: string
          position?: number
          storage_limit?: number
          student_limit?: number
          teacher_limit?: number
          updated_at?: string
          yearly_price_bdt?: number
          yearly_price_usd?: number
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          billing_cycle: string
          cancel_at_period_end: boolean
          cancel_reason: string | null
          canceled_at: string | null
          created_at: string
          currency: string
          current_period_end: string
          current_period_start: string
          external_id: string | null
          id: string
          payment_provider: string | null
          price_per_month: number
          price_per_year: number | null
          status: Database["public"]["Enums"]["subscription_status"]
          tenant_id: string
          tier: string
          updated_at: string
        }
        Insert: {
          billing_cycle?: string
          cancel_at_period_end?: boolean
          cancel_reason?: string | null
          canceled_at?: string | null
          created_at?: string
          currency?: string
          current_period_end: string
          current_period_start?: string
          external_id?: string | null
          id?: string
          payment_provider?: string | null
          price_per_month?: number
          price_per_year?: number | null
          status?: Database["public"]["Enums"]["subscription_status"]
          tenant_id: string
          tier: string
          updated_at?: string
        }
        Update: {
          billing_cycle?: string
          cancel_at_period_end?: boolean
          cancel_reason?: string | null
          canceled_at?: string | null
          created_at?: string
          currency?: string
          current_period_end?: string
          current_period_start?: string
          external_id?: string | null
          id?: string
          payment_provider?: string | null
          price_per_month?: number
          price_per_year?: number | null
          status?: Database["public"]["Enums"]["subscription_status"]
          tenant_id?: string
          tier?: string
          updated_at?: string
        }
        Relationships: []
      }
      topics: {
        Row: {
          chapter_id: string
          created_at: string
          description: string | null
          display_name: string
          id: string
          is_active: boolean
          name: string
          position: number
          updated_at: string
        }
        Insert: {
          chapter_id: string
          created_at?: string
          description?: string | null
          display_name: string
          id?: string
          is_active?: boolean
          name: string
          position?: number
          updated_at?: string
        }
        Update: {
          chapter_id?: string
          created_at?: string
          description?: string | null
          display_name?: string
          id?: string
          is_active?: boolean
          name?: string
          position?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "topics_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "tenant_admin"
        | "teacher"
        | "student"
        | "parent"
      difficulty_level: "easy" | "medium" | "hard"
      subscription_event_type:
        | "created"
        | "upgraded"
        | "downgraded"
        | "renewed"
        | "canceled"
        | "expired"
        | "payment_failed"
        | "payment_succeeded"
      subscription_status:
        | "trial"
        | "active"
        | "past_due"
        | "canceled"
        | "expired"
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
      app_role: ["super_admin", "tenant_admin", "teacher", "student", "parent"],
      difficulty_level: ["easy", "medium", "hard"],
      subscription_event_type: [
        "created",
        "upgraded",
        "downgraded",
        "renewed",
        "canceled",
        "expired",
        "payment_failed",
        "payment_succeeded",
      ],
      subscription_status: [
        "trial",
        "active",
        "past_due",
        "canceled",
        "expired",
      ],
    },
  },
} as const

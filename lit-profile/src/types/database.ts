export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          user_id: string
          email: string
          created_at: string
        }
        Insert: {
          user_id: string
          email: string
          created_at?: string
        }
        Update: {
          user_id?: string
          email?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      audit_logs: {
        Row: {
          id: number
          table_name: string
          action: string
          record_id: string | null
          old_data: Json | null
          new_data: Json | null
          actor: string | null
          created_at: string
        }
        Insert: {
          id?: number
          table_name: string
          action: string
          record_id?: string | null
          old_data?: Json | null
          new_data?: Json | null
          actor?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          table_name?: string
          action?: string
          record_id?: string | null
          old_data?: Json | null
          new_data?: Json | null
          actor?: string | null
          created_at?: string
        }
        Relationships: []
      }
      competitions: {
        Row: {
          id: string
          student_id: string
          name: string
          org: string | null
          role: string | null
          start_date: string | null
          end_date: string | null
          achievement: string | null
          description: string | null
          badge_url: string | null
          created_at: string
          sort_order: number
        }
        Insert: {
          id?: string
          student_id: string
          name: string
          org?: string | null
          role?: string | null
          start_date?: string | null
          end_date?: string | null
          achievement?: string | null
          description?: string | null
          badge_url?: string | null
          created_at?: string
          sort_order?: number
        }
        Update: {
          id?: string
          student_id?: string
          name?: string
          org?: string | null
          role?: string | null
          start_date?: string | null
          end_date?: string | null
          achievement?: string | null
          description?: string | null
          badge_url?: string | null
          created_at?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "competitions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          }
        ]
      }
      endorsements: {
        Row: {
          id: string
          student_id: string
          reviewer_name: string
          reviewer_title: string | null
          reviewer_avatar_url: string | null
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          reviewer_name: string
          reviewer_title?: string | null
          reviewer_avatar_url?: string | null
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          reviewer_name?: string
          reviewer_title?: string | null
          reviewer_avatar_url?: string | null
          rating?: number
          comment?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "endorsements_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          }
        ]
      }
      experiences: {
        Row: {
          id: string
          student_id: string
          company: string
          role: string
          start_date: string
          end_date: string | null
          description: string | null
          logo_url: string | null
          created_at: string
          sort_order: number
        }
        Insert: {
          id?: string
          student_id: string
          company: string
          role: string
          start_date: string
          end_date?: string | null
          description?: string | null
          logo_url?: string | null
          created_at?: string
          sort_order?: number
        }
        Update: {
          id?: string
          student_id?: string
          company?: string
          role?: string
          start_date?: string
          end_date?: string | null
          description?: string | null
          logo_url?: string | null
          created_at?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "experiences_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          }
        ]
      }
      feedback: {
        Row: {
          id: string
          student_id: string
          kind: string
          text_content: string | null
          media_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          kind: string
          text_content?: string | null
          media_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          kind?: string
          text_content?: string | null
          media_url?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          }
        ]
      }
      highlights: {
        Row: {
          id: string
          student_id: string
          label: string
          value: number | null
          unit: string | null
          trend: string | null
          accent: string | null
          created_at: string
          sort_order: number
        }
        Insert: {
          id?: string
          student_id: string
          label: string
          value?: number | null
          unit?: string | null
          trend?: string | null
          accent?: string | null
          created_at?: string
          sort_order?: number
        }
        Update: {
          id?: string
          student_id?: string
          label?: string
          value?: number | null
          unit?: string | null
          trend?: string | null
          accent?: string | null
          created_at?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "highlights_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          }
        ]
      }
      interests: {
        Row: {
          id: string
          student_id: string
          category: string | null
          tag: string
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          category?: string | null
          tag: string
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          category?: string | null
          tag?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "interests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          }
        ]
      }
      media_assets: {
        Row: {
          id: string
          student_id: string
          bucket: string
          path: string
          mime_type: string | null
          kind: string | null
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          bucket: string
          path: string
          mime_type?: string | null
          kind?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          bucket?: string
          path?: string
          mime_type?: string | null
          kind?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_assets_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          }
        ]
      }
      skills: {
        Row: {
          id: string
          student_id: string
          name: string
          level: number
          endorsements_count: number
          category: string | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          name: string
          level?: number
          endorsements_count?: number
          category?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          name?: string
          level?: number
          endorsements_count?: number
          category?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          }
        ]
      }
      students: {
        Row: {
          id: string
          full_name: string
          institution: string | null
          bio: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          institution?: string | null
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          institution?: string | null
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

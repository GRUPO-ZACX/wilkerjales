export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type NewsletterStatus = "draft" | "published"

export type Database = {
  public: {
    Tables: {
      newsletters: {
        Row: {
          id: string
          user_id: string
          title: string
          slug: string
          status: NewsletterStatus
          content: Json
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          slug: string
          status?: NewsletterStatus
          content: Json
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          slug?: string
          status?: NewsletterStatus
          content?: Json
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "newsletters_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_settings: {
        Row: {
          id: string
          user_id: string
          profile: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          profile?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          profile?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type NewsletterRow = Database["public"]["Tables"]["newsletters"]["Row"]
export type NewsletterSettingsRow =
  Database["public"]["Tables"]["newsletter_settings"]["Row"]

/**
 * Types de la base Supabase de Renaissance.
 * Tenus à jour manuellement en miroir de supabase/migrations/0001_init.sql.
 * Si vous régénérez via `supabase gen types`, ce fichier peut être remplacé.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "client" | "admin";

export type ResourceType =
  | "breathwork"
  | "meditation"
  | "visualization"
  | "pdf"
  | "exercise"
  | "replay";

export type ProgressStatus = "not_started" | "in_progress" | "completed";

export type RadarPhase = "before" | "week4" | "week8";

export type AppointmentStatus = "upcoming" | "completed" | "cancelled";

/** Forme attendue du jsonb `weeks.journaling_prompts` */
export type JournalingPrompt = {
  id: string;
  label: string;
};

/** Forme attendue du jsonb `weeks.pdf_urls` */
export type WeekPdf = {
  title: string;
  url: string;
};

/** Forme attendue du jsonb `user_progress.journaling_responses` */
export type JournalingResponses = Record<string, string>;

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          email: string | null;
          role: UserRole;
          program_start_date: string | null;
          current_week: number;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          first_name?: string | null;
          last_name?: string | null;
          email?: string | null;
          role?: UserRole;
          program_start_date?: string | null;
          current_week?: number;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          email?: string | null;
          role?: UserRole;
          program_start_date?: string | null;
          current_week?: number;
          avatar_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      weeks: {
        Row: {
          id: string;
          week_number: number;
          title: string;
          intention: string | null;
          description: string | null;
          video_url: string | null;
          audio_breathwork_url: string | null;
          audio_meditation_url: string | null;
          audio_visualization_url: string | null;
          journaling_prompts: Json;
          pdf_urls: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          week_number: number;
          title: string;
          intention?: string | null;
          description?: string | null;
          video_url?: string | null;
          audio_breathwork_url?: string | null;
          audio_meditation_url?: string | null;
          audio_visualization_url?: string | null;
          journaling_prompts?: Json;
          pdf_urls?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          week_number?: number;
          title?: string;
          intention?: string | null;
          description?: string | null;
          video_url?: string | null;
          audio_breathwork_url?: string | null;
          audio_meditation_url?: string | null;
          audio_visualization_url?: string | null;
          journaling_prompts?: Json;
          pdf_urls?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      resources: {
        Row: {
          id: string;
          title: string;
          type: ResourceType;
          description: string | null;
          duration: string | null;
          media_url: string | null;
          week_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          type: ResourceType;
          description?: string | null;
          duration?: string | null;
          media_url?: string | null;
          week_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          type?: ResourceType;
          description?: string | null;
          duration?: string | null;
          media_url?: string | null;
          week_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          week_id: string;
          status: ProgressStatus;
          journaling_responses: Json;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          week_id: string;
          status?: ProgressStatus;
          journaling_responses?: Json;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          week_id?: string;
          status?: ProgressStatus;
          journaling_responses?: Json;
          completed_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      radar_assessments: {
        Row: {
          id: string;
          user_id: string;
          phase: RadarPhase;
          securite_physique: number;
          securite_financiere: number;
          securite_relationnelle: number;
          securite_identitaire: number;
          besoin_controle: number;
          hypervigilance: number;
          capacite_recevoir: number;
          capacite_etre: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          phase: RadarPhase;
          securite_physique: number;
          securite_financiere: number;
          securite_relationnelle: number;
          securite_identitaire: number;
          besoin_controle: number;
          hypervigilance: number;
          capacite_recevoir: number;
          capacite_etre: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          phase?: RadarPhase;
          securite_physique?: number;
          securite_financiere?: number;
          securite_relationnelle?: number;
          securite_identitaire?: number;
          besoin_controle?: number;
          hypervigilance?: number;
          capacite_recevoir?: number;
          capacite_etre?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      journal_entries: {
        Row: {
          id: string;
          user_id: string;
          entry_date: string;
          title: string | null;
          content: string;
          mood: string | null;
          week_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          entry_date?: string;
          title?: string | null;
          content: string;
          mood?: string | null;
          week_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          entry_date?: string;
          title?: string | null;
          content?: string;
          mood?: string | null;
          week_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      appointments: {
        Row: {
          id: string;
          user_id: string;
          scheduled_at: string;
          title: string | null;
          meeting_url: string | null;
          status: AppointmentStatus;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          scheduled_at: string;
          title?: string | null;
          meeting_url?: string | null;
          status?: AppointmentStatus;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          scheduled_at?: string;
          title?: string | null;
          meeting_url?: string | null;
          status?: AppointmentStatus;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          recipient_id: string;
          content: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          recipient_id: string;
          content: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          recipient_id?: string;
          content?: string;
          read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type Profile = Tables<"profiles">;
export type Week = Tables<"weeks">;
export type Resource = Tables<"resources">;
export type UserProgress = Tables<"user_progress">;
export type RadarAssessment = Tables<"radar_assessments">;
export type JournalEntry = Tables<"journal_entries">;
export type Appointment = Tables<"appointments">;
export type Message = Tables<"messages">;

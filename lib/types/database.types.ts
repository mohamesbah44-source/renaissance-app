/**
 * Types de la base Supabase de Renaissance.
 * Tenus à jour manuellement en miroir de supabase/migrations/0001_init.sql
 * et supabase/migrations/0002_radar_bilans.sql.
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

export type EtatDominant = "SURVIE" | "ADAPTATION" | "ALIGNEMENT" | "EXPANSION";

export type AppointmentStatus = "upcoming" | "completed" | "cancelled";

/**
 * Type de séance de l'accompagnement 8 semaines : 2 breathwork (1h30/mois) +
 * 6 courtes (30 min/mois : méditation, visualisation ou EFT) + le rendez-vous
 * thème natal / Human Design avec Emmanuel.
 */
export type SessionType = "breathwork" | "courte" | "theme_natal" | "autre";

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
      radar_bilans: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          etat: EtatDominant;
          lune: string;
          fenetre_transformation: number;
          score_charge: number;
          score_ouverture: number;
          score_global: number;
          cercle_scores: Json;
          capacite_scores: Json;
          meta_indicateurs: Json;
          raw_answers: Json;
          pillar_scores: Json;
          top_priorities: Json;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          etat: EtatDominant;
          lune: string;
          fenetre_transformation: number;
          score_charge: number;
          score_ouverture: number;
          score_global: number;
          cercle_scores: Json;
          capacite_scores: Json;
          meta_indicateurs: Json;
          raw_answers: Json;
          pillar_scores: Json;
          top_priorities: Json;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          etat?: EtatDominant;
          lune?: string;
          fenetre_transformation?: number;
          score_charge?: number;
          score_ouverture?: number;
          score_global?: number;
          cercle_scores?: Json;
          capacite_scores?: Json;
          meta_indicateurs?: Json;
          raw_answers?: Json;
          pillar_scores?: Json;
          top_priorities?: Json;
        };
        Relationships: [];
      };
      carnet_entries: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          source: "analyzer" | "manuel";
          titre: string;
          synthese: string;
          hypotheses: Json;
          pilier_ids: number[];
          published_by: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          source?: "analyzer" | "manuel";
          titre: string;
          synthese: string;
          hypotheses?: Json;
          pilier_ids?: number[];
          published_by?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          source?: "analyzer" | "manuel";
          titre?: string;
          synthese?: string;
          hypotheses?: Json;
          pilier_ids?: number[];
          published_by?: string | null;
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
          session_type: SessionType;
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
          session_type?: SessionType;
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
          session_type?: SessionType;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      client_songs: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          titre: string;
          message: string | null;
          media_url: string;
          published_by: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          titre: string;
          message?: string | null;
          media_url: string;
          published_by?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          titre?: string;
          message?: string | null;
          media_url?: string;
          published_by?: string | null;
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
export type RadarBilan = Tables<"radar_bilans">;
export type JournalEntry = Tables<"journal_entries">;
export type Appointment = Tables<"appointments">;
export type Message = Tables<"messages">;
export type CarnetEntry = Tables<"carnet_entries">;
export type ClientSong = Tables<"client_songs">;

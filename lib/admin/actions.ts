"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getURL } from "@/lib/utils";
import type {
  AppointmentStatus,
  JournalingPrompt,
  ResourceType,
  SessionType,
  WeekPdf,
} from "@/lib/types/database.types";

export type AdminFormState = { success?: boolean; error?: string } | undefined;

const RESOURCE_TYPES: ResourceType[] = ["breathwork", "meditation", "visualization", "pdf", "exercise", "replay"];
const APPOINTMENT_STATUSES: AppointmentStatus[] = ["upcoming", "completed", "cancelled"];
const SESSION_TYPES: SessionType[] = ["breathwork", "courte", "theme_natal", "autre"];

/**
 * Crée la fiche d'un nouveau membre et lui envoie une invitation par email
 * pour qu'il choisisse lui-même son mot de passe (le profil "client" est
 * créé automatiquement par le trigger `handle_new_user`).
 */
export async function inviteClient(_prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Session expirée. Reconnecte-toi." };
  }

  const { data: caller } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (caller?.role !== "admin") {
    return { error: "Action réservée à l'accompagnant·e." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();

  if (!email || !firstName) {
    return { error: "Email et prénom sont requis." };
  }

  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    data: { first_name: firstName, last_name: lastName || null },
    redirectTo: `${getURL()}/auth/confirm?next=/reset-password`,
  });

  if (error) {
    return {
      error: error.message.toLowerCase().includes("already")
        ? "Un compte existe déjà avec cet email."
        : "Impossible d'envoyer l'invitation. Réessaie dans un instant.",
    };
  }

  revalidatePath("/admin/clients");

  return { success: true };
}

/** Met à jour la semaine courante et la date de démarrage d'un·e participant·e. */
export async function updateClientSettings(_prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const supabase = await createClient();

  const clientId = formData.get("clientId");
  const currentWeek = formData.get("currentWeek");
  const programStartDate = formData.get("programStartDate");

  if (typeof clientId !== "string" || !clientId) {
    return { error: "Participant·e introuvable." };
  }

  const weekNumber = Number(currentWeek);
  if (!Number.isInteger(weekNumber) || weekNumber < 1 || weekNumber > 8) {
    return { error: "La semaine doit être comprise entre 1 et 8." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      current_week: weekNumber,
      program_start_date: typeof programStartDate === "string" && programStartDate ? programStartDate : null,
    })
    .eq("id", clientId);

  if (error) {
    return { error: "Une erreur est survenue." };
  }

  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/admin/clients");

  return { success: true };
}

/** Crée ou met à jour un rendez-vous pour un·e participant·e. */
export async function saveAppointment(_prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const supabase = await createClient();

  const id = formData.get("id");
  const clientId = formData.get("clientId");
  const scheduledAt = formData.get("scheduledAt");
  const title = formData.get("title");
  const meetingUrl = formData.get("meetingUrl");
  const notes = formData.get("notes");
  const sessionType = formData.get("sessionType");

  if (typeof clientId !== "string" || !clientId) {
    return { error: "Participant·e introuvable." };
  }

  if (typeof scheduledAt !== "string" || !scheduledAt) {
    return { error: "La date est requise." };
  }

  const payload = {
    user_id: clientId,
    scheduled_at: new Date(scheduledAt).toISOString(),
    title: typeof title === "string" && title ? title : null,
    meeting_url: typeof meetingUrl === "string" && meetingUrl ? meetingUrl : null,
    notes: typeof notes === "string" && notes ? notes : null,
    session_type: (typeof sessionType === "string" && SESSION_TYPES.includes(sessionType as SessionType)
      ? sessionType
      : "autre") as SessionType,
  };

  const { error } =
    typeof id === "string" && id
      ? await supabase.from("appointments").update(payload).eq("id", id)
      : await supabase.from("appointments").insert(payload);

  if (error) {
    return { error: "Une erreur est survenue." };
  }

  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/calendrier");

  return { success: true };
}

/** Met à jour le statut d'un rendez-vous (à venir / terminé / annulé). */
export async function updateAppointmentStatus(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const id = formData.get("id");
  const clientId = formData.get("clientId");
  const status = formData.get("status");

  if (typeof id !== "string" || !id) return;
  if (typeof status !== "string" || !APPOINTMENT_STATUSES.includes(status as AppointmentStatus)) return;

  await supabase
    .from("appointments")
    .update({ status: status as AppointmentStatus })
    .eq("id", id);

  if (typeof clientId === "string" && clientId) {
    revalidatePath(`/admin/clients/${clientId}`);
  }
  revalidatePath("/calendrier");
}

/** Crée ou met à jour une ressource de la bibliothèque. */
export async function saveResource(_prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const supabase = await createClient();

  const id = formData.get("id");
  const title = formData.get("title");
  const type = formData.get("type");
  const description = formData.get("description");
  const duration = formData.get("duration");
  const mediaUrl = formData.get("mediaUrl");
  const weekId = formData.get("weekId");

  if (typeof title !== "string" || !title.trim()) {
    return { error: "Le titre est requis." };
  }

  if (typeof type !== "string" || !RESOURCE_TYPES.includes(type as ResourceType)) {
    return { error: "Le type est invalide." };
  }

  const payload = {
    title: title.trim(),
    type: type as ResourceType,
    description: typeof description === "string" && description ? description : null,
    duration: typeof duration === "string" && duration ? duration : null,
    media_url: typeof mediaUrl === "string" && mediaUrl ? mediaUrl : null,
    week_id: typeof weekId === "string" && weekId ? weekId : null,
  };

  const { error } =
    typeof id === "string" && id
      ? await supabase.from("resources").update(payload).eq("id", id)
      : await supabase.from("resources").insert(payload);

  if (error) {
    return { error: "Une erreur est survenue." };
  }

  revalidatePath("/admin/ressources");
  revalidatePath("/ressources");

  return { success: true };
}

/** Supprime une ressource de la bibliothèque. */
export async function deleteResource(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const id = formData.get("id");

  if (typeof id !== "string" || !id) return;

  await supabase.from("resources").delete().eq("id", id);

  revalidatePath("/admin/ressources");
  revalidatePath("/ressources");
}

/** Met à jour le contenu d'une semaine du parcours. */
export async function saveWeekContent(_prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const supabase = await createClient();

  const id = formData.get("id");
  const title = formData.get("title");
  const intention = formData.get("intention");
  const description = formData.get("description");
  const videoUrl = formData.get("videoUrl");
  const audioBreathworkUrl = formData.get("audioBreathworkUrl");
  const audioMeditationUrl = formData.get("audioMeditationUrl");
  const audioVisualizationUrl = formData.get("audioVisualizationUrl");
  const journalingPromptsRaw = formData.get("journalingPrompts");
  const pdfUrlsRaw = formData.get("pdfUrls");

  if (typeof id !== "string" || !id) {
    return { error: "Semaine introuvable." };
  }

  if (typeof title !== "string" || !title.trim()) {
    return { error: "Le titre est requis." };
  }

  const { data: existingWeek } = await supabase
    .from("weeks")
    .select("week_number, journaling_prompts")
    .eq("id", id)
    .single();

  const existingPrompts = ((existingWeek?.journaling_prompts as unknown as JournalingPrompt[] | null) ?? []);
  const weekNumber = existingWeek?.week_number ?? 0;

  const journalingPrompts: JournalingPrompt[] = (typeof journalingPromptsRaw === "string" ? journalingPromptsRaw : "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((label, index) => ({
      id: existingPrompts[index]?.id ?? `s${weekNumber}-${index + 1}`,
      label,
    }));

  const pdfUrls: WeekPdf[] = (typeof pdfUrlsRaw === "string" ? pdfUrlsRaw : "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [pdfTitle, url] = line.split("|").map((part) => part.trim());
      return { title: pdfTitle || url || "", url: url || pdfTitle || "" };
    });

  const { error } = await supabase
    .from("weeks")
    .update({
      title: title.trim(),
      intention: typeof intention === "string" && intention ? intention : null,
      description: typeof description === "string" && description ? description : null,
      video_url: typeof videoUrl === "string" && videoUrl ? videoUrl : null,
      audio_breathwork_url: typeof audioBreathworkUrl === "string" && audioBreathworkUrl ? audioBreathworkUrl : null,
      audio_meditation_url: typeof audioMeditationUrl === "string" && audioMeditationUrl ? audioMeditationUrl : null,
      audio_visualization_url:
        typeof audioVisualizationUrl === "string" && audioVisualizationUrl ? audioVisualizationUrl : null,
      journaling_prompts: journalingPrompts,
      pdf_urls: pdfUrls,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: "Une erreur est survenue." };
  }

  revalidatePath("/admin/semaines");
  revalidatePath("/parcours");
  revalidatePath(`/parcours/semaine/${id}`);
  revalidatePath("/dashboard");

  return { success: true };
}

"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type HabitFormState = { error?: string; ok?: boolean } | undefined;

const MOMENTS = ["morning", "day", "evening"];

/** Vérifie que l'appelant est admin, puis renvoie un client à droits étendus (non typé). */
async function getAdminDb(): Promise<SupabaseClient | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (me?.role !== "admin") return null;
  return createAdminClient() as unknown as SupabaseClient;
}

function readFields(formData: FormData) {
  const titre = String(formData.get("titre") ?? "").trim();
  const timeOfDay = String(formData.get("time_of_day") ?? "day");
  const weekdays = formData
    .getAll("weekdays")
    .map((v) => Number(v))
    .filter((n) => Number.isInteger(n) && n >= 1 && n <= 7);
  const start = String(formData.get("start_date") ?? "").trim();
  const end = String(formData.get("end_date") ?? "").trim();
  return { titre, timeOfDay, weekdays, start: start || null, end: end || null };
}

function validate(f: ReturnType<typeof readFields>): string | null {
  if (f.titre.length < 2) return "Donne un titre à l'habitude.";
  if (f.titre.length > 120) return "Le titre est trop long (120 caractères maximum).";
  if (!MOMENTS.includes(f.timeOfDay)) return "Moment de la journée invalide.";
  if (f.weekdays.length === 0) return "Choisis au moins un jour.";
  if (f.start && f.end && f.end < f.start) return "La date de fin doit suivre la date de début.";
  return null;
}

function refresh(clientId: string) {
  revalidatePath(`/admin/clients/${clientId}`);
}

export async function createHabit(_prev: HabitFormState, formData: FormData): Promise<HabitFormState> {
  const db = await getAdminDb();
  if (!db) return { error: "Action non autorisée." };

  const clientId = String(formData.get("clientId") ?? "");
  if (!clientId) return { error: "Participant introuvable." };

  const { data: target } = await db.from("profiles").select("role").eq("id", clientId).maybeSingle();
  if (target?.role !== "client") return { error: "Participant introuvable." };

  const f = readFields(formData);
  const invalid = validate(f);
  if (invalid) return { error: invalid };

  const { error } = await db.from("habits").insert({
    user_id: clientId,
    titre: f.titre,
    source: "manuel",
    is_active: true,
    time_of_day: f.timeOfDay,
    weekdays: f.weekdays,
    start_date: f.start,
    end_date: f.end,
  });
  if (error) return { error: "Impossible d'ajouter l'habitude pour le moment." };

  refresh(clientId);
  return { ok: true };
}

export async function updateHabit(formData: FormData): Promise<void> {
  const db = await getAdminDb();
  if (!db) return;
  const id = String(formData.get("id") ?? "");
  const clientId = String(formData.get("clientId") ?? "");
  if (!id || !clientId) return;

  const f = readFields(formData);
  if (validate(f)) return;

  await db
    .from("habits")
    .update({
      titre: f.titre,
      time_of_day: f.timeOfDay,
      weekdays: f.weekdays,
      start_date: f.start,
      end_date: f.end,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", clientId);
  refresh(clientId);
}

export async function toggleHabitActive(formData: FormData): Promise<void> {
  const db = await getAdminDb();
  if (!db) return;
  const id = String(formData.get("id") ?? "");
  const clientId = String(formData.get("clientId") ?? "");
  const active = formData.get("active") === "1";
  if (!id || !clientId) return;

  await db
    .from("habits")
    .update({ is_active: active, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", clientId);
  refresh(clientId);
}

export async function deleteHabit(formData: FormData): Promise<void> {
  const db = await getAdminDb();
  if (!db) return;
  const id = String(formData.get("id") ?? "");
  const clientId = String(formData.get("clientId") ?? "");
  if (!id || !clientId) return;

  // Les habitudes du socle Re-Naissance se désactivent, elles ne se suppriment pas.
  const { data: habit } = await db.from("habits").select("system_key").eq("id", id).eq("user_id", clientId).maybeSingle();
  if (!habit || habit.system_key) return;

  await db.from("habits").delete().eq("id", id).eq("user_id", clientId);
  refresh(clientId);
}

export async function setRetentionAllowed(formData: FormData): Promise<void> {
  const db = await getAdminDb();
  if (!db) return;
  const clientId = String(formData.get("clientId") ?? "");
  const allowed = formData.get("allowed") === "1";
  if (!clientId) return;

  const { data: practice } = await db.from("practices").select("id").eq("key", "morning_breath").maybeSingle();
  if (!practice) return;

  await db
    .from("client_practices")
    .upsert(
      { user_id: clientId, practice_id: practice.id, retention_allowed: allowed },
      { onConflict: "user_id,practice_id" }
    );
  refresh(clientId);
}

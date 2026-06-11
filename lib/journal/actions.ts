"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type JournalFormState = { success?: boolean; error?: string } | undefined;

/** Crée ou met à jour une entrée de journal (selon la présence d'un id). */
export async function saveJournalEntry(
  _prevState: JournalFormState,
  formData: FormData
): Promise<JournalFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Tu dois être connecté·e." };
  }

  const id = formData.get("id");
  const entryDate = formData.get("entryDate");
  const title = formData.get("title");
  const content = formData.get("content");
  const mood = formData.get("mood");
  const weekId = formData.get("weekId");

  if (typeof entryDate !== "string" || !entryDate) {
    return { error: "La date est requise." };
  }

  if (typeof content !== "string" || !content.trim()) {
    return { error: "Ton entrée ne peut pas être vide." };
  }

  const payload = {
    user_id: user.id,
    entry_date: entryDate,
    title: typeof title === "string" && title.trim() ? title.trim() : null,
    content: content.trim(),
    mood: typeof mood === "string" && mood ? mood : null,
    week_id: typeof weekId === "string" && weekId ? weekId : null,
  };

  const { error } =
    typeof id === "string" && id
      ? await supabase.from("journal_entries").update(payload).eq("id", id).eq("user_id", user.id)
      : await supabase.from("journal_entries").insert(payload);

  if (error) {
    return { error: "Une erreur est survenue. Réessaie dans un instant." };
  }

  revalidatePath("/journal");
  revalidatePath("/dashboard");

  return { success: true };
}

/** Supprime une entrée de journal appartenant à l'utilisateur courant. */
export async function deleteJournalEntry(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  await supabase.from("journal_entries").delete().eq("id", id).eq("user_id", user.id);

  revalidatePath("/journal");
  revalidatePath("/dashboard");
}

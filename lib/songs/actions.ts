"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type SongFormState = { success?: boolean; error?: string } | undefined;

/** Publie une chanson personnalisée Re-Naissance™ dans l'espace d'un·e client·e. */
export async function publishClientSong(_prevState: SongFormState, formData: FormData): Promise<SongFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Tu dois être connecté·e." };
  }

  const clientId = formData.get("clientId");
  const titre = formData.get("titre");
  const mediaUrl = formData.get("mediaUrl");
  const message = formData.get("message");

  if (typeof clientId !== "string" || !clientId) {
    return { error: "Participant·e introuvable." };
  }

  if (typeof titre !== "string" || !titre.trim()) {
    return { error: "Le titre est requis." };
  }

  if (typeof mediaUrl !== "string" || !mediaUrl.trim()) {
    return { error: "Le lien audio est requis." };
  }

  const { error } = await supabase.from("client_songs").insert({
    user_id: clientId,
    titre: titre.trim(),
    media_url: mediaUrl.trim(),
    message: typeof message === "string" && message.trim() ? message.trim() : null,
    published_by: user.id,
  });

  if (error) {
    return { error: "Une erreur est survenue. Réessaie dans un instant." };
  }

  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/ressources");
  revalidatePath("/dashboard");

  return { success: true };
}

/** Supprime une chanson personnalisée (admin uniquement, via la policy RLS `client_songs_admin_all`). */
export async function deleteClientSong(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const id = formData.get("id");
  const clientId = formData.get("clientId");
  if (typeof id !== "string" || !id) return;

  await supabase.from("client_songs").delete().eq("id", id);

  if (typeof clientId === "string" && clientId) {
    revalidatePath(`/admin/clients/${clientId}`);
  }
  revalidatePath("/ressources");
}

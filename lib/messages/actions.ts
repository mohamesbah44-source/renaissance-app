"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type MessageFormState = { success?: boolean; error?: string } | undefined;

/** Envoie un message au ou à la praticien·ne. */
export async function sendMessage(
  _prevState: MessageFormState,
  formData: FormData
): Promise<MessageFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Tu dois être connecté·e." };
  }

  const recipientId = formData.get("recipientId");
  const content = formData.get("content");

  if (typeof recipientId !== "string" || !recipientId) {
    return { error: "Destinataire introuvable." };
  }

  if (typeof content !== "string" || !content.trim()) {
    return { error: "Le message ne peut pas être vide." };
  }

  const { error } = await supabase.from("messages").insert({
    sender_id: user.id,
    recipient_id: recipientId,
    content: content.trim(),
  });

  if (error) {
    return { error: "Une erreur est survenue. Réessaie dans un instant." };
  }

  revalidatePath("/messages");
  revalidatePath(`/admin/clients/${user.id}`);
  revalidatePath(`/admin/clients/${recipientId}`);
  revalidatePath("/admin");

  return { success: true };
}

/** Marque comme lus les messages reçus par l'utilisateur courant, éventuellement d'un seul interlocuteur. */
export async function markMessagesRead(userId: string, fromUserId?: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.id !== userId) return;

  let query = supabase.from("messages").update({ read: true }).eq("recipient_id", user.id).eq("read", false);

  if (fromUserId) {
    query = query.eq("sender_id", fromUserId);
  }

  await query;
}

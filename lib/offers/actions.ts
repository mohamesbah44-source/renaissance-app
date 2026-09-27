"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type OfferFormState = { success?: boolean; error?: string } | undefined;

/** Crée ou met à jour une offre de suite (upsell) — création si `id` absent. */
export async function saveOffer(_prevState: OfferFormState, formData: FormData): Promise<OfferFormState> {
  const supabase = await createClient();

  const id = formData.get("id");
  const title = formData.get("title");
  const description = formData.get("description");
  const ctaLabel = formData.get("ctaLabel");
  const ctaUrl = formData.get("ctaUrl");
  const priceLabel = formData.get("priceLabel");
  const isActive = formData.get("isActive");

  if (typeof title !== "string" || !title.trim()) {
    return { error: "Le titre est requis." };
  }

  if (typeof description !== "string" || !description.trim()) {
    return { error: "La description est requise." };
  }

  if (typeof ctaUrl !== "string" || !ctaUrl.trim()) {
    return { error: "Le lien (paiement, Calendly...) est requis." };
  }

  const payload = {
    title: title.trim(),
    description: description.trim(),
    cta_label: typeof ctaLabel === "string" && ctaLabel.trim() ? ctaLabel.trim() : "En savoir plus",
    cta_url: ctaUrl.trim(),
    price_label: typeof priceLabel === "string" && priceLabel.trim() ? priceLabel.trim() : null,
    is_active: isActive === "on",
    updated_at: new Date().toISOString(),
  };

  const { error } =
    typeof id === "string" && id
      ? await supabase.from("program_offers").update(payload).eq("id", id)
      : await supabase.from("program_offers").insert(payload);

  if (error) {
    return { error: "Une erreur est survenue. Réessaie dans un instant." };
  }

  revalidatePath("/admin/offre");
  revalidatePath("/dashboard");
  revalidatePath("/parcours/semaine/[id]", "page");

  return { success: true };
}

/** Supprime une offre. */
export async function deleteOffer(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  await supabase.from("program_offers").delete().eq("id", id);

  revalidatePath("/admin/offre");
  revalidatePath("/dashboard");
}

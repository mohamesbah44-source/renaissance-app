"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { PILIERS } from "@/lib/radar/constants";

export type CarnetFormState = { success?: boolean; error?: string } | undefined;

const VALID_PILIER_IDS = new Set(PILIERS.map((p) => p.id));

/**
 * Publie une entrée dans le Carnet Re-Naissance™ d'un·e client·e — synthèse issue du
 * Re-Naissance Analyzer™ (practicien) ou saisie manuellement par l'admin.
 */
export async function publishCarnetEntry(_prevState: CarnetFormState, formData: FormData): Promise<CarnetFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Tu dois être connecté·e." };
  }

  const clientId = formData.get("clientId");
  const titre = formData.get("titre");
  const synthese = formData.get("synthese");
  const hypothesesRaw = formData.get("hypotheses");
  const source = formData.get("source");
  const pilierIdsRaw = formData.getAll("pilierIds");

  if (typeof clientId !== "string" || !clientId) {
    return { error: "Participant·e introuvable." };
  }

  if (typeof titre !== "string" || !titre.trim()) {
    return { error: "Le titre est requis." };
  }

  if (typeof synthese !== "string" || !synthese.trim()) {
    return { error: "La synthèse ne peut pas être vide." };
  }

  const hypotheses = (typeof hypothesesRaw === "string" ? hypothesesRaw : "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const pilierIds = pilierIdsRaw
    .map((value) => Number(value))
    .filter((id) => VALID_PILIER_IDS.has(id));

  const payload = {
    user_id: clientId,
    titre: titre.trim(),
    synthese: synthese.trim(),
    hypotheses,
    pilier_ids: pilierIds,
    source: source === "analyzer" ? ("analyzer" as const) : ("manuel" as const),
    published_by: user.id,
  };

  const { error } = await supabase.from("carnet_entries").insert(payload);

  if (error) {
    return { error: "Une erreur est survenue. Réessaie dans un instant." };
  }

  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/carnet");
  revalidatePath("/journal");
  revalidatePath("/dashboard");

  return { success: true };
}

/** Supprime une entrée du Carnet (admin uniquement, via la policy RLS `carnet_entries_admin_all`). */
export async function deleteCarnetEntry(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const id = formData.get("id");
  const clientId = formData.get("clientId");
  if (typeof id !== "string" || !id) return;

  await supabase.from("carnet_entries").delete().eq("id", id);

  if (typeof clientId === "string" && clientId) {
    revalidatePath(`/admin/clients/${clientId}`);
  }
  revalidatePath("/carnet");
  revalidatePath("/journal");
}

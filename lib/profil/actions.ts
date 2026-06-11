"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProfilFormState = { success?: boolean; error?: string } | undefined;

/** Met à jour le prénom et le nom du profil courant. */
export async function updateProfileInfo(_prevState: ProfilFormState, formData: FormData): Promise<ProfilFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Tu dois être connecté·e." };
  }

  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");

  if (typeof firstName !== "string" || !firstName.trim()) {
    return { error: "Le prénom est requis." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: firstName.trim(),
      last_name: typeof lastName === "string" && lastName.trim() ? lastName.trim() : null,
    })
    .eq("id", user.id);

  if (error) {
    return { error: "Une erreur est survenue." };
  }

  revalidatePath("/profil");
  revalidatePath("/dashboard");

  return { success: true };
}

/** Met à jour le mot de passe du compte connecté. */
export async function changePassword(_prevState: ProfilFormState, formData: FormData): Promise<ProfilFormState> {
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

  if (password.length < 8) {
    return { error: "Ton mot de passe doit contenir au moins 8 caractères." };
  }

  if (password !== passwordConfirm) {
    return { error: "Les mots de passe ne correspondent pas." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: "Une erreur est survenue. Réessaie dans un instant." };
  }

  return { success: true };
}

"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getURL } from "@/lib/utils";

export type AuthFormState = { error?: string; success?: string } | undefined;

export async function signIn(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Merci de renseigner ton email et ton mot de passe." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Email ou mot de passe incorrect." };
  }

  redirect("/dashboard");
}

export async function signUp(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

  if (!firstName || !email || !password) {
    return { error: "Merci de remplir les champs obligatoires." };
  }

  if (password.length < 8) {
    return { error: "Ton mot de passe doit contenir au moins 8 caractères." };
  }

  if (password !== passwordConfirm) {
    return { error: "Les mots de passe ne correspondent pas." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { first_name: firstName, last_name: lastName },
      emailRedirectTo: `${getURL()}/auth/confirm`,
    },
  });

  if (error) {
    return {
      error: error.message.toLowerCase().includes("already")
        ? "Un compte existe déjà avec cet email."
        : "Impossible de créer ton compte. Réessaie dans un instant.",
    };
  }

  if (data.session) {
    redirect("/dashboard");
  }

  return {
    success:
      "Ton espace t'attend. Vérifie tes emails pour confirmer ton inscription, puis connecte-toi.",
  };
}

export async function requestPasswordReset(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { error: "Merci de renseigner ton email." };
  }

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getURL()}/auth/confirm?next=/reset-password`,
  });

  return {
    success:
      "Si un compte existe avec cet email, tu vas recevoir un lien pour choisir un nouveau mot de passe.",
  };
}

export async function updatePassword(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
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
    return { error: "Le lien a expiré. Demande un nouveau lien de réinitialisation." };
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

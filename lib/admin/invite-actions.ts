"use server";

import { headers } from "next/headers";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export type InviteState = {
  error?: string;
  link?: string;
  firstName?: string;
  email?: string;
  existing?: boolean;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function inviteMember(_prev: InviteState | undefined, formData: FormData): Promise<InviteState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Connexion requise." };

  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (me?.role !== "admin") return { error: "Cette action est réservée à l'administrateur." };

  const firstName = String(formData.get("first_name") ?? "").trim();
  const lastName = String(formData.get("last_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const startDate = String(formData.get("start_date") ?? "").trim();

  if (!firstName) return { error: "Indique le prénom du membre." };
  if (!EMAIL_RE.test(email)) return { error: "Cette adresse e-mail n'est pas valide." };
  if (!DATE_RE.test(startDate)) return { error: "La date de début n'est pas valide." };

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { error: "Le serveur n'est pas configuré pour créer des comptes." };
  const admin = createServiceClient(url, key, { auth: { persistSession: false } });

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  const origin = `${proto}://${host}`;

  let existing = false;
  let linkType: "invite" | "recovery" = "invite";

  const invite = await admin.auth.admin.generateLink({
    type: "invite",
    email,
    options: { data: { first_name: firstName, last_name: lastName } },
  });
  let hashed: string | null = invite.data?.properties?.hashed_token ?? null;
  let userId: string | null = invite.data?.user?.id ?? null;

  if (invite.error || !hashed) {
    const message = invite.error?.message ?? "";
    if (/already|registered|exists/i.test(message)) {
      // Le membre a déjà un compte : on génère un lien pour redéfinir son mot de passe.
      const recovery = await admin.auth.admin.generateLink({ type: "recovery", email });
      const recoveryHash = recovery.data?.properties?.hashed_token ?? null;
      if (recovery.error || !recoveryHash) {
        return { error: "Impossible de générer un lien pour ce membre." };
      }
      hashed = recoveryHash;
      userId = recovery.data?.user?.id ?? null;
      linkType = "recovery";
      existing = true;
    } else {
      return { error: "Impossible de créer le compte. Vérifie l'adresse e-mail et réessaie." };
    }
  }

  if (!existing && userId) {
    await admin
      .from("profiles")
      .update({
        first_name: firstName,
        last_name: lastName || null,
        program_start_date: startDate,
      })
      .eq("id", userId);
  }

  const link = `${origin}/auth/confirm?token_hash=${encodeURIComponent(hashed as string)}&type=${linkType}&next=${encodeURIComponent("/reset-password")}`;

  return { link, firstName, email, existing };
}

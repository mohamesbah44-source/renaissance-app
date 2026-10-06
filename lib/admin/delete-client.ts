"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type DeleteClientState = { error?: string } | undefined;

/** Supprime définitivement un·e participant·e (compte de connexion et données rattachées). */
export async function deleteClient(
  _prevState: DeleteClientState,
  formData: FormData
): Promise<DeleteClientState> {
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

  const clientId = formData.get("clientId");
  if (typeof clientId !== "string" || !clientId) {
    return { error: "Participant·e introuvable." };
  }

  if (clientId === user.id) {
    return { error: "Tu ne peux pas supprimer ton propre compte." };
  }

  const { data: target } = await supabase.from("profiles").select("role").eq("id", clientId).maybeSingle();
  if (!target) {
    return { error: "Participant·e introuvable." };
  }
  if (target.role !== "client") {
    return { error: "Seuls les comptes participants peuvent être supprimés." };
  }

  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin.auth.admin.deleteUser(clientId);

  if (error) {
    return { error: "Suppression impossible : des données restent rattachées à ce compte." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/clients");
  redirect("/admin/clients");
}

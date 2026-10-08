import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { AppShell } from "@/components/layout/AppShell";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const db = supabase as unknown as SupabaseClient;
    const { data: profile } = await db
      .from("profiles")
      .select("role, onboarded_at")
      .eq("id", user.id)
      .maybeSingle();

    // Un nouveau membre (jamais accueilli) passe d'abord par l'accueil.
    // Si la colonne n'existe pas encore ou si la lecture échoue, on ne bloque rien.
    if (profile && profile.role !== "admin" && profile.onboarded_at === null) {
      redirect("/bienvenue");
    }
  }

  return <AppShell>{children}</AppShell>;
}

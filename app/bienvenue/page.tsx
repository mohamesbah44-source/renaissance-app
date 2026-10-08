import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { WelcomeFlow } from "@/components/features/bienvenue/WelcomeFlow";

export default async function BienvenuePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const db = supabase as unknown as SupabaseClient;
  const { data: profile } = await db
    .from("profiles")
    .select("first_name, role, onboarded_at")
    .eq("id", user.id)
    .single();

  // Déjà vu : on renvoie vers l'appli (l'admin peut toujours revoir l'accueil).
  if (profile?.onboarded_at && profile.role !== "admin") redirect("/aujourdhui");

  const firstName = (profile?.first_name as string | null)?.trim() || "toi";

  return (
    <main className="min-h-screen bg-rr-noir">
      <WelcomeFlow firstName={firstName} />
    </main>
  );
}

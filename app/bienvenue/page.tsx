import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { WelcomeFlow } from "@/components/features/bienvenue/WelcomeFlow";

export default async function BienvenuePage({ searchParams }: { searchParams: Promise<{ step?: string }> }) {
  const { step } = await searchParams;
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

  const { count } = await db
    .from("radar_bilans")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const firstName = (profile?.first_name as string | null)?.trim() || "toi";
  const initialStep = Number.parseInt(step ?? "0", 10);

  return (
    <main>
      <WelcomeFlow
        firstName={firstName}
        hasRadar={(count ?? 0) > 0}
        initialStep={Number.isNaN(initialStep) ? 0 : initialStep}
      />
    </main>
  );
}

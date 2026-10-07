import { notFound, redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { GroundingPlayer, type GroundingStep } from "@/components/features/revenir/GroundingPlayer";

export default async function GroundingPracticePage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const db = supabase as unknown as SupabaseClient;
  const { data: practice } = await db
    .from("practices")
    .select("key, title, description, config")
    .eq("key", key)
    .eq("category", "besoin")
    .eq("is_active", true)
    .maybeSingle();

  if (!practice) notFound();

  const rawSteps = (practice.config as { steps?: GroundingStep[] } | null)?.steps;
  const steps = Array.isArray(rawSteps) ? rawSteps.filter((s) => s && typeof s.prompt === "string") : [];
  if (steps.length === 0) notFound();

  return (
    <GroundingPlayer
      practiceKey={practice.key as string}
      title={practice.title as string}
      description={(practice.description as string | null) ?? ""}
      steps={steps}
    />
  );
}

import { notFound, redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { BreathingPlayer } from "@/components/features/practice/BreathingPlayer";

const MODES = { matin: "morning", soir: "evening", sommeil: "sleep" } as const;

export default async function PratiquePage({ params }: { params: Promise<{ mode: string }> }) {
  const { mode: slug } = await params;
  const mode = MODES[slug as keyof typeof MODES];
  if (!mode) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const db = supabase as unknown as SupabaseClient;
  let retentionAllowed = false;

  if (mode === "morning") {
    const { data: practice } = await db.from("practices").select("id").eq("key", "morning_breath").maybeSingle();
    if (practice) {
      const { data: cp } = await db
        .from("client_practices")
        .select("retention_allowed, is_enabled")
        .eq("user_id", user.id)
        .eq("practice_id", practice.id)
        .maybeSingle();
      retentionAllowed = Boolean(cp?.retention_allowed && cp?.is_enabled !== false);
    }
  }

  return <BreathingPlayer mode={mode} retentionAllowed={retentionAllowed} />;
}

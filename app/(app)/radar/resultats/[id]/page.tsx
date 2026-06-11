import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RadarResults } from "@/components/features/radar/RadarResults";

export default async function RadarResultatsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: bilan } = await supabase
    .from("radar_bilans")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!bilan) {
    notFound();
  }

  const { data: previousBilan } = await supabase
    .from("radar_bilans")
    .select("*")
    .eq("user_id", user.id)
    .lt("created_at", bilan.created_at)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return <RadarResults bilan={bilan} previousBilan={previousBilan ?? null} />;
}

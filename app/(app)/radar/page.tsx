import { createClient } from "@/lib/supabase/server";
import { RadarIntro } from "@/components/features/radar/RadarIntro";

export default async function RadarPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: bilans } = await supabase
    .from("radar_bilans")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return <RadarIntro bilans={bilans ?? []} />;
}

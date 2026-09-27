import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WeekDetailHeader } from "@/components/features/parcours/WeekDetailHeader";
import { MediaSection } from "@/components/features/parcours/MediaSection";
import { JournalingPromptForm } from "@/components/features/parcours/JournalingPromptForm";
import { MarkCompleteButton } from "@/components/features/parcours/MarkCompleteButton";
import { OfferSpotlight } from "@/components/features/parcours/OfferSpotlight";
import type { JournalingPrompt, JournalingResponses, WeekPdf } from "@/lib/types/database.types";

interface WeekDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function WeekDetailPage({ params }: WeekDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: week } = await supabase.from("weeks").select("*").eq("id", id).maybeSingle();

  if (!week) {
    notFound();
  }

  const { data: progress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("week_id", id)
    .maybeSingle();

  const prompts = (week.journaling_prompts as JournalingPrompt[] | null) ?? [];
  const responses = (progress?.journaling_responses as JournalingResponses | null) ?? {};
  const pdfs = (week.pdf_urls as WeekPdf[] | null) ?? [];
  const status = progress?.status ?? "not_started";

  const { data: offer } =
    week.week_number === 8
      ? await supabase
          .from("program_offers")
          .select("*")
          .eq("is_active", true)
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle()
      : { data: null };

  return (
    <div className="mx-auto max-w-2xl pb-8">
      <WeekDetailHeader week={week} status={status} />

      <MediaSection week={week} pdfs={pdfs} />

      {prompts.length > 0 && (
        <JournalingPromptForm weekId={week.id} prompts={prompts} responses={responses} />
      )}

      <MarkCompleteButton weekId={week.id} weekNumber={week.week_number} status={status} />

      {offer && <OfferSpotlight offer={offer} />}
    </div>
  );
}

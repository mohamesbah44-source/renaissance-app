import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/queries";
import { WelcomeHeader } from "@/components/features/dashboard/WelcomeHeader";
import { ProgressOverview } from "@/components/features/dashboard/ProgressOverview";
import { CurrentStateCard } from "@/components/features/dashboard/CurrentStateCard";
import { RadarLinkCard } from "@/components/features/dashboard/RadarLinkCard";
import { NextAppointmentCard } from "@/components/features/dashboard/NextAppointmentCard";
import { WeeklyActionsList } from "@/components/features/dashboard/WeeklyActionsList";
import { ContinueButton } from "@/components/features/dashboard/ContinueButton";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const profile = await getProfile(supabase, user.id);
  const currentWeekNumber = profile?.current_week ?? 1;

  const [{ data: currentWeek }, { data: progressRows }, { data: journalEntries }, { data: appointments }] =
    await Promise.all([
      supabase.from("weeks").select("*").eq("week_number", currentWeekNumber).single(),
      supabase.from("user_progress").select("*").eq("user_id", user.id),
      supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("entry_date", { ascending: false })
        .limit(1),
      supabase
        .from("appointments")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "upcoming")
        .gte("scheduled_at", new Date().toISOString())
        .order("scheduled_at", { ascending: true })
        .limit(1),
    ]);

  const completedCount = progressRows?.filter((p) => p.status === "completed").length ?? 0;
  const currentProgress = progressRows?.find((p) => p.week_id === currentWeek?.id) ?? null;

  return (
    <div className="mx-auto max-w-2xl">
      <WelcomeHeader firstName={profile?.first_name ?? null} />

      <ProgressOverview
        currentWeek={currentWeekNumber}
        weekTitle={currentWeek?.title ?? null}
        completedCount={completedCount}
      />

      <CurrentStateCard entry={journalEntries?.[0] ?? null} />

      <RadarLinkCard />

      <NextAppointmentCard appointment={appointments?.[0] ?? null} />

      {currentWeek && <WeeklyActionsList week={currentWeek} progress={currentProgress} />}

      {currentWeek && <ContinueButton weekId={currentWeek.id} status={currentProgress?.status} />}
    </div>
  );
}

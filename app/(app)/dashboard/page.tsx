import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/queries";
import { WelcomeHeader } from "@/components/features/dashboard/WelcomeHeader";
import { ProgressOverview } from "@/components/features/dashboard/ProgressOverview";
import { CurrentStateCard } from "@/components/features/dashboard/CurrentStateCard";
import { RadarLinkCard } from "@/components/features/dashboard/RadarLinkCard";
import { NextAppointmentCard } from "@/components/features/dashboard/NextAppointmentCard";
import { ContinueButton } from "@/components/features/dashboard/ContinueButton";
import { OfferCard } from "@/components/features/dashboard/OfferCard";
import { HabitsLinkCard } from "@/components/features/dashboard/HabitsLinkCard";
import { todayISODate } from "@/lib/habits/streak";

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

  const today = todayISODate();

  const [{ data: currentWeek }, { data: progressRows }, { data: journalEntries }, { data: appointments }, { data: offer }, { data: activeHabits }, { data: todayLogs }] =
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
      supabase
        .from("program_offers")
        .select("*")
        .eq("is_active", true)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase.from("habits").select("id").eq("user_id", user.id).eq("is_active", true),
      supabase.from("habit_logs").select("habit_id").eq("user_id", user.id).eq("log_date", today),
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
      <Link
        href="/aujourdhui"
        className="mt-4 flex w-full items-center justify-center rounded-full bg-rr-or px-6 py-4 text-[15px] font-medium text-rr-noir transition-opacity hover:opacity-90"
      >
        Ma journée
      </Link>
      {currentWeek && <ContinueButton weekId={currentWeek.id} status={currentProgress?.status} />}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <NextAppointmentCard appointment={appointments?.[0] ?? null} />
        <HabitsLinkCard activeCount={activeHabits?.length ?? 0} doneTodayCount={todayLogs?.length ?? 0} />
      </div>

      <section className="mt-12">
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-gris">Pour aller plus loin</p>
        <CurrentStateCard entry={journalEntries?.[0] ?? null} />
        <RadarLinkCard />
        {offer && <OfferCard offer={offer} />}
      </section>
    </div>
  );
}

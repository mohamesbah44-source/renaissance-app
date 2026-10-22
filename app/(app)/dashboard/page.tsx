import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/queries";
import { CurrentStateCard } from "@/components/features/dashboard/CurrentStateCard";
import { RadarLinkCard } from "@/components/features/dashboard/RadarLinkCard";
import { NextAppointmentCard } from "@/components/features/dashboard/NextAppointmentCard";
import { OfferCard } from "@/components/features/dashboard/OfferCard";
import { HabitsLinkCard } from "@/components/features/dashboard/HabitsLinkCard";
import { todayISODate } from "@/lib/habits/streak";

function greeting(): string {
  const hour = Number(
    new Intl.DateTimeFormat("fr-FR", { hour: "numeric", hour12: false, timeZone: "Europe/Paris" }).format(new Date())
  );
  return hour >= 18 || hour < 5 ? "Bonsoir" : "Bonjour";
}

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

  const [{ data: currentWeek }, { data: journalEntries }, { data: appointments }, { data: offer }, { data: activeHabits }, { data: todayLogs }] =
    await Promise.all([
      supabase.from("weeks").select("*").eq("week_number", currentWeekNumber).single(),
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

  const progressPct = Math.min(100, Math.max(0, (currentWeekNumber / 8) * 100));

  return (
    <div className="mx-auto max-w-2xl">
      <header className="pt-1">
        <h1 className="animate-fade-up font-rr-display text-4xl leading-tight text-rr-ivoire">
          {greeting()}
          {profile?.first_name ? ` ${profile.first_name}` : ""}.
        </h1>
        <p className="mt-3 text-sm text-rr-gris-clair">
          Semaine {currentWeekNumber} sur 8{currentWeek?.title ? ` · ${currentWeek.title}` : ""}
        </p>
        <div
          className="mt-5 h-[3px] rounded-full bg-white/10"
          role="img"
          aria-label={`Semaine ${currentWeekNumber} sur 8`}
        >
          <div className="h-[3px] rounded-full bg-rr-or" style={{ width: `${progressPct}%` }} />
        </div>
      </header>

      <Link
        href="/aujourdhui"
        className="rr-shimmer mt-9 flex w-full items-center justify-center rounded-full bg-rr-or px-6 py-4 text-[16px] font-medium text-rr-noir shadow-[0_10px_40px_-12px_rgba(201,169,110,0.6)] transition-opacity hover:opacity-90"
      >
        Ma journée
      </Link>

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

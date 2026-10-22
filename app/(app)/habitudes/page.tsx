import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { HabitCard } from "@/components/features/habitudes/HabitCard";
import { GenerateHabitsButton } from "@/components/features/habitudes/GenerateHabitsButton";
import { todayISODate } from "@/lib/habits/streak";

/** Les 7 derniers jours (le plus ancien d'abord, aujourd'hui en dernier). */
function lastSevenDays(today: string): string[] {
  const base = new Date(`${today}T12:00:00Z`);
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(base);
    d.setUTCDate(d.getUTCDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export default async function HabitudesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const [{ data: habits }, { data: logs }] = await Promise.all([
    supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: true }),
    supabase
      .from("habit_logs")
      .select("habit_id, log_date")
      .eq("user_id", user.id)
      .gte("log_date", sixtyDaysAgo.toISOString().slice(0, 10)),
  ]);

  const logsByHabit = new Map<string, string[]>();
  for (const log of logs ?? []) {
    const list = logsByHabit.get(log.habit_id) ?? [];
    list.push(log.log_date);
    logsByHabit.set(log.habit_id, list);
  }

  const today = todayISODate();
  const week = lastSevenDays(today);
  const activeHabits = habits ?? [];
  const doneTodayCount = activeHabits.filter((h) => (logsByHabit.get(h.id) ?? []).includes(today)).length;

  return (
    <div className="rr-enter mx-auto max-w-2xl pb-8">
      <Link
        href="/profil"
        aria-label="Retour au profil"
        className="-ml-3 flex h-11 w-11 items-center justify-center rounded-full text-rr-gris-clair transition-colors hover:text-rr-ivoire"
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={1.6} />
      </Link>

      <header className="mt-3">
        <p className="text-[10px] uppercase tracking-[0.3em] text-rr-or">Ancrage quotidien</p>
        <h1 className="mt-4 font-rr-display text-rr-ivoire">Mes habitudes.</h1>
        <p className="mt-4 text-sm leading-relaxed text-rr-gris-clair">
          La régularité compte plus que la perfection.
        </p>
      </header>

      {activeHabits.length > 0 && (
        <>
          <div
            className="mt-12 flex items-baseline gap-3"
            role="img"
            aria-label={`${doneTodayCount} habitudes faites sur ${activeHabits.length} aujourd'hui`}
          >
            <span className="font-rr-serif text-[52px] italic leading-none text-rr-ivoire">
              {doneTodayCount} / {activeHabits.length}
            </span>
            <span className="text-[13px] text-rr-gris-clair">
              {doneTodayCount <= 1 ? "faite aujourd'hui" : "faites aujourd'hui"}
            </span>
          </div>

          <div className="mt-6 flex flex-col">
            {activeHabits.map((habit) => {
              const dates = logsByHabit.get(habit.id) ?? [];
              return (
                <HabitCard
                  key={habit.id}
                  id={habit.id}
                  titre={habit.titre}
                  pilierId={habit.pilier_id}
                  doneToday={dates.includes(today)}
                  week={week.map((d) => dates.includes(d))}
                />
              );
            })}
          </div>

          <p className="mt-12 text-center font-rr-serif text-xl italic leading-snug text-rr-gris-clair">
            Un geste à la fois suffit.
          </p>
        </>
      )}

      {activeHabits.length === 0 && (
        <p className="mt-14 px-4 text-center font-rr-serif text-lg italic leading-relaxed text-rr-gris-clair">
          Tu ne suis encore aucune habitude.
          <br />
          Génère des suggestions à partir de ton dernier bilan Radar, ou demande à ton accompagnant·e d&apos;en
          ajouter une pour toi.
        </p>
      )}

      <div className="mt-10">
        <GenerateHabitsButton />
      </div>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { HabitCard } from "@/components/features/habitudes/HabitCard";
import { GenerateHabitsButton } from "@/components/features/habitudes/GenerateHabitsButton";
import { computeStreak, todayISODate } from "@/lib/habits/streak";

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
  const activeHabits = habits ?? [];
  const doneTodayCount = activeHabits.filter((h) => (logsByHabit.get(h.id) ?? []).includes(today)).length;

  return (
    <div className="mx-auto max-w-2xl pb-8">
      <div className="pt-2">
        <p className="text-xs uppercase tracking-[0.3em] text-rr-or/80">Ancrage quotidien</p>
        <h1 className="mt-3 font-rr-display text-3xl text-rr-ivoire">Mes habitudes</h1>
        <p className="mt-3 text-sm leading-relaxed text-rr-gris-clair">
          De petits gestes quotidiens, reliés à tes zones prioritaires du Radar Re-Naissance™, pour ancrer
          la transformation entre deux semaines de parcours.
        </p>
      </div>

      {activeHabits.length > 0 && (
        <GlassCard className="mt-7 flex items-center justify-between p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">Aujourd&apos;hui</p>
            <p className="mt-2 font-rr-display text-2xl text-rr-ivoire">
              {doneTodayCount} / {activeHabits.length}
            </p>
          </div>
        </GlassCard>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {activeHabits.map((habit) => (
          <HabitCard
            key={habit.id}
            id={habit.id}
            titre={habit.titre}
            pilierId={habit.pilier_id}
            doneToday={(logsByHabit.get(habit.id) ?? []).includes(today)}
            streak={computeStreak(logsByHabit.get(habit.id) ?? [])}
          />
        ))}
      </div>

      {activeHabits.length === 0 && (
        <GlassCard className="mt-7 p-8 text-center">
          <p className="text-sm leading-relaxed text-rr-gris-clair">
            Tu ne suis encore aucune habitude. Génère des suggestions à partir de ton dernier bilan
            Radar, ou demande à ton accompagnant·e d&apos;en ajouter une pour toi.
          </p>
        </GlassCard>
      )}

      <div className="mt-8">
        <GenerateHabitsButton />
      </div>
    </div>
  );
}

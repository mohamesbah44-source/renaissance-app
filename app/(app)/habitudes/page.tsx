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
  const remaining = activeHabits.length - doneTodayCount;

  return (
    <div className="mx-auto max-w-2xl pb-8">
      <header className="pt-1">
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">Ancrage quotidien</p>
        <h1 className="mt-3 font-rr-display text-4xl leading-tight text-rr-ivoire">Mes habitudes</h1>
        <p className="mt-4 text-sm leading-relaxed text-rr-gris-clair">
          De petits gestes quotidiens, reliés à tes zones prioritaires du Radar Re-Naissance™, pour ancrer
          la transformation entre deux semaines de parcours.
        </p>
      </header>

      {activeHabits.length > 0 && (
        <GlassCard className="mt-8 p-6">
          <div className="flex items-baseline justify-between">
            <p className="text-[11px] uppercase tracking-[0.3em] text-rr-gris">Aujourd&apos;hui</p>
            <p className="font-rr-display text-2xl text-rr-ivoire">
              {doneTodayCount} <span className="text-base text-rr-gris">/ {activeHabits.length}</span>
            </p>
          </div>

          <div
            className="mt-5 flex gap-1.5"
            role="img"
            aria-label={`${doneTodayCount} habitudes faites sur ${activeHabits.length} aujourd'hui`}
          >
            {activeHabits.map((habit, i) => (
              <span
                key={habit.id}
                className={i < doneTodayCount ? "h-1 flex-1 rounded-full bg-rr-or" : "h-1 flex-1 rounded-full bg-white/10"}
              />
            ))}
          </div>

          <p className="mt-4 text-sm text-rr-gris-clair">
            {remaining === 0
              ? "Tout est ancré pour aujourd'hui."
              : remaining === 1
                ? "Encore 1 geste aujourd'hui."
                : `Encore ${remaining} gestes aujourd'hui.`}
          </p>
        </GlassCard>
      )}

      {activeHabits.length > 0 && (
        <div className="mt-4 flex flex-col gap-3">
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
      )}

      {activeHabits.length === 0 && (
        <p className="mt-10 px-4 text-center font-rr-serif text-lg italic leading-relaxed text-rr-gris-clair">
          Tu ne suis encore aucune habitude.
          <br />
          Génère des suggestions à partir de ton dernier bilan Radar, ou demande à ton accompagnant·e d&apos;en
          ajouter une pour toi.
        </p>
      )}

      <div className="mt-8">
        <GenerateHabitsButton />
      </div>
    </div>
  );
}

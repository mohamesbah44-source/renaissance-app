import { createClient } from "@/lib/supabase/server";
import { WeekListItem } from "@/components/features/parcours/WeekListItem";
import { todayISODate } from "@/lib/habits/streak";
import type { ProgressStatus } from "@/lib/types/database.types";

export default async function ParcoursPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("program_start_date, current_week")
    .eq("id", user.id)
    .single();

  // Même règle que la page Aujourd'hui : la semaine se calcule depuis la date de début.
  let currentWeekNumber = profile?.current_week ?? 1;
  if (profile?.program_start_date) {
    const todayDate = new Date(`${todayISODate()}T12:00:00`);
    const start = new Date(`${String(profile.program_start_date).slice(0, 10)}T12:00:00`);
    const diff = Math.max(0, Math.round((todayDate.getTime() - start.getTime()) / 86400000));
    currentWeekNumber = Math.min(8, Math.floor(diff / 7) + 1);
  }

  const [{ data: weeks }, { data: progressRows }] = await Promise.all([
    supabase.from("weeks").select("*").order("week_number", { ascending: true }),
    supabase.from("user_progress").select("*").eq("user_id", user.id),
  ]);

  const progressByWeekId = new Map(progressRows?.map((progress) => [progress.week_id, progress]) ?? []);

  return (
    <div className="mx-auto max-w-2xl">
      <header className="pt-1">
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">Ton parcours</p>
        <h1 className="mt-3 font-rr-display text-4xl leading-tight text-rr-ivoire">
          8 semaines vers toi-même
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-rr-gris-clair">
          Chaque semaine ouvre un espace d&apos;exploration : une intention, des pratiques, un temps
          d&apos;écriture. Avance à ton rythme, sans te juger.
        </p>
      </header>

      <div className="mt-10 flex flex-col">
        {weeks?.map((week) => {
          const status: ProgressStatus = progressByWeekId.get(week.id)?.status ?? "not_started";

          return (
            <WeekListItem
              key={week.id}
              week={week}
              status={status}
              isCurrent={week.week_number === currentWeekNumber}
            />
          );
        })}
      </div>
    </div>
  );
}

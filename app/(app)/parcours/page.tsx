import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/queries";
import { WeekListItem } from "@/components/features/parcours/WeekListItem";
import type { ProgressStatus } from "@/lib/types/database.types";

export default async function ParcoursPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const profile = await getProfile(supabase, user.id);
  const currentWeekNumber = profile?.current_week ?? 1;

  const [{ data: weeks }, { data: progressRows }] = await Promise.all([
    supabase.from("weeks").select("*").order("week_number", { ascending: true }),
    supabase.from("user_progress").select("*").eq("user_id", user.id),
  ]);

  const progressByWeekId = new Map(progressRows?.map((progress) => [progress.week_id, progress]) ?? []);

  return (
    <div className="mx-auto max-w-2xl">
      <header className="pt-2">
        <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">Ton parcours</p>
        <h1 className="mt-2 font-rr-display text-3xl uppercase tracking-[0.06em] text-rr-ivoire">8 semaines vers toi-même</h1>
        <p className="mt-3 text-sm leading-relaxed text-rr-gris-clair">
          Chaque semaine ouvre un espace d&apos;exploration : une intention, des pratiques, un temps
          d&apos;écriture. Avance à ton rythme, sans te juger.
        </p>
      </header>

      <div className="mt-9 flex flex-col gap-4">
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

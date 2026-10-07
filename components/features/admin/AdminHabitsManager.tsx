import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { AdminHabitCreateForm } from "@/components/features/admin/AdminHabitCreateForm";
import { deleteHabit, setRetentionAllowed, toggleHabitActive, updateHabit } from "@/lib/admin/habit-actions";
import { todayISODate } from "@/lib/habits/streak";
import { cn } from "@/lib/utils";

const DAYS = [
  { v: 1, l: "Lun" },
  { v: 2, l: "Mar" },
  { v: 3, l: "Mer" },
  { v: 4, l: "Jeu" },
  { v: 5, l: "Ven" },
  { v: 6, l: "Sam" },
  { v: 7, l: "Dim" },
];
const MOMENT: Record<string, string> = { morning: "Matin", day: "Journée", evening: "Soir" };

type HabitRow = {
  id: string;
  titre: string;
  is_active: boolean;
  time_of_day: string;
  weekdays: number[] | null;
  start_date: string | null;
  end_date: string | null;
  system_key: string | null;
};

const field =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-rr-ivoire focus:border-rr-or/50 focus:outline-none";

function lastDays(n: number): { iso: string; isoWeekday: number }[] {
  const base = new Date(`${todayISODate()}T12:00:00`);
  return Array.from({ length: n }, (_, k) => {
    const d = new Date(base.getTime() - (n - 1 - k) * 86400000);
    const js = d.getDay();
    return { iso: d.toLocaleDateString("en-CA"), isoWeekday: js === 0 ? 7 : js };
  });
}

export async function AdminHabitsManager({ clientId }: { clientId: string }) {
  const supabase = await createClient();
  const db = supabase as unknown as SupabaseClient;
  const days = lastDays(14);

  const [{ data: habitsData }, { data: logsData }, { data: practice }] = await Promise.all([
    db
      .from("habits")
      .select("id, titre, is_active, time_of_day, weekdays, start_date, end_date, system_key")
      .eq("user_id", clientId)
      .order("created_at", { ascending: true }),
    db.from("habit_logs").select("habit_id, log_date").eq("user_id", clientId).gte("log_date", days[0].iso),
    db.from("practices").select("id").eq("key", "morning_breath").maybeSingle(),
  ]);

  let retentionAllowed = false;
  if (practice) {
    const { data: cp } = await db
      .from("client_practices")
      .select("retention_allowed")
      .eq("user_id", clientId)
      .eq("practice_id", practice.id)
      .maybeSingle();
    retentionAllowed = Boolean(cp?.retention_allowed);
  }

  const habits = (habitsData ?? []) as HabitRow[];
  const logsByHabit = new Map<string, Set<string>>();
  for (const l of (logsData ?? []) as { habit_id: string; log_date: string }[]) {
    const set = logsByHabit.get(l.habit_id) ?? new Set<string>();
    set.add(String(l.log_date).slice(0, 10));
    logsByHabit.set(l.habit_id, set);
  }

  return (
    <div className="flex flex-col gap-4">
      <GlassCard className="p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-rr-ivoire">Rétention du souffle</p>
            <p className="mt-1 text-xs text-rr-gris-clair">
              Routine du matin (4-7-8). {retentionAllowed ? "Autorisée pour ce participant." : "Non autorisée : le 4-7-8 se fait sans rétention."}
            </p>
          </div>
          <form action={setRetentionAllowed}>
            <input type="hidden" name="clientId" value={clientId} />
            <input type="hidden" name="allowed" value={retentionAllowed ? "0" : "1"} />
            <button
              type="submit"
              className="h-10 shrink-0 rounded-full border border-rr-or/40 px-5 text-xs text-rr-or transition-colors hover:bg-rr-or/10"
            >
              {retentionAllowed ? "Désactiver" : "Autoriser"}
            </button>
          </form>
        </div>
      </GlassCard>

      {habits.length === 0 && <p className="text-sm text-rr-gris-clair">Aucune habitude pour le moment.</p>}

      {habits.map((h) => {
        const done = logsByHabit.get(h.id) ?? new Set<string>();
        const weekdays = h.weekdays ?? [1, 2, 3, 4, 5, 6, 7];
        return (
          <GlassCard key={h.id} className={cn("p-5", !h.is_active && "opacity-60")}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[15px] leading-snug text-rr-ivoire">{h.titre}</p>
                <p className="mt-1 text-xs text-rr-gris-clair">
                  {MOMENT[h.time_of_day] ?? "Journée"} ·{" "}
                  {weekdays.length === 7 ? "Tous les jours" : DAYS.filter((d) => weekdays.includes(d.v)).map((d) => d.l).join(" ")}
                  {h.start_date ? ` · dès le ${h.start_date}` : ""}
                  {h.end_date ? ` · jusqu'au ${h.end_date}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                {h.system_key && (
                  <span className="rounded-full border border-rr-or/30 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.15em] text-rr-or">
                    Socle
                  </span>
                )}
                {!h.is_active && <span className="text-[10px] uppercase tracking-[0.15em] text-rr-gris">Désactivée</span>}
              </div>
            </div>

            <div className="mt-4 flex gap-1" role="img" aria-label="Historique des 14 derniers jours">
              {days.map((d) => (
                <span
                  key={d.iso}
                  title={d.iso}
                  className={cn(
                    "h-2.5 flex-1 rounded-sm",
                    done.has(d.iso) ? "bg-rr-or" : weekdays.includes(d.isoWeekday) ? "bg-white/15" : "bg-white/[0.04]"
                  )}
                />
              ))}
            </div>
            <p className="mt-1.5 text-[11px] text-rr-gris">14 derniers jours · {days.filter((d) => done.has(d.iso)).length} fois</p>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.06] pt-3 text-xs">
              <form action={toggleHabitActive}>
                <input type="hidden" name="id" value={h.id} />
                <input type="hidden" name="clientId" value={clientId} />
                <input type="hidden" name="active" value={h.is_active ? "0" : "1"} />
                <button type="submit" className="text-rr-gris-clair transition-colors hover:text-rr-ivoire">
                  {h.is_active ? "Désactiver" : "Réactiver"}
                </button>
              </form>

              {!h.system_key && (
                <details>
                  <summary className="cursor-pointer list-none text-rr-rouge/80 transition-colors hover:text-rr-rouge [&::-webkit-details-marker]:hidden">
                    Supprimer
                  </summary>
                  <form action={deleteHabit} className="mt-2 flex items-center gap-3">
                    <input type="hidden" name="id" value={h.id} />
                    <input type="hidden" name="clientId" value={clientId} />
                    <span className="text-rr-gris-clair">Supprimer définitivement, historique compris ?</span>
                    <button type="submit" className="text-rr-rouge hover:text-rr-ivoire">
                      Oui
                    </button>
                  </form>
                </details>
              )}
            </div>

            <details className="mt-3">
              <summary className="cursor-pointer list-none text-xs text-rr-or transition-colors hover:text-rr-or-clair [&::-webkit-details-marker]:hidden">
                Modifier
              </summary>
              <form action={updateHabit} className="mt-3 flex flex-col gap-3">
                <input type="hidden" name="id" value={h.id} />
                <input type="hidden" name="clientId" value={clientId} />
                <input name="titre" defaultValue={h.titre} required maxLength={120} aria-label="Titre" className={field} />
                <select name="time_of_day" defaultValue={h.time_of_day} aria-label="Moment de la journée" className={field}>
                  <option value="morning">Matin</option>
                  <option value="day">Journée</option>
                  <option value="evening">Soir</option>
                </select>
                <div className="flex flex-wrap gap-1.5">
                  {DAYS.map((d) => (
                    <label key={d.v}>
                      <input type="checkbox" name="weekdays" value={d.v} defaultChecked={weekdays.includes(d.v)} className="peer sr-only" />
                      <span className="flex h-9 min-w-11 cursor-pointer items-center justify-center rounded-full border border-white/10 px-3 text-xs text-rr-gris transition-colors peer-checked:border-rr-or peer-checked:bg-rr-or/15 peer-checked:text-rr-or peer-focus-visible:ring-2 peer-focus-visible:ring-rr-or/50">
                        {d.l}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="date" name="start_date" defaultValue={h.start_date ?? ""} aria-label="Date de début" className={field} />
                  <input type="date" name="end_date" defaultValue={h.end_date ?? ""} aria-label="Date de fin" className={field} />
                </div>
                <button
                  type="submit"
                  className="h-10 rounded-full border border-rr-or/40 text-xs text-rr-or transition-colors hover:bg-rr-or/10"
                >
                  Enregistrer les modifications
                </button>
              </form>
            </details>
          </GlassCard>
        );
      })}

      <GlassCard className="p-5">
        <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-rr-or">Nouvelle habitude</p>
        <AdminHabitCreateForm clientId={clientId} />
      </GlassCard>
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { todayISODate } from "@/lib/habits/streak";
import { cn } from "@/lib/utils";
import { saveWeeklySynthesis } from "@/lib/today/synthesis-actions";

type Checkin = { checkin_date: string; energy: number | null; tension: number | null };
type Progress = { log_date: string; mission_done: boolean; journaling_done: boolean };
type Entry = { id: string; entry_date: string; content: string };

const DAY_LETTERS = ["D", "L", "M", "M", "J", "V", "S"];

function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + n);
  return d.toLocaleDateString("sv-SE");
}

function longDate(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function Bars({ label, values, letters }: { label: string; values: (number | null)[]; letters: string[] }) {
  return (
    <div>
      <p className="text-xs text-rr-gris-clair">{label}</p>
      <div className="mt-3 flex h-16 items-end gap-2">
        {values.map((v, i) => (
          <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
            <div
              className={cn("w-full rounded-t-md", v ? "bg-rr-or/70" : "bg-white/10")}
              style={{ height: v ? `${(v / 5) * 100}%` : "4px" }}
              title={v ? `${v}/5` : "Pas de check-in"}
            />
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex gap-2">
        {letters.map((l, i) => (
          <span key={i} className="flex-1 text-center text-[10px] text-rr-gris">
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

export default async function BilanPage({ searchParams }: { searchParams: Promise<{ semaine?: string }> }) {
  const { semaine } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const db = supabase as unknown as SupabaseClient;
  const today = todayISODate();

  const { data: profile } = await supabase
    .from("profiles")
    .select("program_start_date, current_week")
    .eq("id", user.id)
    .single();

  // Semaine en cours
  let currentWeek = profile?.current_week ?? 1;
  const startDate = profile?.program_start_date ? String(profile.program_start_date).slice(0, 10) : null;
  if (startDate) {
    const diff = Math.max(
      0,
      Math.round((new Date(`${today}T12:00:00`).getTime() - new Date(`${startDate}T12:00:00`).getTime()) / 86400000)
    );
    currentWeek = Math.min(8, Math.floor(diff / 7) + 1);
  }

  // Semaine affichée (jamais une semaine à venir)
  const requested = Number(semaine);
  const weekNumber =
    Number.isInteger(requested) && requested >= 1 && requested <= currentWeek ? requested : currentWeek;

  const rangeStart = startDate ? addDays(startDate, (weekNumber - 1) * 7) : addDays(today, -6);
  const rangeEnd = addDays(rangeStart, 6);
  const days = Array.from({ length: 7 }, (_, i) => addDays(rangeStart, i));
  const letters = days.map((d) => DAY_LETTERS[new Date(`${d}T12:00:00`).getDay()]);

  const { data: week } = await supabase
    .from("weeks")
    .select("id, title, intention, synthesis_question")
    .eq("week_number", weekNumber)
    .maybeSingle();

  const [{ data: checkinsRaw }, { data: progressRaw }, { data: entriesRaw }, { data: synthesis }] = await Promise.all([
    db
      .from("daily_checkins")
      .select("checkin_date, energy, tension")
      .eq("user_id", user.id)
      .gte("checkin_date", rangeStart)
      .lte("checkin_date", rangeEnd),
    db
      .from("daily_progress")
      .select("log_date, mission_done, journaling_done")
      .eq("user_id", user.id)
      .gte("log_date", rangeStart)
      .lte("log_date", rangeEnd),
    week
      ? db
          .from("journal_entries")
          .select("id, entry_date, content")
          .eq("user_id", user.id)
          .eq("week_id", week.id)
          .order("entry_date", { ascending: true })
      : Promise.resolve({ data: [] }),
    week
      ? db
          .from("weekly_syntheses")
          .select("response")
          .eq("user_id", user.id)
          .eq("week_id", week.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const checkins = (checkinsRaw ?? []) as Checkin[];
  const progress = (progressRaw ?? []) as Progress[];
  const entries = (entriesRaw ?? []) as Entry[];

  const energyByDay = days.map((d) => checkins.find((c) => c.checkin_date === d)?.energy ?? null);
  const tensionByDay = days.map((d) => checkins.find((c) => c.checkin_date === d)?.tension ?? null);

  const journalDays = progress.filter((p) => p.journaling_done).length;
  const missionDays = progress.filter((p) => p.mission_done).length;
  const checkinDays = checkins.length;

  const question = week?.synthesis_question || "Qu'as-tu compris cette semaine, et qu'as-tu envie de garder ?";
  const savedResponse: string = synthesis?.response ?? "";

  return (
    <div className="mx-auto max-w-2xl pb-8">
      <header className="pt-1">
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or-clair/70">Bilan de la semaine {weekNumber}</p>
        <h1 className="mt-3 font-rr-display text-4xl leading-tight text-rr-ivoire">{week?.title ?? "Ma semaine"}</h1>
        {week?.intention && (
          <p className="mt-3 font-rr-serif text-lg italic leading-snug text-rr-gris-clair">{week.intention}</p>
        )}
      </header>

      {currentWeek > 1 && (
        <nav className="mt-6 flex flex-wrap gap-2" aria-label="Choisir une semaine">
          {Array.from({ length: currentWeek }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={`/bilan?semaine=${n}`}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs transition-colors",
                n === weekNumber
                  ? "border-rr-or bg-rr-or/15 text-rr-or"
                  : "border-white/10 text-rr-gris-clair hover:border-rr-or/40"
              )}
            >
              Semaine {n}
            </Link>
          ))}
        </nav>
      )}

      <GlassCard className="mt-8 p-6">
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-gris">Ce que tu as traversé</p>
        <div className="mt-5 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="font-rr-display text-3xl text-rr-ivoire">{journalDays}</p>
            <p className="mt-1 text-xs text-rr-gris-clair">{journalDays > 1 ? "jours d'écriture" : "jour d'écriture"}</p>
          </div>
          <div>
            <p className="font-rr-display text-3xl text-rr-ivoire">{missionDays}</p>
            <p className="mt-1 text-xs text-rr-gris-clair">{missionDays > 1 ? "missions explorées" : "mission explorée"}</p>
          </div>
          <div>
            <p className="font-rr-display text-3xl text-rr-ivoire">{checkinDays}</p>
            <p className="mt-1 text-xs text-rr-gris-clair">{checkinDays > 1 ? "check-ins" : "check-in"}</p>
          </div>
        </div>
        <p className="mt-5 text-sm text-rr-gris-clair">
          La régularité compte plus que la perfection. Observe simplement, sans te juger.
        </p>
      </GlassCard>

      <GlassCard className="mt-6 p-6">
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-gris">Ton énergie et ta tension</p>
        <div className="mt-5 flex flex-col gap-6">
          <Bars label="Énergie" values={energyByDay} letters={letters} />
          <Bars label="Tension intérieure" values={tensionByDay} letters={letters} />
        </div>
      </GlassCard>

      {entries.length > 0 && (
        <details className="group mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <summary className="cursor-pointer list-none text-sm text-rr-ivoire">
            Relire mes réponses de la semaine <span className="text-rr-gris">({entries.length})</span>
          </summary>
          <div className="mt-5 flex flex-col gap-5">
            {entries.map((e) => (
              <div key={e.id}>
                <p className="text-[11px] uppercase tracking-[0.2em] text-rr-or">{longDate(e.entry_date)}</p>
                <p className="mt-2 whitespace-pre-wrap font-rr-serif text-base leading-relaxed text-rr-gris-clair">
                  {e.content}
                </p>
              </div>
            ))}
          </div>
        </details>
      )}

      <section className="mt-10">
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">Ma synthèse</p>
        <GlassCard className="mt-4 p-5">
          <p className="font-rr-serif text-lg italic leading-snug text-rr-ivoire">{question}</p>
          {week ? (
            <form action={saveWeeklySynthesis} className="mt-4 flex flex-col gap-4">
              <input type="hidden" name="weekId" value={week.id} />
              <textarea
                name="response"
                required
                rows={7}
                defaultValue={savedResponse}
                placeholder="Écris ce qui vient, sans te corriger."
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-[15px] leading-relaxed text-rr-ivoire placeholder:text-rr-gris focus:border-rr-or/50 focus:outline-none"
              />
              <button
                type="submit"
                className="h-12 rounded-full border border-rr-or/40 text-sm text-rr-or transition-colors hover:bg-rr-or/10"
              >
                {savedResponse ? "Mettre à jour ma synthèse" : "Enregistrer ma synthèse"}
              </button>
              {savedResponse && <p className="text-center text-xs text-rr-gris">Ta synthèse est enregistrée.</p>}
            </form>
          ) : (
            <p className="mt-4 text-sm text-rr-gris-clair">Cette semaine n&apos;est pas encore disponible.</p>
          )}
        </GlassCard>
      </section>

      <Link
        href="/aujourdhui"
        className="mt-8 flex items-center justify-center rounded-full border border-white/10 px-5 py-3.5 text-sm text-rr-gris-clair transition-colors hover:bg-white/[0.05]"
      >
        Retour à ma journée
      </Link>
    </div>
  );
}

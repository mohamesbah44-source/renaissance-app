import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { RadarExpressForm } from "@/components/features/radar/RadarExpressForm";
import { RadarExpressSummary } from "@/components/features/radar/RadarExpressSummary";
import { levelsFromPillarScores, type Levels } from "@/lib/radar/express";
import { todayISODate } from "@/lib/habits/streak";
import { cn } from "@/lib/utils";
import { saveWeeklySynthesis } from "@/lib/today/synthesis-actions";

type Checkin = { checkin_date: string; energy: number | null; tension: number | null };
type Progress = { log_date: string; mission_done: boolean; journaling_done: boolean };
type Entry = { id: string; entry_date: string; content: string };
type ExpressRow = { week_number: number; levels: Levels | null };

const CARD = "rounded-3xl border border-rr-or/20 bg-white/[0.05]";

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

function average(values: (number | null)[]): number | null {
  const nums = values.filter((v): v is number => typeof v === "number");
  if (nums.length === 0) return null;
  return nums.reduce((s, v) => s + v, 0) / nums.length;
}

function fr(n: number): string {
  return n.toFixed(1).replace(".", ",");
}

function RecapBar({ label, ratio, text }: { label: string; ratio: number | null; text: string }) {
  return (
    <div className="flex items-center gap-3.5">
      <span className="w-[68px] shrink-0 text-xs text-rr-gris-clair">{label}</span>
      <div className="h-1 flex-1 rounded-full bg-white/10">
        {ratio !== null && (
          <div className="h-1 rounded-full bg-rr-or" style={{ width: `${Math.round(ratio * 100)}%` }} />
        )}
      </div>
      <span className="w-9 shrink-0 text-right text-xs text-rr-creme">{text}</span>
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

  // Client non typé : les tables du Lot 1 ne sont pas encore dans les types générés.
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

  const { data: week } = await db
    .from("weeks")
    .select("id, title, intention, synthesis_question")
    .eq("week_number", weekNumber)
    .maybeSingle();

  const [
    { data: checkinsRaw },
    { data: progressRaw },
    { data: entriesRaw },
    { data: synthesis },
    { data: expressRaw },
    { data: baselineBilan },
  ] = await Promise.all([
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
    db
      .from("radar_express")
      .select("week_number, levels")
      .eq("user_id", user.id)
      .in("week_number", [weekNumber, weekNumber - 1]),
    db
      .from("radar_bilans")
      .select("pillar_scores")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  const checkins = (checkinsRaw ?? []) as Checkin[];
  const progress = (progressRaw ?? []) as Progress[];
  const entries = (entriesRaw ?? []) as Entry[];

  const energyAvg = average(checkins.map((c) => c.energy));
  const tensionAvg = average(checkins.map((c) => c.tension));

  const activeDays = new Set<string>();
  for (const p of progress) {
    if (p.mission_done || p.journaling_done) activeDays.add(String(p.log_date).slice(0, 10));
  }
  for (const c of checkins) activeDays.add(String(c.checkin_date).slice(0, 10));
  const regularity = days.filter((d) => activeDays.has(d)).length;

  const question: string =
    week?.synthesis_question || "Qu'as-tu compris cette semaine, et qu'as-tu envie de garder ?";
  const savedResponse: string = synthesis?.response ?? "";

  // Radar express : niveaux de la semaine, et repère de comparaison
  const expressRows = (expressRaw ?? []) as ExpressRow[];
  const currentExpress = expressRows.find((r) => r.week_number === weekNumber)?.levels ?? null;
  const previousExpress = expressRows.find((r) => r.week_number === weekNumber - 1)?.levels ?? null;
  const baseline = levelsFromPillarScores(baselineBilan?.pillar_scores);
  const previousLevels: Levels | null = previousExpress ?? baseline;
  const previousLabel = previousExpress ? "la semaine dernière" : "ton point de départ";
  const showRadar = weekNumber === currentWeek || currentExpress !== null;

  return (
    <div className="rr-enter mx-auto max-w-2xl pb-8">
      <Link
        href={week ? `/parcours/semaine/${week.id}` : "/parcours"}
        aria-label="Retour à la semaine"
        className="-ml-3 flex h-11 w-11 items-center justify-center rounded-full text-rr-gris-clair transition-colors hover:text-rr-ivoire"
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={1.6} />
      </Link>

      <header className="mt-3">
        <p className="text-[10px] uppercase tracking-[0.3em] text-rr-or">
          Semaine {weekNumber}
          {week?.title ? ` · ${week.title}` : ""}
        </p>
        <h1 className="mt-4 font-rr-display text-[42px] leading-[1.02] text-rr-ivoire">Ton bilan.</h1>
        {week?.intention && (
          <p className="mt-4 font-rr-serif text-lg italic leading-snug text-rr-gris-clair">{week.intention}</p>
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
                  ? "border-rr-or bg-rr-or/10 text-rr-or"
                  : "border-white/[0.12] text-rr-gris-clair hover:border-rr-or/40"
              )}
            >
              Semaine {n}
            </Link>
          ))}
        </nav>
      )}

      <div className={cn(CARD, "mt-8 flex flex-col gap-3.5 px-5 py-[18px]")}>
        <RecapBar
          label="Énergie"
          ratio={energyAvg !== null ? energyAvg / 5 : null}
          text={energyAvg !== null ? fr(energyAvg) : "·"}
        />
        <RecapBar
          label="Tension"
          ratio={tensionAvg !== null ? tensionAvg / 5 : null}
          text={tensionAvg !== null ? fr(tensionAvg) : "·"}
        />
        <RecapBar label="Régularité" ratio={regularity / 7} text={`${regularity}/7`} />
      </div>

      <section className="mt-10">
        <p className="font-rr-label text-[9px] uppercase tracking-[0.3em] text-rr-gris-clair">Pour clore la semaine</p>
        <p className="mt-3 font-rr-serif text-[26px] italic leading-[1.22] text-rr-ivoire">{question}</p>

        {week ? (
          <form action={saveWeeklySynthesis} className="mt-6 flex flex-col gap-4">
            <input type="hidden" name="weekId" value={week.id} />
            <textarea
              name="response"
              required
              rows={6}
              defaultValue={savedResponse}
              aria-label="Ta synthèse de la semaine"
              placeholder="Écris ce qui vient, sans te corriger."
              className="w-full resize-none rounded-3xl border border-rr-or/[0.22] bg-white/[0.05] px-5 py-[18px] font-rr-serif text-xl italic leading-[1.35] text-rr-creme placeholder:text-rr-gris focus:border-rr-or/50 focus:outline-none"
            />
            <button
              type="submit"
              className={cn(
                "h-14 rounded-full text-[15px] font-medium transition-opacity duration-300 hover:opacity-90",
                savedResponse ? "border border-rr-or/40 text-rr-or" : "bg-rr-or text-rr-noir"
              )}
            >
              {savedResponse ? "Mettre à jour ma synthèse" : "Enregistrer ma synthèse"}
            </button>
          </form>
        ) : (
          <p className="mt-4 text-sm text-rr-gris-clair">Cette semaine n&apos;est pas encore disponible.</p>
        )}

        {savedResponse && (
          <Link
            href={`/ceremonie/${weekNumber}`}
            className="mt-3 flex h-14 w-full items-center justify-center rounded-full bg-rr-or text-[15px] font-medium text-rr-noir transition-opacity duration-300 hover:opacity-90"
          >
            Terminer la semaine
          </Link>
        )}
      </section>

      {showRadar && (
        <section id="radar" className="mt-14">
          <p className="text-[11px] uppercase tracking-[0.28em] text-rr-gris-clair">Ton Radar de la semaine</p>
          {currentExpress ? (
            <div className={cn(CARD, "mt-4 p-6")}>
              <p className="font-rr-serif text-xl italic leading-snug text-rr-ivoire">
                Voici où tu en es cette semaine.
              </p>
              <RadarExpressSummary levels={currentExpress} previous={previousLevels} previousLabel={previousLabel} />
              {weekNumber === currentWeek && (
                <details className="mt-5 border-t border-white/5 pt-4">
                  <summary className="cursor-pointer list-none text-sm text-rr-gris-clair">
                    Refaire mon Radar de la semaine
                  </summary>
                  <RadarExpressForm defaults={currentExpress} previous={previousLevels} submitLabel="Mettre à jour mon Radar" />
                </details>
              )}
            </div>
          ) : (
            <div className="mt-4 rounded-3xl border border-rr-or/40 bg-rr-or/[0.06] p-6">
              <p className="font-rr-serif text-xl italic leading-snug text-rr-ivoire">
                1 minute pour sentir où tu en es.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-rr-gris-clair">
                Pour chaque pilier, comment ça va cette semaine ? Réponds sans réfléchir : c&apos;est ton ressenti
                du moment.
              </p>
              <RadarExpressForm previous={previousLevels} submitLabel="Enregistrer mon Radar" />
            </div>
          )}
        </section>
      )}

      {entries.length > 0 && (
        <details className="group mt-8 rounded-3xl border border-white/10 bg-white/[0.02] p-5">
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
    </div>
  );
}

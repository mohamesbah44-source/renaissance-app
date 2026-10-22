import Link from "next/link";
import { redirect } from "next/navigation";
import { Check, ArrowRight } from "lucide-react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { CerclesOrbs } from "@/components/features/parcours/CerclesOrbs";
import { cercleLevels, levelsFromPillarScores, programWeek, type Levels } from "@/lib/radar/express";
import { todayISODate } from "@/lib/habits/streak";
import { cn } from "@/lib/utils";

type WeekRow = { id: string; week_number: number; title: string | null; intention: string | null };

/** Niveau moyen (1 à 5) converti en pourcentage d'apaisement. */
function toPercent(level: number | null): number | null {
  if (level === null) return null;
  return Math.round(((level - 1) / 4) * 100);
}

export default async function ParcoursPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("program_start_date, current_week")
    .eq("id", user.id)
    .single();

  const currentWeek = programWeek(profile?.program_start_date, todayISODate(), profile?.current_week ?? 1);

  const db = supabase as unknown as SupabaseClient;
  const [{ data: weeksRaw }, { data: expressRow }, { data: bilanRow }] = await Promise.all([
    db.from("weeks").select("id, week_number, title, intention").order("week_number", { ascending: true }),
    db
      .from("radar_express")
      .select("levels, week_number")
      .eq("user_id", user.id)
      .order("week_number", { ascending: false })
      .limit(1)
      .maybeSingle(),
    db
      .from("radar_bilans")
      .select("pillar_scores")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const weeks = (weeksRaw ?? []) as WeekRow[];
  const current = weeks.find((w) => w.week_number === currentWeek) ?? null;
  const pct = weeks.length > 1 ? ((currentWeek - 1) / (weeks.length - 1)) * 100 : 0;

  const levels: Levels | null =
    (expressRow?.levels as Levels | null | undefined) ?? levelsFromPillarScores(bilanRow?.pillar_scores);
  const cercles = cercleLevels(levels);
  const hasRadar = levels !== null;

  return (
    <div className="rr-enter mx-auto max-w-2xl pb-8">
      <header className="pt-2">
        <p className="text-[10px] uppercase tracking-[0.3em] text-rr-or">8 semaines</p>
        <h1 className="mt-4 font-rr-display text-rr-ivoire">Ton parcours.</h1>
        <p className="mt-4 text-sm text-rr-gris-clair">
          Tu es en semaine {currentWeek} sur 8. Chaque semaine ouvre un nouveau pas, à ton rythme.
        </p>
      </header>

      {weeks.length === 0 ? (
        <p className="mt-12 text-center font-rr-serif text-lg italic text-rr-gris-clair">
          Ton parcours se prépare. Reviens très bientôt.
        </p>
      ) : (
        <>
          {/* Frise des semaines */}
          <div className="relative mt-12 px-2" role="img" aria-label={`Semaine ${currentWeek} sur ${weeks.length}`}>
            <div className="absolute left-2 right-2 top-1/2 h-px -translate-y-1/2 bg-white/10" />
            <div
              className="absolute left-2 top-1/2 h-px -translate-y-1/2 bg-rr-or"
              style={{ width: `calc((100% - 1rem) * ${pct / 100})` }}
            />
            <div className="relative flex items-center justify-between">
              {weeks.map((w) => {
                const isCurrent = w.week_number === currentWeek;
                const isPast = w.week_number < currentWeek;
                return (
                  <span
                    key={w.id}
                    className={cn(
                      "rounded-full",
                      isCurrent
                        ? "h-[18px] w-[18px] border-2 border-rr-or bg-rr-noir shadow-[0_0_14px_rgba(201,169,110,0.7)]"
                        : isPast
                          ? "h-[11px] w-[11px] bg-rr-or"
                          : "h-[11px] w-[11px] border border-white/25 bg-rr-noir"
                    )}
                  />
                );
              })}
            </div>
          </div>

          {/* Cette semaine */}
          {current && (
            <Link href={`/parcours/semaine/${current.id}`} className="mt-12 block">
              <div className="rounded-[28px] border border-rr-or/40 bg-rr-or/[0.06] p-6 transition-transform duration-300 active:scale-[0.99]">
                <p className="font-rr-label text-[10px] uppercase tracking-[0.3em] text-rr-or">Cette semaine</p>
                <p className="mt-3 font-rr-display text-3xl leading-tight text-rr-ivoire">
                  {current.title ?? `Semaine ${current.week_number}`}
                </p>
                {current.intention && (
                  <p className="mt-3 font-rr-serif text-lg italic leading-snug text-rr-gris-clair">
                    {current.intention}
                  </p>
                )}
                <p className="mt-5 flex items-center gap-2 text-sm text-rr-ivoire/90">
                  Ouvrir la semaine
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </p>
              </div>
            </Link>
          )}

          {/* Les trois cercles */}
          {hasRadar && (
            <section className="mt-14">
              <p className="text-[11px] uppercase tracking-[0.28em] text-rr-gris-clair">Tes trois cercles</p>
              <div className="mt-4">
                <CerclesOrbs
                  moi={toPercent(cercles.moi)}
                  nous={toPercent(cercles.nous)}
                  monde={toPercent(cercles.monde)}
                />
              </div>
              <p className="mt-2 text-center text-xs text-rr-gris">D&apos;après ton dernier Radar.</p>
            </section>
          )}

          {/* Toutes les semaines */}
          <section className="mt-14">
            <p className="text-[11px] uppercase tracking-[0.28em] text-rr-gris-clair">Toutes les semaines</p>
            <div className="mt-2">
              {weeks.map((w) => {
                const isCurrent = w.week_number === currentWeek;
                const isPast = w.week_number < currentWeek;
                const isFuture = w.week_number > currentWeek;

                const row = (
                  <div className="flex items-center gap-4 border-b border-white/[0.07] py-4">
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-rr-display text-sm",
                        isCurrent
                          ? "border-rr-or bg-rr-or/15 text-rr-or"
                          : isPast
                            ? "border-rr-or/40 text-rr-or/80"
                            : "border-white/10 text-rr-gris"
                      )}
                    >
                      {isPast ? <Check className="h-4 w-4" strokeWidth={2.25} /> : w.week_number}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "font-rr-serif text-xl italic leading-tight",
                          isFuture ? "text-rr-gris" : "text-rr-ivoire"
                        )}
                      >
                        {w.title ?? `Semaine ${w.week_number}`}
                      </p>
                      <p className="mt-0.5 text-xs text-rr-gris">
                        Semaine {w.week_number}
                        {isCurrent ? " · en cours" : isPast ? " · voir le bilan" : ""}
                      </p>
                    </div>
                  </div>
                );

                if (isFuture) return <div key={w.id} className="opacity-70">{row}</div>;
                if (isCurrent) {
                  return (
                    <Link key={w.id} href={`/parcours/semaine/${w.id}`} className="block">
                      {row}
                    </Link>
                  );
                }
                return (
                  <Link key={w.id} href={`/bilan?semaine=${w.week_number}`} className="block">
                    {row}
                  </Link>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

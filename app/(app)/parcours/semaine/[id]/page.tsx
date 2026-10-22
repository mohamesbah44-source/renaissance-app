import Link from "next/link";
import { redirect } from "next/navigation";
import { Check, ArrowRight } from "lucide-react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { programWeek } from "@/lib/radar/express";
import { todayISODate } from "@/lib/habits/streak";
import { cn } from "@/lib/utils";

type WeekRow = { id: string; week_number: number; title: string | null; intention: string | null };

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
  const { data: weeksRaw } = await db
    .from("weeks")
    .select("id, week_number, title, intention")
    .order("week_number", { ascending: true });
  const weeks = (weeksRaw ?? []) as WeekRow[];
  const current = weeks.find((w) => w.week_number === currentWeek) ?? null;
  const pct = weeks.length > 1 ? ((currentWeek - 1) / (weeks.length - 1)) * 100 : 0;

  return (
    <div className="mx-auto max-w-2xl pb-8">
      <header className="pt-2">
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or-clair/70">8 semaines</p>
        <h1 className="mt-4 font-rr-display text-[2.6rem] leading-[1.1] text-rr-ivoire">Ton parcours</h1>
        <p className="mt-4 text-sm text-rr-gris-clair">
          Tu es en semaine {currentWeek} sur 8. Chaque semaine ouvre un nouveau pas, à ton rythme.
        </p>
      </header>

      {weeks.length === 0 ? (
        <GlassCard variant="quiet" className="mt-10 p-6">
          <p className="text-sm text-rr-gris-clair">Ton parcours se prépare. Reviens très bientôt.</p>
        </GlassCard>
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
              <GlassCard variant="gold" className="p-6 transition-transform duration-300 active:scale-[0.99]">
                <p className="text-[10px] uppercase tracking-[0.3em] text-rr-or">Cette semaine</p>
                <p className="mt-3 font-rr-display text-3xl leading-tight text-rr-ivoire">
                  {current.title ?? `Semaine ${current.week_number}`}
                </p>
                {current.intention && (
                  <p className="mt-3 text-sm leading-relaxed text-rr-gris-clair">{current.intention}</p>
                )}
                <p className="mt-5 flex items-center gap-2 text-sm text-rr-ivoire/90">
                  Ouvrir la semaine
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </p>
              </GlassCard>
            </Link>
          )}

          {/* Toutes les semaines */}
          <section className="mt-12">
            <p className="text-[11px] uppercase tracking-[0.3em] text-rr-gris">Toutes les semaines</p>
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

      <Link
        href="/aujourdhui"
        className="mt-10 flex items-center justify-center rounded-full border border-white/10 px-5 py-3.5 text-sm text-rr-gris-clair transition-colors hover:bg-white/[0.05]"
      >
        Retour à ma journée
      </Link>
    </div>
  );
}

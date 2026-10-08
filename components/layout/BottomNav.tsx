import Link from "next/link";
import { redirect } from "next/navigation";
import { Check } from "lucide-react";
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

  return (
    <div className="mx-auto max-w-2xl pb-8">
      <header className="pt-2">
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or-clair/70">8 semaines</p>
        <h1 className="mt-4 font-rr-display text-[2.6rem] leading-[1.1] text-rr-ivoire">Ton parcours</h1>
        <p className="mt-4 text-sm text-rr-gris-clair">
          Tu es en semaine {currentWeek} sur 8. Chaque semaine ouvre un nouveau pas, à ton rythme.
        </p>
      </header>

      <div className="mt-10 flex flex-col gap-4">
        {weeks.length === 0 && (
          <GlassCard variant="quiet" className="p-6">
            <p className="text-sm text-rr-gris-clair">Ton parcours se prépare. Reviens très bientôt.</p>
          </GlassCard>
        )}

        {weeks.map((w) => {
          const isCurrent = w.week_number === currentWeek;
          const isPast = w.week_number < currentWeek;
          const isFuture = w.week_number > currentWeek;

          const content = (
            <div className="flex items-start gap-5">
              <span
                className={cn(
                  "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-rr-display text-base",
                  isCurrent
                    ? "border-rr-or bg-rr-or/15 text-rr-or shadow-[0_0_18px_rgba(201,169,110,0.35)]"
                    : isPast
                      ? "border-rr-or/40 text-rr-or/80"
                      : "border-white/10 text-rr-gris"
                )}
              >
                {isPast ? <Check className="h-4 w-4" strokeWidth={2.25} /> : w.week_number}
              </span>
              <div className="min-w-0">
                <p
                  className={cn(
                    "text-[11px] uppercase tracking-[0.3em]",
                    isCurrent ? "text-rr-or" : "text-rr-gris"
                  )}
                >
                  Semaine {w.week_number}
                  {isCurrent ? " · en cours" : ""}
                </p>
                <p
                  className={cn(
                    "mt-2 font-rr-display text-xl leading-snug",
                    isFuture ? "text-rr-gris-clair" : "text-rr-ivoire"
                  )}
                >
                  {w.title ?? `Semaine ${w.week_number}`}
                </p>
                {w.intention && (
                  <p
                    className={cn(
                      "mt-2 font-rr-serif text-base italic leading-snug",
                      isFuture ? "text-rr-gris" : "text-rr-gris-clair"
                    )}
                  >
                    {w.intention}
                  </p>
                )}
                {!isFuture && (
                  <p className="mt-3 text-xs text-rr-or/80">Voir le bilan de cette semaine</p>
                )}
              </div>
            </div>
          );

          if (isFuture) {
            return (
              <GlassCard key={w.id} variant="quiet" className="p-6 opacity-70">
                {content}
              </GlassCard>
            );
          }

          return (
            <Link key={w.id} href={`/bilan?semaine=${w.week_number}`} className="block">
              <GlassCard
                variant={isCurrent ? "gold" : "default"}
                className="p-6 transition-transform duration-300 active:scale-[0.99]"
              >
                {content}
              </GlassCard>
            </Link>
          );
        })}
      </div>

      <Link
        href="/aujourdhui"
        className="mt-10 flex items-center justify-center rounded-full border border-white/10 px-5 py-3.5 text-sm text-rr-gris-clair transition-colors hover:bg-white/[0.05]"
      >
        Retour à ma journée
      </Link>
    </div>
  );
}

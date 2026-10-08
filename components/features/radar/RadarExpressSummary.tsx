import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { CERCLES, PILIERS } from "@/lib/radar/constants";
import { cercleLevels, levelWord, trendOf, type Levels } from "@/lib/radar/express";
import { cn } from "@/lib/utils";

export function RadarExpressSummary({
  levels,
  previous,
  previousLabel,
}: {
  levels: Levels;
  previous: Levels | null;
  previousLabel: string;
}) {
  const now = cercleLevels(levels);
  const before = cercleLevels(previous);

  return (
    <div className="mt-4">
      <div className="flex flex-col gap-3">
        {CERCLES.map((cercle) => {
          const trend = trendOf(now[cercle.id], before[cercle.id]);
          return (
            <div key={cercle.id} className="flex items-center justify-between gap-4 rounded-2xl bg-white/[0.03] px-4 py-3.5">
              <div className="min-w-0">
                <p className="font-rr-display text-base text-rr-ivoire">{cercle.nom}</p>
                <p className="mt-0.5 font-rr-serif text-sm italic text-rr-or">{levelWord(now[cercle.id])}</p>
              </div>
              {trend && (
                <p
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 text-right text-xs",
                    trend === "up" ? "text-rr-or" : trend === "down" ? "text-rr-orange" : "text-rr-gris"
                  )}
                >
                  {trend === "up" && <TrendingUp className="h-4 w-4" strokeWidth={1.75} />}
                  {trend === "down" && <TrendingDown className="h-4 w-4" strokeWidth={1.75} />}
                  {trend === "stable" && <Minus className="h-4 w-4" strokeWidth={1.75} />}
                  <span>
                    {trend === "up" && `plus apaisé que ${previousLabel}`}
                    {trend === "down" && `plus chargé que ${previousLabel}`}
                    {trend === "stable" && `stable depuis ${previousLabel}`}
                  </span>
                </p>
              )}
            </div>
          );
        })}
      </div>

      <details className="mt-4">
        <summary className="cursor-pointer list-none text-sm text-rr-gris-clair">Voir mes 12 piliers</summary>
        <div className="mt-3 flex flex-col">
          {PILIERS.map((pilier) => {
            const value = Math.round(levels[String(pilier.id)] ?? 0);
            return (
              <div key={pilier.id} className="flex items-center justify-between border-b border-white/5 py-2.5 last:border-b-0">
                <p className="text-sm text-rr-ivoire">{pilier.court}</p>
                <div className="flex gap-1" aria-label={`${value} sur 5`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span key={n} className={cn("h-1.5 w-5 rounded-full", n <= value ? "bg-rr-or" : "bg-white/10")} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </details>
    </div>
  );
}

import { Check, Flame } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { toggleHabitToday, archiveHabit } from "@/lib/habits/actions";
import { PILIERS } from "@/lib/radar/constants";
import { cn } from "@/lib/utils";

interface HabitCardProps {
  id: string;
  titre: string;
  pilierId: number;
  doneToday: boolean;
  streak: number;
}

export function HabitCard({ id, titre, pilierId, doneToday, streak }: HabitCardProps) {
  const pilier = PILIERS.find((p) => p.id === pilierId);

  return (
    <GlassCard
      className={cn(
        "p-5 transition-all duration-300",
        doneToday && "border-rr-or/30 bg-rr-or/[0.05]"
      )}
    >
      <div className="flex items-center gap-4">
        <form action={toggleHabitToday}>
          <input type="hidden" name="habitId" value={id} />
          <button
            type="submit"
            aria-label={doneToday ? "Décocher pour aujourd'hui" : "Cocher pour aujourd'hui"}
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
              doneToday
                ? "border-rr-or bg-rr-or text-rr-noir shadow-[0_0_20px_-6px_rgba(201,169,110,0.7)]"
                : "border-white/15 bg-white/[0.03] text-transparent hover:border-rr-or/40"
            )}
          >
            <Check className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </form>

        <div className="min-w-0 flex-1">
          {pilier && <p className="text-[11px] uppercase tracking-[0.2em] text-rr-or">{pilier.court}</p>}
          <p className="mt-1 text-base leading-snug text-rr-ivoire">{titre}</p>
        </div>

        {streak > 0 && (
          <div
            className="flex shrink-0 items-center gap-1 text-rr-or-clair"
            title={`${streak} jour(s) d'affilée`}
          >
            <Flame className="h-4 w-4" strokeWidth={1.75} />
            <span className="text-sm font-medium">{streak}</span>
          </div>
        )}
      </div>

      <details className="group mt-4 border-t border-white/[0.06] pt-3">
        <summary className="inline-flex cursor-pointer list-none items-center text-xs text-rr-gris transition-colors duration-300 hover:text-rr-gris-clair [&::-webkit-details-marker]:hidden">
          Ne plus suivre
        </summary>
        <form action={archiveHabit} className="mt-3 flex items-center gap-4">
          <input type="hidden" name="id" value={id} />
          <p className="text-xs text-rr-gris-clair">Arrêter de suivre cette habitude ?</p>
          <button
            type="submit"
            className="text-xs text-rr-rouge transition-colors duration-300 hover:text-rr-ivoire"
          >
            Oui, retirer
          </button>
        </form>
      </details>
    </GlassCard>
  );
}

import { Check } from "lucide-react";
import { toggleHabitToday, archiveHabit } from "@/lib/habits/actions";
import { PILIERS } from "@/lib/radar/constants";
import { cn } from "@/lib/utils";

interface HabitCardProps {
  id: string;
  titre: string;
  pilierId: number;
  doneToday: boolean;
  /** 7 derniers jours, le plus ancien d'abord ; true = fait. */
  week: boolean[];
}

export function HabitCard({ id, titre, pilierId, doneToday, week }: HabitCardProps) {
  const pilier = PILIERS.find((p) => p.id === pilierId);

  return (
    <div className="border-b border-white/[0.08] py-5 last:border-b-0">
      <div className="flex items-center gap-4">
        <form action={toggleHabitToday}>
          <input type="hidden" name="habitId" value={id} />
          <button
            type="submit"
            aria-label={doneToday ? "Décocher pour aujourd'hui" : "Cocher pour aujourd'hui"}
            className={cn(
              "flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border transition-all duration-300",
              doneToday
                ? "border-rr-or bg-rr-or text-rr-noir"
                : "border-rr-ivoire/30 text-transparent hover:border-rr-or/60"
            )}
          >
            <Check className="h-3.5 w-3.5" strokeWidth={2.4} />
          </button>
        </form>

        <div className="min-w-0 flex-1">
          {pilier && (
            <p className="text-[10px] uppercase tracking-[0.25em] text-rr-or/80">{pilier.court}</p>
          )}
          <p className="font-rr-serif text-[22px] italic leading-tight text-rr-ivoire">{titre}</p>
          <div className="mt-2 flex gap-1" role="img" aria-label={`${week.filter(Boolean).length} jours sur 7 cette semaine`}>
            {week.map((done, i) => (
              <span
                key={i}
                className={cn("h-1 w-3.5 rounded-sm", done ? "bg-rr-or" : "bg-white/[0.14]")}
              />
            ))}
          </div>
        </div>
      </div>

      <details className="group mt-3 pl-[46px]">
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
    </div>
  );
}

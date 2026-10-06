import { ANSWER_LABELS } from "@/lib/radar/constants";
import { cn } from "@/lib/utils";

interface RadarScaleProps {
  value: number | undefined;
  onChange: (value: number) => void;
}

/** Échelle de réponse de 1 (Jamais) à 5 (Toujours). */
export function RadarScale({ value, onChange }: RadarScaleProps) {
  return (
    <div className="mt-10 grid grid-cols-5 gap-2">
      {ANSWER_LABELS.map((label, i) => {
        const n = i + 1;
        const selected = value === n;

        return (
          <div key={n} className="flex flex-col items-center gap-2.5">
            <button
              type="button"
              onClick={() => onChange(n)}
              aria-label={label}
              aria-pressed={selected}
              className={cn(
                "flex aspect-square w-full max-w-14 items-center justify-center rounded-full border font-rr-display text-lg transition-all duration-300",
                selected
                  ? "border-rr-or bg-rr-or text-rr-noir shadow-[0_0_22px_-4px_rgba(201,169,110,0.7)]"
                  : "border-rr-or/25 text-rr-creme hover:border-rr-or/60"
              )}
            >
              {n}
            </button>
            <span
              className={cn(
                "text-center text-[10px] uppercase leading-tight tracking-[0.08em] transition-colors duration-300",
                selected ? "text-rr-or-clair" : "text-rr-gris"
              )}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

import { ANSWER_LABELS } from "@/lib/radar/constants";
import { cn } from "@/lib/utils";

interface RadarScaleProps {
  value: number | undefined;
  onChange: (value: number) => void;
}

/** Échelle de réponse de 1 (Jamais) à 5 (Toujours). */
export function RadarScale({ value, onChange }: RadarScaleProps) {
  return (
    <div className="mt-10 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        {ANSWER_LABELS.map((label, i) => {
          const n = i + 1;
          const selected = value === n;

          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              aria-label={label}
              aria-pressed={selected}
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border font-rr-display text-lg transition-colors",
                selected
                  ? "border-rr-or bg-rr-or text-rr-noir"
                  : "border-rr-or/25 text-rr-creme hover:border-rr-or/60"
              )}
            >
              {n}
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-[0.12em] text-rr-gris">
        {ANSWER_LABELS.map((label) => (
          <span key={label} className="w-12 shrink-0 text-center">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

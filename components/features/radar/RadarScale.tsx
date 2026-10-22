import { ANSWER_LABELS } from "@/lib/radar/constants";
import { cn } from "@/lib/utils";

interface RadarScaleProps {
  value: number | undefined;
  onChange: (value: number) => void;
}

/** Échelle de réponse de 1 (Jamais) à 5 (Toujours). */
export function RadarScale({ value, onChange }: RadarScaleProps) {
  return (
    <div className="mt-12">
      <div className="flex justify-between">
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
                "flex h-11 w-11 items-center justify-center rounded-full border text-[15px] transition-all duration-300",
                selected
                  ? "border-rr-or bg-rr-or font-medium text-rr-noir shadow-[0_0_22px_-4px_rgba(201,169,110,0.7)]"
                  : "border-rr-ivoire/20 bg-white/[0.04] text-rr-gris-clair hover:border-rr-or/60"
              )}
            >
              {n}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex justify-between text-[11px] text-rr-gris-clair">
        <span>{ANSWER_LABELS[0]}</span>
        <span>{ANSWER_LABELS[4]}</span>
      </div>
    </div>
  );
}

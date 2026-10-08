import { CERCLES, PILIERS } from "@/lib/radar/constants";
import { saveRadarExpress } from "@/lib/radar/express-actions";
import type { Levels } from "@/lib/radar/express";

export function RadarExpressForm({
  defaults,
  previous,
  submitLabel,
}: {
  defaults?: Levels | null;
  previous?: Levels | null;
  submitLabel: string;
}) {
  return (
    <form action={saveRadarExpress} className="mt-5">
      <div className="flex justify-between text-[11px] text-rr-gris">
        <span>1 · très chargé</span>
        <span>5 · apaisé</span>
      </div>

      {CERCLES.map((cercle) => (
        <div key={cercle.id} className="mt-5">
          <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">{cercle.nom}</p>
          <div className="mt-1 flex flex-col">
            {PILIERS.filter((p) => p.cercle === cercle.id).map((pilier) => {
              const last = previous?.[String(pilier.id)];
              return (
                <fieldset key={pilier.id} className="border-b border-white/5 py-3 last:border-b-0">
                  <legend className="sr-only">{pilier.nom}</legend>
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-rr-ivoire">{pilier.court}</p>
                      {typeof last === "number" && (
                        <p className="text-[11px] text-rr-gris">Dernière fois : {Math.round(last)}</p>
                      )}
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <label key={n}>
                          <input
                            type="radio"
                            name={`p_${pilier.id}`}
                            value={n}
                            required
                            defaultChecked={defaults?.[String(pilier.id)] === n}
                            className="peer sr-only"
                          />
                          <span className="flex h-9 w-8 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-xs text-rr-gris-clair transition-all duration-300 peer-checked:border-rr-or peer-checked:bg-rr-or/15 peer-checked:text-rr-or peer-focus-visible:ring-2 peer-focus-visible:ring-rr-or/50">
                            {n}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </fieldset>
              );
            })}
          </div>
        </div>
      ))}

      <button
        type="submit"
        className="mt-6 h-12 w-full rounded-full border border-rr-or/40 text-sm text-rr-or transition-colors hover:bg-rr-or/10"
      >
        {submitLabel}
      </button>
    </form>
  );
}

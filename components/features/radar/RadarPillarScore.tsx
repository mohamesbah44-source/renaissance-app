import type { Pilier } from "@/lib/radar/constants";
import type { PillarScore } from "@/lib/radar/scoring";

const CERCLE_COLOR: Record<Pilier["cercle"], string> = {
  moi: "bg-rr-or",
  nous: "bg-rr-vert",
  monde: "bg-rr-orange",
};

export function RadarPillarScore({ pilier, score }: { pilier: Pilier; score: PillarScore }) {
  const pct = Math.round(score.ratio * 100);
  const barColor = CERCLE_COLOR[pilier.cercle];

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-rr-or/10 bg-rr-encre p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-rr-display text-sm uppercase tracking-[0.1em] text-rr-ivoire">{pilier.nom}</p>
          <p className="text-[10px] uppercase tracking-[0.25em] text-rr-gris">{pilier.court}</p>
        </div>
        <p className="font-rr-display text-lg text-rr-or-clair">{pct}%</p>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-rr-encre2">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

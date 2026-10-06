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
    <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-rr-display text-base leading-snug text-rr-ivoire">{pilier.nom}</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-rr-gris">{pilier.court}</p>
        </div>
        <p className="shrink-0 font-rr-display text-lg text-rr-or-clair">{pct}%</p>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

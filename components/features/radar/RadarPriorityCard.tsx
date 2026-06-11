import { PILIERS } from "@/lib/radar/constants";
import { MICRO_PROTOCOLS } from "@/lib/radar/protocols";
import { PRIORITY_REASONS } from "@/lib/radar/messages";
import type { TopPriority } from "@/lib/radar/scoring";

export function RadarPriorityCard({ rank, priority }: { rank: number; priority: TopPriority }) {
  const pilier = PILIERS.find((p) => p.id === priority.pilierId);
  const protocol = MICRO_PROTOCOLS[priority.pilierId];

  if (!pilier || !protocol) return null;

  const pct = Math.round(priority.ratio * 100);

  return (
    <div className="rounded-2xl border border-rr-or/15 bg-rr-encre p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-rr-or">Priorité {rank}</p>
          <p className="mt-1 font-rr-display text-lg text-rr-ivoire">{pilier.nom}</p>
        </div>
        <p className="font-rr-display text-2xl text-rr-or-clair">{pct}%</p>
      </div>

      <p className="mt-3 font-rr-serif italic leading-relaxed text-rr-creme">
        {PRIORITY_REASONS[priority.pilierId]}
      </p>

      <div className="mt-5 flex flex-col gap-4 border-t border-rr-or/10 pt-4">
        <p className="text-xs uppercase tracking-[0.25em] text-rr-gris">Micro-protocole recommandé</p>
        {[protocol.acte1, protocol.acte2].map((acte) => (
          <div key={acte.nom}>
            <p className="font-rr-display text-sm text-rr-or-clair">{acte.nom}</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-rr-gris">{acte.frequence}</p>
            <p className="mt-1 text-sm leading-relaxed text-rr-creme">{acte.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

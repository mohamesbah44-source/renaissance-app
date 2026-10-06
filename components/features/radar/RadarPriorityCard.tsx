import { GlassCard } from "@/components/ui/GlassCard";
import { PILIERS } from "@/lib/radar/constants";
import { MICRO_PROTOCOLS } from "@/lib/radar/protocols";
import { PRIORITY_REASONS } from "@/lib/radar/messages";
import { cn } from "@/lib/utils";
import type { TopPriority } from "@/lib/radar/scoring";

export function RadarPriorityCard({ rank, priority }: { rank: number; priority: TopPriority }) {
  const pilier = PILIERS.find((p) => p.id === priority.pilierId);
  const protocol = MICRO_PROTOCOLS[priority.pilierId];

  if (!pilier || !protocol) return null;

  const pct = Math.round(priority.ratio * 100);

  return (
    <GlassCard className={cn("p-6", rank === 1 && "border-rr-or/40")}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">Priorité {rank}</p>
          <p className="mt-2 font-rr-display text-xl leading-snug text-rr-ivoire">{pilier.nom}</p>
        </div>
        <p className="shrink-0 font-rr-display text-2xl text-rr-or-clair">{pct}%</p>
      </div>

      <p className="mt-4 font-rr-serif text-base italic leading-relaxed text-rr-creme">
        {PRIORITY_REASONS[priority.pilierId]}
      </p>

      <div className="mt-6 flex flex-col gap-5 border-t border-rr-or/20 pt-5">
        <p className="text-[11px] uppercase tracking-[0.25em] text-rr-gris">Micro-protocole recommandé</p>
        {[protocol.acte1, protocol.acte2].map((acte) => (
          <div key={acte.nom}>
            <p className="font-rr-display text-base text-rr-or-clair">{acte.nom}</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-rr-gris">{acte.frequence}</p>
            <p className="mt-2 text-sm leading-relaxed text-rr-creme">{acte.description}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

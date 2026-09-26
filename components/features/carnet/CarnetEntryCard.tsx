import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { pilierById } from "@/lib/radar/constants";
import { formatDate } from "@/lib/utils";
import type { CarnetEntry } from "@/lib/types/database.types";

/** Une entrée du Carnet Re-Naissance™ — synthèse reçue du Re-Naissance Analyzer™ ou de ton praticien. */
export function CarnetEntryCard({ entry }: { entry: CarnetEntry }) {
  const hypotheses = (entry.hypotheses as unknown as string[] | null) ?? [];
  const piliers = entry.pilier_ids.map((id) => pilierById(id)).filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <GlassCard className="p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-white/40">{formatDate(entry.created_at)}</span>
        <Badge variant={entry.source === "analyzer" ? "violet" : "neutral"}>
          {entry.source === "analyzer" ? "Re-Naissance Analyzer™" : "Note du praticien"}
        </Badge>
        {piliers.map((pilier) => (
          <Badge key={pilier.id} variant="neutral">
            {pilier.court}
          </Badge>
        ))}
      </div>

      <p className="mt-3 font-rr-display text-lg text-rr-ivoire">{entry.titre}</p>

      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-white/70">{entry.synthese}</p>

      {hypotheses.length > 0 && (
        <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
          <p className="text-xs uppercase tracking-[0.25em] text-rr-or/70">Pistes de réflexion</p>
          <ul className="flex flex-col gap-1.5">
            {hypotheses.map((hypothese, index) => (
              <li key={index} className="flex gap-2 text-sm leading-relaxed text-white/70">
                <span className="text-rr-or">·</span>
                <span>{hypothese}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </GlassCard>
  );
}

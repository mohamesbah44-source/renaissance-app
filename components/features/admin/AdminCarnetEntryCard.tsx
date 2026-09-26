import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { pilierById } from "@/lib/radar/constants";
import { deleteCarnetEntry } from "@/lib/carnet/actions";
import { formatDate } from "@/lib/utils";
import type { CarnetEntry } from "@/lib/types/database.types";

export function AdminCarnetEntryCard({ entry }: { entry: CarnetEntry }) {
  const hypotheses = (entry.hypotheses as unknown as string[] | null) ?? [];
  const piliers = entry.pilier_ids.map((id) => pilierById(id)).filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <GlassCard className="p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-white/40">{formatDate(entry.created_at)}</span>
        <Badge variant={entry.source === "analyzer" ? "violet" : "neutral"}>
          {entry.source === "analyzer" ? "Re-Naissance Analyzer™" : "Note manuelle"}
        </Badge>
        {piliers.map((pilier) => (
          <Badge key={pilier.id} variant="neutral">
            {pilier.court}
          </Badge>
        ))}
      </div>

      <p className="mt-2 font-display text-lg text-white">{entry.titre}</p>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-white/70">{entry.synthese}</p>

      {hypotheses.length > 0 && (
        <ul className="mt-3 flex flex-col gap-1 border-t border-white/10 pt-3">
          {hypotheses.map((hypothese, index) => (
            <li key={index} className="text-xs text-white/50">
              · {hypothese}
            </li>
          ))}
        </ul>
      )}

      <form action={deleteCarnetEntry} className="mt-3">
        <input type="hidden" name="id" value={entry.id} />
        <input type="hidden" name="clientId" value={entry.user_id} />
        <button type="submit" className="text-xs text-white/30 transition-colors hover:text-rr-rouge">
          Supprimer
        </button>
      </form>
    </GlassCard>
  );
}

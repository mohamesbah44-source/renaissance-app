import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { pilierById } from "@/lib/radar/constants";
import { deleteCarnetEntry } from "@/lib/carnet/actions";
import { formatDate } from "@/lib/utils";
import type { CarnetEntry } from "@/lib/types/database.types";

function toTexts(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object") {
        const o = item as Record<string, unknown>;
        const v = o.hypothese ?? o.hypothesis ?? o.texte ?? o.text;
        return typeof v === "string" ? v : "";
      }
      return "";
    })
    .filter((t) => t.trim().length > 0);
}

export function AdminCarnetEntryCard({ entry, hypotheses: privateHypotheses }: { entry: CarnetEntry; hypotheses?: unknown }) {
  // Les hypothèses vivent désormais dans une table réservée à l'admin.
  // On garde l'ancienne colonne en secours pour les entrées créées avant ce changement.
  const fromPrivate = toTexts(privateHypotheses);
  const hypotheses = fromPrivate.length > 0 ? fromPrivate : toTexts(entry.hypotheses);
  const piliers = entry.pilier_ids.map((id) => pilierById(id)).filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <GlassCard className="p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-rr-gris">{formatDate(entry.created_at)}</span>
        <Badge variant={entry.source === "analyzer" ? "violet" : "neutral"}>
          {entry.source === "analyzer" ? "Re-Naissance Analyzer™" : "Note manuelle"}
        </Badge>
        {piliers.map((pilier) => (
          <Badge key={pilier.id} variant="neutral">
            {pilier.court}
          </Badge>
        ))}
      </div>

      <p className="mt-2 font-rr-display text-lg text-rr-ivoire">{entry.titre}</p>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-rr-gris-clair">{entry.synthese}</p>

      {hypotheses.length > 0 && (
        <div className="mt-4 rounded-xl border border-rr-or/20 bg-rr-or/[0.04] p-4">
          <p className="text-[11px] uppercase tracking-[0.25em] text-rr-or">Hypothèses · visibles par toi seulement</p>
          <ul className="mt-3 flex flex-col gap-1.5">
            {hypotheses.map((hypothese, index) => (
              <li key={index} className="text-sm leading-relaxed text-rr-gris-clair">
                · {hypothese}
              </li>
            ))}
          </ul>
        </div>
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

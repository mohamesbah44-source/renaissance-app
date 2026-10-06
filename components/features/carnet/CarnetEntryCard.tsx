import { GlassCard } from "@/components/ui/GlassCard";
import { pilierById } from "@/lib/radar/constants";
import { formatDate } from "@/lib/utils";
import type { CarnetEntry } from "@/lib/types/database.types";

/** Une entrée du Carnet Re-Naissance™ — synthèse reçue du Re-Naissance Analyzer™ ou de ton praticien. */
export function CarnetEntryCard({ entry }: { entry: CarnetEntry }) {
  const hypotheses = (entry.hypotheses as unknown as string[] | null) ?? [];
  const piliers = entry.pilier_ids.map((id) => pilierById(id)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  const sourceLabel = entry.source === "analyzer" ? "Re-Naissance Analyzer™" : "Note du praticien";

  return (
    <GlassCard className="p-6">
      <p className="text-[11px] uppercase tracking-[0.2em] text-rr-gris">
        {formatDate(entry.created_at)}
        <span className="text-rr-or"> · {sourceLabel}</span>
      </p>

      <p className="mt-4 font-rr-display text-xl leading-snug text-rr-ivoire">{entry.titre}</p>

      {piliers.length > 0 && (
        <p className="mt-1.5 text-xs text-rr-gris-clair">{piliers.map((pilier) => pilier.court).join(" · ")}</p>
      )}

      <p className="mt-5 whitespace-pre-wrap font-rr-serif text-base leading-relaxed text-rr-ivoire/85">
        {entry.synthese}
      </p>

      {hypotheses.length > 0 && (
        <div className="mt-6 border-t border-rr-or/20 pt-5">
          <p className="text-[11px] uppercase tracking-[0.25em] text-rr-or">Pistes de réflexion</p>
          <ul className="mt-4 flex flex-col gap-3">
            {hypotheses.map((hypothese, index) => (
              <li
                key={index}
                className="flex gap-3 font-rr-serif text-[15px] italic leading-relaxed text-rr-creme"
              >
                <span aria-hidden="true" className="text-rr-or">
                  ·
                </span>
                <span>{hypothese}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </GlassCard>
  );
}

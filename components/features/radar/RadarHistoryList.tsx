import Link from "next/link";
import { EVOLUTION_STATES } from "@/lib/radar/constants";
import { formatDate } from "@/lib/utils";
import type { RadarBilan } from "@/lib/types/database.types";

export function RadarHistoryList({ bilans }: { bilans: RadarBilan[] }) {
  if (bilans.length === 0) {
    return (
      <div className="rounded-2xl border border-rr-or/15 bg-rr-encre p-6 text-center">
        <p className="font-rr-serif text-lg italic text-rr-gris-clair">
          Tu n&apos;as pas encore réalisé de bilan.
        </p>
        <p className="mt-2 text-sm text-rr-gris">
          Commence ton premier bilan pour découvrir ton état dominant.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {bilans.map((bilan) => {
        const etat = EVOLUTION_STATES[bilan.etat];
        const fenetrePct = Math.round(bilan.fenetre_transformation * 100);

        return (
          <li
            key={bilan.id}
            className="flex items-center justify-between gap-4 rounded-2xl border border-rr-or/15 bg-rr-encre p-5"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-rr-gris">{formatDate(bilan.created_at)}</p>
              <p className="mt-2 font-rr-display text-base text-rr-or-clair">
                {etat.lune} {etat.label}
              </p>
              <p className="mt-1 text-sm text-rr-gris-clair">Fenêtre de Transformation : {fenetrePct}%</p>
            </div>

            <Link
              href={`/radar/resultats/${bilan.id}`}
              className="shrink-0 rounded-full border border-rr-or/40 px-4 py-2 text-xs uppercase tracking-[0.2em] text-rr-or transition-colors hover:bg-rr-or/10"
            >
              Voir le bilan
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

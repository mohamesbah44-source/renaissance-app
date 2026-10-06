import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { EVOLUTION_STATES } from "@/lib/radar/constants";
import { formatDate } from "@/lib/utils";
import type { RadarBilan } from "@/lib/types/database.types";

export function RadarHistoryList({ bilans }: { bilans: RadarBilan[] }) {
  if (bilans.length === 0) {
    return (
      <p className="px-4 py-8 text-center font-rr-serif text-lg italic leading-relaxed text-rr-gris-clair">
        Tu n&apos;as pas encore réalisé de bilan.
        <br />
        Commence ton premier bilan pour découvrir ton état dominant.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {bilans.map((bilan) => {
        const etat = EVOLUTION_STATES[bilan.etat];
        const fenetrePct = Math.round(bilan.fenetre_transformation * 100);

        return (
          <li key={bilan.id}>
            <Link href={`/radar/resultats/${bilan.id}`} className="group block">
              <GlassCard className="flex items-center gap-4 p-5 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-rr-or/30">
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-rr-gris">
                    {formatDate(bilan.created_at)}
                  </p>
                  <p className="mt-2 font-rr-display text-lg leading-snug text-rr-ivoire">
                    {etat.lune} {etat.label}
                  </p>

                  <div className="mt-4">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-rr-gris-clair">Fenêtre de Transformation</span>
                      <span className="text-rr-or">{fenetrePct}%</span>
                    </div>
                    <div className="mt-2 h-1 w-full rounded-full bg-white/10">
                      <div
                        className="h-1 rounded-full bg-rr-or"
                        style={{ width: `${Math.min(100, Math.max(0, fenetrePct))}%` }}
                      />
                    </div>
                  </div>
                </div>

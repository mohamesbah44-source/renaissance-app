import Link from "next/link";
import { RadarChart, type RadarChartSeries } from "@/components/ui/RadarChart";
import { RadarPillarScore } from "@/components/features/radar/RadarPillarScore";
import { RadarPriorityCard } from "@/components/features/radar/RadarPriorityCard";
import { RadarPDFButton } from "@/components/features/radar/RadarPDFButton";
import { EVOLUTION_STATES, PILIERS, CERCLES, CAPACITES, type CercleId, type CapaciteId } from "@/lib/radar/constants";
import {
  fenetreInterpretation,
  type PillarScore,
  type TopPriority,
  type CercleScores,
  type CapaciteScores,
  type MetaIndicateurs,
} from "@/lib/radar/scoring";
import { ETAT_MESSAGES, META_LABELS } from "@/lib/radar/messages";
import { formatDate } from "@/lib/utils";
import type { RadarBilan } from "@/lib/types/database.types";

const CERCLE_COLOR: Record<CercleId, string> = {
  moi: "#c9a96e",
  nous: "#5a8a6e",
  monde: "#9b6b3a",
};

const PREVIOUS_COLOR = "#ede6d6";

export function RadarResults({
  bilan,
  previousBilan,
}: {
  bilan: RadarBilan;
  previousBilan: RadarBilan | null;
}) {
  const pillarScores = bilan.pillar_scores as unknown as PillarScore[];
  const topPriorities = bilan.top_priorities as unknown as TopPriority[];
  const cercleScores = bilan.cercle_scores as unknown as CercleScores;
  const capaciteScores = bilan.capacite_scores as unknown as CapaciteScores;
  const metaIndicateurs = bilan.meta_indicateurs as unknown as MetaIndicateurs;
  const previousPillarScores = previousBilan ? (previousBilan.pillar_scores as unknown as PillarScore[]) : null;

  const etat = EVOLUTION_STATES[bilan.etat];
  const fenetrePct = Math.round(bilan.fenetre_transformation * 100);
  const interpretation = fenetreInterpretation(bilan.fenetre_transformation);

  const axes = PILIERS.map((p) => p.court);
  const pointColors = PILIERS.map((p) => CERCLE_COLOR[p.cercle]);
  const ratioFor = (scores: PillarScore[], pilierId: number) =>
    scores.find((s) => s.pilierId === pilierId)?.ratio ?? 0;

  const series: RadarChartSeries[] = [
    { values: PILIERS.map((p) => ratioFor(pillarScores, p.id)), color: "#c9a96e" },
  ];
  if (previousPillarScores) {
    series.push({
      values: PILIERS.map((p) => ratioFor(previousPillarScores, p.id)),
      color: PREVIOUS_COLOR,
      dashed: true,
      fill: false,
    });
  }

  const previousFenetrePct = previousBilan ? Math.round(previousBilan.fenetre_transformation * 100) : null;
  const fenetreDelta = previousFenetrePct !== null ? fenetrePct - previousFenetrePct : null;

  return (
    <div className="flex flex-col gap-10 pb-12 pt-2">
      {/* 1. Fenêtre de Transformation */}
      <section className="text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-rr-or">Fenêtre de Transformation</p>
        <p className="mt-3 font-rr-display text-5xl text-rr-ivoire">{fenetrePct}%</p>
        <p className="mt-2 font-rr-serif text-lg italic text-rr-or-clair">{interpretation}</p>
      </section>

      {/* 2. État dominant */}
      <section className="rounded-2xl border border-rr-or/15 bg-rr-encre p-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">État dominant</p>
        <p className="mt-3 font-rr-display text-3xl uppercase tracking-[0.1em] text-rr-ivoire">
          {etat.lune} {etat.label}
        </p>
      </section>

      {/* 3. Radar visuel — 12 piliers */}
      <section>
        <p className="text-xs uppercase tracking-[0.3em] text-rr-or">Ton radar</p>
        <div className="mt-4">
          <RadarChart axes={axes} series={series} pointColors={pointColors} />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.2em] text-rr-gris">
          {CERCLES.map((c) => (
            <span key={c.id} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: CERCLE_COLOR[c.id] }} />
              {c.nom}
            </span>
          ))}
          {previousBilan && (
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full border border-dashed border-rr-creme" /> Bilan précédent
            </span>
          )}
        </div>
      </section>

      {/* 4. Scores par cercle */}
      <section>
        <p className="text-xs uppercase tracking-[0.3em] text-rr-or">Tes 3 cercles</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {CERCLES.map((c) => {
            const pct = Math.round((cercleScores[c.id] ?? 0) * 100);
            return (
              <div key={c.id} className="rounded-xl border border-rr-or/10 bg-rr-encre p-4 text-center">
                <p className="font-rr-display text-sm uppercase tracking-[0.15em] text-rr-ivoire">{c.nom}</p>
                <p className="mt-2 font-rr-display text-2xl" style={{ color: CERCLE_COLOR[c.id] }}>
                  {pct}%
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Capacités transversales */}
      <section>
        <p className="text-xs uppercase tracking-[0.3em] text-rr-or">Tes 5 capacités</p>
        <div className="mt-4 flex flex-col gap-3">
          {CAPACITES.map((cap) => {
            const pct = Math.round((capaciteScores[cap.id as CapaciteId] ?? 0) * 100);
            return (
              <div key={cap.id} className="flex items-center gap-4">
                <p className="w-32 shrink-0 text-xs uppercase tracking-[0.15em] text-rr-creme">{cap.nom}</p>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-rr-encre2">
                  <div className="h-full rounded-full bg-rr-vert" style={{ width: `${pct}%` }} />
                </div>
                <p className="w-10 shrink-0 text-right font-rr-display text-sm text-rr-or-clair">{pct}%</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Méta-indicateurs */}
      <section>
        <p className="text-xs uppercase tracking-[0.3em] text-rr-or">Méta-indicateurs</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(Object.keys(META_LABELS) as (keyof typeof META_LABELS)[]).map((key) => {
            const raw = metaIndicateurs[key] ?? 0;
            const pct = Math.round(raw * 100);
            const label = META_LABELS[key];
            return (
              <div key={key} className="rounded-xl border border-rr-or/10 bg-rr-encre p-4">
                <div className="flex items-center justify-between">
                  <p className="font-rr-display text-sm uppercase tracking-[0.1em] text-rr-ivoire">{label.nom}</p>
                  <p className="font-rr-display text-lg text-rr-or-clair">
                    {key === "ecartIncarnation" && raw >= 0 ? "+" : ""}
                    {pct}%
                  </p>
                </div>
                <p className="mt-2 font-rr-serif text-sm italic leading-relaxed text-rr-creme">
                  {raw >= 0.5 ? label.haut : label.bas}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Évolution temporelle / comparaison */}
      <section className="rounded-2xl border border-rr-or/15 bg-rr-encre p-5">
        <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">Évolution</p>
        {previousBilan ? (
          <div className="mt-3 text-sm leading-relaxed text-rr-creme">
            <p>
              Bilan précédent du {formatDate(previousBilan.created_at)} : {EVOLUTION_STATES[previousBilan.etat].lune}{" "}
              {EVOLUTION_STATES[previousBilan.etat].label}
            </p>
            <p className="mt-1">
              Fenêtre de Transformation : {previousFenetrePct}% → {fenetrePct}%{" "}
              <span className="text-rr-or-clair">
                ({fenetreDelta !== null && fenetreDelta >= 0 ? "+" : ""}
                {fenetreDelta} pts)
              </span>
            </p>
          </div>
        ) : (
          <p className="mt-3 text-sm text-rr-gris-clair">
            Premier bilan enregistré. Refais un bilan plus tard pour suivre ton évolution.
          </p>
        )}
      </section>

      {/* 8 & 9. Top 3 zones prioritaires + micro-protocoles */}
      <section className="flex flex-col gap-4">
        <p className="text-xs uppercase tracking-[0.3em] text-rr-or">Tes 3 zones prioritaires</p>
        {topPriorities.map((priority, i) => (
          <RadarPriorityCard key={priority.pilierId} rank={i + 1} priority={priority} />
        ))}
      </section>

      {/* 10. Scores détaillés par pilier */}
      <section>
        <p className="text-xs uppercase tracking-[0.3em] text-rr-or">Tes 12 scores détaillés</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {PILIERS.map((pilier) => {
            const score = pillarScores.find((s) => s.pilierId === pilier.id);
            if (!score) return null;
            return <RadarPillarScore key={pilier.id} pilier={pilier} score={score} />;
          })}
        </div>
      </section>

      {/* 11. Message final personnalisé */}
      <section className="rounded-2xl border border-rr-or/15 bg-rr-encre p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">Message</p>
        <p className="mt-3 font-rr-serif text-lg italic leading-relaxed text-rr-creme">
          {ETAT_MESSAGES[bilan.etat]}
        </p>
      </section>

      {/* 12 & 13. PDF + retour */}
      <section className="flex flex-col items-center gap-4">
        <RadarPDFButton bilan={bilan} pillarScores={pillarScores} topPriorities={topPriorities} />
        <Link
          href="/radar"
          className="text-xs uppercase tracking-[0.25em] text-rr-gris-clair transition-all duration-300 hover:text-rr-or-clair"
        >
          ← Retour à l&apos;accueil du Radar
        </Link>
      </section>
    </div>
  );
}

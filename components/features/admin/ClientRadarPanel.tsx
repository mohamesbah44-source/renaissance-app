import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { RadarChart, type RadarChartSeries } from "@/components/ui/RadarChart";
import { EVOLUTION_STATES, PILIERS } from "@/lib/radar/constants";
import { formatDate } from "@/lib/utils";
import type { PillarScore } from "@/lib/radar/scoring";
import type { RadarBilan } from "@/lib/types/database.types";

const CURRENT_COLOR = "#a78bfa"; // violet-400
const PREVIOUS_COLOR = "#fbc382"; // gold-400

function ratioFor(bilan: RadarBilan, pilierId: number): number {
  const scores = bilan.pillar_scores as unknown as PillarScore[];
  return scores.find((s) => s.pilierId === pilierId)?.ratio ?? 0;
}

/** Bilans Radar Renaissance™ d'un client, dans le thème admin existant (violet/or). */
export function ClientRadarPanel({ bilans }: { bilans: RadarBilan[] }) {
  if (bilans.length === 0) {
    return (
      <GlassCard className="p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Radar Renaissance™</p>
        <p className="mt-4 text-sm text-white/60">Aucun bilan enregistré pour le moment.</p>
      </GlassCard>
    );
  }

  const [latest, previous] = bilans;
  const axes = PILIERS.map((p) => p.court);

  const series: RadarChartSeries[] = [{ values: PILIERS.map((p) => ratioFor(latest, p.id)), color: CURRENT_COLOR }];
  if (previous) {
    series.push({
      values: PILIERS.map((p) => ratioFor(previous, p.id)),
      color: PREVIOUS_COLOR,
      dashed: true,
      fill: false,
    });
  }

  return (
    <GlassCard className="p-6">
      <p className="text-xs uppercase tracking-[0.3em] text-white/40">Radar Renaissance™</p>

      <div className="mt-4">
        <RadarChart
          axes={axes}
          series={series}
          gridColor="rgba(255,255,255,0.08)"
          textColor="rgba(255,255,255,0.5)"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        <div className="flex items-center gap-2 text-xs text-white/60">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: CURRENT_COLOR }} />
          Dernier bilan
        </div>
        {previous && (
          <div className="flex items-center gap-2 text-xs text-white/60">
            <span className="h-2 w-2 rounded-full border border-dashed" style={{ borderColor: PREVIOUS_COLOR }} />
            Bilan précédent
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {bilans.map((bilan) => {
          const etat = EVOLUTION_STATES[bilan.etat];
          return (
            <div
              key={bilan.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
            >
              <div>
                <p className="text-xs text-white/40">{formatDate(bilan.created_at)}</p>
                <p className="mt-1 text-sm text-white/80">
                  {etat.lune} {etat.label}
                </p>
              </div>
              <Badge variant="violet">Fenêtre {Math.round(bilan.fenetre_transformation * 100)}%</Badge>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}

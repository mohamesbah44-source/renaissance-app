import { GlassCard } from "@/components/ui/GlassCard";
import { RadarChart } from "@/components/ui/RadarChart";
import { RADAR_DIMENSIONS, RADAR_PHASES, averageScore, evolutionPhase } from "@/lib/radar/constants";
import type { RadarAssessment, RadarPhase } from "@/lib/types/database.types";

export function ClientRadarPanel({ assessments }: { assessments: Map<RadarPhase, RadarAssessment> }) {
  const presentPhases = RADAR_PHASES.filter((phase) => assessments.has(phase.key));

  if (presentPhases.length === 0) {
    return (
      <GlassCard className="p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Radar Renaissance™</p>
        <p className="mt-4 text-sm text-white/60">Aucune auto-évaluation enregistrée pour le moment.</p>
      </GlassCard>
    );
  }

  const axes = RADAR_DIMENSIONS.map((dimension) => dimension.label);
  const series = presentPhases.map((phase) => {
    const assessment = assessments.get(phase.key)!;
    return {
      label: phase.title,
      color: phase.color,
      values: RADAR_DIMENSIONS.map((dimension) => assessment[dimension.key]),
    };
  });

  return (
    <GlassCard className="p-6">
      <p className="text-xs uppercase tracking-[0.3em] text-white/40">Radar Renaissance™</p>

      <div className="mt-4">
        <RadarChart axes={axes} series={series} />
      </div>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        {presentPhases.map((phase) => {
          const assessment = assessments.get(phase.key)!;

          return (
            <div key={phase.key} className="flex items-center gap-2 text-xs text-white/60">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: phase.color }} />
              {phase.title} — {evolutionPhase(averageScore(assessment))}
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}

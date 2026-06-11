"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { RadarChart } from "@/components/ui/RadarChart";
import { RadarQuestionnaireForm } from "@/components/features/radar/RadarQuestionnaireForm";
import { RADAR_DIMENSIONS, averageScore, evolutionPhase } from "@/lib/radar/constants";
import type { RadarAssessment, RadarPhase } from "@/lib/types/database.types";

interface RadarPhaseCardProps {
  phase: RadarPhase;
  title: string;
  description: string;
  existing: RadarAssessment | null;
  locked?: boolean;
}

export function RadarPhaseCard({ phase, title, description, existing, locked }: RadarPhaseCardProps) {
  const [editing, setEditing] = useState(!existing);

  if (locked && !existing) {
    return (
      <GlassCard className="p-6 opacity-50">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">{title}</p>
        <p className="mt-2 text-sm text-white/50">{description}</p>
        <p className="mt-4 text-sm text-white/30">Disponible plus tard dans ton parcours.</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">{title}</p>
        {existing && (
          <button
            type="button"
            onClick={() => setEditing((current) => !current)}
            className="text-xs text-violet-300 transition-colors hover:text-violet-200"
          >
            {editing ? "Annuler" : "Modifier"}
          </button>
        )}
      </div>

      <p className="mt-2 text-sm leading-relaxed text-white/60">{description}</p>

      {editing ? (
        <div className="mt-6">
          <RadarQuestionnaireForm phase={phase} existing={existing} onSaved={() => setEditing(false)} />
        </div>
      ) : existing ? (
        <div className="mt-6">
          <RadarChart
            axes={RADAR_DIMENSIONS.map((dimension) => dimension.label)}
            series={[
              {
                label: title,
                color: "#a78bfa",
                values: RADAR_DIMENSIONS.map((dimension) => existing[dimension.key]),
              },
            ]}
          />
          <div className="mt-4 flex items-center justify-center gap-2">
            <Badge variant="violet">{evolutionPhase(averageScore(existing))}</Badge>
            <span className="text-xs text-white/40">Score moyen : {averageScore(existing).toFixed(1)} / 10</span>
          </div>
        </div>
      ) : null}
    </GlassCard>
  );
}

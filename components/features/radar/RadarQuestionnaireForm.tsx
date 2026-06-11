"use client";

import { useActionState, useEffect, useState } from "react";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { saveRadarAssessment } from "@/lib/radar/actions";
import { RADAR_DIMENSIONS, type RadarDimensionKey } from "@/lib/radar/constants";
import type { RadarAssessment, RadarPhase } from "@/lib/types/database.types";

interface RadarQuestionnaireFormProps {
  phase: RadarPhase;
  existing: RadarAssessment | null;
  onSaved?: () => void;
}

export function RadarQuestionnaireForm({ phase, existing, onSaved }: RadarQuestionnaireFormProps) {
  const [state, formAction] = useActionState(saveRadarAssessment, undefined);
  const [values, setValues] = useState<Record<RadarDimensionKey, number>>(() => {
    const initial = {} as Record<RadarDimensionKey, number>;
    for (const dimension of RADAR_DIMENSIONS) {
      initial[dimension.key] = existing?.[dimension.key] ?? 5;
    }
    return initial;
  });

  useEffect(() => {
    if (state?.success) {
      onSaved?.();
    }
  }, [state, onSaved]);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="phase" value={phase} />

      {RADAR_DIMENSIONS.map((dimension) => (
        <div key={dimension.key}>
          <div className="flex items-center justify-between gap-3">
            <label htmlFor={dimension.key} className="text-sm text-white/80">
              {dimension.label}
            </label>
            <span className="font-display text-base text-violet-200">{values[dimension.key]}</span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-white/40">{dimension.question}</p>
          <input
            type="range"
            id={dimension.key}
            name={dimension.key}
            min={1}
            max={10}
            step={1}
            value={values[dimension.key]}
            onChange={(e) =>
              setValues((current) => ({ ...current, [dimension.key]: Number(e.target.value) }))
            }
            className="mt-3 w-full accent-violet-400"
          />
        </div>
      ))}

      {state?.error && <p className="text-sm text-rose-400">{state.error}</p>}

      <SubmitButton>Enregistrer mon état</SubmitButton>
    </form>
  );
}

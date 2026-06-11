import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/queries";
import { GlassCard } from "@/components/ui/GlassCard";
import { RadarChart } from "@/components/ui/RadarChart";
import { RadarPhaseCard } from "@/components/features/radar/RadarPhaseCard";
import { RADAR_DIMENSIONS, RADAR_PHASES, averageScore, evolutionPhase } from "@/lib/radar/constants";
import type { RadarAssessment, RadarPhase } from "@/lib/types/database.types";

export default async function RadarPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const profile = await getProfile(supabase, user.id);
  const currentWeek = profile?.current_week ?? 1;

  const { data: assessments } = await supabase.from("radar_assessments").select("*").eq("user_id", user.id);

  const byPhase = new Map<RadarPhase, RadarAssessment>(
    (assessments ?? []).map((assessment) => [assessment.phase, assessment])
  );

  const filledPhases = RADAR_PHASES.filter((phase) => byPhase.has(phase.key));

  return (
    <div className="mx-auto max-w-2xl pb-8">
      <header className="pt-2">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Radar Renaissance™</p>
        <h1 className="mt-2 font-display text-3xl text-white">Là où tu en es</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          Huit dimensions, une photographie de ton état intérieur. Réponds en conscience, sans te
          juger : il n&apos;y a pas de bonne réponse, seulement la tienne, à cet instant.
        </p>
      </header>

      {filledPhases.length > 0 && (
        <GlassCard className="mt-8 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Ton évolution</p>

          <div className="mt-6">
            <RadarChart
              axes={RADAR_DIMENSIONS.map((dimension) => dimension.label)}
              series={filledPhases.map((phase) => ({
                label: phase.title,
                color: phase.color,
                values: RADAR_DIMENSIONS.map((dimension) => byPhase.get(phase.key)![dimension.key]),
              }))}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {filledPhases.map((phase) => {
              const assessment = byPhase.get(phase.key)!;
              return (
                <div key={phase.key} className="flex items-center gap-2 text-xs text-white/60">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: phase.color }} />
                  {phase.title} · {evolutionPhase(averageScore(assessment))}
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}

      <div className="mt-6 flex flex-col gap-4">
        {RADAR_PHASES.map((phase) => (
          <RadarPhaseCard
            key={phase.key}
            phase={phase.key}
            title={phase.title}
            description={phase.description}
            existing={byPhase.get(phase.key) ?? null}
            locked={
              (phase.key === "week4" && currentWeek < 4) || (phase.key === "week8" && currentWeek < 8)
            }
          />
        ))}
      </div>
    </div>
  );
}

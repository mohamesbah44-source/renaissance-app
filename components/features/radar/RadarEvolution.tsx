import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { CERCLES } from "@/lib/radar/constants";
import { cercleLevels, levelsFromPillarScores, type Levels } from "@/lib/radar/express";

type Row = { week_number: number; levels: Levels | null };

export async function RadarEvolution({ userId }: { userId: string }) {
  const supabase = await createClient();
  const db = supabase as unknown as SupabaseClient;

  const [{ data: rowsRaw }, { data: baselineBilan }] = await Promise.all([
    db.from("radar_express").select("week_number, levels").eq("user_id", userId).order("week_number"),
    db
      .from("radar_bilans")
      .select("pillar_scores")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  const rows = (rowsRaw ?? []) as Row[];
  const baseline = levelsFromPillarScores(baselineBilan?.pillar_scores);

  const columns: { label: string; levels: Levels | null }[] = [
    { label: "Départ", levels: baseline },
    ...rows.map((r) => ({ label: `S${r.week_number}`, levels: r.levels })),
  ];

  return (
    <GlassCard className="p-6">
      <p className="text-[11px] uppercase tracking-[0.3em] text-rr-gris">Évolution du Radar</p>
      {columns.every((c) => !c.levels) ? (
        <p className="mt-4 text-sm text-rr-gris-clair">Aucun Radar pour le moment.</p>
      ) : (
        <div className="mt-5 flex flex-col gap-6">
          {CERCLES.map((cercle) => (
            <div key={cercle.id}>
              <p className="text-xs text-rr-gris-clair">{cercle.nom}</p>
              <div className="mt-3 flex h-20 items-end gap-2">
                {columns.map((c, i) => {
                  const v = cercleLevels(c.levels)[cercle.id];
                  return (
                    <div key={i} className="flex h-full flex-1 flex-col items-center justify-end">
                      <div
                        className={v ? "w-full rounded-t-md bg-rr-or/70" : "w-full rounded-t-md bg-white/10"}
                        style={{ height: v ? `${(v / 5) * 100}%` : "4px" }}
                        title={v ? `${v.toFixed(1)}/5` : "Pas de Radar"}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="mt-1.5 flex gap-2">
                {columns.map((c, i) => (
                  <span key={i} className="flex-1 text-center text-[10px] text-rr-gris">
                    {c.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <p className="text-[11px] text-rr-gris">Plus la barre est haute, plus le cercle est apaisé (1 à 5).</p>
        </div>
      )}
    </GlassCard>
  );
}

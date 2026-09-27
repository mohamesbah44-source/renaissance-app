import { GlassCard } from "@/components/ui/GlassCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { computeSessionCounts } from "@/lib/parcours/sessions";
import type { Appointment } from "@/lib/types/database.types";

/** Suivi des 8 séances de l'accompagnement : 2 breathwork + 6 séances courtes. */
export function SessionProgressPanel({ appointments }: { appointments: Appointment[] }) {
  const counts = computeSessionCounts(appointments);
  const totalCompleted = counts.reduce((sum, c) => sum + c.completed, 0);
  const totalTarget = counts.reduce((sum, c) => sum + c.target, 0);

  return (
    <GlassCard className="p-7">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Suivi des séances</p>
        <p className="text-xs text-rr-or-clair">
          {totalCompleted} / {totalTarget}
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-5">
        {counts.map((count) => (
          <div key={count.type}>
            <div className="flex items-center justify-between text-sm text-white/70">
              <span>{count.label}</span>
              <span className="text-white/40">
                {count.completed} / {count.target}
              </span>
            </div>
            <div className="mt-2">
              <ProgressBar value={count.target > 0 ? (count.completed / count.target) * 100 : 0} />
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

import { GlassCard } from "@/components/ui/GlassCard";
import { Badge, type BadgeProps } from "@/components/ui/Badge";
import type { ProgressStatus, UserProgress, Week } from "@/lib/types/database.types";

const STATUS_LABEL: Record<ProgressStatus, string> = {
  not_started: "À explorer",
  in_progress: "En cours",
  completed: "Terminée",
};

const STATUS_VARIANT: Record<ProgressStatus, BadgeProps["variant"]> = {
  not_started: "neutral",
  in_progress: "violet",
  completed: "gold",
};

interface ClientProgressPanelProps {
  weeks: Week[];
  progressByWeekId: Map<string, UserProgress>;
}

export function ClientProgressPanel({ weeks, progressByWeekId }: ClientProgressPanelProps) {
  return (
    <GlassCard className="p-6">
      <p className="text-xs uppercase tracking-[0.3em] text-white/40">Parcours</p>

      <div className="mt-4 flex flex-col gap-2">
        {weeks.map((week) => {
          const status = progressByWeekId.get(week.id)?.status ?? "not_started";

          return (
            <div
              key={week.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-white/5 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-xs text-white/40">Semaine {week.week_number}</p>
                <p className="truncate text-sm text-white/80">{week.title}</p>
              </div>
              <Badge variant={STATUS_VARIANT[status]} className="shrink-0">
                {STATUS_LABEL[status]}
              </Badge>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}

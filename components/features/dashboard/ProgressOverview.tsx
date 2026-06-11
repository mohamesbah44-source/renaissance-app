import { GlassCard } from "@/components/ui/GlassCard";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface ProgressOverviewProps {
  currentWeek: number;
  weekTitle: string | null;
  completedCount: number;
}

export function ProgressOverview({ currentWeek, weekTitle, completedCount }: ProgressOverviewProps) {
  return (
    <GlassCard className="mt-6 p-6">
      <div className="flex items-baseline justify-between">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Semaine {currentWeek} / 8</p>
        <p className="text-xs text-white/40">{completedCount}/8 terminées</p>
      </div>

      {weekTitle && <h2 className="mt-3 font-display text-xl text-white">{weekTitle}</h2>}

      <ProgressBar value={(completedCount / 8) * 100} className="mt-5" />
    </GlassCard>
  );
}

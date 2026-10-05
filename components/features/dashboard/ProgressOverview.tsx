import { GlassCard } from "@/components/ui/GlassCard";

interface ProgressOverviewProps {
  currentWeek: number;
  weekTitle: string | null;
  completedCount: number;
}

export function ProgressOverview({ currentWeek, weekTitle, completedCount }: ProgressOverviewProps) {
  return (
    <GlassCard className="mt-8 p-6">
      <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">Semaine {currentWeek} sur 8</p>

      {weekTitle && (
        <h2 className="mt-3 font-rr-display text-2xl leading-snug text-rr-ivoire">{weekTitle}</h2>
      )}

      <div
        className="mt-6 flex gap-1.5"
        role="img"
        aria-label={`${completedCount} semaines terminées sur 8`}
      >
        {Array.from({ length: 8 }, (_, i) => {
          const done = i < completedCount;
          const current = i === currentWeek - 1;
          return (
            <span
              key={i}
              className={
                done
                  ? "h-1 flex-1 rounded-full bg-rr-or"
                  : current
                    ? "h-1 flex-1 rounded-full bg-rr-or/45"
                    : "h-1 flex-1 rounded-full bg-white/10"
              }
            />
          );
        })}
      </div>
    </GlassCard>
  );
}

import { GlassCard } from "@/components/ui/GlassCard";
import { EVOLUTION_STATES } from "@/lib/radar/constants";
import { formatDate } from "@/lib/utils";
import type { RadarBilan } from "@/lib/types/database.types";

interface ClientOverviewBannerProps {
  currentWeek: number;
  weekTitle: string | null;
  latestBilan: RadarBilan | null;
  activeHabitsCount: number;
  doneTodayCount: number;
}

/** Vue d'ensemble du programme d'un membre : Parcours + Radar + Habitudes, en un coup d'œil. */
export function ClientOverviewBanner({
  currentWeek,
  weekTitle,
  latestBilan,
  activeHabitsCount,
  doneTodayCount,
}: ClientOverviewBannerProps) {
  return (
    <GlassCard className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-3">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-rr-gris">Parcours</p>
        <p className="mt-2 font-rr-display text-xl text-rr-ivoire">Semaine {currentWeek} / 8</p>
        {weekTitle && <p className="mt-1 truncate text-sm text-rr-gris-clair">{weekTitle}</p>}
      </div>

      <div className="border-t border-white/10 pt-6 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
        <p className="text-xs uppercase tracking-[0.2em] text-rr-gris">Dernier Radar</p>
        {latestBilan ? (
          <>
            <p className="mt-2 font-rr-display text-xl text-rr-ivoire">
              {latestBilan.lune} {EVOLUTION_STATES[latestBilan.etat].label}
            </p>
            <p className="mt-1 text-sm text-rr-gris-clair">
              {formatDate(latestBilan.created_at)}
              {latestBilan.source === "analyzer" && " · Analyzer"}
            </p>
          </>
        ) : (
          <p className="mt-2 text-sm text-rr-gris-clair">Aucun bilan pour le moment</p>
        )}
      </div>

      <div className="border-t border-white/10 pt-6 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
        <p className="text-xs uppercase tracking-[0.2em] text-rr-gris">Habitudes</p>
        <p className="mt-2 font-rr-display text-xl text-rr-ivoire">
          {doneTodayCount} / {activeHabitsCount}
        </p>
        <p className="mt-1 text-sm text-rr-gris-clair">Aujourd&apos;hui</p>
      </div>
    </GlassCard>
  );
}

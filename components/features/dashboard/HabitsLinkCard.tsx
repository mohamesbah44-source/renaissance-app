import Link from "next/link";
import { Flame } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

interface HabitsLinkCardProps {
  activeCount: number;
  doneTodayCount: number;
}

/** Tuile d'entrée vers le tracker d'habitudes, depuis le dashboard. */
export function HabitsLinkCard({ activeCount, doneTodayCount }: HabitsLinkCardProps) {
  return (
    <Link href="/habitudes" className="group block h-full">
      <GlassCard className="flex h-full flex-col p-5 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-rr-or/30">
        <Flame className="h-5 w-5 text-rr-or" strokeWidth={1.75} />
        <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-rr-gris">Habitudes</p>
        {activeCount > 0 ? (
          <p className="mt-1.5 font-rr-display text-base leading-snug text-rr-ivoire">
            {doneTodayCount} / {activeCount} <span className="text-xs text-rr-gris-clair">aujourd&apos;hui</span>
          </p>
        ) : (
          <p className="mt-1.5 text-sm text-rr-gris-clair">Ancrer une habitude</p>
        )}
      </GlassCard>
    </Link>
  );
}

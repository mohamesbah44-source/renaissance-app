import Link from "next/link";
import { Flame } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

interface HabitsLinkCardProps {
  activeCount: number;
  doneTodayCount: number;
}

/** Bandeau d'entrée vers le tracker d'habitudes, depuis le dashboard. */
export function HabitsLinkCard({ activeCount, doneTodayCount }: HabitsLinkCardProps) {
  return (
    <Link href="/habitudes" className="group block">
      <GlassCard className="mt-5 flex items-center gap-4 p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-rr-or/30 hover:bg-white/[0.06]">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rr-or/[0.14] transition-all duration-300 group-hover:bg-rr-or/[0.22]">
          <Flame className="h-5 w-5 text-rr-or-clair" strokeWidth={1.75} />
        </div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.2em] text-rr-gris">Mes habitudes</p>
          <p className="mt-1 text-sm text-rr-ivoire/90">
            {activeCount > 0
              ? `${doneTodayCount} / ${activeCount} aujourd'hui`
              : "Ancrer une habitude depuis ton Radar"}
          </p>
        </div>
      </GlassCard>
    </Link>
  );
}

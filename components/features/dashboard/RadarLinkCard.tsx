import Link from "next/link";
import { Compass } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export function RadarLinkCard() {
  return (
    <Link href="/radar" className="group block">
      <GlassCard className="mt-5 flex items-center gap-4 p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-rr-or/30 hover:bg-white/[0.06]">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400/15 transition-all duration-300 group-hover:bg-amber-400/25">
          <Compass className="h-5 w-5 text-amber-300" strokeWidth={1.75} />
        </div>
        <div>
          <p className="font-rr-display text-base text-rr-ivoire">Renaissance Radar™</p>
          <p className="mt-1 text-sm text-rr-gris">Ton état dominant, ta fenêtre de transformation, tes priorités.</p>
        </div>
      </GlassCard>
    </Link>
  );
}

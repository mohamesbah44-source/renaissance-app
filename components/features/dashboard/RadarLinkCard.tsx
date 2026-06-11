import Link from "next/link";
import { Compass } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export function RadarLinkCard() {
  return (
    <Link href="/radar">
      <GlassCard className="mt-4 flex items-center gap-4 p-6 transition-colors hover:bg-white/[0.06]">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400/15">
          <Compass className="h-5 w-5 text-amber-300" strokeWidth={1.75} />
        </div>
        <div>
          <p className="font-display text-base text-white">Radar Renaissance™</p>
          <p className="mt-1 text-sm text-white/50">Ton état dominant, ta fenêtre de transformation, tes priorités.</p>
        </div>
      </GlassCard>
    </Link>
  );
}

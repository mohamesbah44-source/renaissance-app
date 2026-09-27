import Link from "next/link";
import { Check } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge, type BadgeProps } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { ProgressStatus, Week } from "@/lib/types/database.types";

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

interface WeekListItemProps {
  week: Week;
  status: ProgressStatus;
  isCurrent: boolean;
}

export function WeekListItem({ week, status, isCurrent }: WeekListItemProps) {
  return (
    <Link href={`/parcours/semaine/${week.id}`}>
      <GlassCard
        className={cn(
          "flex items-center gap-4 p-5 transition-colors hover:bg-white/[0.06]",
          isCurrent && "border-rr-or/30"
        )}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-sm text-rr-gris-clair">
          {status === "completed" ? (
            <Check className="h-4 w-4 text-gold-300" />
          ) : (
            week.week_number
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">Semaine {week.week_number}</p>
          <p className="mt-1 truncate font-rr-display text-lg text-rr-ivoire">{week.title}</p>
        </div>

        <Badge variant={STATUS_VARIANT[status]} className="shrink-0">
          {STATUS_LABEL[status]}
        </Badge>
      </GlassCard>
    </Link>
  );
}

import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import type { ProgressStatus, Week } from "@/lib/types/database.types";

const STATUS_LABEL: Record<ProgressStatus, string> = {
  not_started: "À explorer",
  in_progress: "En cours",
  completed: "Terminée",
};

interface WeekListItemProps {
  week: Week;
  status: ProgressStatus;
  isCurrent: boolean;
}

export function WeekListItem({ week, status, isCurrent }: WeekListItemProps) {
  const isCompleted = status === "completed";
  const isLast = week.week_number >= 8;

  return (
    <Link href={`/parcours/semaine/${week.id}`} className="group flex gap-4 pb-3">
      {/* Fil du parcours */}
      <div className="flex w-10 shrink-0 flex-col items-center">
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full border text-sm transition-all duration-300",
            isCurrent
              ? "border-rr-or bg-rr-or text-rr-noir shadow-[0_0_24px_-4px_rgba(201,169,110,0.65)]"
              : isCompleted
                ? "border-rr-or/60 text-rr-or"
                : "border-white/10 text-rr-gris-clair"
          )}
        >
          {isCompleted && !isCurrent ? <Check className="h-4 w-4" strokeWidth={2.25} /> : week.week_number}
        </span>
        {!isLast && (
          <span
            className={cn(
              "mt-1 w-px flex-1 rounded-full",
              isCompleted ? "bg-rr-or/40" : "bg-white/10"
            )}
          />
        )}
      </div>

      {/* Carte de la semaine */}
      <GlassCard
        className={cn(
          "flex min-w-0 flex-1 items-center gap-3 p-5 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-rr-or/30",
          isCurrent && "border-rr-or/40"
        )}
      >
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-[11px] uppercase tracking-[0.25em]",
              isCurrent ? "text-rr-or" : "text-rr-gris"
            )}
          >
            {isCurrent ? "En cours" : STATUS_LABEL[status]}
          </p>
          <p className="mt-1.5 font-rr-display text-lg leading-snug text-rr-ivoire">{week.title}</p>
        </div>
        <ChevronRight
          className="h-5 w-5 shrink-0 text-rr-gris transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-rr-or"
          strokeWidth={1.75}
        />
      </GlassCard>
    </Link>
  );
}

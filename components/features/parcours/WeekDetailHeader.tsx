import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/Badge";
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

export function WeekDetailHeader({ week, status }: { week: Week; status: ProgressStatus }) {
  return (
    <header className="pt-2">
      <Link
        href="/parcours"
        className="inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white/70"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour au parcours
      </Link>

      <div className="mt-6 flex items-center gap-3">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Semaine {week.week_number} / 8</p>
        <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>
      </div>

      <h1 className="mt-2 font-display text-3xl text-white">{week.title}</h1>

      {week.intention && <p className="mt-3 text-base italic text-violet-200/80">{week.intention}</p>}

      {week.description && <p className="mt-4 text-sm leading-relaxed text-white/60">{week.description}</p>}
    </header>
  );
}

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
        className="group inline-flex items-center gap-2 text-sm text-rr-gris transition-all duration-300 hover:text-rr-gris-clair"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 group-hover:bg-white/[0.06]">
          <ArrowLeft className="h-4 w-4" />
        </span>
        Retour au parcours
      </Link>

      <div className="mt-7 flex items-center gap-3">
        <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">Semaine {week.week_number} / 8</p>
        <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>
      </div>

      <h1
        className="animate-fade-up mt-3 font-rr-display text-3xl text-rr-ivoire"
        style={{ animationDelay: "0ms" }}
      >
        {week.title}
      </h1>

      {week.intention && <p className="mt-3 text-base italic text-rr-or-clair/80">{week.intention}</p>}

      {week.description && <p className="mt-5 text-sm leading-relaxed text-rr-gris-clair">{week.description}</p>}
    </header>
  );
}

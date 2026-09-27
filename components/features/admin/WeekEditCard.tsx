"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { WeekForm } from "@/components/features/admin/WeekForm";
import type { Week } from "@/lib/types/database.types";

export function WeekEditCard({ week }: { week: Week }) {
  const [open, setOpen] = useState(false);

  return (
    <GlassCard className="p-6">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">Semaine {week.week_number}</p>
          <p className="mt-1 truncate font-rr-display text-lg text-rr-ivoire">{week.title}</p>
        </div>
        <span className="shrink-0 text-xs text-rr-or-clair">{open ? "Réduire" : "Modifier"}</span>
      </button>

      {open && (
        <div className="mt-6">
          <WeekForm week={week} />
        </div>
      )}
    </GlassCard>
  );
}

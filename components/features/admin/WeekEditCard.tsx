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
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Semaine {week.week_number}</p>
          <p className="mt-1 truncate font-display text-lg text-white">{week.title}</p>
        </div>
        <span className="shrink-0 text-xs text-violet-300">{open ? "Réduire" : "Modifier"}</span>
      </button>

      {open && (
        <div className="mt-6">
          <WeekForm week={week} />
        </div>
      )}
    </GlassCard>
  );
}

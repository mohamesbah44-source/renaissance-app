"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { JournalEntryForm } from "@/components/features/journal/JournalEntryForm";
import { JournalEntryCard } from "@/components/features/journal/JournalEntryCard";
import { CarnetEntryCard } from "@/components/features/carnet/CarnetEntryCard";
import { cn } from "@/lib/utils";
import type { CarnetEntry, JournalEntry, Week } from "@/lib/types/database.types";

type Tab = "journal" | "carnet";

interface JournalCarnetTabsProps {
  entries: JournalEntry[];
  weeks: Week[];
  weekTitleById: Record<string, string>;
  defaultDate: string;
  carnetEntries: CarnetEntry[];
}

export function JournalCarnetTabs({
  entries,
  weeks,
  weekTitleById,
  defaultDate,
  carnetEntries,
}: JournalCarnetTabsProps) {
  const [tab, setTab] = useState<Tab>("journal");

  return (
    <div>
      <div className="flex gap-2 border-b border-rr-or/15">
        <button
          type="button"
          onClick={() => setTab("journal")}
          className={cn(
            "px-4 pb-3 text-xs uppercase tracking-[0.25em] transition-colors",
            tab === "journal" ? "border-b-2 border-rr-or text-rr-or-clair" : "text-white/40 hover:text-white/70"
          )}
        >
          Mon journal
        </button>
        <button
          type="button"
          onClick={() => setTab("carnet")}
          className={cn(
            "px-4 pb-3 text-xs uppercase tracking-[0.25em] transition-colors",
            tab === "carnet" ? "border-b-2 border-rr-or text-rr-or-clair" : "text-white/40 hover:text-white/70"
          )}
        >
          Mon Carnet Re-Naissance™
        </button>
      </div>

      {tab === "journal" ? (
        <div className="mt-6">
          <GlassCard className="p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Nouvelle entrée</p>
            <div className="mt-4">
              <JournalEntryForm weeks={weeks} defaultDate={defaultDate} />
            </div>
          </GlassCard>

          <div className="mt-6 flex flex-col gap-4">
            {entries.length > 0 ? (
              entries.map((entry) => (
                <JournalEntryCard
                  key={entry.id}
                  entry={entry}
                  weeks={weeks}
                  weekTitleById={weekTitleById}
                  defaultDate={defaultDate}
                />
              ))
            ) : (
              <p className="text-center text-sm text-white/40">
                Tu n&apos;as pas encore écrit. Commence quand tu te sens prêt·e.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <p className="text-sm leading-relaxed text-white/60">
            Les synthèses que ton praticien te partage — issues du Re-Naissance Analyzer™ ou de vos échanges —
            atterrissent ici.
          </p>
          <div className="mt-6 flex flex-col gap-4">
            {carnetEntries.length > 0 ? (
              carnetEntries.map((entry) => <CarnetEntryCard key={entry.id} entry={entry} />)
            ) : (
              <p className="text-center text-sm text-white/40">
                Ton Carnet est encore vide. Les prochaines synthèses de ton praticien apparaîtront ici.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

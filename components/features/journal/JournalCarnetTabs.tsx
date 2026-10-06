"use client";

import { useCallback, useState } from "react";
import { PenLine, X } from "lucide-react";
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

const TABS: { id: Tab; label: string }[] = [
  { id: "journal", label: "Journal" },
  { id: "carnet", label: "Carnet" },
];

export function JournalCarnetTabs({
  entries,
  weeks,
  weekTitleById,
  defaultDate,
  carnetEntries,
}: JournalCarnetTabsProps) {
  const [tab, setTab] = useState<Tab>("journal");
  const [writing, setWriting] = useState(false);
  const handleSaved = useCallback(() => setWriting(false), []);
  
  return (
    <div>
      <div
        role="tablist"
        aria-label="Journal et Carnet"
        className="grid grid-cols-2 gap-1 rounded-full border border-rr-or/15 bg-white/[0.03] p-1"
      >
        {TABS.map(({ id, label }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(id)}
              className={cn(
                "h-11 rounded-full text-xs uppercase tracking-[0.25em] transition-all duration-300",
                active
                  ? "bg-rr-or/[0.16] text-rr-or-clair shadow-[inset_0_0_0_1px_rgba(201,169,110,0.3)]"
                  : "text-rr-gris hover:text-rr-gris-clair"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {tab === "journal" ? (
        <div className="mt-8">
          {writing ? (
            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">Nouvelle entrée</p>
                <button
                  type="button"
                  onClick={() => setWriting(false)}
                  aria-label="Fermer le formulaire"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-rr-gris transition-all duration-300 hover:bg-white/[0.06] hover:text-rr-ivoire"
                >
                  <X className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>
              <div className="mt-5">
                <JournalEntryForm weeks={weeks} defaultDate={defaultDate} onSaved={handleSaved} />
              </div>
            </GlassCard>
          ) : (
            <button
              type="button"
              onClick={() => setWriting(true)}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-rr-or text-xs uppercase tracking-[0.25em] text-rr-noir transition-all duration-300 hover:bg-rr-or-clair"
            >
              <PenLine className="h-4 w-4" strokeWidth={2} />
              Écrire une entrée
            </button>
          )}

          <div className="mt-10">
            {entries.length > 0 ? (
              <>
                <p className="text-[11px] uppercase tracking-[0.3em] text-rr-gris">
                  Tes écrits · {entries.length}
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  {entries.map((entry) => (
                    <JournalEntryCard
                      key={entry.id}
                      entry={entry}
                      weeks={weeks}
                      weekTitleById={weekTitleById}
                      defaultDate={defaultDate}
                    />
                  ))}
                </div>
              </>
            ) : (
              <p className="px-4 py-8 text-center font-rr-serif text-lg italic leading-relaxed text-rr-gris-clair">
                Ta page est vierge.
                <br />
                Commence quand tu te sens prêt·e.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <p className="font-rr-serif text-base italic leading-relaxed text-rr-creme">
            Les synthèses que ton praticien te partage, issues du Re-Naissance Analyzer™ ou de vos
            échanges, atterrissent ici.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            {carnetEntries.length > 0 ? (
              carnetEntries.map((entry) => <CarnetEntryCard key={entry.id} entry={entry} />)
            ) : (
              <p className="px-4 py-8 text-center font-rr-serif text-lg italic leading-relaxed text-rr-gris-clair">
                Ton Carnet est encore vide.
                <br />
                Les prochaines synthèses de ton praticien apparaîtront ici.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useCallback, useState } from "react";
import { PenLine, X, BookOpen, Feather } from "lucide-react";
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-6 bg-rr-or/50" />
      <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">{children}</p>
    </div>
  );
}

function EmptyInvite({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-dashed border-white/10 px-6 py-12 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-rr-or/25 bg-rr-or/[0.05]">
        <Icon className="h-5 w-5 text-rr-or/80" strokeWidth={1.5} />
      </span>
      <p className="mt-6 font-rr-serif text-lg italic leading-relaxed text-rr-gris-clair">{children}</p>
    </div>
  );
}

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
                  ? "bg-rr-or/[0.16] text-rr-or-clair shadow-[inset_0_0_0_1px_rgba(201,169,110,0.3),0_0_18px_-6px_rgba(201,169,110,0.5)]"
                  : "text-rr-gris hover:text-rr-gris-clair"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {tab === "journal" ? (
        <div className="mt-10">
          {writing ? (
            <GlassCard variant="gold" className="p-7">
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or-clair/80">Nouvelle entrée</p>
                <button
                  type="button"
                  onClick={() => setWriting(false)}
                  aria-label="Fermer le formulaire"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-rr-gris transition-all duration-300 hover:bg-white/[0.06] hover:text-rr-ivoire"
                >
                  <X className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>
              <div className="mt-6">
                <JournalEntryForm weeks={weeks} defaultDate={defaultDate} onSaved={handleSaved} />
              </div>
            </GlassCard>
          ) : (
            <button
              type="button"
              onClick={() => setWriting(true)}
              className="rr-shimmer flex h-14 w-full items-center justify-center gap-3 rounded-full bg-rr-or text-xs font-medium uppercase tracking-[0.25em] text-rr-noir shadow-[0_10px_40px_-12px_rgba(201,169,110,0.6)] transition-all duration-300 hover:bg-rr-or-clair"
            >
              <PenLine className="h-4 w-4" strokeWidth={2} />
              Écrire une entrée
            </button>
          )}

          <div className="mt-14">
            {entries.length > 0 ? (
              <>
                <SectionLabel>
                  Tes écrits · {entries.length}
                </SectionLabel>
                <div className="mt-5 flex flex-col gap-4">
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
              <EmptyInvite icon={Feather}>
                Ta page est vierge.
                <br />
                Commence quand tu te sens prêt·e.
              </EmptyInvite>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-10">
          <p className="font-rr-serif text-lg italic leading-relaxed text-rr-creme">
            Les synthèses que ton praticien te partage, issues du Re-Naissance Analyzer™ ou de vos
            échanges, atterrissent ici.
          </p>
          <div className="mt-10 flex flex-col gap-4">
            {carnetEntries.length > 0 ? (
              carnetEntries.map((entry) => <CarnetEntryCard key={entry.id} entry={entry} />)
            ) : (
              <EmptyInvite icon={BookOpen}>
                Ton Carnet est encore vide.
                <br />
                Les prochaines synthèses de ton praticien apparaîtront ici.
              </EmptyInvite>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

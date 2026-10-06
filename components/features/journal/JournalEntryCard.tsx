"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { JournalEntryForm } from "@/components/features/journal/JournalEntryForm";
import { deleteJournalEntry } from "@/lib/journal/actions";
import { formatDate } from "@/lib/utils";
import type { JournalEntry, Week } from "@/lib/types/database.types";

interface JournalEntryCardProps {
  entry: JournalEntry;
  weeks: Week[];
  weekTitleById: Record<string, string>;
  defaultDate: string;
}

const LONG_ENTRY_LENGTH = 220;

export function JournalEntryCard({ entry, weeks, weekTitleById, defaultDate }: JournalEntryCardProps) {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  if (editing) {
    return (
      <GlassCard className="p-6">
        <JournalEntryForm
          entry={entry}
          weeks={weeks}
          defaultDate={defaultDate}
          onSaved={() => setEditing(false)}
          onCancel={() => setEditing(false)}
        />
      </GlassCard>
    );
  }

  const isLong = entry.content.length > LONG_ENTRY_LENGTH;
  const weekLabel = entry.week_id ? weekTitleById[entry.week_id] : null;

  return (
    <GlassCard className="p-6">
      <p className="text-[11px] uppercase tracking-[0.2em] text-rr-gris">
        {formatDate(entry.entry_date)}
        {entry.mood && <span className="text-rr-or"> · {entry.mood}</span>}
      </p>

      {entry.title && <p className="mt-3 font-rr-display text-xl leading-snug text-rr-ivoire">{entry.title}</p>}

      {weekLabel && <p className="mt-1 text-xs text-rr-gris-clair">{weekLabel}</p>}

      <p
        className={
          expanded
            ? "mt-4 whitespace-pre-wrap text-[15px] leading-relaxed text-rr-ivoire/85"
            : "mt-4 line-clamp-4 whitespace-pre-wrap text-[15px] leading-relaxed text-rr-ivoire/85"
        }
      >
        {entry.content}
      </p>

      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-xs text-rr-or-clair transition-colors duration-300 hover:text-rr-ivoire"
        >
          {expanded ? "Réduire" : "Lire la suite"}
        </button>
      )}

      <div className="mt-5 flex items-center gap-5 border-t border-white/[0.06] pt-4">
        {confirmingDelete ? (
          <>
            <p className="text-xs text-rr-gris-clair">Supprimer cette entrée ?</p>
            <form action={deleteJournalEntry}>
              <input type="hidden" name="id" value={entry.id} />
              <button type="submit" className="text-xs text-rr-rouge transition-colors duration-300 hover:text-rr-ivoire">
                Oui, supprimer
              </button>
            </form>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="text-xs text-rr-or-clair transition-colors duration-300 hover:text-rr-ivoire"
            >
              Garder
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-xs text-rr-or-clair transition-colors duration-300 hover:text-rr-ivoire"
            >
              Modifier
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="text-xs text-rr-gris transition-colors duration-300 hover:text-rr-rouge"
            >
              Supprimer
            </button>
          </>
        )}
      </div>
    </GlassCard>
  );
}

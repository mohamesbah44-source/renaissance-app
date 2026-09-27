"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
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

export function JournalEntryCard({ entry, weeks, weekTitleById, defaultDate }: JournalEntryCardProps) {
  const [editing, setEditing] = useState(false);

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

  return (
    <GlassCard className="p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-rr-gris">{formatDate(entry.entry_date)}</span>
        {entry.mood && <Badge variant="violet">{entry.mood}</Badge>}
        {entry.week_id && weekTitleById[entry.week_id] && (
          <Badge variant="neutral">{weekTitleById[entry.week_id]}</Badge>
        )}
      </div>

      {entry.title && <p className="mt-2 font-rr-display text-lg text-rr-ivoire">{entry.title}</p>}

      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-rr-gris-clair">{entry.content}</p>

      <div className="mt-4 flex items-center gap-4">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-xs text-rr-or-clair transition-colors hover:text-rr-or-clair"
        >
          Modifier
        </button>
        <form action={deleteJournalEntry}>
          <input type="hidden" name="id" value={entry.id} />
          <button type="submit" className="text-xs text-white/30 transition-colors hover:text-rr-rouge">
            Supprimer
          </button>
        </form>
      </div>
    </GlassCard>
  );
}

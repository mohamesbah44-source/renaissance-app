import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { JournalEntry } from "@/lib/types/database.types";

interface AdminJournalEntryCardProps {
  entry: JournalEntry;
  weekTitleById: Record<string, string>;
}

export function AdminJournalEntryCard({ entry, weekTitleById }: AdminJournalEntryCardProps) {
  return (
    <GlassCard className="p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-rr-gris">{formatDate(entry.entry_date)}</span>
        {entry.mood && <Badge variant="violet">{entry.mood}</Badge>}
        {entry.week_id && weekTitleById[entry.week_id] && (
          <Badge variant="neutral">{weekTitleById[entry.week_id]}</Badge>
        )}
      </div>

      {entry.title && <p className="mt-2 font-rr-display text-lg text-rr-ivoire">{entry.title}</p>}

      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-rr-gris-clair">{entry.content}</p>
    </GlassCard>
  );
}

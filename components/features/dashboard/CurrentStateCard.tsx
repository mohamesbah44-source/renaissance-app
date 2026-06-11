import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { JournalEntry } from "@/lib/types/database.types";

export function CurrentStateCard({ entry }: { entry: JournalEntry | null }) {
  return (
    <GlassCard className="mt-4 p-6">
      <p className="text-xs uppercase tracking-[0.3em] text-white/40">Ton état du moment</p>

      {entry ? (
        <div className="mt-3">
          <div className="flex items-center gap-2">
            {entry.mood && <Badge variant="violet">{entry.mood}</Badge>}
            <span className="text-xs text-white/40">{formatDate(entry.entry_date)}</span>
          </div>
          {entry.title && <p className="mt-3 text-sm text-white/80">{entry.title}</p>}
        </div>
      ) : (
        <p className="mt-3 text-sm text-white/60">
          Tu n&apos;as pas encore posé de mots sur ton état. Prends un instant pour toi.
        </p>
      )}

      <Link href="/journal" className="mt-4 inline-block text-sm text-violet-300 hover:text-violet-200">
        {entry ? "Ouvrir mon journal" : "Écrire dans mon journal"}
      </Link>
    </GlassCard>
  );
}

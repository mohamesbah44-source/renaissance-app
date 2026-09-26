import { GlassCard } from "@/components/ui/GlassCard";
import { formatDate } from "@/lib/utils";
import type { ClientSong } from "@/lib/types/database.types";

/** Une chanson personnalisée Re-Naissance™, composée pour ce moment du parcours. */
export function ClientSongCard({ song }: { song: ClientSong }) {
  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="font-rr-display text-lg text-rr-ivoire">{song.titre}</p>
        <span className="text-xs text-white/40">{formatDate(song.created_at)}</span>
      </div>

      {song.message && (
        <p className="mt-2 font-rr-serif text-sm italic leading-relaxed text-rr-creme">{song.message}</p>
      )}

      <audio controls src={song.media_url} className="mt-4 w-full" />
    </GlassCard>
  );
}

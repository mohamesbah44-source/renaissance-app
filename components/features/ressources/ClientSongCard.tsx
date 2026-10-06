import { GlassCard } from "@/components/ui/GlassCard";
import { formatDate } from "@/lib/utils";
import type { ClientSong } from "@/lib/types/database.types";

/** Une chanson personnalisée Re-Naissance™, composée pour ce moment du parcours. */
export function ClientSongCard({ song }: { song: ClientSong }) {
  return (
    <GlassCard className="border-rr-or/25 p-6">
      <p className="text-[11px] uppercase tracking-[0.25em] text-rr-or">
        Pour toi
        <span className="text-rr-gris"> · {formatDate(song.created_at)}</span>
      </p>

      <p className="mt-3 font-rr-display text-xl leading-snug text-rr-ivoire">{song.titre}</p>

      {song.message && (
        <p className="mt-3 font-rr-serif text-[15px] italic leading-relaxed text-rr-creme">{song.message}</p>
      )}

      <audio controls src={song.media_url} className="mt-5 w-full [color-scheme:dark]" />
    </GlassCard>
  );
}

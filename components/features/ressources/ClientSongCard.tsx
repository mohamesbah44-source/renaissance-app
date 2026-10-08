import { GlassCard } from "@/components/ui/GlassCard";
import { formatDate } from "@/lib/utils";
import type { ClientSong } from "@/lib/types/database.types";

/** Une chanson personnalisée Re-Naissance™, composée pour ce moment du parcours. */
export function ClientSongCard({ song }: { song: ClientSong }) {
  return (
    <GlassCard variant="gold" className="p-7">
      <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or-clair/80">
        Pour toi
        <span className="text-rr-gris"> · {formatDate(song.created_at)}</span>
      </p>

      <p className="mt-4 font-rr-display text-2xl leading-snug text-rr-ivoire">{song.titre}</p>

      {song.message && (
        <p className="mt-4 font-rr-serif text-lg italic leading-relaxed text-rr-creme">{song.message}</p>
      )}

      <audio controls src={song.media_url} className="mt-6 w-full [color-scheme:dark]" />
    </GlassCard>
  );
}

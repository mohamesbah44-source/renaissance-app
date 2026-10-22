import { formatDate } from "@/lib/utils";
import type { ClientSong } from "@/lib/types/database.types";

/** Une chanson personnalisée Re-Naissance™, composée pour ce moment du parcours. */
export function ClientSongCard({ song }: { song: ClientSong }) {
  return (
    <div
      className="rounded-[26px] border border-rr-or/40 p-6"
      style={{
        background:
          "radial-gradient(120% 140% at 0% 0%, rgba(139,92,246,0.45) 0%, rgba(76,29,149,0.14) 60%, rgba(7,6,13,0) 100%), rgba(255,255,255,0.03)",
      }}
    >
      <p className="font-rr-label text-[9px] uppercase tracking-[0.3em] text-rr-or">
        Ta chanson personnalisée
        <span className="text-rr-gris-clair"> · {formatDate(song.created_at)}</span>
      </p>

      <p className="mt-3 font-rr-serif text-[26px] italic leading-tight text-rr-ivoire">{song.titre}</p>

      {song.message && (
        <p className="mt-3 text-sm leading-relaxed text-rr-gris-clair">{song.message}</p>
      )}

      <audio controls src={song.media_url} className="mt-5 w-full [color-scheme:dark]" />
    </div>
  );
}

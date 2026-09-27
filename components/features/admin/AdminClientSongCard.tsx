import { GlassCard } from "@/components/ui/GlassCard";
import { deleteClientSong } from "@/lib/songs/actions";
import { formatDate } from "@/lib/utils";
import type { ClientSong } from "@/lib/types/database.types";

export function AdminClientSongCard({ song }: { song: ClientSong }) {
  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="font-rr-display text-base text-rr-ivoire">{song.titre}</p>
        <span className="text-xs text-rr-gris">{formatDate(song.created_at)}</span>
      </div>

      {song.message && <p className="mt-2 text-sm leading-relaxed text-rr-gris-clair">{song.message}</p>}

      <audio controls src={song.media_url} className="mt-3 w-full" />

      <form action={deleteClientSong} className="mt-3">
        <input type="hidden" name="id" value={song.id} />
        <input type="hidden" name="clientId" value={song.user_id} />
        <button type="submit" className="text-xs text-white/30 transition-colors hover:text-rr-rouge">
          Supprimer
        </button>
      </form>
    </GlassCard>
  );
}

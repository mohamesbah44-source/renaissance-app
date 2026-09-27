import { createClient } from "@/lib/supabase/server";
import { ResourceLibrary } from "@/components/features/ressources/ResourceLibrary";
import { ClientSongCard } from "@/components/features/ressources/ClientSongCard";

export default async function RessourcesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: resources } = await supabase.from("resources").select("*").order("created_at", { ascending: false });

  const { data: songs } = user
    ? await supabase.from("client_songs").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
    : { data: null };

  return (
    <div className="mx-auto max-w-2xl pb-8">
      <header className="pt-2">
        <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">Bibliothèque</p>
        <h1 className="mt-2 font-rr-display text-3xl uppercase tracking-[0.06em] text-rr-ivoire">Tes ressources</h1>
        <p className="mt-3 text-sm leading-relaxed text-rr-gris-clair">
          Respirations, méditations, visualisations, exercices et replays pour t&apos;accompagner entre
          chaque séance.
        </p>
      </header>

      {songs && songs.length > 0 && (
        <div className="mt-9">
          <p className="text-xs uppercase tracking-[0.3em] text-rr-or">Tes chansons personnalisées</p>
          <div className="mt-5 flex flex-col gap-4">
            {songs.map((song) => (
              <ClientSongCard key={song.id} song={song} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-9">
        <ResourceLibrary resources={resources ?? []} />
      </div>
    </div>
  );
}

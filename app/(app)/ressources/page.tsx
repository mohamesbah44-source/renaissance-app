import Link from "next/link";
import { ChevronLeft } from "lucide-react";
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
    <div className="rr-enter mx-auto max-w-2xl pb-8">
      <Link
        href="/profil"
        aria-label="Retour au profil"
        className="-ml-3 flex h-11 w-11 items-center justify-center rounded-full text-rr-gris-clair transition-colors hover:text-rr-ivoire"
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={1.6} />
      </Link>

      <header className="mt-3">
        <p className="text-[10px] uppercase tracking-[0.3em] text-rr-or">Bibliothèque</p>
        <h1 className="mt-4 font-rr-display text-rr-ivoire">Tes ressources.</h1>
      </header>

      {songs && songs.length > 0 && (
        <section className="mt-10 flex flex-col gap-4">
          {songs.map((song) => (
            <ClientSongCard key={song.id} song={song} />
          ))}
        </section>
      )}

      <div className="mt-10">
        <ResourceLibrary resources={resources ?? []} />
      </div>
    </div>
  );
}

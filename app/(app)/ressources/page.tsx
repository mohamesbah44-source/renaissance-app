import { createClient } from "@/lib/supabase/server";
import { ResourceLibrary } from "@/components/features/ressources/ResourceLibrary";

export default async function RessourcesPage() {
  const supabase = await createClient();
  const { data: resources } = await supabase
    .from("resources")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-2xl pb-8">
      <header className="pt-2">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Bibliothèque</p>
        <h1 className="mt-2 font-display text-3xl text-white">Tes ressources</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          Respirations, méditations, visualisations, exercices et replays pour t&apos;accompagner entre
          chaque séance.
        </p>
      </header>

      <div className="mt-8">
        <ResourceLibrary resources={resources ?? []} />
      </div>
    </div>
  );
}

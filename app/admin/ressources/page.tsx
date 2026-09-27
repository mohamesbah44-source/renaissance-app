import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { ResourceForm } from "@/components/features/admin/ResourceForm";
import { AdminResourceCard } from "@/components/features/admin/AdminResourceCard";

export default async function AdminRessourcesPage() {
  const supabase = await createClient();

  const [{ data: resources }, { data: weeks }] = await Promise.all([
    supabase.from("resources").select("*").order("created_at", { ascending: false }),
    supabase.from("weeks").select("*").order("week_number", { ascending: true }),
  ]);

  return (
    <div className="flex flex-col gap-8 pb-12">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">Admin</p>
        <h1 className="mt-2 font-rr-display text-3xl uppercase tracking-[0.06em] text-rr-ivoire">Bibliothèque de ressources</h1>
      </header>

      <GlassCard className="p-6">
        <p className="mb-4 text-sm text-rr-gris-clair">Ajouter une ressource</p>
        <ResourceForm weeks={weeks ?? []} />
      </GlassCard>

      <div className="flex flex-col gap-4">
        {(resources ?? []).map((resource) => (
          <AdminResourceCard key={resource.id} resource={resource} weeks={weeks ?? []} />
        ))}

        {(resources ?? []).length === 0 && (
          <GlassCard className="p-6">
            <p className="text-sm text-rr-gris-clair">Aucune ressource pour le moment.</p>
          </GlassCard>
        )}
      </div>
    </div>
  );
}

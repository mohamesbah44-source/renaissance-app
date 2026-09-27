import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { OfferForm } from "@/components/features/admin/OfferForm";
import { AdminOfferCard } from "@/components/features/admin/AdminOfferCard";

export default async function AdminOffrePage() {
  const supabase = await createClient();

  const { data: offers } = await supabase.from("program_offers").select("*").order("updated_at", { ascending: false });

  return (
    <div className="flex flex-col gap-8 pb-12">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Admin</p>
        <h1 className="mt-2 font-display text-3xl text-white">Offre de suite</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          L&apos;offre active est affichée dans le dashboard des client·e·s et mise en avant à la semaine 8.
          Une seule offre active à la fois.
        </p>
      </header>

      <GlassCard className="p-6">
        <p className="mb-4 text-sm text-white/70">Créer une offre</p>
        <OfferForm />
      </GlassCard>

      <div className="flex flex-col gap-4">
        {(offers ?? []).map((offer) => (
          <AdminOfferCard key={offer.id} offer={offer} />
        ))}

        {(offers ?? []).length === 0 && (
          <GlassCard className="p-6">
            <p className="text-sm text-white/60">Aucune offre pour le moment.</p>
          </GlassCard>
        )}
      </div>
    </div>
  );
}

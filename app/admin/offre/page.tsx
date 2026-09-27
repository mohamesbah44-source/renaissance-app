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
        <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">Admin</p>
        <h1 className="mt-2 font-rr-display text-3xl uppercase tracking-[0.06em] text-rr-ivoire">Offre de suite</h1>
        <p className="mt-3 text-sm leading-relaxed text-rr-gris-clair">
          L&apos;offre active est affichée dans le dashboard des client·e·s et mise en avant à la semaine 8.
          Une seule offre active à la fois.
        </p>
      </header>

      <GlassCard className="p-6">
        <p className="mb-4 text-sm text-rr-gris-clair">Créer une offre</p>
        <OfferForm />
      </GlassCard>

      <div className="flex flex-col gap-4">
        {(offers ?? []).map((offer) => (
          <AdminOfferCard key={offer.id} offer={offer} />
        ))}

        {(offers ?? []).length === 0 && (
          <GlassCard className="p-6">
            <p className="text-sm text-rr-gris-clair">Aucune offre pour le moment.</p>
          </GlassCard>
        )}
      </div>
    </div>
  );
}

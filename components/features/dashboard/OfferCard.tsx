import { GlassCard } from "@/components/ui/GlassCard";
import type { ProgramOffer } from "@/lib/types/database.types";

/** Bandeau compact affichant l'offre de suite active, dans le dashboard. */
export function OfferCard({ offer }: { offer: ProgramOffer }) {
  return (
    <GlassCard className="mt-7 border-rr-or/20 bg-rr-or/[0.04] p-7">
      <p className="text-xs uppercase tracking-[0.3em] text-rr-or">Pour la suite</p>
      <p className="mt-2 font-rr-display text-lg text-rr-ivoire">{offer.title}</p>
      <p className="mt-2 text-sm leading-relaxed text-rr-gris-clair">{offer.description}</p>
      <div className="mt-5 flex items-center gap-4">
        <a
          href={offer.cta_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-rr-or px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-rr-noir transition-all duration-300 hover:-translate-y-0.5 hover:bg-rr-or-clair"
        >
          {offer.cta_label}
        </a>
        {offer.price_label && <span className="text-xs text-rr-gris">{offer.price_label}</span>}
      </div>
    </GlassCard>
  );
}

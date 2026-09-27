import { GlassCard } from "@/components/ui/GlassCard";
import type { ProgramOffer } from "@/lib/types/database.types";

/** Mise en avant pleine largeur de l'offre de suite, affichée à la fin du parcours (semaine 8). */
export function OfferSpotlight({ offer }: { offer: ProgramOffer }) {
  return (
    <GlassCard className="mt-8 border-rr-or/30 bg-gradient-to-br from-rr-or/[0.08] to-transparent p-8 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-rr-or">Et après ?</p>
      <p className="mt-3 font-rr-display text-2xl uppercase tracking-[0.04em] text-rr-ivoire">{offer.title}</p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/70">{offer.description}</p>
      <div className="mt-6 flex flex-col items-center gap-2">
        <a
          href={offer.cta_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-rr-or px-8 py-3 text-xs uppercase tracking-[0.25em] text-rr-noir transition-colors hover:bg-rr-or-clair"
        >
          {offer.cta_label}
        </a>
        {offer.price_label && <span className="text-xs text-white/40">{offer.price_label}</span>}
      </div>
    </GlassCard>
  );
}

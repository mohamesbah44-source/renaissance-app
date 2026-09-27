"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { OfferForm } from "@/components/features/admin/OfferForm";
import { deleteOffer } from "@/lib/offers/actions";
import type { ProgramOffer } from "@/lib/types/database.types";

export function AdminOfferCard({ offer }: { offer: ProgramOffer }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <GlassCard className="p-6">
        <OfferForm offer={offer} onSaved={() => setEditing(false)} onCancel={() => setEditing(false)} />
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Badge variant={offer.is_active ? "gold" : "neutral"}>{offer.is_active ? "Active" : "Inactive"}</Badge>
            {offer.price_label && <Badge variant="neutral">{offer.price_label}</Badge>}
          </div>
          <p className="mt-2 font-display text-lg text-white">{offer.title}</p>
          <p className="mt-1 text-sm text-white/60">{offer.description}</p>
          <a
            href={offer.cta_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-xs text-rr-or-clair hover:text-rr-or-clair"
          >
            {offer.cta_label} →
          </a>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-xs text-rr-or-clair transition-colors hover:text-rr-or-clair"
        >
          Modifier
        </button>
        <form action={deleteOffer}>
          <input type="hidden" name="id" value={offer.id} />
          <button type="submit" className="text-xs text-white/30 transition-colors hover:text-rr-rouge">
            Supprimer
          </button>
        </form>
      </div>
    </GlassCard>
  );
}

"use client";

import { useActionState, useEffect, useRef } from "react";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Button } from "@/components/ui/Button";
import { saveOffer } from "@/lib/offers/actions";
import type { ProgramOffer } from "@/lib/types/database.types";

interface OfferFormProps {
  offer?: ProgramOffer;
  onSaved?: () => void;
  onCancel?: () => void;
}

/** Formulaire admin pour créer ou éditer une offre de suite (upsell) : abonnement, 2e cohorte, accompagnement approfondi... */
export function OfferForm({ offer, onSaved, onCancel }: OfferFormProps) {
  const [state, formAction] = useActionState(saveOffer, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      if (!offer) {
        formRef.current?.reset();
      }
      onSaved?.();
    }
  }, [state, offer, onSaved]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      {offer && <input type="hidden" name="id" value={offer.id} />}

      <Field label="Titre" htmlFor="title">
        <Input id="title" name="title" type="text" defaultValue={offer?.title ?? ""} placeholder="Continuer le chemin avec moi" required />
      </Field>

      <Field label="Description" htmlFor="description">
        <Textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={offer?.description ?? ""}
          placeholder="Ce que propose la suite, pour qui, et pourquoi maintenant..."
          required
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Texte du bouton" htmlFor="ctaLabel">
          <Input id="ctaLabel" name="ctaLabel" type="text" defaultValue={offer?.cta_label ?? ""} placeholder="En savoir plus" />
        </Field>

        <Field label="Prix affiché (facultatif)" htmlFor="priceLabel">
          <Input id="priceLabel" name="priceLabel" type="text" defaultValue={offer?.price_label ?? ""} placeholder="À partir de 150€/mois" />
        </Field>
      </div>

      <Field label="Lien (paiement, Calendly...)" htmlFor="ctaUrl">
        <Input id="ctaUrl" name="ctaUrl" type="url" defaultValue={offer?.cta_url ?? ""} placeholder="https://..." required />
      </Field>

      <label className="flex items-center gap-2 text-sm text-white/70">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={offer ? offer.is_active : true}
          className="h-4 w-4 rounded border-white/20 bg-white/[0.04] accent-rr-or"
        />
        Offre active (visible par les client·e·s)
      </label>

      {state?.error && <p className="text-sm text-rr-rouge">{state.error}</p>}
      {state?.success && !offer && <p className="text-sm text-rr-or-clair">Offre ajoutée.</p>}

      <div className="flex gap-3">
        <SubmitButton className="flex-1">{offer ? "Mettre à jour" : "Créer l'offre"}</SubmitButton>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Annuler
          </Button>
        )}
      </div>
    </form>
  );
}

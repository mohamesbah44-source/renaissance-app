"use client";

import { useActionState } from "react";
import { Field } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Textarea";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { importPlanning } from "@/lib/admin/planning-actions";

const EXAMPLE = `02/11/2026 | 10h | Breathwork 1 | 1h30 | Sécurité intérieure et relâchement
06/11/2026 | 14h | Méditation 1 | 30 | Ancrage et stabilité intérieure`;

export function PlanningImport({ clientId }: { clientId: string }) {
  const [state, formAction] = useActionState(importPlanning, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="clientId" value={clientId} />

      <p className="text-sm leading-relaxed text-rr-gris-clair">
        Colle le planning, une ligne par rendez-vous : date | heure | format | durée | intention. Le titre devient
        « format · intention », l&apos;agenda du participant se met à jour, et il reçoit une notification et un e-mail le
        matin de chaque séance.
      </p>

      <Field label="Planning" htmlFor="planning">
        <Textarea id="planning" name="planning" rows={8} placeholder={EXAMPLE} required />
      </Field>

      {state?.error && <p className="text-sm text-rr-rouge">{state.error}</p>}
      {state?.success && <p className="text-sm text-rr-or-clair">{state.message}</p>}

      <SubmitButton className="w-auto self-start px-8">Importer le planning</SubmitButton>
    </form>
  );
}

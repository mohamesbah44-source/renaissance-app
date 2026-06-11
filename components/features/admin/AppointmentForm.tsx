"use client";

import { useActionState, useEffect, useRef } from "react";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { saveAppointment } from "@/lib/admin/actions";

export function AppointmentForm({ clientId }: { clientId: string }) {
  const [state, formAction] = useActionState(saveAppointment, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="clientId" value={clientId} />

      <Field label="Date et heure" htmlFor="scheduledAt">
        <Input id="scheduledAt" name="scheduledAt" type="datetime-local" className="[color-scheme:dark]" required />
      </Field>

      <Field label="Titre (facultatif)" htmlFor="title">
        <Input id="title" name="title" type="text" placeholder="Séance de suivi" />
      </Field>

      <Field label="Lien de visio (facultatif)" htmlFor="meetingUrl">
        <Input id="meetingUrl" name="meetingUrl" type="url" placeholder="https://..." />
      </Field>

      <Field label="Notes (facultatif)" htmlFor="notes">
        <Textarea id="notes" name="notes" rows={2} />
      </Field>

      {state?.error && <p className="text-sm text-rose-400">{state.error}</p>}
      {state?.success && <p className="text-sm text-violet-300">Rendez-vous enregistré.</p>}

      <SubmitButton className="w-auto self-start px-8">Ajouter le rendez-vous</SubmitButton>
    </form>
  );
}

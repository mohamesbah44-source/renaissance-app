"use client";

import { useActionState, useEffect, useRef } from "react";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { saveAppointment } from "@/lib/admin/actions";
import { SESSION_TYPE_LABEL } from "@/lib/parcours/sessions";
import type { SessionType } from "@/lib/types/database.types";

const SESSION_TYPE_OPTIONS: SessionType[] = ["breathwork", "courte", "theme_natal", "autre"];

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

      <Field label="Type de séance" htmlFor="sessionType">
        <Select id="sessionType" name="sessionType" defaultValue="courte">
          {SESSION_TYPE_OPTIONS.map((type) => (
            <option key={type} value={type}>
              {SESSION_TYPE_LABEL[type]}
            </option>
          ))}
        </Select>
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

      {state?.error && <p className="text-sm text-rr-rouge">{state.error}</p>}
      {state?.success && <p className="text-sm text-rr-or-clair">Rendez-vous enregistré.</p>}

      <SubmitButton className="w-auto self-start px-8">Ajouter le rendez-vous</SubmitButton>
    </form>
  );
}

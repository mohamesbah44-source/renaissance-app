"use client";

import { useActionState, useEffect, useRef } from "react";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { publishClientSong } from "@/lib/songs/actions";

/** Formulaire admin pour publier une chanson personnalisée Re-Naissance™ dans l'espace d'un·e client·e. */
export function ClientSongForm({ clientId }: { clientId: string }) {
  const [state, formAction] = useActionState(publishClientSong, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="clientId" value={clientId} />

      <Field label="Titre de la chanson" htmlFor="titre">
        <Input id="titre" name="titre" type="text" placeholder="Chanson 1 — Le Portail" required />
      </Field>

      <Field label="Lien audio" htmlFor="mediaUrl">
        <Input id="mediaUrl" name="mediaUrl" type="url" placeholder="https://..." required />
      </Field>

      <Field label="Mot d'accompagnement (facultatif)" htmlFor="message">
        <Textarea id="message" name="message" rows={3} placeholder="Ce que cette chanson porte pour ce moment de son parcours..." />
      </Field>

      {state?.error && <p className="text-sm text-rr-rouge">{state.error}</p>}
      {state?.success && <p className="text-sm text-rr-or-clair">Chanson publiée.</p>}

      <SubmitButton className="w-auto self-start px-8">Publier la chanson</SubmitButton>
    </form>
  );
}

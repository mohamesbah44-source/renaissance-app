"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { UserPlus } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { inviteClient } from "@/lib/admin/actions";

/** Crée la fiche d'un nouveau membre et lui envoie un lien d'invitation par email. */
export function InviteClientForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(inviteClient, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="self-start">
        <UserPlus className="h-4 w-4" strokeWidth={1.75} />
        Inviter un nouveau membre
      </Button>
    );
  }

  return (
    <GlassCard className="p-6">
      <p className="mb-4 text-sm text-rr-gris-clair">
        Crée la fiche du membre : il recevra un email pour choisir lui-même son mot de passe.
      </p>
      <form ref={formRef} action={formAction} className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Field label="Prénom" htmlFor="firstName">
            <Input id="firstName" name="firstName" type="text" placeholder="Charlotte" required />
          </Field>
        </div>
        <div className="flex-1">
          <Field label="Nom (facultatif)" htmlFor="lastName">
            <Input id="lastName" name="lastName" type="text" placeholder="Mazairat" />
          </Field>
        </div>
        <div className="flex-[1.5]">
          <Field label="Email" htmlFor="email">
            <Input id="email" name="email" type="email" placeholder="charlotte@exemple.com" required />
          </Field>
        </div>
        <SubmitButton className="sm:w-auto">Envoyer l&apos;invitation</SubmitButton>
      </form>

      {state?.error && <p className="mt-3 text-sm text-rr-rouge">{state.error}</p>}
      {state?.success && <p className="mt-3 text-sm text-rr-or-clair">Invitation envoyée.</p>}
    </GlassCard>
  );
}

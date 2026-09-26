"use client";

import { useActionState, useEffect, useRef } from "react";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { changePassword } from "@/lib/profil/actions";

export function PasswordForm() {
  const [state, formAction] = useActionState(changePassword, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <Field label="Nouveau mot de passe" htmlFor="password">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="8 caractères minimum"
          required
        />
      </Field>

      <Field label="Confirmer le mot de passe" htmlFor="passwordConfirm">
        <Input
          id="passwordConfirm"
          name="passwordConfirm"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          required
        />
      </Field>

      {state?.error && <p className="text-sm text-rr-rouge">{state.error}</p>}
      {state?.success && <p className="text-sm text-rr-or-clair">Ton mot de passe a été mis à jour.</p>}

      <SubmitButton className="w-auto self-start px-8">Mettre à jour le mot de passe</SubmitButton>
    </form>
  );
}

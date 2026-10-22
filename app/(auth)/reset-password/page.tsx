"use client";

import { useActionState } from "react";
import { updatePassword } from "@/lib/auth/actions";
import { Field } from "@/components/ui/Field";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { SubmitButton } from "@/components/ui/SubmitButton";

const PILL = "h-[52px] rounded-full px-5 pr-12";

export default function ResetPasswordPage() {
  const [state, formAction] = useActionState(updatePassword, undefined);

  return (
    <div className="rr-enter">
      <h1 className="text-center font-rr-display text-[46px] leading-none text-rr-ivoire">Nouveau départ.</h1>
      <p className="mt-4 text-center text-sm leading-relaxed text-rr-gris-clair">
        Choisis ton nouveau mot de passe.
      </p>

      <form action={formAction} className="mt-9 flex flex-col gap-4">
        <Field label="Nouveau mot de passe" htmlFor="password">
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            required
            placeholder="8 caractères minimum"
            className={PILL}
          />
        </Field>
        <Field label="Confirmer le mot de passe" htmlFor="passwordConfirm">
          <PasswordInput
            id="passwordConfirm"
            name="passwordConfirm"
            autoComplete="new-password"
            required
            placeholder="••••••••"
            className={PILL}
          />
        </Field>

        {state?.error && <p className="px-2 text-sm text-rr-rouge">{state.error}</p>}

        <SubmitButton size="lg" className="mt-3">
          Mettre à jour mon mot de passe
        </SubmitButton>
      </form>
    </div>
  );
}

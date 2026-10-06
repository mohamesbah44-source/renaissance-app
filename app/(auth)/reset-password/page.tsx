"use client";

import { useActionState } from "react";
import { updatePassword } from "@/lib/auth/actions";
import { GlassCard } from "@/components/ui/GlassCard";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { SubmitButton } from "@/components/ui/SubmitButton";

export default function ResetPasswordPage() {
  const [state, formAction] = useActionState(updatePassword, undefined);

  return (
    <GlassCard className="p-6 sm:p-8">
      <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">Re-Naissance™</p>
      <h1 className="mt-3 font-rr-display text-3xl leading-tight text-rr-ivoire">Nouveau départ.</h1>
      <p className="mt-3 text-sm leading-relaxed text-rr-gris-clair">Choisis ton nouveau mot de passe.</p>

      <form action={formAction} className="mt-8 flex flex-col gap-5">
        <Field label="Nouveau mot de passe" htmlFor="password">
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            placeholder="8 caractères minimum"
          />
        </Field>
        <Field label="Confirmer le mot de passe" htmlFor="passwordConfirm">
          <Input
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            autoComplete="new-password"
            required
            placeholder="••••••••"
          />
        </Field>

        {state?.error && <p className="text-sm text-rr-rouge">{state.error}</p>}

        <SubmitButton>Mettre à jour mon mot de passe</SubmitButton>
      </form>
    </GlassCard>
  );
}

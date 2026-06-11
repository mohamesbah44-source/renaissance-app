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
    <GlassCard className="p-8">
      <h1 className="font-display text-2xl text-white">Nouveau départ.</h1>
      <p className="mt-2 text-sm text-white/60">Choisis ton nouveau mot de passe.</p>

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

        {state?.error && <p className="text-sm text-rose-400">{state.error}</p>}

        <SubmitButton>Mettre à jour mon mot de passe</SubmitButton>
      </form>
    </GlassCard>
  );
}

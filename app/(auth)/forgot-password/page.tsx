"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset } from "@/lib/auth/actions";
import { GlassCard } from "@/components/ui/GlassCard";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { SubmitButton } from "@/components/ui/SubmitButton";

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState(requestPasswordReset, undefined);

  return (
    <GlassCard className="p-8">
      <h1 className="font-display text-2xl text-white">Mot de passe oublié.</h1>
      <p className="mt-2 text-sm text-white/60">
        Indique ton email : nous t&apos;enverrons un lien pour en choisir un nouveau.
      </p>

      {state?.success ? (
        <p className="mt-8 text-sm text-rr-or-clair">{state.success}</p>
      ) : (
        <form action={formAction} className="mt-8 flex flex-col gap-5">
          <Field label="Email" htmlFor="email">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="toi@exemple.com"
            />
          </Field>

          {state?.error && <p className="text-sm text-rr-rouge">{state.error}</p>}

          <SubmitButton>Envoyer le lien</SubmitButton>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-white/50">
        <Link href="/login" className="text-rr-or-clair hover:text-rr-or-clair">
          Retour à la connexion
        </Link>
      </p>
    </GlassCard>
  );
}

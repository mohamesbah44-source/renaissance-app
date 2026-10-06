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
    <GlassCard className="p-6 sm:p-8">
      <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">Re-Naissance™</p>
      <h1 className="mt-3 font-rr-display text-3xl leading-tight text-rr-ivoire">Mot de passe oublié.</h1>
      <p className="mt-3 text-sm leading-relaxed text-rr-gris-clair">
        Indique ton email : nous t&apos;enverrons un lien pour en choisir un nouveau.
      </p>

      {state?.success ? (
        <p className="mt-8 font-rr-serif text-base italic leading-relaxed text-rr-creme">{state.success}</p>
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

      <p className="mt-6 text-center text-sm text-rr-gris">
        <Link
          href="/login"
          className="inline-block px-1 py-2 text-rr-or-clair transition-colors duration-300 hover:text-rr-ivoire"
        >
          Retour à la connexion
        </Link>
      </p>
    </GlassCard>
  );
}

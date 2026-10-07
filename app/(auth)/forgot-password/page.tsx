"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset } from "@/lib/auth/actions";
import { GlassCard } from "@/components/ui/GlassCard";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { SubmitButton } from "@/components/ui/SubmitButton";

type ResetState = { error?: string; success?: unknown; message?: string } | undefined;

export default function ForgotPasswordPage() {
  const [rawState, formAction] = useActionState(requestPasswordReset, undefined);
  const state = rawState as ResetState;
  const sent = Boolean(state && !state.error);

  return (
    <GlassCard className="p-6 sm:p-8">
      <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">Re-Naissance™</p>
      <h1 className="mt-3 font-rr-display text-3xl leading-tight text-rr-ivoire">Pas de souci.</h1>
      <p className="mt-3 text-sm leading-relaxed text-rr-gris-clair">
        Indique ton adresse e-mail : tu recevras un lien pour choisir un nouveau mot de passe.
      </p>

      {sent ? (
        <p className="mt-8 font-rr-serif text-lg italic leading-relaxed text-rr-creme">
          {typeof state?.message === "string" && state.message
            ? state.message
            : "Si cette adresse correspond à un compte, un e-mail vient de partir. Pense à vérifier tes courriers indésirables."}
        </p>
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

          <SubmitButton>Recevoir le lien</SubmitButton>
        </form>
      )}

      <div className="mt-6 flex justify-center text-sm text-rr-gris">
        <Link href="/login" className="px-2 py-2 transition-colors duration-300 hover:text-rr-gris-clair">
          Retour à la connexion
        </Link>
      </div>
    </GlassCard>
  );
}

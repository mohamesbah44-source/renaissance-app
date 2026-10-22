"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset } from "@/lib/auth/actions";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { SubmitButton } from "@/components/ui/SubmitButton";

type ResetState = { error?: string; success?: unknown; message?: string } | undefined;

export default function ForgotPasswordPage() {
  const [rawState, formAction] = useActionState(requestPasswordReset, undefined);
  const state = rawState as ResetState;
  const sent = Boolean(state && !state.error);

  return (
    <div className="rr-enter">
      <h1 className="text-center font-rr-display text-[46px] leading-none text-rr-ivoire">Pas de souci.</h1>
      <p className="mt-4 text-center text-sm leading-relaxed text-rr-gris-clair">
        Indique ton adresse e-mail : tu recevras un lien pour choisir un nouveau mot de passe.
      </p>

      {sent ? (
        <p className="mt-10 text-center font-rr-serif text-xl italic leading-relaxed text-rr-creme">
          {typeof state?.message === "string" && state.message
            ? state.message
            : "Si cette adresse correspond à un compte, un e-mail vient de partir. Pense à vérifier tes courriers indésirables."}
        </p>
      ) : (
        <form action={formAction} className="mt-9 flex flex-col gap-4">
          <Field label="Email" htmlFor="email">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="toi@exemple.com"
              className="h-[52px] rounded-full px-5"
            />
          </Field>

          {state?.error && <p className="px-2 text-sm text-rr-rouge">{state.error}</p>}

          <SubmitButton size="lg" className="mt-3">
            Recevoir le lien
          </SubmitButton>
        </form>
      )}

      <div className="mt-4 flex justify-center text-sm text-rr-gris-clair">
        <Link href="/login" className="px-2 py-2 transition-colors duration-300 hover:text-rr-ivoire">
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
}

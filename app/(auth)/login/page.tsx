"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn } from "@/lib/auth/actions";
import { GlassCard } from "@/components/ui/GlassCard";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { SubmitButton } from "@/components/ui/SubmitButton";

export default function LoginPage() {
  const [state, formAction] = useActionState(signIn, undefined);

  return (
    <GlassCard className="p-6 sm:p-8">
      <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">Re-Naissance™</p>
      <h1 className="mt-3 font-rr-display text-3xl leading-tight text-rr-ivoire">Te revoilà.</h1>
      <p className="mt-3 text-sm leading-relaxed text-rr-gris-clair">
        Reviens te poser dans ton espace Renaissance.
      </p>

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
        <Field label="Mot de passe" htmlFor="password">
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
          />
        </Field>

        {state?.error && <p className="text-sm text-rr-rouge">{state.error}</p>}

        <SubmitButton>Entrer dans mon espace</SubmitButton>
      </form>

      <div className="mt-6 flex flex-col items-center gap-1 text-sm text-rr-gris">
        <Link href="/forgot-password" className="px-2 py-2 transition-colors duration-300 hover:text-rr-gris-clair">
          Mot de passe oublié ?
        </Link>
        <p>
          Pas encore de compte ?{" "}
          <Link
            href="/register"
            className="inline-block px-1 py-2 text-rr-or-clair transition-colors duration-300 hover:text-rr-ivoire"
          >
            Commencer le parcours
          </Link>
        </p>
      </div>
    </GlassCard>
  );
}

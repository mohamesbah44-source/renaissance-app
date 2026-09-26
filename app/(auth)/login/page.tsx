"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn } from "@/lib/auth/actions";
import { GlassCard } from "@/components/ui/GlassCard";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { SubmitButton } from "@/components/ui/SubmitButton";

export default function LoginPage() {
  const [state, formAction] = useActionState(signIn, undefined);

  return (
    <GlassCard className="p-8">
      <h1 className="font-display text-2xl text-white">Te revoilà.</h1>
      <p className="mt-2 text-sm text-white/60">
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
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
          />
        </Field>

        {state?.error && <p className="text-sm text-rr-rouge">{state.error}</p>}

        <SubmitButton>Entrer dans mon espace</SubmitButton>
      </form>

      <div className="mt-6 flex flex-col items-center gap-3 text-sm text-white/50">
        <Link href="/forgot-password" className="hover:text-white/80">
          Mot de passe oublié ?
        </Link>
        <p>
          Pas encore de compte ?{" "}
          <Link href="/register" className="text-rr-or-clair hover:text-rr-or-clair">
            Commencer le parcours
          </Link>
        </p>
      </div>
    </GlassCard>
  );
}

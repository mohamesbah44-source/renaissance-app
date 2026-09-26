"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUp } from "@/lib/auth/actions";
import { GlassCard } from "@/components/ui/GlassCard";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { SubmitButton } from "@/components/ui/SubmitButton";

export default function RegisterPage() {
  const [state, formAction] = useActionState(signUp, undefined);

  if (state?.success) {
    return (
      <GlassCard className="p-8 text-center">
        <h1 className="font-display text-2xl text-white">Presque prêt(e).</h1>
        <p className="mt-3 text-sm text-white/60">{state.success}</p>
        <Link
          href="/login"
          className="mt-6 inline-block text-sm text-rr-or-clair hover:text-rr-or-clair"
        >
          Retour à la connexion
        </Link>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-8">
      <h1 className="font-display text-2xl text-white">Bienvenue.</h1>
      <p className="mt-2 text-sm text-white/60">
        Crée ton espace Renaissance. Le chemin commence ici, à ton rythme.
      </p>

      <form action={formAction} className="mt-8 flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Prénom" htmlFor="firstName">
            <Input
              id="firstName"
              name="firstName"
              autoComplete="given-name"
              required
              placeholder="Ton prénom"
            />
          </Field>
          <Field label="Nom" htmlFor="lastName">
            <Input id="lastName" name="lastName" autoComplete="family-name" placeholder="Ton nom" />
          </Field>
        </div>
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

        <SubmitButton>Créer mon espace</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-white/50">
        Déjà un compte ?{" "}
        <Link href="/login" className="text-rr-or-clair hover:text-rr-or-clair">
          Te connecter
        </Link>
      </p>
    </GlassCard>
  );
}

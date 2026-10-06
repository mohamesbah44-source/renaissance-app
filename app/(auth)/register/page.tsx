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
      <GlassCard className="p-6 text-center sm:p-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">Re-Naissance™</p>
        <h1 className="mt-3 font-rr-display text-3xl leading-tight text-rr-ivoire">Presque prêt(e).</h1>
        <p className="mt-4 font-rr-serif text-base italic leading-relaxed text-rr-creme">{state.success}</p>
        <Link
          href="/login"
          className="mt-8 flex h-12 items-center justify-center rounded-full border border-rr-or/30 text-xs uppercase tracking-[0.25em] text-rr-or-clair transition-all duration-300 hover:bg-white/[0.05]"
        >
          Retour à la connexion
        </Link>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6 sm:p-8">
      <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">Re-Naissance™</p>
      <h1 className="mt-3 font-rr-display text-3xl leading-tight text-rr-ivoire">Bienvenue.</h1>
      <p className="mt-3 text-sm leading-relaxed text-rr-gris-clair">
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

      <p className="mt-6 text-center text-sm text-rr-gris">
        Déjà un compte ?{" "}
        <Link
          href="/login"
          className="inline-block px-1 py-2 text-rr-or-clair transition-colors duration-300 hover:text-rr-ivoire"
        >
          Te connecter
        </Link>
      </p>
    </GlassCard>
  );
}

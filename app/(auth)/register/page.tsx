"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUp } from "@/lib/auth/actions";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { SubmitButton } from "@/components/ui/SubmitButton";

const PILL = "h-[52px] rounded-full px-5";

export default function RegisterPage() {
  const [state, formAction] = useActionState(signUp, undefined);

  if (state?.success) {
    return (
      <div className="rr-enter text-center">
        <h1 className="font-rr-display text-[46px] leading-none text-rr-ivoire">Presque prêt·e.</h1>
        <p className="mt-6 font-rr-serif text-xl italic leading-relaxed text-rr-creme">{state.success}</p>
        <Link
          href="/login"
          className="mt-10 flex h-14 items-center justify-center rounded-full border border-rr-ivoire/20 text-[15px] text-rr-ivoire transition-colors duration-300 hover:bg-white/[0.05]"
        >
          Retour à la connexion
        </Link>
      </div>
    );
  }

  return (
    <div className="rr-enter">
      <h1 className="text-center font-rr-display text-[46px] leading-none text-rr-ivoire">Bienvenue.</h1>
      <p className="mt-4 text-center text-sm leading-relaxed text-rr-gris-clair">
        Crée ton espace. Le chemin commence ici, à ton rythme.
      </p>

      <form action={formAction} className="mt-9 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Prénom" htmlFor="firstName">
            <Input
              id="firstName"
              name="firstName"
              autoComplete="given-name"
              required
              placeholder="Ton prénom"
              className={PILL}
            />
          </Field>
          <Field label="Nom" htmlFor="lastName">
            <Input
              id="lastName"
              name="lastName"
              autoComplete="family-name"
              placeholder="Ton nom"
              className={PILL}
            />
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
            className={PILL}
          />
        </Field>
        <Field label="Mot de passe" htmlFor="password">
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            required
            placeholder="8 caractères minimum"
            className={`${PILL} pr-12`}
          />
        </Field>
        <Field label="Confirmer le mot de passe" htmlFor="passwordConfirm">
          <PasswordInput
            id="passwordConfirm"
            name="passwordConfirm"
            autoComplete="new-password"
            required
            placeholder="••••••••"
            className={`${PILL} pr-12`}
          />
        </Field>

        {state?.error && <p className="px-2 text-sm text-rr-rouge">{state.error}</p>}

        <SubmitButton size="lg" className="mt-3">
          Créer mon espace
        </SubmitButton>
      </form>

      <p className="mt-4 text-center text-sm text-rr-gris">
        Déjà un compte ?{" "}
        <Link
          href="/login"
          className="inline-block px-1 py-2 text-rr-or-clair transition-colors duration-300 hover:text-rr-ivoire"
        >
          Te connecter
        </Link>
      </p>
    </div>
  );
}

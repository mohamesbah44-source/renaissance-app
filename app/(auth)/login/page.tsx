"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn } from "@/lib/auth/actions";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { SubmitButton } from "@/components/ui/SubmitButton";

const PILL = "h-[52px] rounded-full px-5";

export default function LoginPage() {
  const [state, formAction] = useActionState(signIn, undefined);

  return (
    <div className="rr-enter">
      <h1 className="text-center font-rr-display text-[46px] leading-none text-rr-ivoire">Te revoilà.</h1>

      <form action={formAction} className="mt-10 flex flex-col gap-4">
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
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className={`${PILL} pr-12`}
          />
        </Field>

        {state?.error && <p className="px-2 text-sm text-rr-rouge">{state.error}</p>}

        <SubmitButton size="lg" className="mt-3">
          Entrer
        </SubmitButton>
      </form>

      <div className="mt-4 flex flex-col items-center gap-1 text-sm text-rr-gris-clair">
        <Link href="/forgot-password" className="px-2 py-2 transition-colors duration-300 hover:text-rr-ivoire">
          Mot de passe oublié
        </Link>
        <p className="text-rr-gris">
          Pas encore de compte ?{" "}
          <Link
            href="/register"
            className="inline-block px-1 py-2 text-rr-or-clair transition-colors duration-300 hover:text-rr-ivoire"
          >
            Commencer le parcours
          </Link>
        </p>
      </div>
    </div>
  );
}

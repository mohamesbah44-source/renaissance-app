"use client";

import { useActionState } from "react";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { updateProfileInfo } from "@/lib/profil/actions";
import type { Profile } from "@/lib/types/database.types";

export function ProfileInfoForm({ profile }: { profile: Profile }) {
  const [state, formAction] = useActionState(updateProfileInfo, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Prénom" htmlFor="firstName">
          <Input id="firstName" name="firstName" type="text" defaultValue={profile.first_name ?? ""} required />
        </Field>

        <Field label="Nom" htmlFor="lastName">
          <Input id="lastName" name="lastName" type="text" defaultValue={profile.last_name ?? ""} />
        </Field>
      </div>

      {state?.error && <p className="text-sm text-rr-rouge">{state.error}</p>}
      {state?.success && <p className="text-sm text-rr-or-clair">Tes informations ont été mises à jour.</p>}

      <SubmitButton className="w-auto self-start px-8">Enregistrer</SubmitButton>
    </form>
  );
}

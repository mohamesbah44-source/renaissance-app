"use client";

import { useActionState } from "react";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { updateClientSettings } from "@/lib/admin/actions";
import type { Profile } from "@/lib/types/database.types";

const WEEK_NUMBERS = Array.from({ length: 8 }, (_, i) => i + 1);

export function ClientSettingsForm({ client }: { client: Profile }) {
  const [state, formAction] = useActionState(updateClientSettings, undefined);

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2 sm:items-end">
      <input type="hidden" name="clientId" value={client.id} />

      <Field label="Semaine actuelle" htmlFor="currentWeek">
        <Select id="currentWeek" name="currentWeek" defaultValue={client.current_week}>
          {WEEK_NUMBERS.map((n) => (
            <option key={n} value={n} className="bg-night-900">
              Semaine {n}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Date de démarrage" htmlFor="programStartDate">
        <Input
          id="programStartDate"
          name="programStartDate"
          type="date"
          defaultValue={client.program_start_date ?? ""}
          className="[color-scheme:dark]"
        />
      </Field>

      {state?.error && <p className="text-sm text-rr-rouge sm:col-span-2">{state.error}</p>}
      {state?.success && <p className="text-sm text-rr-or-clair sm:col-span-2">Mis à jour.</p>}

      <div className="sm:col-span-2">
        <SubmitButton className="w-auto px-8">Enregistrer</SubmitButton>
      </div>
    </form>
  );
}

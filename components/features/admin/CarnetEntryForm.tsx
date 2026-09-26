"use client";

import { useActionState, useEffect, useRef } from "react";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { CERCLES, PILIERS } from "@/lib/radar/constants";
import { publishCarnetEntry } from "@/lib/carnet/actions";

/** Formulaire admin pour publier une synthèse (Re-Naissance Analyzer™ ou note manuelle) dans le Carnet d'un·e client·e. */
export function CarnetEntryForm({ clientId }: { clientId: string }) {
  const [state, formAction] = useActionState(publishCarnetEntry, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="clientId" value={clientId} />

      <Field label="Origine" htmlFor="source">
        <Select id="source" name="source" defaultValue="manuel">
          <option value="manuel">Note manuelle</option>
          <option value="analyzer">Re-Naissance Analyzer™</option>
        </Select>
      </Field>

      <Field label="Titre" htmlFor="titre">
        <Input id="titre" name="titre" type="text" placeholder="Ce que révèle ton bilan" required />
      </Field>

      <Field label="Synthèse" htmlFor="synthese">
        <Textarea id="synthese" name="synthese" rows={4} placeholder="La synthèse partagée avec le·la client·e..." required />
      </Field>

      <Field label="Pistes de réflexion (une par ligne, facultatif)" htmlFor="hypotheses">
        <Textarea id="hypotheses" name="hypotheses" rows={3} placeholder={"Piste 1\nPiste 2"} />
      </Field>

      <div>
        <p className="mb-2 text-sm font-medium text-white/70">Piliers concernés</p>
        <div className="flex flex-col gap-3">
          {CERCLES.map((cercle) => (
            <div key={cercle.id}>
              <p className="text-xs uppercase tracking-[0.2em] text-rr-or/60">{cercle.nom}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {PILIERS.filter((p) => p.cercle === cercle.id).map((pilier) => (
                  <label
                    key={pilier.id}
                    className="cursor-pointer rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/50 transition-colors hover:border-white/25 has-checked:border-rr-or has-checked:bg-rr-or/15 has-checked:text-rr-or-clair"
                  >
                    <input type="checkbox" name="pilierIds" value={pilier.id} className="sr-only" />
                    {pilier.court}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {state?.error && <p className="text-sm text-rr-rouge">{state.error}</p>}
      {state?.success && <p className="text-sm text-rr-or-clair">Entrée publiée dans le Carnet.</p>}

      <SubmitButton className="w-auto self-start px-8">Publier dans le Carnet</SubmitButton>
    </form>
  );
}

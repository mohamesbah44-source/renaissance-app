"use client";

import { useActionState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Field } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Textarea";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { saveJournalingResponses } from "@/lib/parcours/actions";
import type { JournalingPrompt, JournalingResponses } from "@/lib/types/database.types";

interface JournalingPromptFormProps {
  weekId: string;
  prompts: JournalingPrompt[];
  responses: JournalingResponses;
}

export function JournalingPromptForm({ weekId, prompts, responses }: JournalingPromptFormProps) {
  const [state, formAction] = useActionState(saveJournalingResponses, undefined);

  return (
    <GlassCard className="mt-7 p-7">
      <p className="text-xs uppercase tracking-[0.3em] text-white/40">Ton espace de journalisation</p>
      <p className="mt-2 text-sm leading-relaxed text-white/60">
        Prends le temps qu&apos;il te faut. Il n&apos;y a pas de bonne réponse, seulement la tienne.
      </p>

      <form action={formAction} className="mt-7 flex flex-col gap-6">
        <input type="hidden" name="weekId" value={weekId} />

        {prompts.map((prompt) => (
          <Field key={prompt.id} label={prompt.label} htmlFor={`prompt-${prompt.id}`}>
            <Textarea
              id={`prompt-${prompt.id}`}
              name={`prompt-${prompt.id}`}
              defaultValue={responses[prompt.id] ?? ""}
              rows={4}
              placeholder="Écris librement..."
            />
          </Field>
        ))}

        {state?.error && <p className="text-sm text-rr-rouge">{state.error}</p>}
        {state?.success && <p className="text-sm text-rr-or-clair">Tes réflexions ont été enregistrées.</p>}

        <SubmitButton variant="outline">Enregistrer mes réflexions</SubmitButton>
      </form>
    </GlassCard>
  );
}

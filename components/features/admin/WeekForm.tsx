"use client";

import { useActionState } from "react";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { saveWeekContent } from "@/lib/admin/actions";
import type { JournalingPrompt, Week, WeekPdf } from "@/lib/types/database.types";

export function WeekForm({ week }: { week: Week }) {
  const [state, formAction] = useActionState(saveWeekContent, undefined);

  const journalingPrompts = (week.journaling_prompts as unknown as JournalingPrompt[] | null) ?? [];
  const pdfUrls = (week.pdf_urls as unknown as WeekPdf[] | null) ?? [];

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="id" value={week.id} />

      <Field label="Titre" htmlFor={`title-${week.id}`}>
        <Input id={`title-${week.id}`} name="title" type="text" defaultValue={week.title} required />
      </Field>

      <Field label="Intention" htmlFor={`intention-${week.id}`}>
        <Input id={`intention-${week.id}`} name="intention" type="text" defaultValue={week.intention ?? ""} />
      </Field>

      <Field label="Description" htmlFor={`description-${week.id}`}>
        <Textarea id={`description-${week.id}`} name="description" rows={4} defaultValue={week.description ?? ""} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Vidéo (URL)" htmlFor={`videoUrl-${week.id}`}>
          <Input
            id={`videoUrl-${week.id}`}
            name="videoUrl"
            type="url"
            defaultValue={week.video_url ?? ""}
            placeholder="https://..."
          />
        </Field>

        <Field label="Audio — respiration (URL)" htmlFor={`audioBreathworkUrl-${week.id}`}>
          <Input
            id={`audioBreathworkUrl-${week.id}`}
            name="audioBreathworkUrl"
            type="url"
            defaultValue={week.audio_breathwork_url ?? ""}
            placeholder="https://..."
          />
        </Field>

        <Field label="Audio — méditation (URL)" htmlFor={`audioMeditationUrl-${week.id}`}>
          <Input
            id={`audioMeditationUrl-${week.id}`}
            name="audioMeditationUrl"
            type="url"
            defaultValue={week.audio_meditation_url ?? ""}
            placeholder="https://..."
          />
        </Field>

        <Field label="Audio — visualisation (URL)" htmlFor={`audioVisualizationUrl-${week.id}`}>
          <Input
            id={`audioVisualizationUrl-${week.id}`}
            name="audioVisualizationUrl"
            type="url"
            defaultValue={week.audio_visualization_url ?? ""}
            placeholder="https://..."
          />
        </Field>
      </div>

      <Field label="Questions de journalisation (une par ligne)" htmlFor={`journalingPrompts-${week.id}`}>
        <Textarea
          id={`journalingPrompts-${week.id}`}
          name="journalingPrompts"
          rows={4}
          defaultValue={journalingPrompts.map((prompt) => prompt.label).join("\n")}
        />
      </Field>

      <Field label="Documents PDF (un par ligne, format « Titre | URL »)" htmlFor={`pdfUrls-${week.id}`}>
        <Textarea
          id={`pdfUrls-${week.id}`}
          name="pdfUrls"
          rows={3}
          defaultValue={pdfUrls.map((pdf) => `${pdf.title} | ${pdf.url}`).join("\n")}
        />
      </Field>

      {state?.error && <p className="text-sm text-rose-400">{state.error}</p>}
      {state?.success && <p className="text-sm text-violet-300">Semaine mise à jour.</p>}

      <SubmitButton className="w-auto self-start px-8">Enregistrer</SubmitButton>
    </form>
  );
}

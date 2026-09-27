"use client";

import { useActionState, useEffect, useRef } from "react";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Button } from "@/components/ui/Button";
import { saveJournalEntry } from "@/lib/journal/actions";
import { MOOD_OPTIONS } from "@/lib/journal/constants";
import type { JournalEntry, Week } from "@/lib/types/database.types";

interface JournalEntryFormProps {
  entry?: JournalEntry;
  weeks: Week[];
  defaultDate: string;
  onSaved?: () => void;
  onCancel?: () => void;
}

export function JournalEntryForm({ entry, weeks, defaultDate, onSaved, onCancel }: JournalEntryFormProps) {
  const [state, formAction] = useActionState(saveJournalEntry, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      if (!entry) {
        formRef.current?.reset();
      }
      onSaved?.();
    }
  }, [state, entry, onSaved]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-5">
      {entry && <input type="hidden" name="id" value={entry.id} />}

      <div className="grid grid-cols-2 gap-5">
        <Field label="Date" htmlFor="entryDate">
          <Input
            id="entryDate"
            name="entryDate"
            type="date"
            defaultValue={entry?.entry_date ?? defaultDate}
            className="[color-scheme:dark]"
            required
          />
        </Field>

        <Field label="Humeur" htmlFor="mood">
          <Select id="mood" name="mood" defaultValue={entry?.mood ?? ""}>
            <option value="" className="bg-night-900">
              Choisir...
            </option>
            {MOOD_OPTIONS.map((mood) => (
              <option key={mood} value={mood} className="bg-night-900">
                {mood}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Titre (facultatif)" htmlFor="title">
        <Input
          id="title"
          name="title"
          type="text"
          defaultValue={entry?.title ?? ""}
          placeholder="Un mot pour résumer..."
        />
      </Field>

      {weeks.length > 0 && (
        <Field label="Semaine associée (facultatif)" htmlFor="weekId">
          <Select id="weekId" name="weekId" defaultValue={entry?.week_id ?? ""}>
            <option value="" className="bg-night-900">
              Aucune
            </option>
            {weeks.map((week) => (
              <option key={week.id} value={week.id} className="bg-night-900">
                Semaine {week.week_number} — {week.title}
              </option>
            ))}
          </Select>
        </Field>
      )}

      <Field label="Ton texte" htmlFor="content">
        <Textarea
          id="content"
          name="content"
          defaultValue={entry?.content ?? ""}
          rows={6}
          placeholder="Écris ce qui traverse ton esprit, sans filtre..."
          required
        />
      </Field>

      {state?.error && <p className="text-sm text-rr-rouge">{state.error}</p>}
      {state?.success && !entry && <p className="text-sm text-rr-or-clair">Ton entrée a été enregistrée.</p>}

      <div className="flex gap-4">
        <SubmitButton className="flex-1">{entry ? "Mettre à jour" : "Ajouter au journal"}</SubmitButton>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Annuler
          </Button>
        )}
      </div>
    </form>
  );
}

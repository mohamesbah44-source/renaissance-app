"use client";

import { useActionState, useEffect, useRef } from "react";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Button } from "@/components/ui/Button";
import { saveResource } from "@/lib/admin/actions";
import { RESOURCE_TYPES, RESOURCE_TYPE_LABELS } from "@/lib/ressources/constants";
import type { Resource, Week } from "@/lib/types/database.types";

interface ResourceFormProps {
  resource?: Resource;
  weeks: Week[];
  onSaved?: () => void;
  onCancel?: () => void;
}

export function ResourceForm({ resource, weeks, onSaved, onCancel }: ResourceFormProps) {
  const [state, formAction] = useActionState(saveResource, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      if (!resource) {
        formRef.current?.reset();
      }
      onSaved?.();
    }
  }, [state, resource, onSaved]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      {resource && <input type="hidden" name="id" value={resource.id} />}

      <Field label="Titre" htmlFor="title">
        <Input id="title" name="title" type="text" defaultValue={resource?.title ?? ""} required />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Type" htmlFor="type">
          <Select id="type" name="type" defaultValue={resource?.type ?? RESOURCE_TYPES[0]}>
            {RESOURCE_TYPES.map((type) => (
              <option key={type} value={type} className="bg-night-900">
                {RESOURCE_TYPE_LABELS[type]}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Durée (facultatif)" htmlFor="duration">
          <Input id="duration" name="duration" type="text" defaultValue={resource?.duration ?? ""} placeholder="10 min" />
        </Field>
      </div>

      <Field label="Description (facultatif)" htmlFor="description">
        <Textarea id="description" name="description" rows={3} defaultValue={resource?.description ?? ""} />
      </Field>

      <Field label="Lien média (facultatif)" htmlFor="mediaUrl">
        <Input id="mediaUrl" name="mediaUrl" type="url" defaultValue={resource?.media_url ?? ""} placeholder="https://..." />
      </Field>

      {weeks.length > 0 && (
        <Field label="Semaine associée (facultatif)" htmlFor="weekId">
          <Select id="weekId" name="weekId" defaultValue={resource?.week_id ?? ""}>
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

      {state?.error && <p className="text-sm text-rr-rouge">{state.error}</p>}
      {state?.success && !resource && <p className="text-sm text-rr-or-clair">Ressource ajoutée.</p>}

      <div className="flex gap-3">
        <SubmitButton className="flex-1">{resource ? "Mettre à jour" : "Ajouter la ressource"}</SubmitButton>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Annuler
          </Button>
        )}
      </div>
    </form>
  );
}

"use client";

import { useActionState, useEffect, useRef } from "react";
import { createHabit } from "@/lib/admin/habit-actions";
import { cn } from "@/lib/utils";

const DAYS = [
  { v: 1, l: "Lun" },
  { v: 2, l: "Mar" },
  { v: 3, l: "Mer" },
  { v: 4, l: "Jeu" },
  { v: 5, l: "Ven" },
  { v: 6, l: "Sam" },
  { v: 7, l: "Dim" },
];

export function AdminHabitCreateForm({ clientId }: { clientId: string }) {
  const [state, formAction, pending] = useActionState(createHabit, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  const field =
    "w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-rr-ivoire placeholder:text-rr-gris focus:border-rr-or/50 focus:outline-none";

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="clientId" value={clientId} />

      <div>
        <label htmlFor="new-habit-titre" className="text-xs text-rr-gris-clair">
          Titre de l&apos;habitude
        </label>
        <input id="new-habit-titre" name="titre" required maxLength={120} placeholder="Ex. Marcher 20 minutes" className={cn(field, "mt-1.5")} />
      </div>

      <div>
        <label htmlFor="new-habit-moment" className="text-xs text-rr-gris-clair">
          Moment de la journée
        </label>
        <select id="new-habit-moment" name="time_of_day" defaultValue="day" className={cn(field, "mt-1.5")}>
          <option value="morning">Matin</option>
          <option value="day">Journée</option>
          <option value="evening">Soir</option>
        </select>
      </div>

      <fieldset>
        <legend className="text-xs text-rr-gris-clair">Jours</legend>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {DAYS.map((d) => (
            <label key={d.v}>
              <input type="checkbox" name="weekdays" value={d.v} defaultChecked className="peer sr-only" />
              <span className="flex h-9 min-w-11 cursor-pointer items-center justify-center rounded-full border border-white/10 px-3 text-xs text-rr-gris transition-colors peer-checked:border-rr-or peer-checked:bg-rr-or/15 peer-checked:text-rr-or peer-focus-visible:ring-2 peer-focus-visible:ring-rr-or/50">
                {d.l}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="new-habit-start" className="text-xs text-rr-gris-clair">
            Début (optionnel)
          </label>
          <input id="new-habit-start" type="date" name="start_date" className={cn(field, "mt-1.5")} />
        </div>
        <div>
          <label htmlFor="new-habit-end" className="text-xs text-rr-gris-clair">
            Fin (optionnel)
          </label>
          <input id="new-habit-end" type="date" name="end_date" className={cn(field, "mt-1.5")} />
        </div>
      </div>

      {state?.error && <p className="text-sm text-rr-rouge">{state.error}</p>}
      {state?.ok && <p className="text-sm text-rr-or-clair">Habitude ajoutée.</p>}

      <button
        type="submit"
        disabled={pending}
        className="h-11 rounded-full border border-rr-or/40 text-sm text-rr-or transition-colors hover:bg-rr-or/10 disabled:opacity-50"
      >
        {pending ? "Ajout…" : "Ajouter l'habitude"}
      </button>
    </form>
  );
}

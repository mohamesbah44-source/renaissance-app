"use client";

import { useActionState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { adminAddHabit, adminSetHabitActive, adminDeleteHabit } from "@/lib/habits/actions";
import { PILIERS } from "@/lib/radar/constants";
import { cn } from "@/lib/utils";
import type { Habit } from "@/lib/types/database.types";

interface AdminHabitsPanelProps {
  clientId: string;
  habits: Habit[];
}

/** Gestion des habitudes d'un client : suggestions auto (Radar) + ajout manuel, depuis l'admin. */
export function AdminHabitsPanel({ clientId, habits }: AdminHabitsPanelProps) {
  const [state, formAction] = useActionState(adminAddHabit, undefined);

  return (
    <div className="flex flex-col gap-4">
      <GlassCard className="p-6">
        <p className="mb-4 text-sm text-rr-gris-clair">Ajouter une habitude pour ce client</p>
        <form action={formAction} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <input type="hidden" name="clientId" value={clientId} />

          <div className="sm:w-56">
            <Field label="Pilier" htmlFor="pilierId">
              <Select id="pilierId" name="pilierId" defaultValue="1" required>
                {PILIERS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nom}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="flex-1">
            <Field label="Habitude" htmlFor="titre">
              <Input id="titre" name="titre" type="text" placeholder="Ex : noter une gratitude chaque soir" required />
            </Field>
          </div>

          <SubmitButton className="sm:w-auto">Ajouter</SubmitButton>
        </form>
        {state?.error && <p className="mt-3 text-sm text-rr-rouge">{state.error}</p>}
      </GlassCard>

      {habits.length === 0 && (
        <GlassCard className="p-6">
          <p className="text-sm text-rr-gris-clair">Ce client ne suit encore aucune habitude.</p>
        </GlassCard>
      )}

      {habits.map((habit) => {
        const pilier = PILIERS.find((p) => p.id === habit.pilier_id);
        return (
          <GlassCard
            key={habit.id}
            className={cn("flex items-center gap-4 p-5", !habit.is_active && "opacity-50")}
          >
            <div className="min-w-0 flex-1">
              <p className="text-[11px] uppercase tracking-[0.2em] text-rr-or/70">
                {pilier?.court} · {habit.source === "auto" ? "Suggérée (Radar)" : "Ajoutée manuellement"}
              </p>
              <p className="mt-1 text-sm text-rr-ivoire/90">{habit.titre}</p>
            </div>

            <form action={adminSetHabitActive}>
              <input type="hidden" name="id" value={habit.id} />
              <input type="hidden" name="clientId" value={clientId} />
              <input type="hidden" name="isActive" value={String(habit.is_active)} />
              <button
                type="submit"
                className="shrink-0 rounded-full border border-white/15 px-3 py-1.5 text-xs text-rr-gris-clair transition-all duration-300 hover:border-rr-or/40 hover:text-rr-ivoire"
              >
                {habit.is_active ? "Désactiver" : "Réactiver"}
              </button>
            </form>

            <form action={adminDeleteHabit}>
              <input type="hidden" name="id" value={habit.id} />
              <input type="hidden" name="clientId" value={clientId} />
              <button
                type="submit"
                className="shrink-0 text-xs text-rr-gris transition-colors duration-300 hover:text-rr-rouge"
              >
                Supprimer
              </button>
            </form>
          </GlassCard>
        );
      })}
    </div>
  );
}

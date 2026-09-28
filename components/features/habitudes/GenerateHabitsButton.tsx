"use client";

import { useActionState } from "react";
import { Sparkles } from "lucide-react";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { generateSuggestedHabits } from "@/lib/habits/actions";

/** Génère des habitudes suggérées à partir des zones prioritaires du dernier bilan Radar du membre. */
export function GenerateHabitsButton() {
  const [state, formAction] = useActionState(generateSuggestedHabits, undefined);

  return (
    <form action={formAction} className="flex flex-col items-center gap-3 text-center">
      <SubmitButton variant="outline">
        <Sparkles className="h-4 w-4" strokeWidth={1.75} />
        Générer depuis mon Radar
      </SubmitButton>

      {state?.error && <p className="text-sm text-rr-gris-clair">{state.error}</p>}
      {state?.success && (
        <p className="text-sm text-rr-or-clair">
          {state.addedCount} habitude{state.addedCount && state.addedCount > 1 ? "s" : ""} ajoutée
          {state.addedCount && state.addedCount > 1 ? "s" : ""} depuis tes zones prioritaires.
        </p>
      )}
    </form>
  );
}

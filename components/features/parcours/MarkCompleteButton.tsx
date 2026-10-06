import { SubmitButton } from "@/components/ui/SubmitButton";
import { markWeekComplete } from "@/lib/parcours/actions";
import type { ProgressStatus } from "@/lib/types/database.types";

interface MarkCompleteButtonProps {
  weekId: string;
  weekNumber: number;
  status: ProgressStatus;
}

export function MarkCompleteButton({ weekId, weekNumber, status }: MarkCompleteButtonProps) {
  if (status === "completed") {
    return (
      <p className="mt-8 text-center text-sm leading-relaxed text-rr-gris-clair">
        Tu as terminé cette semaine. Reviens-y aussi souvent que tu en ressens le besoin.
      </p>
    );
  }

  return (
    <form action={markWeekComplete} className="mt-8">
      <input type="hidden" name="weekId" value={weekId} />
      <input type="hidden" name="weekNumber" value={weekNumber} />
      <SubmitButton size="lg">Marquer cette semaine comme terminée</SubmitButton>
    </form>
  );
}

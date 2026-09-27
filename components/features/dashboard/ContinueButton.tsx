import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { ProgressStatus } from "@/lib/types/database.types";

interface ContinueButtonProps {
  weekId: string;
  status?: ProgressStatus;
}

export function ContinueButton({ weekId, status }: ContinueButtonProps) {
  const label =
    status === "completed"
      ? "Revoir ma semaine"
      : status === "in_progress"
        ? "Continuer mon parcours"
        : "Commencer ma semaine";

  return (
    <Link href={`/parcours/semaine/${weekId}`} className={cn(buttonVariants({ size: "lg" }), "mt-7 w-full")}>
      {label}
    </Link>
  );
}

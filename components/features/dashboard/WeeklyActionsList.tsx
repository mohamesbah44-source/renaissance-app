import Link from "next/link";
import { Check, Circle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { JournalingPrompt, JournalingResponses, UserProgress, Week } from "@/lib/types/database.types";

interface WeeklyActionsListProps {
  week: Week;
  progress: UserProgress | null;
}

export function WeeklyActionsList({ week, progress }: WeeklyActionsListProps) {
  const prompts = (week.journaling_prompts as JournalingPrompt[] | null) ?? [];
  const responses = (progress?.journaling_responses as JournalingResponses | null) ?? {};

  if (prompts.length === 0) {
    return null;
  }

  return (
    <GlassCard className="mt-4 p-6">
      <p className="text-xs uppercase tracking-[0.3em] text-white/40">Actions de la semaine</p>

      <ul className="mt-4 flex flex-col gap-3">
        {prompts.map((prompt) => {
          const done = Boolean(responses[prompt.id]?.trim());

          return (
            <li key={prompt.id}>
              <Link
                href={`/parcours/semaine/${week.id}`}
                className="flex items-start gap-3 text-sm text-white/70 transition-colors hover:text-white"
              >
                {done ? (
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />
                ) : (
                  <Circle className="mt-0.5 h-4 w-4 shrink-0 text-white/25" />
                )}
                <span className={done ? "text-white/40 line-through" : ""}>{prompt.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </GlassCard>
  );
}

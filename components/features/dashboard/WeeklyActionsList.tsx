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
    <GlassCard className="mt-5 p-7">
      <p className="text-xs uppercase tracking-[0.3em] text-white/40">Actions de la semaine</p>

      <ul className="mt-5 flex flex-col gap-4">
        {prompts.map((prompt) => {
          const done = Boolean(responses[prompt.id]?.trim());

          return (
            <li key={prompt.id}>
              <Link
                href={`/parcours/semaine/${week.id}`}
                className="group flex items-start gap-3 rounded-xl px-2 py-1.5 -mx-2 text-sm text-white/70 transition-all duration-300 hover:bg-white/[0.05] hover:text-white"
              >
                {done ? (
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-rr-or-clair" />
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

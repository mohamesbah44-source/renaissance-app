import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import { toggleTodayHabit } from "@/lib/today/actions";
import { cn } from "@/lib/utils";

const PRACTICE_HREF: Record<string, string> = {
  morning_breath: "/pratique/matin",
  evening_breath: "/pratique/soir",
};

interface TodayHabitRowProps {
  id: string;
  titre: string;
  isDone: boolean;
  systemKey?: string | null;
}

export function TodayHabitRow({ id, titre, isDone, systemKey }: TodayHabitRowProps) {
  const href = systemKey ? PRACTICE_HREF[systemKey] : undefined;

  const circle = (
    <span
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
        isDone ? "border-rr-or bg-rr-or text-rr-noir" : "border-white/15 text-transparent"
      )}
    >
      <Check className="h-4 w-4" strokeWidth={2.5} />
    </span>
  );
  const box = cn(
    "flex w-full items-center gap-4 rounded-2xl border px-4 py-3.5 text-left transition-all duration-300",
    isDone ? "border-rr-or/30 bg-rr-or/[0.05]" : "border-white/10 bg-white/[0.02] hover:border-rr-or/30"
  );
  const label = <span className={cn("flex-1 text-[15px] leading-snug", isDone ? "text-rr-gris-clair" : "text-rr-ivoire")}>{titre}</span>;

  if (href) {
    return (
      <Link href={href} className={box}>
        {circle}
        {label}
        <span className="flex items-center gap-1 text-xs text-rr-or">
          {isDone ? "Refaire" : "Commencer"}
          <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
        </span>
      </Link>
    );
  }

  return (
    <form action={toggleTodayHabit}>
      <input type="hidden" name="habitId" value={id} />
      <input type="hidden" name="done" value={isDone ? "1" : "0"} />
      <button type="submit" className={box}>
        {circle}
        {label}
      </button>
    </form>
  );
}

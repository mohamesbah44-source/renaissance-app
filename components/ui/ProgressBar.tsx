import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
}

/** Barre de progression 0-100, dégradé violet -> rose. */
export function ProgressBar({ value, className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-white/10", className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-rr-or to-gold-400 transition-all duration-700"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

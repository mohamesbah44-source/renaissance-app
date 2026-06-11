import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function GlassCard({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-white/[0.04] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl",
        className
      )}
      {...props}
    />
  );
}

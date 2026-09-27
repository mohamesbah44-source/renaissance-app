import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function GlassCard({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-rr-or/[0.14] bg-gradient-to-b from-white/[0.05] to-white/[0.015] shadow-[0_24px_70px_-24px_rgba(0,0,0,0.65),inset_0_1px_0_0_rgba(232,213,163,0.07)] backdrop-blur-xl",
        className
      )}
      {...props}
    />
  );
}

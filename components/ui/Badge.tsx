import { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva("inline-flex items-center rounded-full px-3 py-1 text-xs font-medium", {
  variants: {
    variant: {
      violet: "bg-rr-or/15 text-rr-or-clair",
      rose: "bg-rr-orange/20 text-gold-300",
      gold: "bg-gold-500/15 text-gold-200",
      neutral: "bg-white/[0.06] text-white/60",
    },
  },
  defaultVariants: { variant: "neutral" },
});

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

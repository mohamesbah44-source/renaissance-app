import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * default : carte standard
   * gold    : mise en avant (halo doré), à réserver à l'élément le plus important de l'écran
   * quiet   : discrète, sans bordure, pour les informations secondaires
   */
  variant?: "default" | "gold" | "quiet";
};

const VARIANTS = {
  default:
    "rounded-[28px] border border-rr-or/[0.14] bg-gradient-to-b from-white/[0.05] to-white/[0.015] shadow-[0_24px_70px_-24px_rgba(0,0,0,0.65),inset_0_1px_0_0_rgba(232,213,163,0.07)]",
  gold:
    "rounded-[28px] border border-rr-or/[0.38] bg-gradient-to-b from-rr-or/[0.12] to-rr-or/[0.025] shadow-[0_24px_70px_-24px_rgba(0,0,0,0.65),0_0_44px_-14px_rgba(201,169,110,0.30),inset_0_1px_0_0_rgba(232,213,163,0.14)]",
  quiet: "rounded-[24px] bg-white/[0.03]",
} as const;

export function GlassCard({ className, variant = "default", ...props }: GlassCardProps) {
  return <div className={cn(VARIANTS[variant], className)} {...props} />;
}

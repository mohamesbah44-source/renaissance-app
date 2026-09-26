import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rr-or/60 focus-visible:ring-offset-2 focus-visible:ring-offset-night-950",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-rr-or to-gold-500 text-rr-noir shadow-[0_8px_30px_-8px_rgba(201,169,110,0.55)] hover:brightness-110 hover:shadow-[0_8px_40px_-6px_rgba(232,213,163,0.5)]",
        outline:
          "border border-white/15 bg-white/[0.03] text-white/90 hover:border-white/25 hover:bg-white/[0.08]",
        ghost: "text-white/70 hover:bg-white/[0.06] hover:text-white",
      },
      size: {
        default: "h-12 px-6 text-sm",
        sm: "h-10 px-4 text-sm",
        lg: "h-14 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

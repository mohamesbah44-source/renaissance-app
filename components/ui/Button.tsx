import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rr-or/60 focus-visible:ring-offset-2 focus-visible:ring-offset-night-950",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-rr-or to-gold-500 text-rr-noir shadow-[0_8px_30px_-8px_rgba(201,169,110,0.55)] hover:brightness-110 hover:shadow-[0_10px_44px_-6px_rgba(232,213,163,0.55)] hover:-translate-y-px active:translate-y-0",
        outline:
          "border border-rr-or/25 bg-white/[0.03] text-rr-ivoire/90 hover:border-rr-or/40 hover:bg-rr-or/[0.06]",
        ghost: "text-rr-gris-clair hover:bg-white/[0.06] hover:text-rr-ivoire",
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

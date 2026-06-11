import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/30 outline-none transition-colors duration-200 focus:border-violet-400/50 focus:bg-white/[0.06]",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

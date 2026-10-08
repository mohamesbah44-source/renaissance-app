import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-[15px] text-rr-ivoire placeholder:text-rr-gris outline-none transition-all duration-300 hover:border-white/20 focus:border-rr-or/50 focus:bg-white/[0.05] focus:shadow-[0_0_0_4px_rgba(201,169,110,0.08)]",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

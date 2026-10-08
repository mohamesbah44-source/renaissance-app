import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-[15px] text-rr-ivoire outline-none transition-all duration-300 hover:border-white/20 focus:border-rr-or/50 focus:bg-white/[0.05] focus:shadow-[0_0_0_4px_rgba(201,169,110,0.08)]",
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";

"use client";

import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function SubmitButton({ children, className, ...props }: ButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className={cn("w-full", className)} {...props}>
      {pending ? "Un instant..." : children}
    </Button>
  );
}

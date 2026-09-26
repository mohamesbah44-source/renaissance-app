import { ReactNode } from "react";

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}

export function Field({ label, htmlFor, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-white/70">
        {label}
      </label>
      {children}
      {error && <p className="text-sm text-rr-rouge">{error}</p>}
    </div>
  );
}

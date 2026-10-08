import { ReactNode } from "react";

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}

export function Field({ label, htmlFor, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <label htmlFor={htmlFor} className="text-[11px] uppercase tracking-[0.25em] text-rr-or-clair/80">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-sm text-rr-rouge">
          {error}
        </p>
      )}
    </div>
  );
}

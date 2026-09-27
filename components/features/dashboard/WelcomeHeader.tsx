import { formatDate } from "@/lib/utils";

export function WelcomeHeader({ firstName }: { firstName: string | null }) {
  return (
    <div className="pt-2">
      <p className="text-xs uppercase tracking-[0.3em] text-rr-or-clair/70">{formatDate(new Date())}</p>
      <h1 className="mt-3 font-rr-display text-3xl text-rr-ivoire">
        Bonjour{firstName ? `, ${firstName}` : ""}.
      </h1>
      <p className="mt-2 text-sm text-rr-gris-clair">
        Heureux de te retrouver dans ton espace Renaissance.
      </p>
    </div>
  );
}

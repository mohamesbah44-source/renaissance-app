import { formatDate } from "@/lib/utils";

export function WelcomeHeader({ firstName }: { firstName: string | null }) {
  return (
    <div className="pt-2">
      <p
        className="animate-fade-up text-xs uppercase tracking-[0.3em] text-rr-or-clair/70"
        style={{ animationDelay: "0ms" }}
      >
        {formatDate(new Date())}
      </p>
      <h1
        className="animate-fade-up mt-3 font-rr-display text-3xl text-rr-ivoire"
        style={{ animationDelay: "80ms" }}
      >
        Bonjour{firstName ? `, ${firstName}` : ""}.
      </h1>
      <p
        className="animate-fade-up mt-3 text-sm text-rr-gris-clair"
        style={{ animationDelay: "160ms" }}
      >
        Heureux de te retrouver dans ton espace Renaissance.
      </p>
    </div>
  );
}

import { RespirationSessions } from "@/components/features/respiration/RespirationSessions";

export default function RespirationPage() {
  return (
    <div className="mx-auto max-w-2xl pb-8">
      <header className="pt-1">
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or-clair/70">Retrouver ton calme</p>
        <h1 className="mt-2 font-rr-display text-4xl text-rr-ivoire">Respiration</h1>
        <p className="mt-4 text-sm leading-relaxed text-rr-gris-clair">
          Des sessions guidées pour redescendre, respirer et revenir à toi. Quelques minutes suffisent.
        </p>
      </header>
      <RespirationSessions />
    </div>
  );
}

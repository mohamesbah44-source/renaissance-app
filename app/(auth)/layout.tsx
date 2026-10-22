import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center overflow-hidden px-6 pb-10 pt-14 sm:pt-20">
      <Link
        href="/"
        aria-label="Le Programme Re-Naissance™, retour à l'accueil"
        className="relative flex flex-col items-center"
      >
        <span
          aria-hidden
          className="animate-breathe block h-[100px] w-[100px] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, #ddd6fe 0%, #a78bfa 24%, #7c3aed 54%, #4c1d95 84%, #2e1065 100%)",
            boxShadow: "0 0 70px 10px rgba(139,92,246,0.5), inset 0 0 26px rgba(255,255,255,0.14)",
          }}
        />
        <span className="mt-9 text-[10px] uppercase tracking-[0.34em] text-rr-or font-rr-label">Le Programme</span>
        <span className="mt-2 font-rr-label text-2xl uppercase tracking-[0.14em] text-rr-or">
          Re-Naissance<sup className="text-[10px]">™</sup>
        </span>
      </Link>

      <div className="relative mt-10 w-full max-w-sm flex-1">{children}</div>

      <p className="relative mt-10 text-center font-rr-serif text-[17px] italic text-rr-gris-clair">
        Un accompagnement sur invitation.
      </p>
    </div>
  );
}

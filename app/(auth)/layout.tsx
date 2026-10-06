import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-10 sm:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-rr-or/[0.08] blur-[100px]"
      />

      <Link href="/" aria-label="Le Programme Re-Naissance™, retour à l'accueil" className="relative mb-8 sm:mb-10">
        <span
          aria-hidden
          className="animate-breathe absolute inset-0 -z-10 rounded-full bg-rr-or/15 blur-2xl"
        />
        <Image
          src="/logo-icon.png"
          alt=""
          width={72}
          height={72}
          className="rounded-full ring-1 ring-rr-or/30"
          priority
        />
      </Link>

      <div className="relative w-full max-w-sm">{children}</div>
    </div>
  );
}

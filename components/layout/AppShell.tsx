import Link from "next/link";
import Image from "next/image";
import { LifeBuoy, MessageCircle } from "lucide-react";
import { BottomNav } from "@/components/layout/BottomNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="relative z-10 flex min-h-dvh flex-col">
        {/* Voile sous l'heure du téléphone : le contenu ne passe plus dessous */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 top-0 z-20 h-[env(safe-area-inset-top)] bg-rr-noir/80 backdrop-blur-md"
        />

        <header className="flex items-center justify-between px-5 py-4">
          <Link href="/dashboard" className="group flex items-center gap-3" aria-label="Le Programme Re-Naissance">
            <Image
              src="/logo-icon.png"
              alt=""
              width={32}
              height={32}
              className="rounded-full ring-1 ring-rr-or/20 transition-all duration-300 group-hover:ring-rr-or/50"
              priority
            />
            <span className="flex flex-col leading-none">
              <span className="text-[8.5px] uppercase tracking-[0.34em] text-rr-or-clair/70">Le Programme</span>
              <span className="mt-1.5 font-rr-display text-[14px] uppercase tracking-[0.14em] text-rr-or">
                Re-Naissance
                <sup className="ml-0.5 text-[8px]">™</sup>
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-1">
            <Link
              href="/sos"
              aria-label="Protocole SOS Re-Naissance™"
              className="flex h-10 w-10 items-center justify-center rounded-full text-rr-orange/70 transition-all duration-300 hover:bg-rr-orange/[0.08] hover:text-rr-orange"
            >
              <LifeBuoy className="h-5 w-5" strokeWidth={1.75} />
            </Link>
            <Link
              href="/messages"
              aria-label="Messages"
              className="flex h-10 w-10 items-center justify-center rounded-full text-rr-gris transition-all duration-300 hover:bg-white/[0.06] hover:text-rr-ivoire"
            >
              <MessageCircle className="h-5 w-5" strokeWidth={1.75} />
            </Link>
          </div>
        </header>

        <main className="flex-1 px-5 pb-36 pt-2">{children}</main>

        <BottomNav />
      </div>
    </div>
  );
}

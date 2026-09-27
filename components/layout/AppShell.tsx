import Link from "next/link";
import Image from "next/image";
import { LifeBuoy, LogOut, MessageCircle } from "lucide-react";
import { BottomNav } from "@/components/layout/BottomNav";
import { signOut } from "@/lib/auth/actions";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between px-6 py-6">
        <Link href="/dashboard" className="group flex items-center gap-3">
          <Image
            src="/logo-icon.png"
            alt=""
            width={30}
            height={30}
            className="rounded-full ring-1 ring-rr-or/20 transition-all duration-300 group-hover:ring-rr-or/50"
            priority
          />
          <span className="font-rr-display text-[13px] uppercase tracking-[0.14em] text-rr-ivoire">
            Le Programme <span className="text-rr-or">Re-Naissance</span>
            <sup className="ml-0.5 text-[8px]">™</sup>
          </span>
        </Link>
        <div className="flex items-center gap-2">
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
          <form action={signOut}>
            <button
              type="submit"
              aria-label="Se déconnecter"
              className="flex h-10 w-10 items-center justify-center rounded-full text-rr-gris transition-all duration-300 hover:bg-white/[0.06] hover:text-rr-ivoire"
            >
              <LogOut className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </form>
        </div>
      </header>

      <main className="flex-1 px-6 pb-32 pt-2">{children}</main>

      <BottomNav />
    </div>
  );
}

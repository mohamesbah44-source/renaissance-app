import Link from "next/link";
import Image from "next/image";
import { LifeBuoy, LogOut, MessageCircle } from "lucide-react";
import { BottomNav } from "@/components/layout/BottomNav";
import { signOut } from "@/lib/auth/actions";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between px-6 py-5">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <Image src="/logo-icon.png" alt="" width={28} height={28} className="rounded-full" priority />
          <span className="font-rr-display text-[13px] uppercase tracking-[0.14em] text-rr-ivoire">
            Le Programme <span className="text-rr-or">Re-Naissance</span>
            <sup className="ml-0.5 text-[8px]">™</sup>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/sos"
            aria-label="Protocole SOS Re-Naissance™"
            className="text-rr-orange/70 transition-colors hover:text-rr-orange"
          >
            <LifeBuoy className="h-5 w-5" strokeWidth={1.75} />
          </Link>
          <Link
            href="/messages"
            aria-label="Messages"
            className="text-white/40 transition-colors hover:text-white/80"
          >
            <MessageCircle className="h-5 w-5" strokeWidth={1.75} />
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              aria-label="Se déconnecter"
              className="text-white/40 transition-colors hover:text-white/80"
            >
              <LogOut className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </form>
        </div>
      </header>

      <main className="flex-1 px-6 pb-28">{children}</main>

      <BottomNav />
    </div>
  );
}

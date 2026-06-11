import Link from "next/link";
import { LogOut, MessageCircle } from "lucide-react";
import { BottomNav } from "@/components/layout/BottomNav";
import { signOut } from "@/lib/auth/actions";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between px-6 py-5">
        <span className="font-display text-lg italic tracking-wide text-white/90">Renaissance</span>
        <div className="flex items-center gap-4">
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

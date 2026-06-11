import Link from "next/link";
import { LogOut } from "lucide-react";
import { AdminNav } from "@/components/layout/AdminNav";
import { signOut } from "@/lib/auth/actions";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-6xl flex-col md:flex-row">
      <aside className="shrink-0 border-b border-white/10 px-6 py-5 md:w-64 md:border-b-0 md:border-r md:border-white/10 md:px-4 md:py-8">
        <div className="flex items-center justify-between md:block">
          <div>
            <Link href="/dashboard" className="font-display text-lg italic tracking-wide text-white/90">
              Renaissance
            </Link>
            <p className="mt-1 text-xs uppercase tracking-[0.3em] text-white/40">Admin</p>
          </div>

          <form action={signOut} className="md:hidden">
            <button
              type="submit"
              aria-label="Se déconnecter"
              className="text-white/40 transition-colors hover:text-white/80"
            >
              <LogOut className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </form>
        </div>

        <div className="mt-4 md:mt-8">
          <AdminNav />
        </div>

        <form action={signOut} className="mt-8 hidden md:block">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white/80"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.75} />
            Se déconnecter
          </button>
        </form>
      </aside>

      <main className="flex-1 px-6 py-8">{children}</main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, BookOpen, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Accueil", icon: Home },
  { href: "/parcours", label: "Parcours", icon: Compass },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/ressources", label: "Ressources", icon: Sparkles },
  { href: "/profil", label: "Profil", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-rr-or/[0.12] bg-rr-noir/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
      <ul className="mx-auto flex max-w-2xl items-stretch justify-between px-2 py-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group flex flex-col items-center gap-1.5 px-2 py-2.5 text-[11px] tracking-[0.02em] transition-colors duration-300",
                  isActive ? "text-rr-or" : "text-rr-gris hover:text-rr-gris-clair"
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300",
                    isActive
                      ? "bg-rr-or/[0.16] shadow-[inset_0_0_0_1px_rgba(201,169,110,0.35),0_0_18px_-4px_rgba(201,169,110,0.5)]"
                      : "group-hover:bg-white/[0.05]"
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={isActive ? 2 : 1.6} />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

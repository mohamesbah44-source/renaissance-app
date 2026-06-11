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
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-night-950/80 backdrop-blur-xl">
      <ul className="mx-auto flex max-w-2xl items-stretch justify-between px-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 px-2 py-3 text-[11px] transition-colors",
                  isActive ? "text-white" : "text-white/40 hover:text-white/70"
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={isActive ? 2.25 : 1.75} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

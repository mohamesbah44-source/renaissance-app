"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Compass, Sparkles, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/admin/clients", label: "Participant·e·s", icon: Users },
  { href: "/admin/semaines", label: "Semaines", icon: Compass },
  { href: "/admin/ressources", label: "Ressources", icon: Sparkles },
  { href: "/admin/offre", label: "Offre de suite", icon: Gift },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1.5 overflow-x-auto md:flex-col md:overflow-visible">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-300",
              isActive
                ? "bg-rr-or/[0.1] text-rr-ivoire shadow-[inset_0_0_0_1px_rgba(201,169,110,0.22)]"
                : "text-rr-gris hover:bg-white/[0.04] hover:text-rr-gris-clair"
            )}
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

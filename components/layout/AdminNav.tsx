"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Compass, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/admin/clients", label: "Participant·e·s", icon: Users },
  { href: "/admin/semaines", label: "Semaines", icon: Compass },
  { href: "/admin/ressources", label: "Ressources", icon: Sparkles },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors",
              isActive ? "bg-white/[0.06] text-white" : "text-white/50 hover:bg-white/[0.04] hover:text-white/80"
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

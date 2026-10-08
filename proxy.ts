import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];

const PROTECTED_PREFIXES = [
  "/aujourdhui",
  "/bilan",
  "/progression",
  "/rappels",
  "/revenir-a-moi",
  "/pratique",
  "/habitudes",
  "/dashboard",
  "/parcours",
  "/radar",
  "/journal",
  "/ressources",
  "/calendrier",
  "/messages",
  "/profil",
  "/reset-password",
  "/admin",
];

/**
 * Rafraîchit la session Supabase et protège les routes privées.
 * Le contrôle du rôle admin se fait dans app/admin/layout.tsx.
 */
export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};

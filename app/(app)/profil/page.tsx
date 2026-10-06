import Link from "next/link";
import { ChevronDown, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/queries";
import { signOut } from "@/lib/auth/actions";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProfileInfoForm } from "@/components/features/profil/ProfileInfoForm";
import { PasswordForm } from "@/components/features/profil/PasswordForm";
import { formatDate } from "@/lib/utils";

export default async function ProfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const profile = await getProfile(supabase, user.id);

  if (!profile) {
    return null;
  }

  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(" ") || "Toi";
  const initials = ((profile.first_name?.[0] ?? "") + (profile.last_name?.[0] ?? "")).toUpperCase() || "R";

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 pb-8">
      <header className="flex items-center gap-4 pt-1">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-rr-or/[0.14] font-rr-display text-xl text-rr-or-clair ring-1 ring-rr-or/30">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">Profil</p>
          <h1 className="mt-1 truncate font-rr-display text-2xl text-rr-ivoire">{fullName}</h1>
          <p className="truncate text-sm text-rr-gris">{profile.email}</p>
        </div>
      </header>

      <GlassCard className="mt-4 p-6">
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-gris">Ton parcours</p>
        <p className="mt-3 font-rr-display text-lg text-rr-ivoire">Semaine {profile.current_week} sur 8</p>
        {profile.program_start_date && (
          <p className="mt-1 text-sm text-rr-gris-clair">Démarré le {formatDate(profile.program_start_date)}</p>
        )}
      </GlassCard>

      <details className="group rounded-[28px] border border-rr-or/[0.14] bg-white/[0.03]">
        <summary className="flex cursor-pointer list-none items-center justify-between p-6 [&::-webkit-details-marker]:hidden">
          <span className="text-sm text-rr-ivoire">Mes informations</span>
          <ChevronDown
            className="h-4 w-4 text-rr-gris transition-transform duration-300 group-open:rotate-180"
            strokeWidth={1.75}
          />
        </summary>
        <div className="px-6 pb-6">
          <ProfileInfoForm profile={profile} />
        </div>
      </details>

      <details className="group rounded-[28px] border border-rr-or/[0.14] bg-white/[0.03]">
        <summary className="flex cursor-pointer list-none items-center justify-between p-6 [&::-webkit-details-marker]:hidden">
          <span className="text-sm text-rr-ivoire">Mot de passe</span>
          <ChevronDown
            className="h-4 w-4 text-rr-gris transition-transform duration-300 group-open:rotate-180"
            strokeWidth={1.75}
          />
        </summary>
        <div className="px-6 pb-6">
          <PasswordForm />
        </div>
      </details>

      {profile.role === "admin" && (
        <Link href="/admin" className="group block">
          <GlassCard className="flex items-center justify-between gap-3 p-6 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-rr-or/30">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rr-or/[0.12] transition-all duration-300 group-hover:bg-rr-or/[0.2]">
                <Shield className="h-5 w-5 text-rr-or-clair" strokeWidth={1.75} />
              </span>
              <p className="text-sm text-rr-ivoire">Espace admin</p>
            </div>
            <span className="text-xs text-rr-gris transition-all duration-300 group-hover:text-rr-or-clair">→</span>
          </GlassCard>
        </Link>
      )}

      <details className="group mt-6 text-center">
        <summary className="inline-flex cursor-pointer list-none items-center py-2 text-sm text-rr-gris transition-colors duration-300 hover:text-rr-ivoire [&::-webkit-details-marker]:hidden">
          Se déconnecter
        </summary>
        <form action={signOut} className="mt-3 flex flex-col items-center gap-4">
          <p className="text-sm text-rr-gris-clair">Te déconnecter de ton espace ?</p>
          <button
            type="submit"
            className="h-11 rounded-full border border-rr-or/30 px-8 text-xs uppercase tracking-[0.25em] text-rr-or-clair transition-all duration-300 hover:bg-white/[0.05]"
          >
            Confirmer
          </button>
        </form>
      </details>
    </div>
  );
}

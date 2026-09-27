import Link from "next/link";
import { Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/queries";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
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
    <div className="mx-auto flex max-w-2xl flex-col gap-8 pb-8">
      <header className="flex items-center gap-4 pt-2">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-500/30 to-gold-400/20 font-rr-display text-xl text-rr-ivoire">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">Profil</p>
          <h1 className="mt-1 truncate font-rr-display text-2xl text-rr-ivoire">{fullName}</h1>
          <p className="truncate text-sm text-rr-gris">{profile.email}</p>
        </div>
      </header>

      <GlassCard className="p-7">
        <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">Ton parcours</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Badge variant="violet">Semaine {profile.current_week} / 8</Badge>
          {profile.program_start_date && (
            <span className="text-sm text-rr-gris">Démarré le {formatDate(profile.program_start_date)}</span>
          )}
        </div>
      </GlassCard>

      <GlassCard className="p-7">
        <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">Informations</p>
        <div className="mt-5">
          <ProfileInfoForm profile={profile} />
        </div>
      </GlassCard>

      <GlassCard className="p-7">
        <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">Sécurité</p>
        <div className="mt-5">
          <PasswordForm />
        </div>
      </GlassCard>

      {profile.role === "admin" && (
        <Link href="/admin" className="group block">
          <GlassCard className="flex items-center justify-between gap-3 p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-rr-or/30 hover:bg-white/[0.06]">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rr-or/[0.1] transition-all duration-300 group-hover:bg-rr-or/[0.18]">
                <Shield className="h-5 w-5 text-rr-or-clair" strokeWidth={1.75} />
              </span>
              <p className="text-sm text-rr-ivoire">Espace admin</p>
            </div>
            <span className="text-xs text-rr-gris transition-all duration-300 group-hover:text-rr-or-clair">→</span>
          </GlassCard>
        </Link>
      )}
    </div>
  );
}

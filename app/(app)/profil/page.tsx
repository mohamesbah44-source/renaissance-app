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
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/30 to-rose-400/20 font-display text-xl text-white">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Profil</p>
          <h1 className="mt-1 truncate font-display text-2xl text-white">{fullName}</h1>
          <p className="truncate text-sm text-white/50">{profile.email}</p>
        </div>
      </header>

      <GlassCard className="p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Ton parcours</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Badge variant="violet">Semaine {profile.current_week} / 8</Badge>
          {profile.program_start_date && (
            <span className="text-sm text-white/50">Démarré le {formatDate(profile.program_start_date)}</span>
          )}
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Informations</p>
        <div className="mt-4">
          <ProfileInfoForm profile={profile} />
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Sécurité</p>
        <div className="mt-4">
          <PasswordForm />
        </div>
      </GlassCard>

      {profile.role === "admin" && (
        <Link href="/admin">
          <GlassCard className="flex items-center justify-between gap-3 p-6 transition-colors hover:bg-white/[0.06]">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-violet-300" strokeWidth={1.75} />
              <p className="text-sm text-white/80">Espace admin</p>
            </div>
            <span className="text-xs text-white/40">→</span>
          </GlassCard>
        </Link>
      )}
    </div>
  );
}

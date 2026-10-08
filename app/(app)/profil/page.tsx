import Link from "next/link";
import { ChevronDown, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/queries";
import { signOut } from "@/lib/auth/actions";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProfileInfoForm } from "@/components/features/profil/ProfileInfoForm";
import { PasswordForm } from "@/components/features/profil/PasswordForm";
import { programWeek } from "@/lib/radar/express";
import { todayISODate } from "@/lib/habits/streak";
import { formatDate } from "@/lib/utils";

function WeekRing({ week }: { week: number }) {
  const r = 28;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, week / 8);
  return (
    <div className="relative h-[76px] w-[76px] shrink-0" role="img" aria-label={`Semaine ${week} sur 8`}>
      <svg viewBox="0 0 72 72" className="h-full w-full -rotate-90">
        <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke="#c9a96e"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ filter: "drop-shadow(0 0 6px rgba(201,169,110,0.55))" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-rr-display text-xl text-rr-ivoire">
        {week}
        <span className="text-xs text-rr-gris">/8</span>
      </div>
    </div>
  );
}

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
  const week = programWeek(profile.program_start_date, todayISODate(), profile.current_week ?? 1);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5 pb-8">
      <header className="flex items-center gap-5 pt-2">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-rr-or/[0.12] font-rr-display text-2xl text-rr-or-clair shadow-[0_0_30px_-6px_rgba(201,169,110,0.5)] ring-1 ring-rr-or/40">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or-clair/70">Profil</p>
          <h1 className="mt-2 truncate font-rr-display text-3xl leading-tight text-rr-ivoire">{fullName}</h1>
          <p className="mt-1 truncate text-sm text-rr-gris">{profile.email}</p>
        </div>
      </header>

      <GlassCard variant="gold" className="mt-6 p-7">
        <div className="flex items-center justify-between gap-5">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or-clair/80">Ton parcours</p>
            <p className="mt-3 font-rr-serif text-2xl italic leading-tight text-rr-ivoire">
              Semaine {week} sur 8
            </p>
            {profile.program_start_date && (
              <p className="mt-3 text-sm text-rr-gris-clair">
                Démarré le {formatDate(profile.program_start_date)}
              </p>
            )}
          </div>
          <WeekRing week={week} />
        </div>
      </GlassCard>

      <details className="group rounded-[28px] border border-rr-or/[0.14] bg-white/[0.03] transition-colors duration-300 open:border-rr-or/25 open:bg-white/[0.04]">
        <summary className="flex cursor-pointer list-none items-center justify-between p-6 [&::-webkit-details-marker]:hidden">
          <span className="text-[11px] uppercase tracking-[0.3em] text-rr-or-clair/80">Mes informations</span>
          <ChevronDown
            className="h-4 w-4 text-rr-gris transition-transform duration-300 group-open:rotate-180"
            strokeWidth={1.75}
          />
        </summary>
        <div className="px-6 pb-7">
          <ProfileInfoForm profile={profile} />
        </div>
      </details>

      <details className="group rounded-[28px] border border-rr-or/[0.14] bg-white/[0.03] transition-colors duration-300 open:border-rr-or/25 open:bg-white/[0.04]">
        <summary className="flex cursor-pointer list-none items-center justify-between p-6 [&::-webkit-details-marker]:hidden">
          <span className="text-[11px] uppercase tracking-[0.3em] text-rr-or-clair/80">Mot de passe</span>
          <ChevronDown
            className="h-4 w-4 text-rr-gris transition-transform duration-300 group-open:rotate-180"
            strokeWidth={1.75}
          />
        </summary>
        <div className="px-6 pb-7">
          <PasswordForm />
        </div>
      </details>

      {profile.role === "admin" && (
        <Link href="/admin" className="group block">
          <GlassCard className="flex items-center justify-between gap-3 p-6 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-rr-or/30">
            <div className="flex items-center gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-rr-or/25 bg-rr-or/[0.08] transition-all duration-300 group-hover:bg-rr-or/[0.18]">
                <Shield className="h-5 w-5 text-rr-or-clair" strokeWidth={1.5} />
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

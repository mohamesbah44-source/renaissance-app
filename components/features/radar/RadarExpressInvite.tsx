import Link from "next/link";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { programWeek } from "@/lib/radar/express";
import { todayISODate } from "@/lib/habits/streak";

export async function RadarExpressInvite() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("program_start_date, current_week")
    .eq("id", user.id)
    .single();
  if (!profile?.program_start_date) return null;

  const today = todayISODate();
  const start = new Date(`${String(profile.program_start_date).slice(0, 10)}T12:00:00`);
  const now = new Date(`${today}T12:00:00`);
  const diff = Math.max(0, Math.round((now.getTime() - start.getTime()) / 86400000));

  // Jours 6 et 7 de la semaine du programme
  if (diff % 7 < 5) return null;

  const weekNumber = programWeek(profile.program_start_date, today, profile.current_week ?? 1);

  const db = supabase as unknown as SupabaseClient;
  const { data: done } = await db
    .from("radar_express")
    .select("id")
    .eq("user_id", user.id)
    .eq("week_number", weekNumber)
    .maybeSingle();
  if (done) return null;

  return (
    <GlassCard variant="gold" className="p-6">
      <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">Fin de semaine {weekNumber}</p>
      <p className="mt-3 font-rr-serif text-xl italic leading-snug text-rr-ivoire">
        Ton Radar de la semaine t&apos;attend.
      </p>
      <p className="mt-2 text-sm leading-relaxed text-rr-gris-clair">
        1 minute pour sentir où tu en es, et voir ce qui a bougé depuis la semaine dernière.
      </p>
      <Link
        href="/bilan#radar"
        className="mt-5 flex h-12 items-center justify-center rounded-full border border-rr-or/40 text-sm text-rr-or transition-colors hover:bg-rr-or/10"
      >
        Faire mon Radar
      </Link>
    </GlassCard>
  );
}

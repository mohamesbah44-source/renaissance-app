import Link from "next/link";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { ReminderSwitch } from "@/components/features/reminders/ReminderSwitch";
import { ReminderTimesForm } from "@/components/features/reminders/ReminderTimesForm";

type Settings = {
  morning_enabled: boolean;
  morning_time: string;
  evening_enabled: boolean;
  evening_time: string;
};

const DEFAULTS: Settings = {
  morning_enabled: true,
  morning_time: "08:00",
  evening_enabled: true,
  evening_time: "20:30",
};

export default async function RappelsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const db = supabase as unknown as SupabaseClient;
  const { data } = await db
    .from("reminder_settings")
    .select("morning_enabled, morning_time, evening_enabled, evening_time")
    .eq("user_id", user.id)
    .maybeSingle();

  const s: Settings = data
    ? {
        morning_enabled: data.morning_enabled,
        morning_time: String(data.morning_time).slice(0, 5),
        evening_enabled: data.evening_enabled,
        evening_time: String(data.evening_time).slice(0, 5),
      }
    : DEFAULTS;

  return (
    <div className="mx-auto max-w-2xl pb-8">
      <header className="pt-1">
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or-clair/70">En douceur</p>
        <h1 className="mt-3 font-rr-display text-4xl leading-tight text-rr-ivoire">Mes rappels</h1>
        <p className="mt-3 text-sm leading-relaxed text-rr-gris-clair">
          Deux petits rappels par jour, jamais plus. Pas de pression : juste une invitation à revenir à toi.
        </p>
      </header>

      <section className="mt-10">
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">Cet appareil</p>
        <GlassCard className="mt-4 p-5">
          <ReminderSwitch />
        </GlassCard>
      </section>

      <section className="mt-10">
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">Mes horaires</p>
        <GlassCard className="mt-4 p-5">
          <ReminderTimesForm
            morningEnabled={s.morning_enabled}
            morningTime={s.morning_time}
            eveningEnabled={s.evening_enabled}
            eveningTime={s.evening_time}
          />
        </GlassCard>
      </section>

      <Link
        href="/aujourdhui"
        className="mt-10 flex items-center justify-center rounded-full border border-white/10 px-5 py-3.5 text-sm text-rr-gris-clair transition-colors hover:bg-white/[0.05]"
      >
        Retour à aujourd&apos;hui
      </Link>
    </div>
  );
}

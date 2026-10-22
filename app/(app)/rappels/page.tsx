import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
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
    <div className="rr-enter mx-auto max-w-2xl pb-8">
      <Link
        href="/profil"
        aria-label="Retour au profil"
        className="-ml-3 flex h-11 w-11 items-center justify-center rounded-full text-rr-gris-clair transition-colors hover:text-rr-ivoire"
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={1.6} />
      </Link>

      <header className="mt-3">
        <p className="text-[10px] uppercase tracking-[0.3em] text-rr-or">En douceur</p>
        <h1 className="mt-4 font-rr-display text-rr-ivoire">Mes rappels.</h1>
        <p className="mt-4 text-sm leading-relaxed text-rr-gris-clair">
          Deux petits rappels par jour, jamais plus. Pas de pression.
        </p>
      </header>

      <section className="mt-12">
        <p className="text-[11px] uppercase tracking-[0.28em] text-rr-gris-clair">Cet appareil</p>
        <div className="mt-4 rounded-3xl border border-rr-or/20 bg-white/[0.05] p-5">
          <ReminderSwitch />
        </div>
      </section>

      <section className="mt-10">
        <p className="text-[11px] uppercase tracking-[0.28em] text-rr-gris-clair">Mes horaires</p>
        <div className="mt-4">
          <ReminderTimesForm
            morningEnabled={s.morning_enabled}
            morningTime={s.morning_time}
            eveningEnabled={s.evening_enabled}
            eveningTime={s.evening_time}
          />
        </div>
      </section>
    </div>
  );
}

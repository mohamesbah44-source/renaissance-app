import Link from "next/link";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { ReminderSwitch } from "@/components/features/reminders/ReminderSwitch";
import { saveReminderSettings } from "@/lib/reminders/actions";

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

  const timeInput =
    "h-11 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm text-rr-ivoire focus:border-rr-or/50 focus:outline-none";

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
          <form action={saveReminderSettings} className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <label className="flex items-center gap-3 text-sm text-rr-ivoire">
                <input type="checkbox" name="morning_enabled" defaultChecked={s.morning_enabled} className="h-4 w-4 accent-[#c9a961]" />
                Le matin
              </label>
              <input type="time" name="morning_time" defaultValue={s.morning_time} required className={timeInput} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <label className="flex items-center gap-3 text-sm text-rr-ivoire">
                <input type="checkbox" name="evening_enabled" defaultChecked={s.evening_enabled} className="h-4 w-4 accent-[#c9a961]" />
                Le soir
              </label>
              <input type="time" name="evening_time" defaultValue={s.evening_time} required className={timeInput} />
            </div>
            <p className="text-xs text-rr-gris">
              Le rappel du matin ne part pas si ton check-in est déjà fait. Celui du soir ne part pas si ta journée est déjà terminée.
              Heure de Paris.
            </p>
            <button
              type="submit"
              className="h-12 rounded-full border border-rr-or/40 text-sm text-rr-or transition-colors hover:bg-rr-or/10"
            >
              Enregistrer mes horaires
            </button>
          </form>
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

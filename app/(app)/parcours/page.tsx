import Link from "next/link";
import { redirect } from "next/navigation";
import { LifeBuoy, Check, Moon, CalendarCheck, TrendingUp, Bell } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { TodayHabitRow } from "@/components/features/today/TodayHabitRow";
import { todayISODate } from "@/lib/habits/streak";
import { formatDate, cn } from "@/lib/utils";
import { toggleMission, saveCheckin, saveJournalAnswer, closeDay } from "@/lib/today/actions";

const FALLBACK_QUESTION = "Qu'est-ce qui, aujourd'hui, a mérité ton attention ?";

function pickQuestion(prompts: unknown, dayNumber: number): string {
  if (!Array.isArray(prompts) || prompts.length === 0) return FALLBACK_QUESTION;
  const item = prompts[(dayNumber - 1) % prompts.length];
  if (typeof item === "string") return item;
  if (item && typeof item === "object") {
    const o = item as Record<string, unknown>;
    const v = o.question ?? o.text ?? o.prompt;
    if (typeof v === "string") return v;
  }
  return FALLBACK_QUESTION;
}

function greeting(): string {
  const hour = Number(
    new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", hourCycle: "h23", timeZone: "Europe/Paris" }).format(new Date())
  );
  if (hour < 5) return "Bonne nuit";
  if (hour < 12) return "Bonjour";
  if (hour < 18) return "Bon après-midi";
  return "Bonsoir";
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-6 bg-rr-or/50" />
      <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">{children}</p>
    </div>
  );
}

function ProgressRing({ done, total }: { done: number; total: number }) {
  const r = 28;
  const c = 2 * Math.PI * r;
  const pct = total > 0 ? Math.min(1, done / total) : 0;
  return (
    <div className="relative h-[76px] w-[76px] shrink-0" role="img" aria-label={`${done} étapes sur ${total}`}>
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
          style={{ filter: "drop-shadow(0 0 6px rgba(201,169,110,0.55))", transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-rr-display text-xl text-rr-ivoire">
        {done}
        <span className="text-xs text-rr-gris">/{total}</span>
      </div>
    </div>
  );
}

function ScaleInput({ name, label, low, high }: { name: string; label: string; low: string; high: string }) {
  return (
    <fieldset>
      <legend className="text-sm text-rr-ivoire">{label}</legend>
      <div className="mt-3 flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="flex-1">
            <input type="radio" name={name} value={n} required className="peer sr-only" />
            <span className="flex h-11 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] text-sm text-rr-gris-clair transition-all duration-300 peer-checked:border-rr-or peer-checked:bg-rr-or/15 peer-checked:text-rr-or peer-focus-visible:ring-2 peer-focus-visible:ring-rr-or/50">
              {n}
            </span>
          </label>
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] text-rr-gris">
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </fieldset>
  );
}

function QuietTile({
  href,
  icon: Icon,
  label,
  ariaLabel,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  ariaLabel?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel ?? label}
      className="flex flex-col items-center gap-2 rounded-2xl bg-white/[0.03] px-2 py-4 text-rr-gris-clair transition-all duration-300 hover:bg-white/[0.06] hover:text-rr-ivoire active:scale-[0.97]"
    >
      <Icon className="h-5 w-5 text-rr-or/80" strokeWidth={1.5} />
      <span className="text-[11px] tracking-wide">{label}</span>
    </Link>
  );
}

export default async function AujourdhuiPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const today = todayISODate();
  const todayDate = new Date(`${today}T12:00:00`);
  const jsDay = todayDate.getDay();
  const isoWeekday = jsDay === 0 ? 7 : jsDay;

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, program_start_date, current_week")
    .eq("id", user.id)
    .single();

  // Client non typé : les tables du Lot 1 ne sont pas encore dans les types générés.
  const db = supabase as unknown as SupabaseClient;

  let weekNumber = profile?.current_week ?? 1;
  let dayNumber = 1;
  if (profile?.program_start_date) {
    const start = new Date(`${String(profile.program_start_date).slice(0, 10)}T12:00:00`);
    const diff = Math.max(0, Math.round((todayDate.getTime() - start.getTime()) / 86400000));
    weekNumber = Math.min(8, Math.floor(diff / 7) + 1);
    dayNumber = (diff % 7) + 1;
  }

  const { data: week } = await supabase
    .from("weeks")
    .select("id, title, journaling_prompts")
    .eq("week_number", weekNumber)
    .maybeSingle();

  const [{ data: programDay }, { data: habits }, { data: logs }, { data: progress }, { data: checkin }] =
    await Promise.all([
      week
        ? db
            .from("program_days")
            .select("id, journaling_question, mission")
            .eq("week_id", week.id)
            .eq("day_number", dayNumber)
            .maybeSingle()
        : Promise.resolve({ data: null }),
      db
        .from("habits")
        .select("id, titre, time_of_day, weekdays, start_date, end_date, system_key")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("created_at", { ascending: true }),
      db.from("habit_logs").select("habit_id").eq("user_id", user.id).eq("log_date", today),
      db.from("daily_progress").select("*").eq("user_id", user.id).eq("log_date", today).maybeSingle(),
      db
        .from("daily_checkins")
        .select("energy, tension")
        .eq("user_id", user.id)
        .eq("checkin_date", today)
        .maybeSingle(),
    ]);

  const { data: override } = programDay
    ? await db
        .from("client_day_overrides")
        .select("journaling_question, mission")
        .eq("user_id", user.id)
        .eq("day_id", programDay.id)
        .maybeSingle()
    : { data: null };

  const mission: string | null = override?.mission ?? programDay?.mission ?? null;
  const question: string =
    override?.journaling_question ?? programDay?.journaling_question ?? pickQuestion(week?.journaling_prompts, dayNumber);

  const doneIds = new Set<string>((logs ?? []).map((l: { habit_id: string }) => l.habit_id));
  type TodayHabit = {
    id: string;
    titre: string;
    time_of_day: string;
    weekdays: number[] | null;
    start_date: string | null;
    end_date: string | null;
    system_key: string | null;
  };
  const todaysHabits: TodayHabit[] = ((habits ?? []) as TodayHabit[]).filter((h) => {
    if (h.start_date && h.start_date > today) return false;
    if (h.end_date && h.end_date < today) return false;
    const days = h.weekdays ?? [1, 2, 3, 4, 5, 6, 7];
    return days.includes(isoWeekday);
  });

  const morning = todaysHabits.filter((h) => h.time_of_day === "morning");
  const daytime = todaysHabits.filter((h) => h.time_of_day === "day");
  const evening = todaysHabits.filter((h) => h.time_of_day === "evening");

  const missionDone: boolean = progress?.mission_done ?? false;
  const journalingDone: boolean = progress?.journaling_done ?? false;
  const closed = Boolean(progress?.day_closed_at);

  const steps = [
    !!checkin,
    journalingDone,
    ...(mission ? [missionDone] : []),
    ...todaysHabits.map((h) => doneIds.has(h.id)),
  ];
  const doneCount = steps.filter(Boolean).length;
  const firstName = (profile?.first_name as string | null)?.trim();

  return (
    <div className="mx-auto max-w-2xl pb-8">
      <header className="pt-2">
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or-clair/70">{formatDate(new Date())}</p>
        <h1 className="mt-4 font-rr-display text-[2.6rem] leading-[1.1] text-rr-ivoire">Aujourd&apos;hui</h1>
        <p className="mt-4 text-sm text-rr-gris-clair">
          Semaine {weekNumber} · Jour {dayNumber}
          {week?.title ? ` · ${week.title}` : ""}
        </p>
      </header>

      <GlassCard variant="gold" className="mt-10 p-7">
        <div className="flex items-center justify-between gap-5">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or-clair/80">Ta journée</p>
            <p className="mt-3 font-rr-serif text-2xl italic leading-tight text-rr-ivoire">
              {greeting()}
              {firstName ? `, ${firstName}` : ""}.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-rr-gris-clair">
              La régularité compte plus que la perfection.
            </p>
          </div>
          <ProgressRing done={doneCount} total={steps.length} />
        </div>
      </GlassCard>

      {morning.length > 0 && (
        <section className="mt-14">
          <SectionLabel>Routine du matin</SectionLabel>
          <div className="mt-5 flex flex-col gap-3">
            {morning.map((h) => (
              <TodayHabitRow
                key={h.id}
                id={h.id}
                titre={h.titre}
                isDone={doneIds.has(h.id)}
                systemKey={h.system_key}
              />
            ))}
          </div>
        </section>
      )}

      {mission && (
        <section className="mt-14">
          <SectionLabel>Mission du jour</SectionLabel>
          <form action={toggleMission} className="mt-5">
            <input type="hidden" name="done" value={missionDone ? "1" : "0"} />
            <button
              type="submit"
              className={cn(
                "flex w-full items-start gap-5 rounded-[28px] border p-6 text-left transition-all duration-300",
                missionDone
                  ? "border-rr-or/30 bg-rr-or/[0.05]"
                  : "border-rr-or/25 bg-gradient-to-b from-rr-or/[0.07] to-transparent hover:border-rr-or/50"
              )}
            >
              <span
                className={cn(
                  "mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-500",
                  missionDone
                    ? "border-rr-or bg-rr-or text-rr-noir shadow-[0_0_18px_rgba(201,169,110,0.45)]"
                    : "border-rr-or/40 text-transparent"
                )}
              >
                <Check className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <span className="font-rr-serif text-xl italic leading-snug text-rr-ivoire">{mission}</span>
            </button>
          </form>
        </section>
      )}

      <section className="mt-14">
        <SectionLabel>Check-in · 30 secondes</SectionLabel>
        <GlassCard variant={checkin ? "quiet" : "default"} className="mt-5 p-6">
          {checkin ? (
            <p className="text-sm text-rr-gris-clair">
              Énergie <span className="text-rr-ivoire">{checkin.energy}/5</span> · Tension{" "}
              <span className="text-rr-ivoire">{checkin.tension}/5</span>. Merci de t&apos;être écouté·e.
            </p>
          ) : (
            <form action={saveCheckin} className="flex flex-col gap-7">
              <ScaleInput name="energy" label="Mon niveau d'énergie" low="Très bas" high="Très haut" />
              <ScaleInput name="tension" label="Ma tension intérieure" low="Détendu·e" high="Très tendu·e" />
              <button
                type="submit"
                className="h-12 rounded-full border border-rr-or/40 text-sm text-rr-or transition-colors hover:bg-rr-or/10"
              >
                Enregistrer
              </button>
            </form>
          )}
        </GlassCard>
      </section>

      {daytime.length > 0 && (
        <section className="mt-14">
          <SectionLabel>Dans la journée</SectionLabel>
          <div className="mt-5 flex flex-col gap-3">
            {daytime.map((h) => (
              <TodayHabitRow
                key={h.id}
                id={h.id}
                titre={h.titre}
                isDone={doneIds.has(h.id)}
                systemKey={h.system_key}
              />
            ))}
          </div>
        </section>
      )}

      <section className="mt-14">
        <SectionLabel>Journaling</SectionLabel>
        <GlassCard variant={journalingDone ? "quiet" : "default"} className="mt-5 p-6">
          <p className="font-rr-serif text-xl italic leading-snug text-rr-ivoire">{question}</p>
          {journalingDone ? (
            <p className="mt-4 text-sm text-rr-gris-clair">Écrit pour aujourd&apos;hui. Retrouve-le dans ton journal.</p>
          ) : (
            <form action={saveJournalAnswer} className="mt-5 flex flex-col gap-4">
              <input type="hidden" name="question" value={question} />
              <input type="hidden" name="weekId" value={week?.id ?? ""} />
              <textarea
                name="content"
                required
                rows={5}
                placeholder="Écris ce qui vient, sans te corriger."
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-[15px] leading-relaxed text-rr-ivoire placeholder:text-rr-gris focus:border-rr-or/50 focus:outline-none"
              />
              <button
                type="submit"
                className="h-12 rounded-full border border-rr-or/40 text-sm text-rr-or transition-colors hover:bg-rr-or/10"
              >
                Enregistrer
              </button>
            </form>
          )}
        </GlassCard>
      </section>

      {evening.length > 0 && (
        <section className="mt-14">
          <SectionLabel>Routine du soir</SectionLabel>
          <div className="mt-5 flex flex-col gap-3">
            {evening.map((h) => (
              <TodayHabitRow
                key={h.id}
                id={h.id}
                titre={h.titre}
                isDone={doneIds.has(h.id)}
                systemKey={h.system_key}
              />
            ))}
          </div>
        </section>
      )}

      <div className="mt-16">
        {closed ? (
          <p className="text-center font-rr-serif text-xl italic leading-relaxed text-rr-gris-clair">
            Ta journée est terminée. Repose-toi bien.
          </p>
        ) : (
          <form action={closeDay}>
            <button
              type="submit"
              className="rr-shimmer h-14 w-full rounded-full bg-rr-or text-[15px] font-medium text-rr-noir shadow-[0_10px_40px_-12px_rgba(201,169,110,0.6)] transition-opacity hover:opacity-90"
            >
              Terminer ma journée
            </button>
          </form>
        )}
      </div>

      <Link
        href="/revenir-a-moi"
        className="mt-6 flex items-center justify-center gap-2 rounded-full border border-rr-orange/30 px-5 py-3.5 text-sm text-rr-orange/90 transition-colors hover:bg-rr-orange/[0.08]"
      >
        <LifeBuoy className="h-4 w-4" strokeWidth={1.75} />
        J&apos;ai besoin de revenir à moi
      </Link>

      <nav aria-label="Mon espace" className="mt-10 grid grid-cols-4 gap-2.5">
        <QuietTile href="/bilan" icon={CalendarCheck} label="Bilan" ariaLabel="Le bilan de ma semaine" />
        <QuietTile href="/progression" icon={TrendingUp} label="Progression" ariaLabel="Ma progression" />
        <QuietTile href="/rappels" icon={Bell} label="Rappels" ariaLabel="Mes rappels" />
        <QuietTile href="/pratique/sommeil" icon={Moon} label="Sommeil" ariaLabel="Je n'arrive pas à dormir" />
      </nav>
    </div>
  );
}

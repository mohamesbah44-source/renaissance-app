import Link from "next/link";
import { redirect } from "next/navigation";
import { LifeBuoy, Check, Moon } from "lucide-react";
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

  return (
    <div className="mx-auto max-w-2xl pb-8">
      <header className="pt-1">
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or-clair/70">{formatDate(new Date())}</p>
        <h1 className="mt-3 font-rr-display text-4xl leading-tight text-rr-ivoire">Aujourd&apos;hui</h1>
        <p className="mt-3 text-sm text-rr-gris-clair">
          Semaine {weekNumber} · Jour {dayNumber}
          {week?.title ? ` · ${week.title}` : ""}
        </p>
      </header>

      <GlassCard className="mt-8 p-6">
        <div className="flex items-baseline justify-between">
          <p className="text-[11px] uppercase tracking-[0.3em] text-rr-gris">Ta journée</p>
          <p className="font-rr-display text-2xl text-rr-ivoire">
            {doneCount} <span className="text-base text-rr-gris">/ {steps.length}</span>
          </p>
        </div>
        <div className="mt-5 flex gap-1.5" role="img" aria-label={`${doneCount} étapes sur ${steps.length}`}>
          {steps.map((s, i) => (
            <span key={i} className={cn("h-1 flex-1 rounded-full", s ? "bg-rr-or" : "bg-white/10")} />
          ))}
        </div>
        <p className="mt-4 text-sm text-rr-gris-clair">La régularité compte plus que la perfection.</p>
      </GlassCard>

      {morning.length > 0 && (
        <section className="mt-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">Routine du matin</p>
          <div className="mt-4 flex flex-col gap-2.5">
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
        <section className="mt-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">Mission du jour</p>
          <form action={toggleMission} className="mt-4">
            <input type="hidden" name="done" value={missionDone ? "1" : "0"} />
            <button
              type="submit"
              className={cn(
                "flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-300",
                missionDone ? "border-rr-or/30 bg-rr-or/[0.05]" : "border-white/10 bg-white/[0.02] hover:border-rr-or/30"
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                  missionDone ? "border-rr-or bg-rr-or text-rr-noir" : "border-white/15 text-transparent"
                )}
              >
                <Check className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <span className="font-rr-serif text-lg italic leading-snug text-rr-ivoire">{mission}</span>
            </button>
          </form>
        </section>
      )}

      <section className="mt-10">
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">Check-in · 30 secondes</p>
        <GlassCard className="mt-4 p-5">
          {checkin ? (
            <p className="text-sm text-rr-gris-clair">
              Énergie <span className="text-rr-ivoire">{checkin.energy}/5</span> · Tension{" "}
              <span className="text-rr-ivoire">{checkin.tension}/5</span>. Merci de t&apos;être écouté·e.
            </p>
          ) : (
            <form action={saveCheckin} className="flex flex-col gap-6">
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
        <section className="mt-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">Dans la journée</p>
          <div className="mt-4 flex flex-col gap-2.5">
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

      <section className="mt-10">
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">Journaling</p>
        <GlassCard className="mt-4 p-5">
          <p className="font-rr-serif text-lg italic leading-snug text-rr-ivoire">{question}</p>
          {journalingDone ? (
            <p className="mt-4 text-sm text-rr-gris-clair">Écrit pour aujourd&apos;hui. Retrouve-le dans ton journal.</p>
          ) : (
            <form action={saveJournalAnswer} className="mt-4 flex flex-col gap-4">
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
        <section className="mt-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">Routine du soir</p>
          <div className="mt-4 flex flex-col gap-2.5">
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

      <div className="mt-12">
        {closed ? (
          <p className="text-center font-rr-serif text-lg italic leading-relaxed text-rr-gris-clair">
            Ta journée est terminée. Repose-toi bien.
          </p>
        ) : (
          <form action={closeDay}>
            <button
              type="submit"
              className="h-14 w-full rounded-full bg-rr-or text-[15px] font-medium text-rr-noir transition-opacity hover:opacity-90"
            >
              Terminer ma journée
            </button>
          </form>
        )}
      </div>

      <Link
        href="/bilan"
        className="mt-6 flex items-center justify-center rounded-full border border-rr-or/30 px-5 py-3.5 text-sm text-rr-or transition-colors hover:bg-rr-or/10"
      >
        Le bilan de ma semaine
      </Link>

      <Link
        href="/revenir-a-moi"
        className="mt-3 flex items-center justify-center gap-2 rounded-full border border-rr-orange/30 px-5 py-3.5 text-sm text-rr-orange/90 transition-colors hover:bg-rr-orange/[0.08]"
      >
        <LifeBuoy className="h-4 w-4" strokeWidth={1.75} />
        J&apos;ai besoin de revenir à moi
      </Link>

      <Link
        href="/pratique/sommeil"
        className="mt-3 flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3.5 text-sm text-rr-gris-clair transition-colors hover:bg-white/[0.05]"
      >
        <Moon className="h-4 w-4" strokeWidth={1.75} />
        Je n&apos;arrive pas à dormir
      </Link>
    </div>
  );
}

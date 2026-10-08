import Link from "next/link";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { RadarEvolution } from "@/components/features/radar/RadarEvolution";
import { todayISODate } from "@/lib/habits/streak";
import { formatDate, cn } from "@/lib/utils";

function dayDiff(a: string, b: string): number {
  return Math.round(
    (new Date(`${a}T12:00:00`).getTime() - new Date(`${b}T12:00:00`).getTime()) / 86400000
  );
}

function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + n);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function avg(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((s, v) => s + v, 0) / values.length;
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
    <div className="relative h-[76px] w-[76px] shrink-0" role="img" aria-label={`${done} jours sur ${total}`}>
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

function MiniBar({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-14 shrink-0 text-[11px] text-rr-gris">{label}</span>
      <div className="h-1.5 flex-1 rounded-full bg-white/10">
        {value !== null && (
          <div
            className="h-1.5 rounded-full bg-gradient-to-r from-rr-or/60 to-rr-or shadow-[0_0_10px_rgba(201,169,110,0.4)]"
            style={{ width: `${(value / 5) * 100}%` }}
          />
        )}
      </div>
      <span className="w-8 shrink-0 text-right text-xs text-rr-gris-clair">
        {value !== null ? value.toFixed(1) : "·"}
      </span>
    </div>
  );
}

function EmptyInvite({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[24px] border border-dashed border-white/10 px-6 py-7 text-center">
      <p className="font-rr-serif text-base italic leading-relaxed text-rr-gris-clair">{children}</p>
    </div>
  );
}

export default async function ProgressionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const db = supabase as unknown as SupabaseClient;
  const today = todayISODate();

  const { data: profile } = await db
    .from("profiles")
    .select("program_start_date")
    .eq("id", user.id)
    .single();

  const start: string | null = profile?.program_start_date
    ? String(profile.program_start_date).slice(0, 10)
    : null;

  if (!start) {
    return (
      <div className="mx-auto max-w-2xl pb-8">
        <header className="pt-2">
          <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or-clair/70">Le chemin parcouru</p>
          <h1 className="mt-4 font-rr-display text-[2.6rem] leading-[1.1] text-rr-ivoire">Ma progression</h1>
        </header>
        <div className="mt-10">
          <EmptyInvite>Ta progression apparaîtra dès que ton programme aura une date de début.</EmptyInvite>
        </div>
      </div>
    );
  }

  const [progressRes, checkinsRes, logsRes, weeksRes, synthRes, journalRes] = await Promise.all([
    db
      .from("daily_progress")
      .select("log_date, mission_done, journaling_done, day_closed_at")
      .eq("user_id", user.id)
      .gte("log_date", start)
      .limit(500),
    db
      .from("daily_checkins")
      .select("checkin_date, energy, tension")
      .eq("user_id", user.id)
      .gte("checkin_date", start)
      .limit(500),
    db.from("habit_logs").select("log_date").eq("user_id", user.id).gte("log_date", start).limit(2000),
    db.from("weeks").select("id, week_number, title").order("week_number", { ascending: true }),
    db.from("weekly_syntheses").select("week_id").eq("user_id", user.id),
    db
      .from("journal_entries")
      .select("entry_date, content")
      .eq("user_id", user.id)
      .order("entry_date", { ascending: false })
      .limit(40),
  ]);

  type Prog = { log_date: string; mission_done: boolean | null; journaling_done: boolean | null; day_closed_at: string | null };
  type Chk = { checkin_date: string; energy: number; tension: number };
  type Wk = { id: string; week_number: number; title: string | null };
  type Jr = { entry_date: string; content: string | null };

  const active = new Set<string>();
  for (const r of (progressRes.data ?? []) as Prog[]) {
    if (r.mission_done || r.journaling_done || r.day_closed_at) active.add(String(r.log_date).slice(0, 10));
  }
  const checkins = (checkinsRes.data ?? []) as Chk[];
  for (const c of checkins) active.add(String(c.checkin_date).slice(0, 10));
  for (const l of (logsRes.data ?? []) as { log_date: string }[]) active.add(String(l.log_date).slice(0, 10));

  const weeks = (weeksRes.data ?? []) as Wk[];
  const synthesized = new Set<string>(((synthRes.data ?? []) as { week_id: string }[]).map((s) => s.week_id));

  const todayIdx = Math.max(0, dayDiff(today, start));
  const currentWeek = Math.min(8, Math.floor(todayIdx / 7) + 1);
  const elapsed = Math.min(todayIdx + 1, 56);
  const activeCount = Array.from(active).filter((d) => {
    const i = dayDiff(d, start);
    return i >= 0 && i < 56 && i <= todayIdx;
  }).length;

  const energyByWeek: Record<number, number[]> = {};
  const tensionByWeek: Record<number, number[]> = {};
  for (const c of checkins) {
    const i = dayDiff(String(c.checkin_date).slice(0, 10), start);
    if (i < 0 || i >= 56) continue;
    const w = Math.floor(i / 7) + 1;
    (energyByWeek[w] ??= []).push(c.energy);
    (tensionByWeek[w] ??= []).push(c.tension);
  }
  const weeksWithCheckins = Object.keys(energyByWeek).map(Number).sort((a, b) => a - b);

  const phrases = ((journalRes.data ?? []) as Jr[])
    .filter((j) => j.content && j.content.trim().length > 20)
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-2xl pb-8">
      <header className="pt-2">
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or-clair/70">Le chemin parcouru</p>
        <h1 className="mt-4 font-rr-display text-[2.6rem] leading-[1.1] text-rr-ivoire">Ma progression</h1>
        <p className="mt-4 text-sm text-rr-gris-clair">Semaine {currentWeek} sur 8</p>
      </header>

      <GlassCard variant="gold" className="mt-10 p-7">
        <div className="flex items-center justify-between gap-5">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or-clair/80">Ta présence</p>
            <p className="mt-3 font-rr-serif text-2xl italic leading-tight text-rr-ivoire">
              {activeCount === 0
                ? "Ton chemin commence ici."
                : `Tu es venu·e ${activeCount} jour${activeCount > 1 ? "s" : ""} sur ${elapsed}.`}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-rr-gris-clair">
              La régularité compte plus que la perfection.
            </p>
          </div>
          <ProgressRing done={activeCount} total={elapsed} />
        </div>
      </GlassCard>

      <section className="mt-14">
        <SectionLabel>Régularité</SectionLabel>
        <GlassCard className="mt-5 p-6">
          <div className="flex flex-col gap-3.5">
            {Array.from({ length: 8 }, (_, w) => (
              <div key={w} className="flex items-center gap-3">
                <span className="w-7 shrink-0 text-[11px] text-rr-gris">S{w + 1}</span>
                <div className="flex flex-1 justify-between">
                  {Array.from({ length: 7 }, (_, d) => {
                    const date = addDays(start, w * 7 + d);
                    const future = date > today;
                    const isActive = active.has(date);
                    const isToday = date === today;
                    return (
                      <span
                        key={d}
                        title={formatDate(new Date(`${date}T12:00:00`))}
                        className={cn(
                          "h-3.5 w-3.5 rounded-full transition-colors",
                          isActive
                            ? "bg-rr-or shadow-[0_0_10px_rgba(201,169,110,0.55)]"
                            : future
                              ? "bg-white/[0.04]"
                              : "border border-white/15",
                          isToday && "ring-2 ring-rr-or/50 ring-offset-2 ring-offset-transparent"
                        )}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm leading-relaxed text-rr-gris-clair">
            Un point doré, c&apos;est un jour où tu es venu·e à toi. Les jours vides ne comptent pas contre toi.
          </p>
        </GlassCard>
      </section>

      <section className="mt-14">
        <SectionLabel>Énergie et tension</SectionLabel>
        <div className="mt-5">
          {weeksWithCheckins.length === 0 ? (
            <EmptyInvite>Tes check-ins apparaîtront ici, semaine après semaine.</EmptyInvite>
          ) : (
            <GlassCard className="p-6">
              <div className="flex flex-col gap-7">
                {weeksWithCheckins.map((w) => (
                  <div key={w}>
                    <p className="mb-3 text-xs text-rr-ivoire">Semaine {w}</p>
                    <div className="flex flex-col gap-3">
                      <MiniBar label="Énergie" value={avg(energyByWeek[w])} />
                      <MiniBar label="Tension" value={avg(tensionByWeek[w])} />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      </section>

      <section className="mt-14">
        <SectionLabel>Ton Radar</SectionLabel>
        <div className="mt-5">
          <RadarEvolution userId={user.id} />
        </div>
      </section>

      <section className="mt-14">
        <SectionLabel>Les 8 semaines</SectionLabel>
        <div className="mt-5 flex flex-col gap-3">
          {Array.from({ length: 8 }, (_, i) => {
            const n = i + 1;
            const wk = weeks.find((x) => x.week_number === n);
            const state = n < currentWeek ? "done" : n === currentWeek ? "now" : "next";
            return (
              <div
                key={n}
                className={cn(
                  "flex items-center justify-between gap-4 rounded-[20px] border p-5",
                  state === "now"
                    ? "border-rr-or/30 bg-rr-or/[0.05]"
                    : state === "next"
                      ? "border-white/5 bg-transparent"
                      : "border-white/10 bg-white/[0.02]"
                )}
              >
                <div className="min-w-0">
                  <p className={cn("text-sm", state === "next" ? "text-rr-gris" : "text-rr-ivoire")}>
                    Semaine {n}
                    {wk?.title ? ` · ${wk.title}` : ""}
                  </p>
                  {wk && synthesized.has(wk.id) && (
                    <p className="mt-1.5 text-[11px] text-rr-or-clair/80">Bilan écrit</p>
                  )}
                </div>
                <span
                  className={cn(
                    "shrink-0 text-[11px] uppercase tracking-[0.2em]",
                    state === "now" ? "text-rr-or" : "text-rr-gris"
                  )}
                >
                  {state === "done" ? "Traversée" : state === "now" ? "En cours" : "À venir"}
                </span>
              </div>
            );
          })}
        </div>
        <Link href="/bilan" className="mt-5 inline-block text-sm text-rr-or hover:underline">
          Écrire ou relire le bilan de ma semaine
        </Link>
      </section>

      <section className="mt-14">
        <SectionLabel>Ce que tu as écrit</SectionLabel>
        <div className="mt-5 flex flex-col gap-4">
          {phrases.length === 0 ? (
            <EmptyInvite>Tes réponses du journal pourront être relues ici.</EmptyInvite>
          ) : (
            phrases.map((j, i) => {
              const text = (j.content ?? "").trim();
              return (
                <GlassCard key={i} variant="quiet" className="p-6">
                  <p className="font-rr-serif text-lg italic leading-relaxed text-rr-ivoire">
                    « {text.length > 240 ? `${text.slice(0, 240).trim()}…` : text} »
                  </p>
                  <p className="mt-4 text-[11px] text-rr-gris">
                    {formatDate(new Date(`${String(j.entry_date).slice(0, 10)}T12:00:00`))}
                  </p>
                </GlassCard>
              );
            })
          )}
        </div>
        <Link href="/journal" className="mt-5 inline-block text-sm text-rr-or hover:underline">
          Ouvrir mon journal
        </Link>
      </section>

      <Link
        href="/aujourdhui"
        className="mt-14 flex items-center justify-center rounded-full border border-white/10 px-5 py-3.5 text-sm text-rr-gris-clair transition-colors hover:bg-white/[0.05]"
      >
        Retour à aujourd&apos;hui
      </Link>
    </div>
  );
}

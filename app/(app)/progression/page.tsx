import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { RadarEvolution } from "@/components/features/radar/RadarEvolution";
import { todayISODate } from "@/lib/habits/streak";
import { formatDate, cn } from "@/lib/utils";

const CARD = "rounded-3xl border border-rr-or/20 bg-white/[0.05]";

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
  return <p className="text-[11px] uppercase tracking-[0.28em] text-rr-gris-clair">{children}</p>;
}

function BackLink() {
  return (
    <Link
      href="/profil"
      aria-label="Retour au profil"
      className="-ml-3 flex h-11 w-11 items-center justify-center rounded-full text-rr-gris-clair transition-colors hover:text-rr-ivoire"
    >
      <ChevronLeft className="h-5 w-5" strokeWidth={1.6} />
    </Link>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className={cn(CARD, "flex-1 px-3.5 py-4 text-center")}>
      <p className="font-rr-serif text-[34px] italic leading-none text-rr-ivoire">{value}</p>
      <p className="mt-1.5 text-[11px] text-rr-gris-clair">{label}</p>
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

/** Courbe énergie / tension : moyenne par semaine, échelle 1 à 5. */
function EnergyChart({
  weeks,
  energy,
  tension,
}: {
  weeks: number[];
  energy: Record<number, number[]>;
  tension: Record<number, number[]>;
}) {
  const W = 318;
  const left = 24;
  const right = 24;
  const top = 20;
  const bottom = 130;
  const xOf = (i: number) =>
    weeks.length === 1 ? W / 2 : left + (i * (W - left - right)) / (weeks.length - 1);
  const yOf = (v: number) => bottom - ((v - 1) / 4) * (bottom - top);

  const build = (src: Record<number, number[]>) =>
    weeks
      .map((w, i) => {
        const v = avg(src[w] ?? []);
        return v === null ? null : { x: xOf(i), y: yOf(v) };
      })
      .filter((p): p is { x: number; y: number } => p !== null);

  const e = build(energy);
  const t = build(tension);
  const line = (pts: { x: number; y: number }[]) => pts.map((p) => `${p.x},${p.y}`).join(" ");
  const lastE = e[e.length - 1];
  const lastT = t[t.length - 1];

  return (
    <svg
      viewBox={`0 0 ${W} 160`}
      className="mt-4 w-full"
      fill="none"
      role="img"
      aria-label="Énergie et tension, moyenne par semaine"
    >
      {[20, 75, 130].map((y) => (
        <line key={y} x1="0" y1={y} x2={W} y2={y} stroke="rgba(255,255,255,0.07)" />
      ))}
      {e.length > 1 && (
        <polyline points={line(e)} stroke="#D4AF6A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      )}
      {t.length > 1 && (
        <polyline points={line(t)} stroke="#B79CF5" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      )}
      {e.map((p, i) => (
        <circle key={`e${i}`} cx={p.x} cy={p.y} r={i === e.length - 1 ? 5 : 3} fill="#D4AF6A" />
      ))}
      {t.map((p, i) => (
        <circle key={`t${i}`} cx={p.x} cy={p.y} r={i === t.length - 1 ? 5 : 3} fill="#B79CF5" />
      ))}
      {weeks.map((w, i) => (
        <text key={w} x={xOf(i)} y="152" fontSize="10" fill="#A8A3B8" textAnchor="middle">
          Sem. {w}
        </text>
      ))}
      {lastE && lastT ? null : null}
    </svg>
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
      <div className="rr-enter mx-auto max-w-2xl pb-8">
        <BackLink />
        <header className="mt-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-rr-or">Le chemin parcouru</p>
          <h1 className="mt-4 font-rr-display text-rr-ivoire">Ta progression.</h1>
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

  const written = ((journalRes.data ?? []) as Jr[]).filter((j) => j.content && j.content.trim().length > 20);
  const phrases = written.slice(0, 3);

  return (
    <div className="rr-enter mx-auto max-w-2xl pb-8">
      <BackLink />

      <header className="mt-3">
        <p className="text-[10px] uppercase tracking-[0.3em] text-rr-or">Le chemin parcouru</p>
        <h1 className="mt-4 font-rr-display text-rr-ivoire">Ta progression.</h1>
        <p className="mt-4 text-sm text-rr-gris-clair">
          Semaine {currentWeek} sur 8. La régularité compte plus que la perfection.
        </p>
      </header>

      <div className="mt-10 flex gap-2.5">
        <Stat value={activeCount} label={activeCount > 1 ? "jours actifs" : "jour actif"} />
        <Stat value={currentWeek} label={currentWeek > 1 ? "semaines" : "semaine"} />
        <Stat value={written.length} label={written.length > 1 ? "phrases écrites" : "phrase écrite"} />
      </div>

      <section className="mt-10">
        <div className={cn(CARD, "p-5")}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-rr-label text-[9px] uppercase tracking-[0.3em] text-rr-or">Énergie et tension</p>
            <span className="flex gap-3 text-[11px] text-rr-gris-clair">
              <span className="flex items-center gap-1.5">
                <i className="block h-0.5 w-3.5 bg-rr-or" />
                Énergie
              </span>
              <span className="flex items-center gap-1.5">
                <i className="block h-0.5 w-3.5 bg-[#B79CF5]" />
                Tension
              </span>
            </span>
          </div>
          {weeksWithCheckins.length === 0 ? (
            <p className="mt-6 pb-2 text-center font-rr-serif text-base italic leading-relaxed text-rr-gris-clair">
              Tes check-ins apparaîtront ici, semaine après semaine.
            </p>
          ) : (
            <EnergyChart weeks={weeksWithCheckins} energy={energyByWeek} tension={tensionByWeek} />
          )}
        </div>
      </section>

      <section className="mt-10">
        <SectionLabel>Régularité</SectionLabel>
        <div className={cn(CARD, "mt-4 p-5")}>
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
          <p className="mt-5 text-xs leading-relaxed text-rr-gris-clair">
            Un point doré, c&apos;est un jour où tu es venu·e à toi. Les jours vides ne comptent pas contre toi.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <SectionLabel>Ton Radar</SectionLabel>
        <div className="mt-4">
          <RadarEvolution userId={user.id} />
        </div>
      </section>

      <section className="mt-10">
        <SectionLabel>Les 8 semaines</SectionLabel>
        <div className="mt-2 flex flex-col">
          {Array.from({ length: 8 }, (_, i) => {
            const n = i + 1;
            const wk = weeks.find((x) => x.week_number === n);
            const state = n < currentWeek ? "done" : n === currentWeek ? "now" : "next";
            return (
              <div
                key={n}
                className="flex items-center justify-between gap-4 border-b border-white/[0.08] py-4 last:border-b-0"
              >
                <div className="min-w-0">
                  <p
                    className={cn(
                      "font-rr-serif text-xl italic leading-tight",
                      state === "next" ? "text-rr-gris" : "text-rr-ivoire"
                    )}
                  >
                    Semaine {n}
                    {wk?.title ? ` · ${wk.title}` : ""}
                  </p>
                  {wk && synthesized.has(wk.id) && (
                    <p className="mt-1 text-[11px] text-rr-or-clair/80">Bilan écrit</p>
                  )}
                </div>
                <span
                  className={cn(
                    "shrink-0 text-[10px] uppercase tracking-[0.2em]",
                    state === "now" ? "text-rr-or" : "text-rr-gris"
                  )}
                >
                  {state === "done" ? "Traversée" : state === "now" ? "En cours" : "À venir"}
                </span>
              </div>
            );
          })}
        </div>
        <Link href="/bilan" className="mt-4 inline-block text-sm text-rr-or hover:underline">
          Écrire ou relire le bilan de ma semaine
        </Link>
      </section>

      <section className="mt-10">
        <SectionLabel>Ce que tu as écrit</SectionLabel>
        <div className="mt-4 flex flex-col gap-5">
          {phrases.length === 0 ? (
            <EmptyInvite>Tes réponses du journal pourront être relues ici.</EmptyInvite>
          ) : (
            phrases.map((j, i) => {
              const text = (j.content ?? "").trim();
              return (
                <div key={i}>
                  <p className="font-rr-serif text-xl italic leading-snug text-rr-creme">
                    « {text.length > 200 ? `${text.slice(0, 200).trim()}…` : text} »
                  </p>
                  <p className="mt-2 text-[11px] text-rr-gris">
                    {formatDate(new Date(`${String(j.entry_date).slice(0, 10)}T12:00:00`))}
                  </p>
                </div>
              );
            })
          )}
        </div>
        <Link href="/journal" className="mt-5 inline-block text-sm text-rr-or hover:underline">
          Ouvrir mon journal
        </Link>
      </section>
    </div>
  );
}

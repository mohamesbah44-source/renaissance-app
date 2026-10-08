import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendToSubscriptions, type StoredSub } from "@/lib/reminders/push";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Kind = "morning" | "evening";

const MESSAGES: Record<Kind, string[]> = {
  morning: [
    "Un instant pour toi ce matin : ton check-in t'attend.",
    "Respire, puis viens poser ta journée.",
    "Ta journée commence ici, en douceur.",
  ],
  evening: [
    "Prends deux minutes pour clôturer ta journée.",
    "Qu'est-ce qui a mérité ton attention aujourd'hui ?",
    "Dépose ta journée. Ton journal t'attend.",
  ],
};

function localNow(tz: string): { date: string; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

function toMinutes(t: string): number {
  const [h, m] = String(t).split(":");
  return Number(h) * 60 + Number(m);
}

async function handle(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "missing supabase env" }, { status: 500 });
  }
  const db = createClient(url, key, { auth: { persistSession: false } });

  const { data: all } = await db
    .from("reminder_settings")
    .select(
      "user_id, morning_enabled, morning_time, evening_enabled, evening_time, timezone, last_morning_sent, last_evening_sent"
    );

  let checked = 0;
  let sent = 0;

  for (const s of all ?? []) {
    for (const kind of ["morning", "evening"] as Kind[]) {
      if (!s[`${kind}_enabled`]) continue;
      const tz = s.timezone || "Europe/Paris";
      const now = localNow(tz);
      const target = toMinutes(s[`${kind}_time`]);
      const lastSent = s[`last_${kind}_sent`] ? String(s[`last_${kind}_sent`]).slice(0, 10) : null;
      const due = now.minutes >= target && now.minutes < target + 120 && lastSent !== now.date;
      if (!due) continue;
      checked += 1;

      // Quand on n'envoie rien, on note quand même la journée pour ne pas retester.
      await db
        .from("reminder_settings")
        .update({ [`last_${kind}_sent`]: now.date })
        .eq("user_id", s.user_id);

      if (kind === "morning") {
        const { data: ck } = await db
          .from("daily_checkins")
          .select("id")
          .eq("user_id", s.user_id)
          .eq("checkin_date", now.date)
          .maybeSingle();
        if (ck) continue;
      } else {
        const { data: pr } = await db
          .from("daily_progress")
          .select("day_closed_at")
          .eq("user_id", s.user_id)
          .eq("log_date", now.date)
          .maybeSingle();
        if (pr?.day_closed_at) continue;
      }

      const { data: subsData } = await db
        .from("push_subscriptions")
        .select("id, endpoint, p256dh, auth")
        .eq("user_id", s.user_id);
      const subs = (subsData ?? []) as StoredSub[];
      if (subs.length === 0) continue;

      const pool = MESSAGES[kind];
      const dayIndex = Math.floor(Date.now() / 86400000);
      const res = await sendToSubscriptions(subs, {
        title: "Renaissance",
        body: pool[dayIndex % pool.length],
        url: "/aujourdhui",
      });
      sent += res.sent;
      if (res.gone.length > 0) await db.from("push_subscriptions").delete().in("id", res.gone);
    }
  }

  return NextResponse.json({ ok: true, checked, sent });
}

export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}

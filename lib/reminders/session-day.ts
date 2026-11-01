
import type { SupabaseClient } from "@supabase/supabase-js";
import { sendToSubscriptions, type StoredSub } from "@/lib/reminders/push";
import { sendSessionEmail } from "@/lib/reminders/session-email";

const TZ = "Europe/Paris";

function parisParts(date: Date): { day: string; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return {
    day: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

export function formatHour(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, "0")}`;
}

/**
 * Le matin de chaque séance (vers 8 h, ou 2 h avant si elle est très tôt),
 * envoie une notification et un e-mail au participant. Une seule fois par
 * rendez-vous (reminder_sent_at).
 */
export async function notifySessionsToday(db: SupabaseClient): Promise<{ checked: number; push: number; emails: number }> {
  const now = new Date();
  const today = parisParts(now);

  const from = now.toISOString();
  const to = new Date(now.getTime() + 36 * 3600 * 1000).toISOString();

  const { data: appts } = await db
    .from("appointments")
    .select("id, user_id, scheduled_at, title, status")
    .eq("status", "upcoming")
    .is("reminder_sent_at", null)
    .gte("scheduled_at", from)
    .lte("scheduled_at", to);

  let checked = 0;
  let push = 0;
  let emails = 0;

  for (const a of appts ?? []) {
    const at = parisParts(new Date(a.scheduled_at));
    if (at.day !== today.day) continue;
    const sendFrom = Math.max(6 * 60, Math.min(8 * 60, at.minutes - 120));
    if (today.minutes < sendFrom) continue;
    checked += 1;

    // On marque d'abord, pour ne jamais envoyer deux fois.
    await db.from("appointments").update({ reminder_sent_at: new Date().toISOString() }).eq("id", a.id);

    const hour = formatHour(at.minutes);
    const title = a.title ?? "Ta séance";
    const body = `Aujourd'hui à ${hour} : ${title}.`;

    const { data: subsData } = await db
      .from("push_subscriptions")
      .select("id, endpoint, p256dh, auth")
      .eq("user_id", a.user_id);
    const subs = (subsData ?? []) as StoredSub[];
    if (subs.length > 0) {
      const res = await sendToSubscriptions(subs, { title: "Ta séance du jour", body, url: "/calendrier" });
      push += res.sent;
      if (res.gone.length > 0) await db.from("push_subscriptions").delete().in("id", res.gone);
    }

    const { data: prof } = await db.from("profiles").select("email, first_name").eq("id", a.user_id).maybeSingle();
    if (prof?.email) {
      const ok = await sendSessionEmail({ to: prof.email, firstName: prof.first_name ?? "", hour, title });
      if (ok) emails += 1;
    }
  }

  return { checked, push, emails };
}

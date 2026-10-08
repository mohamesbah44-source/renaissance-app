"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { sendToSubscriptions, type StoredSub } from "@/lib/reminders/push";

type SubInput = { endpoint: string; p256dh: string; auth: string };

async function getDb() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { db: supabase as unknown as SupabaseClient, user };
}

export async function savePushSubscription(input: SubInput): Promise<{ ok: boolean }> {
  const { db, user } = await getDb();
  if (!user || !input.endpoint || !input.p256dh || !input.auth) return { ok: false };
  const { error } = await db
    .from("push_subscriptions")
    .upsert(
      { user_id: user.id, endpoint: input.endpoint, p256dh: input.p256dh, auth: input.auth },
      { onConflict: "endpoint" }
    );
  return { ok: !error };
}

export async function removePushSubscription(endpoint: string): Promise<{ ok: boolean }> {
  const { db, user } = await getDb();
  if (!user) return { ok: false };
  const { error } = await db.from("push_subscriptions").delete().eq("user_id", user.id).eq("endpoint", endpoint);
  return { ok: !error };
}

export async function sendTestPush(): Promise<{ ok: boolean; message: string }> {
  const { db, user } = await getDb();
  if (!user) return { ok: false, message: "Connexion requise." };
  const { data } = await db
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth")
    .eq("user_id", user.id);
  const subs = (data ?? []) as StoredSub[];
  if (subs.length === 0) return { ok: false, message: "Aucun appareil activé pour le moment." };
  const { sent, gone } = await sendToSubscriptions(subs, {
    title: "Renaissance",
    body: "Tout est prêt. Tes rappels arriveront ici, en douceur.",
    url: "/aujourdhui",
  });
  if (gone.length > 0) await db.from("push_subscriptions").delete().in("id", gone);
  return sent > 0
    ? { ok: true, message: "Notification envoyée." }
    : { ok: false, message: "L'envoi a échoué. Réactive les rappels puis réessaie." };
}

const TIME_RE = /^\d{2}:\d{2}$/;

export async function saveReminderSettings(formData: FormData): Promise<void> {
  const { db, user } = await getDb();
  if (!user) return;
  const morningTime = String(formData.get("morning_time") ?? "08:00");
  const eveningTime = String(formData.get("evening_time") ?? "20:30");
  if (!TIME_RE.test(morningTime) || !TIME_RE.test(eveningTime)) return;
  await db.from("reminder_settings").upsert(
    {
      user_id: user.id,
      morning_enabled: formData.get("morning_enabled") === "on",
      morning_time: morningTime,
      evening_enabled: formData.get("evening_enabled") === "on",
      evening_time: eveningTime,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
  revalidatePath("/rappels");
}

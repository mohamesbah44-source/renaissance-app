"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { todayISODate } from "@/lib/habits/streak";

async function getUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, userId: user?.id ?? null };
}

function done() {
  revalidatePath("/aujourdhui");
  revalidatePath("/dashboard");
  revalidatePath("/habitudes");
}

export async function toggleTodayHabit(formData: FormData): Promise<void> {
  const habitId = String(formData.get("habitId") ?? "");
  const isDone = formData.get("done") === "1";
  const { supabase, userId } = await getUserId();
  if (!userId || !habitId) return;

  const today = todayISODate();

  if (isDone) {
    await supabase.from("habit_logs").delete().eq("habit_id", habitId).eq("user_id", userId).eq("log_date", today);
  } else {
    await supabase
      .from("habit_logs")
      .upsert({ habit_id: habitId, user_id: userId, log_date: today }, { onConflict: "habit_id,log_date" });
  }
  done();
}

export async function toggleMission(formData: FormData): Promise<void> {
  const isDone = formData.get("done") === "1";
  const { supabase, userId } = await getUserId();
  if (!userId) return;

  await supabase
    .from("daily_progress")
    .upsert(
      { user_id: userId, log_date: todayISODate(), mission_done: !isDone, updated_at: new Date().toISOString() },
      { onConflict: "user_id,log_date" }
    );
  done();
}

export async function saveCheckin(formData: FormData): Promise<void> {
  const energy = Number(formData.get("energy"));
  const tension = Number(formData.get("tension"));
  const { supabase, userId } = await getUserId();
  if (!userId) return;
  if (!(energy >= 1 && energy <= 5) || !(tension >= 1 && tension <= 5)) return;

  await supabase
    .from("daily_checkins")
    .upsert({ user_id: userId, checkin_date: todayISODate(), energy, tension }, { onConflict: "user_id,checkin_date" });
  done();
}

export async function saveJournalAnswer(formData: FormData): Promise<void> {
  const content = String(formData.get("content") ?? "").trim();
  const question = String(formData.get("question") ?? "").trim();
  const weekId = String(formData.get("weekId") ?? "");
  const { supabase, userId } = await getUserId();
  if (!userId || content.length === 0) return;

  const today = todayISODate();

  await supabase.from("journal_entries").insert({
    user_id: userId,
    entry_date: today,
    title: question || null,
    content,
    week_id: weekId || null,
  });

  await supabase
    .from("daily_progress")
    .upsert(
      { user_id: userId, log_date: today, journaling_done: true, updated_at: new Date().toISOString() },
      { onConflict: "user_id,log_date" }
    );
  revalidatePath("/journal");
  done();
}

export async function closeDay(): Promise<void> {
  const { supabase, userId } = await getUserId();
  if (!userId) return;

  const now = new Date().toISOString();
  await supabase
    .from("daily_progress")
    .upsert(
      { user_id: userId, log_date: todayISODate(), day_closed_at: now, updated_at: now },
      { onConflict: "user_id,log_date" }
    );
  done();
}

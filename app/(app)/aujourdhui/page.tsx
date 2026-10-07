import Link from "next/link";
import { redirect } from "next/navigation";
import { LifeBuoy, Check } from "lucide-react";
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
        .select("id, titre, time_of_day, weekdays, start_date, end_date")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("created_at", { ascending: true }),
      db.from("habit_logs").select("habit_id").eq("user_id", user.id).eq("log_date", today),

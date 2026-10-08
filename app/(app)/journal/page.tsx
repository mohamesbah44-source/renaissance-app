import { createClient } from "@/lib/supabase/server";
import { JournalCarnetTabs } from "@/components/features/journal/JournalCarnetTabs";
import { todayISODate } from "@/lib/habits/streak";

export default async function JournalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [{ data: entries }, { data: weeks }, { data: carnetEntries }] = await Promise.all([
    supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("entry_date", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase.from("weeks").select("*").order("week_number", { ascending: true }),
    supabase.from("carnet_entries").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
  ]);

  const weekOptions = weeks ?? [];
  const weekTitleById = Object.fromEntries(
    weekOptions.map((week) => [week.id, `Semaine ${week.week_number} — ${week.title}`])
  );
  const today = todayISODate();

  return (
    <div className="mx-auto max-w-2xl pb-8">
      <header className="pt-2">
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or-clair/70">Ton espace</p>
        <h1 className="mt-4 font-rr-display text-[2.6rem] leading-[1.1] text-rr-ivoire">Un espace pour toi</h1>
        <p className="mt-4 font-rr-serif text-lg italic leading-relaxed text-rr-gris-clair">
          Pose des mots sur ce que tu traverses, et retrouve les synthèses que ton praticien te partage.
        </p>
      </header>

      <div className="mt-12">
        <JournalCarnetTabs
          entries={entries ?? []}
          weeks={weekOptions}
          weekTitleById={weekTitleById}
          defaultDate={today}
          carnetEntries={carnetEntries ?? []}
        />
      </div>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { JournalCarnetTabs } from "@/components/features/journal/JournalCarnetTabs";

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
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="mx-auto max-w-2xl pb-8">
      <header className="pt-2">
        <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">Ton espace</p>
        <h1 className="mt-2 font-rr-display text-3xl uppercase tracking-[0.06em] text-rr-ivoire">Un espace pour toi</h1>
        <p className="mt-3 text-sm leading-relaxed text-rr-gris-clair">
          Pose des mots sur ce que tu traverses, et retrouve les synthèses que ton praticien te partage.
        </p>
      </header>

      <div className="mt-8">
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

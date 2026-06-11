import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { JournalEntryForm } from "@/components/features/journal/JournalEntryForm";
import { JournalEntryCard } from "@/components/features/journal/JournalEntryCard";

export default async function JournalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [{ data: entries }, { data: weeks }] = await Promise.all([
    supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("entry_date", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase.from("weeks").select("*").order("week_number", { ascending: true }),
  ]);

  const weekOptions = weeks ?? [];
  const weekTitleById = Object.fromEntries(
    weekOptions.map((week) => [week.id, `Semaine ${week.week_number} — ${week.title}`])
  );
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="mx-auto max-w-2xl pb-8">
      <header className="pt-2">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Ton journal</p>
        <h1 className="mt-2 font-display text-3xl text-white">Un espace pour toi</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          Pose des mots sur ce que tu traverses. Ce journal n&apos;appartient qu&apos;à toi.
        </p>
      </header>

      <GlassCard className="mt-8 p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Nouvelle entrée</p>
        <div className="mt-4">
          <JournalEntryForm weeks={weekOptions} defaultDate={today} />
        </div>
      </GlassCard>

      <div className="mt-6 flex flex-col gap-4">
        {entries && entries.length > 0 ? (
          entries.map((entry) => (
            <JournalEntryCard
              key={entry.id}
              entry={entry}
              weeks={weekOptions}
              weekTitleById={weekTitleById}
              defaultDate={today}
            />
          ))
        ) : (
          <p className="text-center text-sm text-white/40">
            Tu n&apos;as pas encore écrit. Commence quand tu te sens prêt·e.
          </p>
        )}
      </div>
    </div>
  );
}

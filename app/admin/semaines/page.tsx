import { createClient } from "@/lib/supabase/server";
import { WeekEditCard } from "@/components/features/admin/WeekEditCard";

export default async function AdminSemainesPage() {
  const supabase = await createClient();
  const { data: weeks } = await supabase.from("weeks").select("*").order("week_number", { ascending: true });

  return (
    <div className="flex flex-col gap-8 pb-12">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">Admin</p>
        <h1 className="mt-2 font-rr-display text-3xl uppercase tracking-[0.06em] text-rr-ivoire">Le parcours en 8 semaines</h1>
        <p className="mt-3 text-sm leading-relaxed text-rr-gris-clair">
          Édite le contenu de chaque semaine : intention, description, médias et questions de journalisation.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {(weeks ?? []).map((week) => (
          <WeekEditCard key={week.id} week={week} />
        ))}
      </div>
    </div>
  );
}

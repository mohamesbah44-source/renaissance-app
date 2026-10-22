import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

function pickQuote(content: string | null | undefined): string | null {
  if (!content) return null;
  const text = content.replace(/\s+/g, " ").trim();
  if (text.length < 8) return null;
  const sentence = text.match(/^(.{12,160}?[.!?…])(\s|$)/);
  if (sentence) return sentence[1];
  return text.length > 140 ? `${text.slice(0, 140).trimEnd()}…` : text;
}

export default async function CeremoniePage({ params }: { params: Promise<{ semaine: string }> }) {
  const { semaine } = await params;
  const weekNumber = Number(semaine);
  if (!Number.isInteger(weekNumber) || weekNumber < 1 || weekNumber > 8) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const db = supabase as unknown as SupabaseClient;

  const { data: week } = await db
    .from("weeks")
    .select("id, title, intention")
    .eq("week_number", weekNumber)
    .maybeSingle();

  const { data: entry } = week
    ? await db
        .from("journal_entries")
        .select("content, entry_date")
        .eq("user_id", user.id)
        .eq("week_id", week.id)
        .order("entry_date", { ascending: false })
        .limit(1)
        .maybeSingle()
    : { data: null };

  const quote = pickQuote(entry?.content);
  const weekday = entry?.entry_date
    ? new Date(`${String(entry.entry_date).slice(0, 10)}T12:00:00`).toLocaleDateString("fr-FR", {
        weekday: "long",
      })
    : null;

  const isLast = weekNumber === 8;
  const title = week?.title?.trim() || `Semaine ${weekNumber}`;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between overflow-y-auto bg-rr-noir px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] text-rr-ivoire">
      <div className="flex w-full max-w-md justify-end">
        <Link
          href="/aujourdhui"
          className="flex h-10 items-center rounded-full px-4 text-xs text-rr-gris transition-colors hover:text-rr-ivoire"
        >
          Fermer
        </Link>
      </div>

      <div className="flex w-full max-w-md flex-1 flex-col items-center justify-center py-6 text-center">
        <div className="relative h-44 w-44" aria-hidden="true">
          <span
            className="absolute inset-[-30%] rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(139,92,246,0.5) 0%, rgba(109,40,217,0.24) 45%, rgba(46,16,101,0) 72%)",
            }}
          />
          <span
            className="absolute inset-[14px] rounded-full"
            style={{
              background:
                "radial-gradient(circle at 35% 30%, #ddd6fe 0%, #a78bfa 22%, #7c3aed 52%, #4c1d95 82%, #2e1065 100%)",
              boxShadow:
                "0 0 60px 8px rgba(139,92,246,0.4), inset 0 0 40px rgba(255,255,255,0.14), inset 0 -16px 40px rgba(30,10,70,0.55)",
            }}
          />
          <svg viewBox="0 0 176 176" className="absolute inset-0 h-full w-full">
            <circle
              cx="88"
              cy="88"
              r="84"
              fill="none"
              stroke="#c9a96e"
              strokeWidth="2"
              style={{ filter: "drop-shadow(0 0 6px rgba(201,169,110,0.6))" }}
            />
          </svg>
        </div>

        <p className="mt-12 text-[11px] uppercase tracking-[0.34em] text-rr-or">
          {isLast ? "Graduation" : `Semaine ${weekNumber}`}
        </p>
        <h1 className="mt-4 font-rr-display text-5xl leading-none text-rr-ivoire">
          {isLast ? "Re-Naissance." : `${title}.`}
        </h1>

        {quote ? (
          <>
            <p className="mt-8 max-w-[300px] font-rr-serif text-2xl italic leading-snug text-rr-ivoire/90">
              «&nbsp;{quote}&nbsp;»
            </p>
            <p className="mt-3 text-xs text-rr-gris">
              {weekday ? `Tes mots, ${weekday}` : "Tes mots cette semaine"}
            </p>
          </>
        ) : (
          week?.intention && (
            <p className="mt-8 max-w-[300px] font-rr-serif text-xl italic leading-snug text-rr-gris-clair">
              {week.intention}
            </p>
          )
        )}
      </div>

      <div className="flex w-full max-w-md flex-col items-center gap-4">
        <Link
          href="/aujourdhui"
          className="rr-shimmer flex h-14 w-full items-center justify-center rounded-full bg-rr-or text-[15px] font-medium text-rr-noir shadow-[0_10px_40px_-12px_rgba(201,169,110,0.6)] transition-opacity hover:opacity-90"
        >
          {isLast ? "Entrer dans la suite" : `Entrer dans la semaine ${weekNumber + 1}`}
        </Link>
        <p className="text-[11.5px] text-rr-gris">Ton Radar express t&apos;attend dimanche.</p>
      </div>
    </div>
  );
}

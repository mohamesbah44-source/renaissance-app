import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft, Check, Play, FileText, Video } from "lucide-react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { programWeek } from "@/lib/radar/express";
import { todayISODate } from "@/lib/habits/streak";
import { cn } from "@/lib/utils";

type WeekFull = {
  id: string;
  week_number: number;
  title: string | null;
  intention: string | null;
  description: string | null;
  video_url: string | null;
  audio_breathwork_url: string | null;
  audio_meditation_url: string | null;
  audio_visualization_url: string | null;
  pdf_urls: unknown;
};

function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + n);
  return d.toLocaleDateString("sv-SE");
}

function Row({
  done,
  title,
  hint,
  href,
  icon,
}: {
  done?: boolean;
  title: string;
  hint: string;
  href?: string;
  icon?: React.ReactNode;
}) {
  const content = (
    <div className="flex items-center gap-3.5 border-b border-white/[0.08] py-4">
      <span
        className={cn(
          "flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border",
          done ? "border-rr-or bg-rr-or text-rr-noir" : "border-rr-ivoire/30 text-rr-or"
        )}
      >
        {done ? <Check className="h-[13px] w-[13px]" strokeWidth={2.4} /> : icon}
      </span>
      <div className="min-w-0">
        <p className="text-[15px] text-rr-ivoire">{title}</p>
        <p className="mt-0.5 text-xs text-rr-gris-clair">{hint}</p>
      </div>
    </div>
  );

  if (!href) return content;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block">
      {content}
    </a>
  );
}

export default async function SemainePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const db = supabase as unknown as SupabaseClient;
  const today = todayISODate();

  const { data: profile } = await supabase
    .from("profiles")
    .select("program_start_date, current_week")
    .eq("id", user.id)
    .single();

  const currentWeek = programWeek(profile?.program_start_date, today, profile?.current_week ?? 1);

  const { data: weekRaw } = await db.from("weeks").select("*").eq("id", id).maybeSingle();
  const week = weekRaw as WeekFull | null;

  // Semaine inconnue ou pas encore ouverte : retour au parcours
  if (!week || week.week_number > currentWeek) redirect("/parcours");

  const startDate = profile?.program_start_date ? String(profile.program_start_date).slice(0, 10) : null;
  const rangeStart = startDate ? addDays(startDate, (week.week_number - 1) * 7) : addDays(today, -6);
  const rangeEnd = addDays(rangeStart, 6);

  const [{ data: progressRaw }, { data: checkinsRaw }] = await Promise.all([
    db
      .from("daily_progress")
      .select("log_date, mission_done, journaling_done")
      .eq("user_id", user.id)
      .gte("log_date", rangeStart)
      .lte("log_date", rangeEnd),
    db
      .from("daily_checkins")
      .select("checkin_date")
      .eq("user_id", user.id)
      .gte("checkin_date", rangeStart)
      .lte("checkin_date", rangeEnd),
  ]);

  const progress = (progressRaw ?? []) as { mission_done: boolean | null; journaling_done: boolean | null }[];
  const questionDays = progress.filter((p) => p.journaling_done).length;
  const missionDays = progress.filter((p) => p.mission_done).length;
  const checkinDays = (checkinsRaw ?? []).length;

  const pdfs = (Array.isArray(week.pdf_urls) ? week.pdf_urls : []).filter(
    (p): p is { title: string; url: string } =>
      !!p && typeof p === "object" && typeof (p as { url?: unknown }).url === "string"
  );

  const hasResources =
    week.audio_meditation_url ||
    week.audio_breathwork_url ||
    week.audio_visualization_url ||
    week.video_url ||
    pdfs.length > 0;

  return (
    <div className="rr-enter mx-auto max-w-2xl pb-8">
      <Link
        href="/parcours"
        aria-label="Retour au parcours"
        className="-ml-3 flex h-11 w-11 items-center justify-center rounded-full text-rr-gris-clair transition-colors hover:text-rr-ivoire"
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={1.6} />
      </Link>

      <header className="mt-3">
        <p className="text-[10px] uppercase tracking-[0.3em] text-rr-or">
          Semaine {week.week_number} sur 8
          {week.week_number === currentWeek ? " · en cours" : ""}
        </p>
        <h1 className="mt-4 font-rr-display text-[46px] leading-none text-rr-ivoire">
          {week.title ?? `Semaine ${week.week_number}`}
        </h1>
        {week.intention && (
          <p className="mt-5 font-rr-serif text-[21px] italic leading-[1.3] text-rr-creme">{week.intention}</p>
        )}
        {week.description && (
          <p className="mt-4 text-sm leading-relaxed text-rr-gris-clair">{week.description}</p>
        )}
      </header>

      <section className="mt-10">
        <p className="text-[11px] uppercase tracking-[0.28em] text-rr-gris-clair">Cette semaine</p>
        <div className="mt-1.5">
          <Row
            done={questionDays > 0}
            title="Une question par jour"
            hint={`${questionDays} jour${questionDays > 1 ? "s" : ""} sur 7`}
          />
          <Row
            done={missionDays > 0}
            title="Une mission par jour"
            hint={`${missionDays} jour${missionDays > 1 ? "s" : ""} sur 7`}
          />
          <Row
            done={checkinDays > 0}
            title="Ton check-in"
            hint={`${checkinDays} jour${checkinDays > 1 ? "s" : ""} sur 7`}
          />
        </div>
      </section>

      {hasResources && (
        <section className="mt-10">
          <p className="text-[11px] uppercase tracking-[0.28em] text-rr-gris-clair">Pour t&apos;accompagner</p>
          <div className="mt-1.5">
            {week.audio_meditation_url && (
              <Row
                title="Méditation de la semaine"
                hint="Audio"
                href={week.audio_meditation_url}
                icon={<Play className="h-3 w-3" fill="currentColor" />}
              />
            )}
            {week.audio_breathwork_url && (
              <Row
                title="Respiration guidée"
                hint="Audio"
                href={week.audio_breathwork_url}
                icon={<Play className="h-3 w-3" fill="currentColor" />}
              />
            )}
            {week.audio_visualization_url && (
              <Row
                title="Visualisation"
                hint="Audio"
                href={week.audio_visualization_url}
                icon={<Play className="h-3 w-3" fill="currentColor" />}
              />
            )}
            {week.video_url && (
              <Row
                title="Vidéo de la semaine"
                hint="À regarder"
                href={week.video_url}
                icon={<Video className="h-3 w-3" strokeWidth={1.8} />}
              />
            )}
            {pdfs.map((pdf) => (
              <Row
                key={pdf.url}
                title={pdf.title || "Fiche"}
                hint="Fiche · PDF"
                href={pdf.url}
                icon={<FileText className="h-3 w-3" strokeWidth={1.8} />}
              />
            ))}
          </div>
        </section>
      )}

      <Link
        href={`/bilan?semaine=${week.week_number}`}
        className="mt-10 flex h-14 w-full items-center justify-center rounded-full border border-rr-or/50 text-[15px] text-rr-creme transition-colors duration-300 hover:bg-rr-or/10"
      >
        Écrire le bilan de la semaine
      </Link>
    </div>
  );
}

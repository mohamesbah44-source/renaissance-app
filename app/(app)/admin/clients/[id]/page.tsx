import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { ClientSettingsForm } from "@/components/features/admin/ClientSettingsForm";
import { ClientProgressPanel } from "@/components/features/admin/ClientProgressPanel";
import { ClientRadarPanel } from "@/components/features/admin/ClientRadarPanel";
import { ClientOverviewBanner } from "@/components/features/admin/ClientOverviewBanner";
import { ImportAnalyzerButton } from "@/components/features/admin/ImportAnalyzerButton";
import { AdminHabitsPanel } from "@/components/features/admin/AdminHabitsPanel";
import { AdminJournalEntryCard } from "@/components/features/admin/AdminJournalEntryCard";
import { AdminCarnetEntryCard } from "@/components/features/admin/AdminCarnetEntryCard";
import { CarnetEntryForm } from "@/components/features/admin/CarnetEntryForm";
import { AdminClientSongCard } from "@/components/features/admin/AdminClientSongCard";
import { ClientSongForm } from "@/components/features/admin/ClientSongForm";
import { AppointmentForm } from "@/components/features/admin/AppointmentForm";
import { AppointmentRow } from "@/components/features/admin/AppointmentRow";
import { DeleteClientButton } from "@/components/features/admin/DeleteClientButton";
import { SessionProgressPanel } from "@/components/features/calendrier/SessionProgressPanel";
import { MessageThread } from "@/components/features/messages/MessageThread";
import { MessageComposer } from "@/components/features/messages/MessageComposer";
import { MarkMessagesRead } from "@/components/features/messages/MarkMessagesRead";
import { formatDate } from "@/lib/utils";
import { todayISODate } from "@/lib/habits/streak";

export default async function AdminClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: client } = await supabase.from("profiles").select("*").eq("id", id).eq("role", "client").maybeSingle();

  if (!client) {
    notFound();
  }

  const [
    { data: weeks },
    { data: progressRows },
    { data: radarRows },
    { data: journalEntries },
    { data: carnetEntries },
    { data: songs },
    { data: appointments },
    { data: messages },
    { data: habits },
    { data: todayLogs },
  ] = await Promise.all([
    supabase.from("weeks").select("*").order("week_number", { ascending: true }),
    supabase.from("user_progress").select("*").eq("user_id", id),
    supabase.from("radar_bilans").select("*").eq("user_id", id).order("created_at", { ascending: false }),
    supabase.from("journal_entries").select("*").eq("user_id", id).order("entry_date", { ascending: false }),
    supabase.from("carnet_entries").select("*").eq("user_id", id).order("created_at", { ascending: false }),
    supabase.from("client_songs").select("*").eq("user_id", id).order("created_at", { ascending: false }),
    supabase.from("appointments").select("*").eq("user_id", id).order("scheduled_at", { ascending: false }),
    supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${user.id},recipient_id.eq.${id}),and(sender_id.eq.${id},recipient_id.eq.${user.id})`)
      .order("created_at", { ascending: true }),
    supabase.from("habits").select("*").eq("user_id", id).order("created_at", { ascending: false }),
    supabase.from("habit_logs").select("habit_id").eq("user_id", id).eq("log_date", todayISODate()),
  ]);

  const progressByWeekId = new Map((progressRows ?? []).map((progress) => [progress.week_id, progress]));
  const weekTitleById = Object.fromEntries(
    (weeks ?? []).map((week) => [week.id, `Semaine ${week.week_number} — ${week.title}`])
  );

  const fullName = [client.first_name, client.last_name].filter(Boolean).join(" ") || "Sans nom";
  const currentWeekEntity = (weeks ?? []).find((week) => week.week_number === client.current_week);
  const activeHabits = (habits ?? []).filter((h) => h.is_active);

  return (
    <div className="flex flex-col gap-8 pb-12">
      <header>
        <Link href="/admin/clients" className="text-xs text-rr-gris transition-colors hover:text-rr-gris-clair">
          ← Retour aux participant·e·s
        </Link>
        <h1 className="mt-3 font-rr-display text-3xl text-rr-ivoire">{fullName}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-rr-gris">
          <span>{client.email}</span>
          <Badge variant="violet">Semaine {client.current_week} / 8</Badge>
          {client.program_start_date && <span>Depuis le {formatDate(client.program_start_date)}</span>}
        </div>
      </header>

      <ClientOverviewBanner
        currentWeek={client.current_week}
        weekTitle={currentWeekEntity?.title ?? null}
        latestBilan={radarRows?.[0] ?? null}
        activeHabitsCount={activeHabits.length}
        doneTodayCount={todayLogs?.length ?? 0}
      />

      <GlassCard className="p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">Réglages du parcours</p>
        <div className="mt-4">
          <ClientSettingsForm client={client} />
        </div>
      </GlassCard>

      {weeks && <ClientProgressPanel weeks={weeks} progressByWeekId={progressByWeekId} />}

      <ClientRadarPanel bilans={radarRows ?? []} />
      <ImportAnalyzerButton clientId={id} />

      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">Habitudes</p>
        <div className="mt-4">
          <AdminHabitsPanel clientId={id} habits={habits ?? []} />
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">Journal</p>
        <div className="mt-4 flex flex-col gap-4">
          {(journalEntries ?? []).length === 0 && (
            <GlassCard className="p-6">
              <p className="text-sm text-rr-gris-clair">Aucune entrée de journal pour le moment.</p>
            </GlassCard>
          )}

          {(journalEntries ?? []).map((entry) => (
            <AdminJournalEntryCard key={entry.id} entry={entry} weekTitleById={weekTitleById} />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">Carnet Re-Naissance™</p>
        <div className="mt-4 flex flex-col gap-4">
          <GlassCard className="p-6">
            <p className="mb-4 text-sm text-rr-gris-clair">Publier une synthèse dans le Carnet</p>
            <CarnetEntryForm clientId={id} />
          </GlassCard>

          {(carnetEntries ?? []).length === 0 && (
            <GlassCard className="p-6">
              <p className="text-sm text-rr-gris-clair">Aucune entrée publiée pour le moment.</p>
            </GlassCard>
          )}

          {(carnetEntries ?? []).map((entry) => (
            <AdminCarnetEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">Chansons personnalisées</p>
        <div className="mt-4 flex flex-col gap-4">
          <GlassCard className="p-6">
            <p className="mb-4 text-sm text-rr-gris-clair">Publier une nouvelle chanson</p>
            <ClientSongForm clientId={id} />
          </GlassCard>

          {(songs ?? []).length === 0 && (
            <GlassCard className="p-6">
              <p className="text-sm text-rr-gris-clair">Aucune chanson publiée pour le moment.</p>
            </GlassCard>
          )}

          {(songs ?? []).map((song) => (
            <AdminClientSongCard key={song.id} song={song} />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">Rendez-vous</p>
        <div className="mt-4 flex flex-col gap-4">
          <SessionProgressPanel appointments={appointments ?? []} />

          {(appointments ?? []).map((appointment) => (
            <AppointmentRow key={appointment.id} appointment={appointment} />
          ))}

          <GlassCard className="p-6">
            <p className="mb-4 text-sm text-rr-gris-clair">Planifier un nouveau rendez-vous</p>
            <AppointmentForm clientId={id} />
          </GlassCard>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">Messages</p>
        <MarkMessagesRead userId={user.id} fromUserId={id} />
        <div className="mt-4">
          <MessageThread messages={messages ?? []} currentUserId={user.id} />
        </div>
        <div className="mt-4">
          <MessageComposer recipientId={id} />
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">Zone sensible</p>
        <div className="mt-4">
          <DeleteClientButton clientId={id} clientName={fullName} />
        </div>
      </div>
    </div>
  );
}

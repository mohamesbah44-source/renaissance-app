import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { ClientSettingsForm } from "@/components/features/admin/ClientSettingsForm";
import { ClientProgressPanel } from "@/components/features/admin/ClientProgressPanel";
import { ClientRadarPanel } from "@/components/features/admin/ClientRadarPanel";
import { AdminJournalEntryCard } from "@/components/features/admin/AdminJournalEntryCard";
import { AppointmentForm } from "@/components/features/admin/AppointmentForm";
import { AppointmentRow } from "@/components/features/admin/AppointmentRow";
import { MessageThread } from "@/components/features/messages/MessageThread";
import { MessageComposer } from "@/components/features/messages/MessageComposer";
import { MarkMessagesRead } from "@/components/features/messages/MarkMessagesRead";
import { formatDate } from "@/lib/utils";
import type { RadarAssessment, RadarPhase } from "@/lib/types/database.types";

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

  const [{ data: weeks }, { data: progressRows }, { data: radarRows }, { data: journalEntries }, { data: appointments }, { data: messages }] =
    await Promise.all([
      supabase.from("weeks").select("*").order("week_number", { ascending: true }),
      supabase.from("user_progress").select("*").eq("user_id", id),
      supabase.from("radar_assessments").select("*").eq("user_id", id),
      supabase.from("journal_entries").select("*").eq("user_id", id).order("entry_date", { ascending: false }),
      supabase.from("appointments").select("*").eq("user_id", id).order("scheduled_at", { ascending: false }),
      supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${id}),and(sender_id.eq.${id},recipient_id.eq.${user.id})`)
        .order("created_at", { ascending: true }),
    ]);

  const progressByWeekId = new Map((progressRows ?? []).map((progress) => [progress.week_id, progress]));
  const radarByPhase = new Map((radarRows ?? []).map((radar) => [radar.phase as RadarPhase, radar as RadarAssessment]));
  const weekTitleById = Object.fromEntries(
    (weeks ?? []).map((week) => [week.id, `Semaine ${week.week_number} — ${week.title}`])
  );

  const fullName = [client.first_name, client.last_name].filter(Boolean).join(" ") || "Sans nom";

  return (
    <div className="flex flex-col gap-8 pb-12">
      <header>
        <Link href="/admin/clients" className="text-xs text-white/40 transition-colors hover:text-white/70">
          ← Retour aux participant·e·s
        </Link>
        <h1 className="mt-3 font-display text-3xl text-white">{fullName}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-white/50">
          <span>{client.email}</span>
          <Badge variant="violet">Semaine {client.current_week} / 8</Badge>
          {client.program_start_date && <span>Depuis le {formatDate(client.program_start_date)}</span>}
        </div>
      </header>

      <GlassCard className="p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Réglages du parcours</p>
        <div className="mt-4">
          <ClientSettingsForm client={client} />
        </div>
      </GlassCard>

      {weeks && <ClientProgressPanel weeks={weeks} progressByWeekId={progressByWeekId} />}

      <ClientRadarPanel assessments={radarByPhase} />

      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Journal</p>
        <div className="mt-4 flex flex-col gap-4">
          {(journalEntries ?? []).length === 0 && (
            <GlassCard className="p-6">
              <p className="text-sm text-white/60">Aucune entrée de journal pour le moment.</p>
            </GlassCard>
          )}

          {(journalEntries ?? []).map((entry) => (
            <AdminJournalEntryCard key={entry.id} entry={entry} weekTitleById={weekTitleById} />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Rendez-vous</p>
        <div className="mt-4 flex flex-col gap-4">
          {(appointments ?? []).map((appointment) => (
            <AppointmentRow key={appointment.id} appointment={appointment} />
          ))}

          <GlassCard className="p-6">
            <p className="mb-4 text-sm text-white/70">Planifier un nouveau rendez-vous</p>
            <AppointmentForm clientId={id} />
          </GlassCard>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Messages</p>
        <MarkMessagesRead userId={user.id} fromUserId={id} />
        <div className="mt-4">
          <MessageThread messages={messages ?? []} currentUserId={user.id} />
        </div>
        <div className="mt-4">
          <MessageComposer recipientId={id} />
        </div>
      </div>
    </div>
  );
}

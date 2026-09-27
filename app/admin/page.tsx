import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatDateTime } from "@/lib/utils";

export default async function AdminOverviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [{ count: clientCount }, { data: unreadMessages }, { data: appointments }, { data: clients }] =
    await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "client"),
      supabase
        .from("messages")
        .select("*")
        .eq("recipient_id", user.id)
        .eq("read", false)
        .order("created_at", { ascending: false }),
      supabase
        .from("appointments")
        .select("*")
        .eq("status", "upcoming")
        .gte("scheduled_at", new Date().toISOString())
        .order("scheduled_at", { ascending: true })
        .limit(5),
      supabase.from("profiles").select("id, first_name, last_name").eq("role", "client"),
    ]);

  const nameById = new Map(
    (clients ?? []).map((client) => [client.id, [client.first_name, client.last_name].filter(Boolean).join(" ") || "Sans nom"])
  );

  return (
    <div className="flex flex-col gap-8 pb-12">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">Admin</p>
        <h1 className="mt-2 font-rr-display text-3xl uppercase tracking-[0.06em] text-rr-ivoire">Vue d&apos;ensemble</h1>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <GlassCard className="p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">Participant·e·s</p>
          <p className="mt-3 font-rr-display text-3xl text-rr-ivoire">{clientCount ?? 0}</p>
        </GlassCard>

        <GlassCard className="p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">Messages non lus</p>
          <p className="mt-3 font-rr-display text-3xl text-rr-ivoire">{unreadMessages?.length ?? 0}</p>
        </GlassCard>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">Messages non lus</p>
        <div className="mt-4 flex flex-col gap-3">
          {(unreadMessages ?? []).length === 0 && (
            <GlassCard className="p-6">
              <p className="text-sm text-rr-gris-clair">Aucun nouveau message.</p>
            </GlassCard>
          )}

          {(unreadMessages ?? []).map((message) => (
            <Link key={message.id} href={`/admin/clients/${message.sender_id}`}>
              <GlassCard className="p-5 transition-colors hover:bg-white/[0.06]">
                <p className="text-sm text-white/80">{nameById.get(message.sender_id) ?? "Participant·e"}</p>
                <p className="mt-1 truncate text-sm text-rr-gris">{message.content}</p>
                <p className="mt-2 text-xs text-white/30">{formatDateTime(message.created_at)}</p>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">Prochains rendez-vous</p>
        <div className="mt-4 flex flex-col gap-3">
          {(appointments ?? []).length === 0 && (
            <GlassCard className="p-6">
              <p className="text-sm text-rr-gris-clair">Aucun rendez-vous à venir.</p>
            </GlassCard>
          )}

          {(appointments ?? []).map((appointment) => (
            <Link key={appointment.id} href={`/admin/clients/${appointment.user_id}`}>
              <GlassCard className="p-5 transition-colors hover:bg-white/[0.06]">
                <p className="font-rr-display text-base text-rr-ivoire">{formatDateTime(appointment.scheduled_at)}</p>
                <p className="mt-1 text-sm text-rr-gris-clair">{nameById.get(appointment.user_id) ?? "Participant·e"}</p>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

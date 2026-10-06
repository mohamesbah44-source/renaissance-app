import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

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

  const unreadCount = unreadMessages?.length ?? 0;

  return (
    <div className="flex flex-col gap-8 pb-12">
      <header className="pt-1">
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">Admin</p>
        <h1 className="mt-3 font-rr-display text-4xl leading-tight text-rr-ivoire">Vue d&apos;ensemble</h1>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <GlassCard className="p-5">
          <p className="text-[11px] uppercase tracking-[0.25em] text-rr-gris">Participant·e·s</p>
          <p className="mt-3 font-rr-display text-4xl text-rr-ivoire">{clientCount ?? 0}</p>
        </GlassCard>

        <GlassCard className={cn("p-5", unreadCount > 0 && "border-rr-or/40")}>
          <p className="text-[11px] uppercase tracking-[0.25em] text-rr-gris">Non lus</p>
          <p className={cn("mt-3 font-rr-display text-4xl", unreadCount > 0 ? "text-rr-or" : "text-rr-ivoire")}>
            {unreadCount}
          </p>
        </GlassCard>
      </div>

      <section>
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">Messages à lire</p>
        <div className="mt-4 flex flex-col gap-3">
          {unreadCount === 0 && (
            <p className="px-4 py-6 text-center font-rr-serif text-base italic text-rr-gris-clair">
              Aucun nouveau message.
            </p>
          )}

          {(unreadMessages ?? []).map((message) => (
            <Link key={message.id} href={`/admin/clients/${message.sender_id}`} className="group block">
              <GlassCard className="p-5 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-rr-or/30">
                <p className="text-sm font-medium text-rr-ivoire">
                  {nameById.get(message.sender_id) ?? "Participant·e"}
                </p>
                <p className="mt-1 truncate text-sm text-rr-gris-clair">{message.content}</p>
                <p className="mt-2 text-xs text-rr-gris">{formatDateTime(message.created_at)}</p>
              </GlassCard>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">Prochains rendez-vous</p>
        <div className="mt-4 flex flex-col gap-3">
          {(appointments ?? []).length === 0 && (
            <p className="px-4 py-6 text-center font-rr-serif text-base italic text-rr-gris-clair">
              Aucun rendez-vous à venir.
            </p>
          )}

          {(appointments ?? []).map((appointment) => (
            <Link key={appointment.id} href={`/admin/clients/${appointment.user_id}`} className="group block">
              <GlassCard className="p-5 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-rr-or/30">
                <p className="font-rr-display text-lg leading-snug text-rr-ivoire">
                  {formatDateTime(appointment.scheduled_at)}
                </p>
                <p className="mt-1 text-sm text-rr-gris-clair">
                  {nameById.get(appointment.user_id) ?? "Participant·e"}
                </p>
              </GlassCard>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

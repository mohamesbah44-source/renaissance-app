import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { InviteMemberForm } from "@/components/features/admin/InviteMemberForm";
import { todayISODate } from "@/lib/habits/streak";

export default async function AdminClientsPage() {
  const supabase = await createClient();

  const [{ data: clients }, { data: progressRows }] = await Promise.all([
    supabase.from("profiles").select("*").eq("role", "client").order("created_at", { ascending: false }),
    supabase.from("user_progress").select("user_id, status").eq("status", "completed"),
  ]);

  const completedCountByUser = new Map<string, number>();
  for (const row of progressRows ?? []) {
    completedCountByUser.set(row.user_id, (completedCountByUser.get(row.user_id) ?? 0) + 1);
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">Admin</p>
        <h1 className="mt-2 font-rr-display text-3xl uppercase tracking-[0.06em] text-rr-ivoire">Participant·e·s</h1>
      </header>

      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">Inviter un membre</p>
        <div className="mt-4">
          <InviteMemberForm defaultDate={todayISODate()} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {(clients ?? []).map((client) => {
          const completed = completedCountByUser.get(client.id) ?? 0;
          const fullName = [client.first_name, client.last_name].filter(Boolean).join(" ") || "Sans nom";

          return (
            <Link key={client.id} href={`/admin/clients/${client.id}`}>
              <GlassCard className="p-5 transition-colors hover:bg-white/[0.06]">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-rr-display text-lg text-rr-ivoire">{fullName}</p>
                    <p className="truncate text-sm text-rr-gris">{client.email}</p>
                  </div>
                  <p className="shrink-0 text-xs text-rr-gris">Semaine {client.current_week} / 8</p>
                </div>
                <ProgressBar value={(completed / 8) * 100} className="mt-4" />
              </GlassCard>
            </Link>
          );
        })}

        {(clients ?? []).length === 0 && (
          <GlassCard className="p-6">
            <p className="text-sm text-rr-gris-clair">Aucun·e participant·e pour le moment.</p>
          </GlassCard>
        )}
      </div>
    </div>
  );
}

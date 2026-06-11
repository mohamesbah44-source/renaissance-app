import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatDateTime } from "@/lib/utils";
import type { Appointment } from "@/lib/types/database.types";

export function NextAppointmentCard({ appointment }: { appointment: Appointment | null }) {
  return (
    <GlassCard className="mt-4 p-6">
      <p className="text-xs uppercase tracking-[0.3em] text-white/40">Prochain rendez-vous</p>

      {appointment ? (
        <div className="mt-3">
          <p className="font-display text-lg text-white">{formatDateTime(appointment.scheduled_at)}</p>
          {appointment.title && <p className="mt-1 text-sm text-white/60">{appointment.title}</p>}
          {appointment.meeting_url && (
            <a
              href={appointment.meeting_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-violet-300 hover:text-violet-200"
            >
              Rejoindre la visio
            </a>
          )}
        </div>
      ) : (
        <p className="mt-3 text-sm text-white/60">Aucun rendez-vous prévu pour le moment.</p>
      )}

      <Link href="/calendrier" className="mt-4 inline-block text-sm text-violet-300 hover:text-violet-200">
        Voir le calendrier
      </Link>
    </GlassCard>
  );
}

import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatDateTime } from "@/lib/utils";
import type { Appointment } from "@/lib/types/database.types";

export function NextAppointmentCard({ appointment }: { appointment: Appointment | null }) {
  return (
    <GlassCard className="mt-5 p-7">
      <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">Prochain rendez-vous</p>

      {appointment ? (
        <div className="mt-4">
          <p className="font-rr-display text-lg text-rr-ivoire">{formatDateTime(appointment.scheduled_at)}</p>
          {appointment.title && <p className="mt-1 text-sm text-rr-gris-clair">{appointment.title}</p>}
          {appointment.meeting_url && (
            <a
              href={appointment.meeting_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-rr-or-clair transition-all duration-300 hover:text-rr-ivoire"
            >
              Rejoindre la visio
            </a>
          )}
        </div>
      ) : (
        <p className="mt-4 text-sm text-rr-gris-clair">Aucun rendez-vous prévu pour le moment.</p>
      )}

      <Link
        href="/calendrier"
        className="mt-5 inline-block text-sm text-rr-or-clair transition-all duration-300 hover:text-rr-ivoire"
      >
        Voir le calendrier
      </Link>
    </GlassCard>
  );
}

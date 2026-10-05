import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatDateTime } from "@/lib/utils";
import type { Appointment } from "@/lib/types/database.types";

export function NextAppointmentCard({ appointment }: { appointment: Appointment | null }) {
  return (
    <Link href="/calendrier" className="group block h-full">
      <GlassCard className="flex h-full flex-col p-5 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-rr-or/30">
        <CalendarDays className="h-5 w-5 text-rr-or" strokeWidth={1.75} />
        <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-rr-gris">Rendez-vous</p>
        {appointment ? (
          <>
            <p className="mt-1.5 font-rr-display text-base leading-snug text-rr-ivoire">
              {formatDateTime(appointment.scheduled_at)}
            </p>
            {appointment.title && (
              <p className="mt-1 line-clamp-1 text-xs text-rr-gris-clair">{appointment.title}</p>
            )}
          </>
        ) : (
          <p className="mt-1.5 text-sm text-rr-gris-clair">Aucun prévu</p>
        )}
      </GlassCard>
    </Link>
  );
}

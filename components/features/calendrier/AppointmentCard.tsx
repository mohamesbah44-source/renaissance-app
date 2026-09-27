import { GlassCard } from "@/components/ui/GlassCard";
import { Badge, type BadgeProps } from "@/components/ui/Badge";
import { cn, formatDateTime } from "@/lib/utils";
import { SESSION_TYPE_LABEL } from "@/lib/parcours/sessions";
import type { Appointment, AppointmentStatus } from "@/lib/types/database.types";

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  upcoming: "À venir",
  completed: "Terminé",
  cancelled: "Annulé",
};

const STATUS_VARIANT: Record<AppointmentStatus, BadgeProps["variant"]> = {
  upcoming: "violet",
  completed: "gold",
  cancelled: "neutral",
};

export function AppointmentCard({ appointment, highlight }: { appointment: Appointment; highlight?: boolean }) {
  return (
    <GlassCard className={cn("p-7", highlight && "border-rr-or/30")}>
      <div className="flex items-center justify-between gap-3">
        <p className="font-rr-display text-lg text-rr-ivoire">{formatDateTime(appointment.scheduled_at)}</p>
        <Badge variant={STATUS_VARIANT[appointment.status]}>{STATUS_LABEL[appointment.status]}</Badge>
      </div>

      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-rr-or/60">
        {SESSION_TYPE_LABEL[appointment.session_type]}
      </p>

      {appointment.title && <p className="mt-2 text-sm text-rr-gris-clair">{appointment.title}</p>}

      {appointment.notes && <p className="mt-2 text-sm leading-relaxed text-rr-gris">{appointment.notes}</p>}

      {appointment.meeting_url && appointment.status === "upcoming" && (
        <a
          href={appointment.meeting_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm text-rr-or-clair transition-all duration-300 hover:text-rr-ivoire"
        >
          Rejoindre la visio
        </a>
      )}
    </GlassCard>
  );
}

import { GlassCard } from "@/components/ui/GlassCard";
import { Badge, type BadgeProps } from "@/components/ui/Badge";
import { cn, formatDateTime } from "@/lib/utils";
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
    <GlassCard className={cn("p-6", highlight && "border-violet-400/30")}>
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-lg text-white">{formatDateTime(appointment.scheduled_at)}</p>
        <Badge variant={STATUS_VARIANT[appointment.status]}>{STATUS_LABEL[appointment.status]}</Badge>
      </div>

      {appointment.title && <p className="mt-2 text-sm text-white/70">{appointment.title}</p>}

      {appointment.notes && <p className="mt-2 text-sm leading-relaxed text-white/50">{appointment.notes}</p>}

      {appointment.meeting_url && appointment.status === "upcoming" && (
        <a
          href={appointment.meeting_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm text-violet-300 hover:text-violet-200"
        >
          Rejoindre la visio
        </a>
      )}
    </GlassCard>
  );
}

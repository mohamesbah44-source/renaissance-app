import { Video } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn, formatDateTime } from "@/lib/utils";
import { SESSION_TYPE_LABEL } from "@/lib/parcours/sessions";
import type { Appointment, AppointmentStatus } from "@/lib/types/database.types";

const STATUS_NOTE: Partial<Record<AppointmentStatus, string>> = {
  completed: "Terminé",
  cancelled: "Annulé",
};

export function AppointmentCard({ appointment, highlight }: { appointment: Appointment; highlight?: boolean }) {
  const isUpcoming = appointment.status === "upcoming";
  const statusNote = STATUS_NOTE[appointment.status];
  const canJoin = Boolean(appointment.meeting_url) && isUpcoming;

  return (
    <GlassCard
      className={cn(
        "p-6",
        highlight && "border-rr-or/40",
        !isUpcoming && "opacity-75"
      )}
    >
      <p className="text-[11px] uppercase tracking-[0.25em] text-rr-or">
        {SESSION_TYPE_LABEL[appointment.session_type]}
        {statusNote && <span className="text-rr-gris"> · {statusNote}</span>}
      </p>

      <p
        className={cn(
          "mt-3 font-rr-display leading-snug text-rr-ivoire",
          highlight ? "text-2xl" : "text-lg",
          appointment.status === "cancelled" && "line-through decoration-rr-gris/60"
        )}
      >
        {formatDateTime(appointment.scheduled_at)}
      </p>

      {appointment.title && <p className="mt-2 text-sm text-rr-gris-clair">{appointment.title}</p>}

      {appointment.notes && (
        <p className="mt-3 text-sm leading-relaxed text-rr-gris">{appointment.notes}</p>
      )}

      {canJoin && (
        <a
          href={appointment.meeting_url as string}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "mt-5 flex h-12 items-center justify-center gap-2 rounded-full text-xs uppercase tracking-[0.25em] transition-all duration-300",
            highlight
              ? "bg-rr-or text-rr-noir hover:bg-rr-or-clair"
              : "border border-rr-or/30 text-rr-or-clair hover:bg-white/[0.05]"
          )}
        >
          <Video className="h-4 w-4" strokeWidth={2} />
          Rejoindre la visio
        </a>
      )}
    </GlassCard>
  );
}

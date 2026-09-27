import { GlassCard } from "@/components/ui/GlassCard";
import { Badge, type BadgeProps } from "@/components/ui/Badge";
import { formatDateTime } from "@/lib/utils";
import { updateAppointmentStatus } from "@/lib/admin/actions";
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

export function AppointmentRow({ appointment }: { appointment: Appointment }) {
  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="font-rr-display text-base text-rr-ivoire">{formatDateTime(appointment.scheduled_at)}</p>
        <div className="flex items-center gap-2">
          <Badge variant="neutral">{SESSION_TYPE_LABEL[appointment.session_type]}</Badge>
          <Badge variant={STATUS_VARIANT[appointment.status]}>{STATUS_LABEL[appointment.status]}</Badge>
        </div>
      </div>

      {appointment.title && <p className="mt-2 text-sm text-rr-gris-clair">{appointment.title}</p>}
      {appointment.notes && <p className="mt-2 text-sm leading-relaxed text-rr-gris">{appointment.notes}</p>}

      {appointment.status === "upcoming" && (
        <div className="mt-3 flex gap-4">
          <form action={updateAppointmentStatus}>
            <input type="hidden" name="id" value={appointment.id} />
            <input type="hidden" name="clientId" value={appointment.user_id} />
            <input type="hidden" name="status" value="completed" />
            <button type="submit" className="text-xs text-rr-or-clair transition-colors hover:text-rr-or-clair">
              Marquer comme terminé
            </button>
          </form>
          <form action={updateAppointmentStatus}>
            <input type="hidden" name="id" value={appointment.id} />
            <input type="hidden" name="clientId" value={appointment.user_id} />
            <input type="hidden" name="status" value="cancelled" />
            <button type="submit" className="text-xs text-white/30 transition-colors hover:text-rr-rouge">
              Annuler
            </button>
          </form>
        </div>
      )}
    </GlassCard>
  );
}

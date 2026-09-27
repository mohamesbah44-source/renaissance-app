import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { AppointmentCard } from "@/components/features/calendrier/AppointmentCard";
import { SessionProgressPanel } from "@/components/features/calendrier/SessionProgressPanel";

export default async function CalendrierPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: appointments } = await supabase
    .from("appointments")
    .select("*")
    .eq("user_id", user.id)
    .order("scheduled_at", { ascending: false });

  const all = appointments ?? [];
  const now = new Date().getTime();

  const upcoming = all
    .filter((appointment) => appointment.status === "upcoming" && new Date(appointment.scheduled_at).getTime() >= now)
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());

  const history = all.filter(
    (appointment) => !(appointment.status === "upcoming" && new Date(appointment.scheduled_at).getTime() >= now)
  );

  const [nextAppointment, ...otherUpcoming] = upcoming;

  return (
    <div className="mx-auto max-w-2xl pb-8">
      <header className="pt-2">
        <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">Calendrier</p>
        <h1 className="mt-2 font-rr-display text-3xl uppercase tracking-[0.06em] text-rr-ivoire">Tes rendez-vous</h1>
        <p className="mt-3 text-sm leading-relaxed text-rr-gris-clair">
          Le fil de tes échanges avec ton accompagnateur·rice, semaine après semaine.
        </p>
      </header>

      <div className="mt-9">
        <SessionProgressPanel appointments={all} />
      </div>

      <div className="mt-9 flex flex-col gap-4">
        <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">Prochain rendez-vous</p>

        {nextAppointment ? (
          <AppointmentCard appointment={nextAppointment} highlight />
        ) : (
          <GlassCard className="p-7">
            <p className="text-sm text-rr-gris-clair">Aucun rendez-vous prévu pour le moment.</p>
          </GlassCard>
        )}

        {otherUpcoming.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))}
      </div>

      {history.length > 0 && (
        <div className="mt-11">
          <p className="text-xs uppercase tracking-[0.3em] text-rr-gris">Historique</p>
          <div className="mt-5 flex flex-col gap-4">
            {history.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

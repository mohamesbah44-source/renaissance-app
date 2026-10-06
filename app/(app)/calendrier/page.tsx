import { ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
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
      <header className="pt-1">
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">Calendrier</p>
        <h1 className="mt-3 font-rr-display text-4xl leading-tight text-rr-ivoire">Tes rendez-vous</h1>
        <p className="mt-4 text-sm leading-relaxed text-rr-gris-clair">
          Le fil de tes échanges avec ton accompagnateur·rice, semaine après semaine.
        </p>
      </header>

      <section className="mt-10">
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-gris">Prochain rendez-vous</p>

        <div className="mt-4 flex flex-col gap-3">
          {nextAppointment ? (
            <AppointmentCard appointment={nextAppointment} highlight />
          ) : (
            <p className="px-4 py-8 text-center font-rr-serif text-lg italic leading-relaxed text-rr-gris-clair">
              Aucun rendez-vous prévu pour le moment.
            </p>
          )}

          {otherUpcoming.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <SessionProgressPanel appointments={all} />
      </section>

      {history.length > 0 && (
        <details className="group mt-10">
          <summary className="flex cursor-pointer list-none items-center justify-between py-2 [&::-webkit-details-marker]:hidden">
            <span className="text-[11px] uppercase tracking-[0.3em] text-rr-gris">
              Historique · {history.length}
            </span>
            <ChevronDown
              className="h-4 w-4 text-rr-gris transition-transform duration-300 group-open:rotate-180"
              strokeWidth={1.75}
            />
          </summary>
          <div className="mt-4 flex flex-col gap-3">
            {history.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

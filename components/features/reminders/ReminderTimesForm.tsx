"use client";

import { useState, useTransition } from "react";
import { saveReminderSettings } from "@/lib/reminders/actions";

type Props = {
  morningEnabled: boolean;
  morningTime: string;
  eveningEnabled: boolean;
  eveningTime: string;
};

export function ReminderTimesForm({ morningEnabled, morningTime, eveningEnabled, eveningTime }: Props) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const timeInput =
    "h-11 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm text-rr-ivoire focus:border-rr-or/50 focus:outline-none";

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSaved(false);
    startTransition(async () => {
      await saveReminderSettings(fd);
      setSaved(true);
    });
  }

  return (
    <form onSubmit={onSubmit} onChange={() => setSaved(false)} className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <label className="flex items-center gap-3 text-sm text-rr-ivoire">
          <input type="checkbox" name="morning_enabled" defaultChecked={morningEnabled} className="h-4 w-4 accent-[#c9a961]" />
          Le matin
        </label>
        <input type="time" name="morning_time" defaultValue={morningTime} required className={timeInput} />
      </div>
      <div className="flex items-center justify-between gap-4">
        <label className="flex items-center gap-3 text-sm text-rr-ivoire">
          <input type="checkbox" name="evening_enabled" defaultChecked={eveningEnabled} className="h-4 w-4 accent-[#c9a961]" />
          Le soir
        </label>
        <input type="time" name="evening_time" defaultValue={eveningTime} required className={timeInput} />
      </div>
      <p className="text-xs text-rr-gris">
        Le rappel du matin ne part pas si ton check-in est déjà fait. Celui du soir ne part pas si ta journée est déjà terminée.
        Heure de Paris.
      </p>
      <button
        type="submit"
        disabled={pending}
        className="h-12 rounded-full border border-rr-or/40 text-sm text-rr-or transition-colors hover:bg-rr-or/10 disabled:opacity-50"
      >
        {pending ? "Enregistrement…" : "Enregistrer mes horaires"}
      </button>
      {saved && <p className="text-center text-sm text-rr-or">Tes horaires sont enregistrés.</p>}
    </form>
  );
}

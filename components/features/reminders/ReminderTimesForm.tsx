"use client";

import { useState, useTransition } from "react";
import { saveReminderSettings } from "@/lib/reminders/actions";

type Props = {
  morningEnabled: boolean;
  morningTime: string;
  eveningEnabled: boolean;
  eveningTime: string;
};

function Row({
  title,
  hint,
  name,
  enabled,
  time,
}: {
  title: string;
  hint: string;
  name: "morning" | "evening";
  enabled: boolean;
  time: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-3xl border border-rr-or/20 bg-white/[0.05] px-5 py-4">
      <div>
        <p className="font-rr-serif text-[22px] italic leading-tight text-rr-ivoire">{title}</p>
        <p className="mt-1 text-xs text-rr-gris-clair">{hint}</p>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="time"
          name={`${name}_time`}
          defaultValue={time}
          required
          aria-label={`Heure du rappel : ${title}`}
          className="h-10 rounded-full border border-rr-ivoire/20 bg-transparent px-4 font-rr-label text-[15px] tracking-[0.08em] text-rr-ivoire focus:border-rr-or/60 focus:outline-none"
        />
        <label className="relative inline-flex cursor-pointer items-center" aria-label={`Activer : ${title}`}>
          <input type="checkbox" name={`${name}_enabled`} defaultChecked={enabled} className="peer sr-only" />
          <span className="h-[30px] w-[50px] rounded-full bg-white/[0.14] transition-colors duration-300 peer-checked:bg-rr-or peer-focus-visible:ring-2 peer-focus-visible:ring-rr-or/60" />
          <span className="pointer-events-none absolute left-[3px] top-[3px] h-6 w-6 rounded-full bg-rr-ivoire transition-all duration-300 peer-checked:left-[23px] peer-checked:bg-rr-noir" />
        </label>
      </div>
    </div>
  );
}

export function ReminderTimesForm({ morningEnabled, morningTime, eveningEnabled, eveningTime }: Props) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

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
    <form onSubmit={onSubmit} onChange={() => setSaved(false)} className="flex flex-col gap-4">
      <Row title="Matin" hint="Ouvrir ta journée" name="morning" enabled={morningEnabled} time={morningTime} />
      <Row title="Soir" hint="Ralentir, écrire" name="evening" enabled={eveningEnabled} time={eveningTime} />

      <p className="px-1 text-xs leading-relaxed text-rr-gris">
        Le rappel du matin ne part pas si ton check-in est déjà fait. Celui du soir ne part pas si ta journée est déjà
        terminée. Heure de Paris.
      </p>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 h-14 rounded-full bg-rr-or text-[15px] font-medium text-rr-noir transition-opacity duration-300 hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Enregistrement…" : "Enregistrer"}
      </button>
      {saved && <p className="text-center text-sm text-rr-or">Tes horaires sont enregistrés.</p>}
    </form>
  );
}

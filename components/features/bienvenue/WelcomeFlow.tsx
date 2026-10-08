"use client";

import { useState } from "react";
import { completeOnboarding } from "@/lib/onboarding/actions";
import { ReminderSwitch } from "@/components/features/reminders/ReminderSwitch";
import { cn } from "@/lib/utils";

const STEPS = 4;

function ScaleInput({ name, label, low, high }: { name: string; label: string; low: string; high: string }) {
  return (
    <fieldset>
      <legend className="text-sm text-rr-ivoire">{label}</legend>
      <div className="mt-3 flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="flex-1">
            <input type="radio" name={name} value={n} className="peer sr-only" />
            <span className="flex h-11 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] text-sm text-rr-gris-clair transition-all duration-300 peer-checked:border-rr-or peer-checked:bg-rr-or/15 peer-checked:text-rr-or peer-focus-visible:ring-2 peer-focus-visible:ring-rr-or/50">
              {n}
            </span>
          </label>
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] text-rr-gris">
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </fieldset>
  );
}

const primary =
  "h-14 w-full rounded-full bg-rr-or text-[15px] font-medium text-rr-noir transition-opacity hover:opacity-90";

export function WelcomeFlow({ firstName }: { firstName: string }) {
  const [step, setStep] = useState(0);
  const next = () => setStep((s) => Math.min(s + 1, STEPS - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 pb-10 pt-10">
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.35em] text-rr-or">Re-Naissance™</p>
        <div className="flex gap-1.5" role="img" aria-label={`Étape ${step + 1} sur ${STEPS}`}>
          {Array.from({ length: STEPS }, (_, i) => (
            <span key={i} className={cn("h-1 w-6 rounded-full", i <= step ? "bg-rr-or" : "bg-white/10")} />
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center py-10">
        {step === 0 && (
          <div>
            <h1 className="font-rr-display text-4xl leading-tight text-rr-ivoire">Bienvenue, {firstName}.</h1>
            <p className="mt-6 font-rr-serif text-xl italic leading-relaxed text-rr-gris-clair">
              Pendant 8 semaines, tu reviens à toi. Pas à pas, sans pression, à ton rythme.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-rr-gris-clair">Cet espace est le tien.</p>
          </div>
        )}

        {step === 1 && (
          <div>
            <h1 className="font-rr-display text-3xl leading-tight text-rr-ivoire">Comment ça se passe</h1>
            <ul className="mt-8 flex flex-col gap-6">
              <li className="text-[15px] leading-relaxed text-rr-gris-clair">
                <span className="text-rr-ivoire">Chaque jour, une question et une mission.</span> Quelques minutes suffisent.
              </li>
              <li className="text-[15px] leading-relaxed text-rr-gris-clair">
                <span className="text-rr-ivoire">La régularité compte plus que la perfection.</span> Un jour manqué n&apos;efface rien.
              </li>
              <li className="text-[15px] leading-relaxed text-rr-gris-clair">
                <span className="text-rr-ivoire">Quand c&apos;est lourd,</span> un bouton « J&apos;ai besoin de revenir à moi » t&apos;attend, toujours.
              </li>
            </ul>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="font-rr-display text-3xl leading-tight text-rr-ivoire">Un rappel, en douceur</h1>
            <p className="mt-4 text-[15px] leading-relaxed text-rr-gris-clair">
              Deux invitations par jour, jamais plus : le matin et le soir. Tu pourras choisir les heures plus tard.
            </p>
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <ReminderSwitch />
            </div>
          </div>
        )}

        {step === 3 && (
          <form action={completeOnboarding} id="welcome-form" className="flex flex-col gap-7">
            <div>
              <h1 className="font-rr-display text-3xl leading-tight text-rr-ivoire">Comment tu arrives ?</h1>
              <p className="mt-4 text-[15px] leading-relaxed text-rr-gris-clair">
                30 secondes pour poser ton point de départ. Tu peux aussi passer cette étape.
              </p>
            </div>
            <ScaleInput name="energy" label="Mon niveau d'énergie" low="Très bas" high="Très haut" />
            <ScaleInput name="tension" label="Ma tension intérieure" low="Détendu·e" high="Très tendu·e" />
          </form>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {step < STEPS - 1 ? (
          <button type="button" onClick={next} className={primary}>
            {step === 0 ? "Commencer" : "Continuer"}
          </button>
        ) : (
          <button type="submit" form="welcome-form" className={primary}>
            Entrer dans mon espace
          </button>
        )}
        {step > 0 && (
          <button type="button" onClick={back} className="text-sm text-rr-gris transition-colors hover:text-rr-gris-clair">
            Retour
          </button>
        )}
      </div>
    </div>
  );
}

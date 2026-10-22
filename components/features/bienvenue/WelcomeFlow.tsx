"use client";

import { useState } from "react";
import Link from "next/link";
import { completeOnboarding } from "@/lib/onboarding/actions";
import { ReminderSwitch } from "@/components/features/reminders/ReminderSwitch";
import WelcomeVideo from "@/components/features/bienvenue/WelcomeVideo";
import { cn } from "@/lib/utils";

const STEPS = 5;

function ScaleInput({ name, label, low, high }: { name: string; label: string; low: string; high: string }) {
  return (
    <fieldset>
      <legend className="font-rr-serif text-[22px] italic leading-tight text-rr-ivoire">{label}</legend>
      <div className="mt-4 flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="flex-1">
            <input type="radio" name={name} value={n} className="peer sr-only" />
            <span className="flex h-12 cursor-pointer items-center justify-center rounded-full border border-white/[0.12] text-sm text-rr-gris-clair transition-all duration-300 peer-checked:border-rr-or peer-checked:bg-rr-or/10 peer-checked:text-rr-or peer-focus-visible:ring-2 peer-focus-visible:ring-rr-or/50">
              {n}
            </span>
          </label>
        ))}
      </div>
      <div className="mt-2 flex justify-between px-1 text-[11px] text-rr-gris">
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </fieldset>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-[14px] leading-relaxed text-rr-gris-clair">
      <i className="mt-[9px] block h-[5px] w-[5px] shrink-0 rounded-full bg-rr-or" />
      <span>{children}</span>
    </li>
  );
}

const primary =
  "flex h-14 w-full items-center justify-center rounded-full bg-rr-or text-[15px] font-medium text-rr-noir transition-opacity duration-300 hover:opacity-90";

export function WelcomeFlow({
  firstName,
  hasRadar,
  initialStep,
}: {
  firstName: string;
  hasRadar: boolean;
  initialStep: number;
}) {
  const [step, setStep] = useState(Math.min(Math.max(initialStep, 0), STEPS - 1));
  const next = () => setStep((s) => Math.min(s + 1, STEPS - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col px-7 pb-10 pt-12">
      <div className="flex items-center justify-between">
        <p className="font-rr-label text-[10px] uppercase tracking-[0.32em] text-rr-or">Bienvenue</p>
        <div className="flex gap-1.5" role="img" aria-label={`Étape ${step + 1} sur ${STEPS}`}>
          {Array.from({ length: STEPS }, (_, i) => (
            <span key={i} className={cn("h-[3px] w-[18px] rounded-full", i <= step ? "bg-rr-or" : "bg-white/15")} />
          ))}
        </div>
      </div>

      <div key={step} className="rr-enter flex flex-1 flex-col justify-center py-10">
        {step === 0 && (
          <div className="flex flex-col items-center text-center">
            <span
              aria-hidden
              className="animate-breathe block h-[100px] w-[100px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, #ddd6fe 0%, #a78bfa 24%, #7c3aed 54%, #4c1d95 84%, #2e1065 100%)",
                boxShadow: "0 0 70px 10px rgba(139,92,246,0.5), inset 0 0 26px rgba(255,255,255,0.14)",
              }}
            />
            <h1 className="mt-12 font-rr-display text-[42px] leading-[1.04] text-rr-ivoire">Bienvenue, {firstName}.</h1>
            <p className="mt-6 font-rr-serif text-xl italic leading-relaxed text-rr-gris-clair">
              Pendant 8 semaines, tu reviens à toi. Pas à pas, sans pression, à ton rythme.
            </p>
            <p className="mt-4 text-sm text-rr-gris">Cet espace est le tien.</p>
          </div>
        )}

        {step === 1 && (
          <div>
            <h1 className="font-rr-display text-[40px] leading-[1.04] text-rr-ivoire">Ton point de départ.</h1>
            <p className="mt-5 font-rr-serif text-lg italic leading-relaxed text-rr-gris-clair">
              Avant de te présenter l&apos;application, un premier temps pour toi : le Renaissance Radar™.
            </p>
            <ul className="mt-8 flex flex-col gap-4">
              <Bullet>
                <span className="text-rr-ivoire">60 questions, une à la fois.</span> Compte une dizaine de minutes,
                dans le calme.
              </Bullet>
              <Bullet>
                <span className="text-rr-ivoire">Il n&apos;y a pas de bonne réponse.</span> Seulement la tienne, à
                cet instant.
              </Bullet>
              <Bullet>
                <span className="text-rr-ivoire">Il dessine ta carte intérieure :</span> 3 cercles, 12 piliers.
                Ce n&apos;est pas une note, c&apos;est un miroir.
              </Bullet>
            </ul>
            <div className="mt-8 rounded-3xl border border-rr-or/20 bg-white/[0.05] p-5">
              <p className="text-sm leading-relaxed text-rr-ivoire">
                Chaque semaine, tu le refais en <span className="text-rr-or">1 minute</span>, pour voir ce qui
                bouge en toi.
              </p>
            </div>
            {hasRadar && (
              <p className="mt-6 font-rr-serif text-base italic text-rr-or-clair">
                Ton Radar est déjà enregistré. Merci.
              </p>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="font-rr-display text-[40px] leading-[1.04] text-rr-ivoire">
              Ton espace,
              <br />
              en 1 min 30.
            </h1>
            <div className="mx-auto mt-8 w-full max-w-[230px]">
              <WelcomeVideo />
            </div>
            <ul className="mt-9 flex flex-col gap-3.5">
              <Bullet>Une journée, un seul geste à la fois.</Bullet>
              <Bullet>
                Chaque semaine, ton Radar express : 1 minute pour voir ton évolution se dessiner.
              </Bullet>
              <Bullet>La régularité compte plus que la perfection. Un jour manqué n&apos;efface rien.</Bullet>
              <Bullet>
                Quand c&apos;est lourd, un bouton « J&apos;ai besoin de revenir à moi » t&apos;attend, toujours.
              </Bullet>
            </ul>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="font-rr-display text-[40px] leading-[1.04] text-rr-ivoire">Un rappel, en douceur.</h1>
            <p className="mt-5 text-[15px] leading-relaxed text-rr-gris-clair">
              Deux invitations par jour, jamais plus : le matin et le soir. Tu pourras choisir les heures plus tard.
            </p>
            <div className="mt-8 rounded-3xl border border-rr-or/20 bg-white/[0.05] p-5">
              <ReminderSwitch />
            </div>
          </div>
        )}

        {step === 4 && (
          <form action={completeOnboarding} id="welcome-form" className="flex flex-col gap-9">
            <div>
              <h1 className="font-rr-display text-[40px] leading-[1.04] text-rr-ivoire">Comment tu arrives ?</h1>
              <p className="mt-5 text-[15px] leading-relaxed text-rr-gris-clair">
                30 secondes pour poser ton point de départ du jour. Tu peux aussi passer cette étape.
              </p>
            </div>
            <ScaleInput name="energy" label="Mon niveau d'énergie" low="Très bas" high="Très haut" />
            <ScaleInput name="tension" label="Ma tension intérieure" low="Détendu·e" high="Très tendu·e" />
          </form>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {step === STEPS - 1 ? (
          <button type="submit" form="welcome-form" className={primary}>
            Entrer dans mon espace
          </button>
        ) : step === 1 && !hasRadar ? (
          <Link href="/bienvenue/radar" className={primary}>
            Faire mon Radar
          </Link>
        ) : (
          <button type="button" onClick={next} className={primary}>
            {step === 0 ? "Commencer" : "Continuer"}
          </button>
        )}
        {step > 0 && (
          <button
            type="button"
            onClick={back}
            className="h-9 text-sm text-rr-gris transition-colors duration-300 hover:text-rr-gris-clair"
          >
            Retour
          </button>
        )}
      </div>
    </div>
  );
}

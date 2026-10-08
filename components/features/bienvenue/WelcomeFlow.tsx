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
  "flex h-14 w-full items-center justify-center rounded-full bg-rr-or text-[15px] font-medium text-rr-noir transition-opacity hover:opacity-90";

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
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 pb-10 pt-10">
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.35em] text-rr-or">Re-Naissance™</p>
        <div className="flex gap-1.5" role="img" aria-label={`Étape ${step + 1} sur ${STEPS}`}>
          {Array.from({ length: STEPS }, (_, i) => (
            <span key={i} className={cn("h-1 w-5 rounded-full", i <= step ? "bg-rr-or" : "bg-white/10")} />
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
            <h1 className="font-rr-display text-3xl leading-tight text-rr-ivoire">Ton point de départ</h1>
            <p className="mt-4 font-rr-serif text-lg italic leading-relaxed text-rr-gris-clair">
              Avant de te présenter l&apos;application, un premier temps pour toi : le Renaissance Radar™.
            </p>
            <ul className="mt-8 flex flex-col gap-5">
              <li className="text-[15px] leading-relaxed text-rr-gris-clair">
                <span className="text-rr-ivoire">60 questions, une à la fois.</span> Compte une dizaine de minutes,
                dans le calme.
              </li>
              <li className="text-[15px] leading-relaxed text-rr-gris-clair">
                <span className="text-rr-ivoire">Il n&apos;y a pas de bonne réponse.</span> Seulement la tienne, à
                cet instant.
              </li>
              <li className="text-[15px] leading-relaxed text-rr-gris-clair">
                <span className="text-rr-ivoire">Il dessine ta carte intérieure :</span> 3 cercles, 12 piliers.
                Ce n&apos;est pas une note, c&apos;est un miroir.
              </li>
            </ul>
            <div className="mt-8 rounded-2xl border border-rr-or/25 bg-rr-or/[0.05] p-5">
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
            <h1 className="font-rr-display text-3xl leading-tight text-rr-ivoire">Comment ça se passe</h1>
            <p className="mt-4 font-rr-serif text-lg italic leading-relaxed text-rr-gris-clair">
              Une présentation de l&apos;application,

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Pause, Play, X } from "lucide-react";
import { completePractice, type PracticeMode } from "@/lib/today/practice-actions";
import { cn } from "@/lib/utils";

type Kind = "inhale" | "hold" | "exhale" | "contract" | "release";
type Segment = { kind: Kind; seconds: number; phase: string };

const WORD: Record<Kind, string> = {
  inhale: "Inspire",
  hold: "Retiens",
  exhale: "Expire",
  contract: "Contracte doucement",
  release: "Relâche",
};

const SCALE: Record<Kind, number> = { inhale: 1, hold: 1, exhale: 0.62, contract: 0.82, release: 0.62 };

function cycles(n: number, make: () => Segment[]): Segment[] {
  return Array.from({ length: n }, make).flat();
}

function buildSegments(mode: PracticeMode, retention: boolean, eveningSeconds: number): Segment[] {
  if (mode !== "morning") {
    const n = Math.max(1, Math.round(eveningSeconds / 10));
    return cycles(n, () => [
      { kind: "inhale", seconds: 4, phase: "Respiration 4/6" },
      { kind: "exhale", seconds: 6, phase: "Respiration 4/6" },
    ]);
  }
  const p1 = cycles(12, () => [
    { kind: "inhale", seconds: 5, phase: "Respiration 5/5" },
    { kind: "exhale", seconds: 5, phase: "Respiration 5/5" },
  ]);
  const p2 = cycles(4, () => [
    { kind: "inhale", seconds: 4, phase: "Respiration 4-7-8" },
    ...(retention ? ([{ kind: "hold", seconds: 7, phase: "Respiration 4-7-8" }] as Segment[]) : []),
    { kind: "exhale", seconds: 8, phase: "Respiration 4-7-8" },
  ]);
  const p3 = cycles(3, () => [
    { kind: "contract", seconds: 10, phase: "Contraction et relâchement" },
    { kind: "release", seconds: 10, phase: "Contraction et relâchement" },
  ]);
  return [...p1, ...p2, ...p3];
}

interface BreathingPlayerProps {
  mode: PracticeMode;
  retentionAllowed: boolean;
}

export function BreathingPlayer({ mode, retentionAllowed }: BreathingPlayerProps) {
  const dark = mode !== "morning";
  const [status, setStatus] = useState<"idle" | "running" | "paused" | "done">("idle");
  const [retention, setRetention] = useState(false);
  const [duration, setDuration] = useState(mode === "sleep" ? 600 : 300);
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const savedRef = useRef(false);

  const segments = useMemo(() => buildSegments(mode, retention && retentionAllowed, duration), [mode, retention, retentionAllowed, duration]);
  const total = useMemo(() => segments.reduce((s, x) => s + x.seconds, 0), [segments]);
  const current = segments[Math.min(index, segments.length - 1)];

  function start() {
    setIndex(0);
    setRemaining(segments[0].seconds);
    savedRef.current = false;
    setStatus("running");
  }

  // Horloge : décompte précis basé sur l'heure réelle.
  useEffect(() => {
    if (status !== "running") return;
    let last = Date.now();
    const id = setInterval(() => {
      const now = Date.now();
      const dt = (now - last) / 1000;
      last = now;
      setRemaining((r) => r - dt);
    }, 100);
    return () => clearInterval(id);
  }, [status]);

  // Passage au segment suivant, ou fin de la pratique.
  useEffect(() => {
    if (status !== "running" || remaining > 0) return;
    if (index + 1 < segments.length) {
      setIndex(index + 1);
      setRemaining(segments[index + 1].seconds);
    } else {
      setStatus("done");
    }
  }, [remaining, status, index, segments]);

  // Enregistrement automatique à la fin.
  useEffect(() => {
    if (status !== "done" || savedRef.current) return;
    savedRef.current = true;
    void completePractice(mode, total);
  }, [status, mode, total]);

  const active = status === "running" || status === "paused";
  const scale = active ? SCALE[current.kind] : 0.62;
  const dur = current.kind === "hold" ? 0.5 : current.seconds;

  const shell = cn(
    "fixed inset-0 z-50 flex flex-col items-center justify-between overflow-y-auto px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]",
    dark ? "bg-[#07060a] text-rr-gris-clair" : "bg-rr-noir text-rr-ivoire"
  );
  const accent = dark ? "border-rr-gris/40 bg-white/[0.03]" : "border-rr-or/50 bg-rr-or/10";

  return (
    <div className={shell}>
      <div className="flex w-full max-w-md items-center justify-between">
        <p className={cn("text-[11px] uppercase tracking-[0.3em]", dark ? "text-rr-gris" : "text-rr-or")}>
          {mode === "morning" ? "Routine du matin" : mode === "sleep" ? "Pour t'endormir" : "Routine du soir"}
        </p>
        <Link
          href="/aujourdhui"
          aria-label="Quitter la pratique"
          className="flex h-10 w-10 items-center justify-center rounded-full text-rr-gris transition-colors hover:text-rr-ivoire"
        >
          <X className="h-5 w-5" strokeWidth={1.75} />
        </Link>
      </div>

      <div className="flex w-full max-w-md flex-1 flex-col items-center justify-center py-8 text-center">
        {status === "idle" && (
          <>
            <h1 className="font-rr-display text-3xl leading-tight">
              {mode === "morning" ? "Ouvrir ta journée." : mode === "sleep" ? "Laisse venir le calme." : "Ralentir, doucement."}
            </h1>
            <p className="mt-4 font-rr-serif text-lg italic leading-relaxed text-rr-gris-clair">
              {mode === "morning"
                ? "Trois temps : respiration 5/5, respiration 4-7-8, puis contraction et relâchement. Environ 5 minutes."
                : "Inspire sur 4 temps, expire sur 6. Installe-toi confortablement et suis le rythme du cercle."}
            </p>

            {mode !== "morning" && (
              <div className="mt-8 flex gap-2" role="radiogroup" aria-label="Durée">
                {[180, 300, 600].map((s) => (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={duration === s}
                    onClick={() => setDuration(s)}
                    className={cn(
                      "h-11 rounded-full border px-5 text-sm transition-colors",
                      duration === s ? "border-rr-gris-clair text-rr-ivoire" : "border-white/10 text-rr-gris hover:text-rr-gris-clair"
                    )}
                  >
                    {s / 60} min
                  </button>
                ))}
              </div>
            )}

            {mode === "morning" && retentionAllowed && (
              <label className="mt-8 flex items-start gap-3 text-left text-sm text-rr-gris-clair">
                <input
                  type="checkbox"
                  checked={retention}
                  onChange={(e) => setRetention(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-[#c9a96e]"
                />
                <span>
                  Avec rétention du souffle (optionnel).
                  <span className="block text-xs text-rr-gris">Interromps-toi à tout moment si tu ressens de l&apos;inconfort.</span>
                </span>
              </label>
            )}

            <button
              type="button"
              onClick={start}
              className={cn(
                "mt-10 h-14 w-full rounded-full text-[15px] font-medium transition-opacity hover:opacity-90",
                dark ? "border border-rr-gris/50 text-rr-ivoire" : "bg-rr-or text-rr-noir"
              )}
            >
              Commencer
            </button>
          </>
        )}

        {active && (
          <>
            <div className="relative flex h-72 w-72 max-w-full items-center justify-center" aria-hidden="true">
              <span
                className={cn("absolute inset-0 rounded-full border transition-transform ease-in-out", accent)}
                style={{ transform: `scale(${scale})`, transitionDuration: `${dur}s` }}
              />
            </div>
            <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-rr-gris">{current.phase}</p>
            <p aria-live="polite" className="mt-3 font-rr-display text-3xl">
              {status === "paused" ? "En pause" : WORD[current.kind]}
            </p>
            {!dark && <p className="mt-2 text-sm text-rr-gris">{Math.max(1, Math.ceil(remaining))}</p>}
            {current.kind === "contract" && (
              <p className="mt-3 text-sm text-rr-gris-clair">Une contraction légère et agréable, jamais douloureuse.</p>
            )}
            <button
              type="button"
              onClick={() => setStatus(status === "paused" ? "running" : "paused")}
              className="mt-8 flex h-12 items-center gap-2 rounded-full border border-white/15 px-6 text-sm text-rr-gris-clair transition-colors hover:text-rr-ivoire"
            >
              {status === "paused" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              {status === "paused" ? "Reprendre" : "Pause"}
            </button>
          </>
        )}

        {status === "done" && (
          <>
            {mode === "morning" ? (
              <>
                <h1 className="font-rr-display text-3xl leading-tight">✓ Routine du matin terminée</h1>
                <p className="mt-4 font-rr-serif text-lg italic text-rr-gris-clair">Ta journée peut commencer.</p>
              </>
            ) : (
              <p className="font-rr-serif text-xl italic leading-relaxed text-rr-gris-clair">
                La pratique est terminée. Tu peux maintenant laisser ton corps se déposer et fermer les yeux.
              </p>
            )}
            <Link
              href="/aujourdhui"
              className="mt-10 flex h-12 items-center rounded-full border border-white/15 px-8 text-sm text-rr-gris-clair transition-colors hover:text-rr-ivoire"
            >
              Retour
            </Link>
          </>
        )}
      </div>

      <div className="h-6" />
    </div>
  );
}

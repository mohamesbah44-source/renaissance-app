"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

type Phase = { label: string; sec: number; kind: "in" | "hold" | "out" };

interface Session {
  id: string;
  title: string;
  rhythm: string;
  tagline: string;
  phases: Phase[];
  cycles: number;
  why: string;
  guide?: string[];
  star?: boolean;
}

const SESSIONS: Session[] = [
  {
    id: "478",
    title: "Apaisement profond",
    rhythm: "4 · 7 · 8",
    tagline: "Retrouver du calme en moins de 2 minutes.",
    phases: [
      { label: "Inspire", sec: 4, kind: "in" },
      { label: "Retiens", sec: 7, kind: "hold" },
      { label: "Expire lentement", sec: 8, kind: "out" },
    ],
    cycles: 6,
    star: true,
    why: "Ton souffle sort deux fois plus longtemps qu'il n'entre. C'est la sortie lente qui envoie à ton corps le signal de redescendre.",
  },
  {
    id: "46",
    title: "Retour au calme",
    rhythm: "4 · 6",
    tagline: "Le plus doux pour commencer, sans rétention.",
    phases: [
      { label: "Inspire", sec: 4, kind: "in" },
      { label: "Expire lentement", sec: 6, kind: "out" },
    ],
    cycles: 18,
    why: "Idéal si la rétention te met mal à l'aise. L'expiration reste plus longue que l'inspiration.",
  },
  {
    id: "soupir",
    title: "Soupir apaisant",
    rhythm: "2 + 1 · 6",
    tagline: "Relâcher la tension d'un coup.",
    phases: [
      { label: "Inspire", sec: 2, kind: "in" },
      { label: "Petit complément", sec: 1, kind: "in" },
      { label: "Expire longuement", sec: 6, kind: "out" },
    ],
    cycles: 10,
    why: "Une double inspiration par le nez, puis un long soupir par la bouche : très efficace pour relâcher une tension qui monte.",
  },
  {
    id: "meditation",
    title: "Méditation de présence",
    rhythm: "5 · 5",
    tagline: "5 minutes pour revenir à toi.",
    phases: [
      { label: "Inspire", sec: 5, kind: "in" },
      { label: "Expire", sec: 5, kind: "out" },
    ],
    cycles: 30,
    why: "Un rythme régulier et lent, avec des consignes douces pour ancrer ton attention dans le moment présent.",
    guide: [
      "Installe-toi. Laisse tes épaules descendre.",
      "Sens l'air entrer, puis sortir. Rien d'autre à faire.",
      "Si une pensée arrive, laisse-la passer comme un nuage.",
      "Sens le poids de ton corps, sa chaleur, son appui.",
      "Ton souffle est ton ancre. Reviens à lui, doucement.",
      "Remarque ce qui est plus calme qu'au début.",
    ],
  },
];

function fmt(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return m > 0 ? `${m} min${s ? ` ${s} s` : ""}` : `${s} s`;
}

function SessionRunner({ session, onClose }: { session: Session; onClose: () => void }) {
  const { phases, cycles } = session;
  const cycleLen = useMemo(() => phases.reduce((a, p) => a + p.sec, 0), [phases]);
  const total = cycleLen * cycles;
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(true);
  const startRef = useRef<number>(Date.now());
  const baseRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    startRef.current = Date.now();
    const id = setInterval(() => {
      const e = baseRef.current + (Date.now() - startRef.current) / 1000;
      if (e >= total) {
        baseRef.current = total;
        setElapsed(total);
        setRunning(false);
        clearInterval(id);
      } else {
        setElapsed(e);
      }
    }, 100);
    return () => {
      baseRef.current = Math.min(total, baseRef.current + (Date.now() - startRef.current) / 1000);
      clearInterval(id);
    };
  }, [running, total]);

  const done = elapsed >= total;
  const inCycle = elapsed % cycleLen;
  let acc = 0;
  let current = phases[0];
  let phaseStart = 0;
  for (const p of phases) {
    if (inCycle < acc + p.sec) {
      current = p;
      phaseStart = acc;
      break;
    }
    acc += p.sec;
    current = p;
    phaseStart = acc - p.sec;
  }
  const remain = Math.max(1, Math.ceil(current.sec - (inCycle - phaseStart)));
  const cycleNo = Math.min(cycles, Math.floor(elapsed / cycleLen) + 1);

  // Échelle du cercle : monte à l'inspiration, reste en haut à la rétention, descend à l'expiration.
  const target = current.kind === "out" ? 0.55 : 1;
  const guide = session.guide
    ? session.guide[Math.min(session.guide.length - 1, Math.floor((elapsed / total) * session.guide.length))]
    : null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-rr-noir/95 px-6 pb-10 pt-14 backdrop-blur-md">
      <div className="text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or-clair/70">{session.rhythm}</p>
        <h2 className="mt-2 font-rr-display text-3xl text-rr-ivoire">{session.title}</h2>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative flex h-72 w-72 items-center justify-center">
          <div
            className="absolute h-full w-full rounded-full bg-rr-or/10 blur-2xl"
            style={{
              transform: `scale(${done ? 0.8 : target})`,
              transition: `transform ${done ? 1 : current.sec}s ease-in-out`,
            }}
          />
          <div
            className="absolute h-full w-full rounded-full border border-rr-or/50 bg-gradient-to-br from-rr-or/30 to-rr-or/5"
            style={{
              transform: `scale(${done ? 0.8 : target})`,
              transition: `transform ${done ? 1 : current.sec}s ease-in-out`,
            }}
          />
          <div className="relative text-center">
            {done ? (
              <p className="font-rr-serif text-2xl italic text-rr-ivoire">Terminé</p>
            ) : (
              <>
                <p className="font-rr-serif text-2xl italic text-rr-ivoire">{current.label}</p>
                <p className="mt-1 font-rr-display text-5xl text-rr-or">{remain}</p>
              </>
            )}
          </div>
        </div>
        <p className="mt-8 min-h-[3rem] max-w-xs text-center font-rr-serif text-base italic leading-snug text-rr-gris-clair">
          {done ? "Prends un instant pour sentir ce qui a changé." : guide ?? `Cycle ${cycleNo} sur ${cycles}`}
        </p>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-3">
        <div className="h-1 w-full rounded-full bg-white/10">
          <div className="h-1 rounded-full bg-rr-or transition-all" style={{ width: `${(elapsed / total) * 100}%` }} />
        </div>
        {!done && (
          <button
            type="button"
            onClick={() => setRunning((r) => !r)}
            className="rounded-full border border-rr-or/40 px-5 py-3.5 text-sm text-rr-ivoire transition-colors hover:bg-rr-or/10"
          >
            {running ? "Pause" : "Reprendre"}
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-white/10 px-5 py-3.5 text-sm text-rr-gris-clair transition-colors hover:bg-white/[0.05]"
        >
          {done ? "Fermer" : "Arrêter"}
        </button>
      </div>
    </div>
  );
}

export function RespirationSessions() {
  const [active, setActive] = useState<Session | null>(null);

  return (
    <div>
      <section className="mt-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">Pourquoi le 4 · 7 · 8</p>
        <GlassCard className="mt-4 p-5">
          <p className="font-rr-serif text-lg italic leading-snug text-rr-ivoire">
            Une expiration plus longue que l&apos;inspiration dit à ton corps : tu peux relâcher.
          </p>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm leading-relaxed text-rr-gris-clair">
            <li>
              <span className="text-rr-ivoire">Calmer le système nerveux.</span> L&apos;expiration longue active le frein
              naturel du corps (le parasympathique) et fait baisser la tension.
            </li>
            <li>
              <span className="text-rr-ivoire">Apaiser le mental.</span> Compter occupe l&apos;attention et coupe le flot
              des pensées.
            </li>
            <li>
              <span className="text-rr-ivoire">Mieux dormir.</span> Pratiquée le soir, elle aide à relâcher la journée et à
              s&apos;endormir plus facilement.
            </li>
            <li>
              <span className="text-rr-ivoire">Rapide et partout.</span> Moins de 2 minutes, sans matériel, au bureau, en
              voiture à l&apos;arrêt, avant un rendez-vous important.
            </li>
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-rr-gris-clair">
            <span className="text-rr-ivoire">Pourquoi celle-là ?</span> C&apos;est le rythme qui allonge le plus la sortie
            du souffle (8 secondes contre 4 à l&apos;entrée), avec une courte rétention qui marque une vraie pause. C&apos;est
            la règle à retenir pour retrouver du calme : <span className="text-rr-or-clair">la sortie doit être plus longue
            que l&apos;entrée</span>. Une inspiration plus longue que l&apos;expiration, à l&apos;inverse, réveille et
            dynamise.
          </p>
          <p className="mt-4 text-[11px] leading-relaxed text-rr-gris">
            Pratique de bien-être, pas un acte médical. Respire par le nez, sans forcer. Si tu as des vertiges ou un
            inconfort, reviens à une respiration normale. En cas de doute ou de problème de santé, demande conseil à ton
            médecin.
          </p>
        </GlassCard>
      </section>

      <section className="mt-10">
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-or">Les sessions</p>
        <div className="mt-4 flex flex-col gap-3">
          {SESSIONS.map((s) => {
            const sec = s.phases.reduce((a, p) => a + p.sec, 0) * s.cycles;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(s)}
                className={cn(
                  "w-full rounded-2xl border p-5 text-left transition-colors hover:bg-white/[0.05]",
                  s.star ? "border-rr-or/30 bg-rr-or/[0.05]" : "border-white/10 bg-white/[0.02]"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-rr-display text-xl text-rr-ivoire">{s.title}</p>
                    <p className="mt-1 text-sm text-rr-gris-clair">{s.tagline}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-rr-display text-lg text-rr-or">{s.rhythm}</p>
                    <p className="mt-1 text-[11px] text-rr-gris">{fmt(sec)}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-rr-gris">{s.why}</p>
                {s.star && (
                  <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-rr-or-clair/80">La session de référence</p>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {active && <SessionRunner session={active} onClose={() => setActive(null)} />}
    </div>
  );
}

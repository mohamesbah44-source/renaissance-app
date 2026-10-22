"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Music, Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

type Kind = "in" | "top" | "hold" | "out";
type Phase = { label: string; sec: number; kind: Kind };

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
      { label: "Encore un peu", sec: 1, kind: "top" },
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

/** Voix enregistrées (les mêmes que la pratique du soir). */
const AUDIO: Partial<Record<Kind, string>> = {
  in: "/audio/inspire.mp3",
  hold: "/audio/retiens.mp3",
  out: "/audio/expire.mp3",
};
const SPEECH: Partial<Record<Kind, string>> = { in: "Inspire", hold: "Retiens", out: "Expire" };
const VOICE_KEY = "rr-breath-voice";
const MUSIC_KEY = "rr-breath-music";
const SCALE: Record<Kind, number> = { in: 1, top: 1, hold: 1, out: 0.62 };

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "fr-FR";
  const fr = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith("fr"));
  if (fr) u.voice = fr;
  u.rate = 0.85;
  u.pitch = 0.95;
  synth.speak(u);
}

function stopCue(audio: HTMLAudioElement | null) {
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  audio?.pause();
}

function cue(kind: Kind, enabled: boolean, audio: HTMLAudioElement | null) {
  if (!enabled) return;
  stopCue(audio);
  const src = AUDIO[kind];
  if (src && audio) {
    audio.src = src;
    audio.currentTime = 0;
    audio.play().catch(() => {
      const w = SPEECH[kind];
      if (w) speak(w);
    });
  }
}

function SessionRunner({ session, onClose }: { session: Session; onClose: () => void }) {
  const segments = useMemo(
    () => Array.from({ length: session.cycles }, () => session.phases).flat(),
    [session]
  );
  const total = useMemo(() => segments.reduce((a, p) => a + p.sec, 0), [segments]);
  const [status, setStatus] = useState<"running" | "paused" | "done">("running");
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(segments[0].sec);
  const [voiceOn, setVoiceOn] = useState(true);
  const [musicOn, setMusicOn] = useState(true);
  const voiceRef = useRef(true);
  const spokenRef = useRef(-1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const musicOnRef = useRef(true);
  const doneSec = useMemo(() => segments.slice(0, index).reduce((a, p) => a + p.sec, 0), [segments, index]);

  // Préférence de voix partagée avec la pratique du soir ; le lecteur audio est créé
  // dans le geste de l'utilisateur (clic sur la session), nécessaire sur iPhone.
  useEffect(() => {
    try {
      if (localStorage.getItem(VOICE_KEY) === "off") {
        setVoiceOn(false);
        voiceRef.current = false;
      }
      if (localStorage.getItem(MUSIC_KEY) === "off") {
        setMusicOn(false);
        musicOnRef.current = false;
      }
    } catch {
      /* stockage indisponible */
    }
    audioRef.current = new Audio();
    const music = new Audio(`/audio/musique/${session.id}.mp3`);
    music.loop = true;
    music.volume = 0.45;
    musicRef.current = music;
    if (musicOnRef.current) music.play().catch(() => undefined);
    return () => {
      stopCue(audioRef.current);
      music.pause();
    };
  }, [session.id]);

  function toggleMusic() {
    const next = !musicOn;
    setMusicOn(next);
    musicOnRef.current = next;
    try {
      localStorage.setItem(MUSIC_KEY, next ? "on" : "off");
    } catch {
      /* ignoré */
    }
    const m = musicRef.current;
    if (!m) return;
    if (next && status === "running") m.play().catch(() => undefined);
    else m.pause();
  }

  // La musique suit la session : pause en pause, reprise, fondu de fin.
  useEffect(() => {
    const m = musicRef.current;
    if (!m) return;
    if (status === "running" && musicOnRef.current) m.play().catch(() => undefined);
    else if (status === "paused") m.pause();
    else if (status === "done") {
      let v = m.volume;
      const id = setInterval(() => {
        v = Math.max(0, v - 0.03);
        m.volume = v;
        if (v <= 0) {
          m.pause();
          clearInterval(id);
        }
      }, 120);
      return () => clearInterval(id);
    }
  }, [status]);

  function toggleVoice() {
    const next = !voiceOn;
    setVoiceOn(next);
    voiceRef.current = next;
    try {
      localStorage.setItem(VOICE_KEY, next ? "on" : "off");
    } catch {
      /* ignoré */
    }
    if (!next) stopCue(audioRef.current);
  }

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

  useEffect(() => {
    if (status !== "running" || remaining > 0) return;
    if (index + 1 < segments.length) {
      setIndex(index + 1);
      setRemaining(segments[index + 1].sec);
    } else {
      setStatus("done");
    }
  }, [remaining, status, index, segments]);

  useEffect(() => {
    if (status !== "running" || spokenRef.current === index) return;
    spokenRef.current = index;
    cue(segments[index].kind, voiceRef.current, audioRef.current);
  }, [status, index, segments]);

  useEffect(() => {
    if (status !== "running") stopCue(audioRef.current);
  }, [status]);

  const current = segments[Math.min(index, segments.length - 1)];
  const done = status === "done";
  const scale = done ? 0.62 : SCALE[current.kind];
  const dur = done ? 1 : current.kind === "hold" ? 0.5 : current.sec;
  const cycleLen = session.phases.reduce((a, p) => a + p.sec, 0);
  const cycleNo = Math.min(session.cycles, Math.floor(doneSec / cycleLen) + 1);
  const guide = session.guide
    ? session.guide[Math.min(session.guide.length - 1, Math.floor((doneSec / total) * session.guide.length))]
    : null;
  const progress = done ? 1 : (doneSec + (current.sec - Math.max(0, remaining))) / total;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between overflow-y-auto bg-[#07060a] px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] text-rr-gris-clair">
      <div className="flex w-full max-w-md items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.3em] text-rr-gris">
          {session.title} · {session.rhythm}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleMusic}
            aria-label={musicOn ? "Couper la musique" : "Activer la musique"}
            aria-pressed={musicOn}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:text-rr-ivoire",
              musicOn ? "text-rr-or" : "text-rr-gris"
            )}
          >
            <Music className="h-5 w-5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={toggleVoice}
            aria-label={voiceOn ? "Couper la voix" : "Activer la voix"}
            aria-pressed={voiceOn}
            className="flex h-10 w-10 items-center justify-center rounded-full text-rr-gris transition-colors hover:text-rr-ivoire"
          >
            {voiceOn ? <Volume2 className="h-5 w-5" strokeWidth={1.75} /> : <VolumeX className="h-5 w-5" strokeWidth={1.75} />}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Quitter la session"
            className="flex h-10 w-10 items-center justify-center rounded-full text-rr-gris transition-colors hover:text-rr-ivoire"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div className="flex w-full max-w-md flex-1 flex-col items-center justify-center py-8 text-center">
        <div className="relative flex h-72 w-72 max-w-full items-center justify-center" aria-hidden="true">
          <span
            className="absolute inset-[-22%] rounded-full opacity-[0.82] blur-3xl transition-transform ease-in-out motion-reduce:transition-none"
            style={{
              background:
                "radial-gradient(circle, rgba(139,92,246,0.55) 0%, rgba(109,40,217,0.28) 45%, rgba(46,16,101,0) 72%)",
              transform: `scale(${scale})`,
              transitionDuration: `${dur}s`,
            }}
          />
          <span
            className="absolute inset-0 rounded-full opacity-[0.82] transition-transform ease-in-out motion-reduce:transition-none"
            style={{
              background:
                "radial-gradient(circle at 35% 30%, #ddd6fe 0%, #a78bfa 22%, #7c3aed 52%, #4c1d95 82%, #2e1065 100%)",
              boxShadow:
                "0 0 70px 10px rgba(139,92,246,0.45), inset 0 0 50px rgba(255,255,255,0.14), inset 0 -20px 50px rgba(30,10,70,0.55)",
              transform: `scale(${scale})`,
              transitionDuration: `${dur}s`,
            }}
          />
          <span
            className="absolute left-[24%] top-[18%] h-[22%] w-[30%] rounded-full bg-white/25 blur-xl opacity-[0.82] transition-transform ease-in-out motion-reduce:transition-none"
            style={{ transform: `scale(${scale})`, transitionDuration: `${dur}s` }}
          />
        </div>

        <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-rr-gris">
          {done ? "Session terminée" : `Cycle ${cycleNo} sur ${session.cycles}`}
        </p>
        <p aria-live="polite" className="mt-3 font-rr-display text-3xl text-rr-ivoire">
          {done ? "Merci pour ce temps" : status === "paused" ? "En pause" : current.label}
        </p>
        {!done && status === "running" && <p className="mt-2 text-sm text-rr-gris">{Math.max(1, Math.ceil(remaining))}</p>}
        <p className="mt-5 min-h-[3rem] max-w-xs font-rr-serif text-base italic leading-snug text-rr-gris-clair">
          {done ? "Prends un instant pour sentir ce qui a changé." : guide}
        </p>

        {!done && (
          <button
            type="button"
            onClick={() => setStatus(status === "paused" ? "running" : "paused")}
            className="mt-6 flex h-12 items-center gap-2 rounded-full border border-white/15 px-6 text-sm text-rr-gris-clair transition-colors hover:text-rr-ivoire"
          >
            {status === "paused" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            {status === "paused" ? "Reprendre" : "Pause"}
          </button>
        )}
        {done && (
          <button
            type="button"
            onClick={onClose}
            className="mt-8 flex h-12 items-center rounded-full border border-white/15 px-8 text-sm text-rr-gris-clair transition-colors hover:text-rr-ivoire"
          >
            Fermer
          </button>
        )}
      </div>

      <div className="h-1 w-full max-w-md rounded-full bg-white/10">
        <div className="h-1 rounded-full bg-rr-or transition-all" style={{ width: `${Math.min(100, progress * 100)}%` }} />
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

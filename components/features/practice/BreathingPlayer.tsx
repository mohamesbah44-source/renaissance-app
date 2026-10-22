"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Music, Pause, Play, Volume2, VolumeX, X } from "lucide-react";
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

/** Voix enregistrées. Les phases absentes de cette liste utilisent la synthèse vocale du téléphone. */
const AUDIO: Partial<Record<Kind, string>> = {
  inhale: "/audio/inspire-doux%20(1).mp3",
  hold: "/audio/retiens-doux%20(1).mp3",
  exhale: "/audio/expire-doux%20(1).mp3",
};

const VOICE_KEY = "rr-breath-voice";
const MUSIC_KEY = "rr-breath-music";
/** Musique d'ambiance douce, jouée en boucle pendant les pratiques du soir et du sommeil. */
const MUSIC_SRC = "/audio/sommeil.mp3";
const MUSIC_VOLUME = 0.3;

const RING_R = 140;
const RING_C = 2 * Math.PI * RING_R;

/** Prononce un mot en français, d'une voix lente et posée (synthèse vocale du navigateur). */
function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "fr-FR";
  const french = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith("fr"));
  if (french) utterance.voice = french;
  utterance.rate = 0.85;
  utterance.pitch = 0.95;
  utterance.volume = 1;
  synth.speak(utterance);
}

function stopSpeech() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
}

/** Joue la voix enregistrée de la phase, ou la synthèse vocale en secours. */
function cue(kind: Kind, enabled: boolean, audio: HTMLAudioElement | null) {
  if (!enabled) return;
  stopSpeech();
  const src = AUDIO[kind];
  if (src && audio) {
    audio.src = src;
    audio.currentTime = 0;
    audio.play().catch(() => speak(WORD[kind]));
    return;
  }
  audio?.pause();
  speak(WORD[kind]);
}

function stopCue(audio: HTMLAudioElement | null) {
  stopSpeech();
  audio?.pause();
}

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

/** Anneau doré qui se remplit autour de l'orbe pendant la pratique. */
function ProgressRing({ progress }: { progress: number }) {
  const p = Math.min(1, Math.max(0, progress));
  return (
    <svg viewBox="0 0 296 296" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
      <circle cx="148" cy="148" r={RING_R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
      <circle
        cx="148"
        cy="148"
        r={RING_R}
        fill="none"
        stroke="#c9a96e"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={RING_C}
        strokeDashoffset={RING_C * (1 - p)}
        style={{ filter: "drop-shadow(0 0 6px rgba(201,169,110,0.55))", transition: "stroke-dashoffset 0.3s linear" }}
      />
    </svg>
  );
}

/** Orbe violette au repos (écrans de départ et de fin). */
function RestingOrb({ full }: { full?: boolean }) {
  return (
    <div className="relative mx-auto h-44 w-44" aria-hidden="true">
      <span
        className="absolute inset-[-24%] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.5) 0%, rgba(109,40,217,0.24) 45%, rgba(46,16,101,0) 72%)",
        }}
      />
      <span
        className="absolute inset-[14px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, #ddd6fe 0%, #a78bfa 22%, #7c3aed 52%, #4c1d95 82%, #2e1065 100%)",
          boxShadow:
            "0 0 60px 8px rgba(139,92,246,0.4), inset 0 0 40px rgba(255,255,255,0.14), inset 0 -16px 40px rgba(30,10,70,0.55)",
        }}
      />
      <svg viewBox="0 0 176 176" className="absolute inset-0 h-full w-full -rotate-90">
        <circle cx="88" cy="88" r="84" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
        {full && (
          <circle
            cx="88"
            cy="88"
            r="84"
            fill="none"
            stroke="#c9a96e"
            strokeWidth="2"
            style={{ filter: "drop-shadow(0 0 6px rgba(201,169,110,0.55))" }}
          />
        )}
      </svg>
    </div>
  );
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
  const [voiceOn, setVoiceOn] = useState(true);
  const [musicOn, setMusicOn] = useState(true);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const musicOnRef = useRef(true);
  const fadeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasMusic = mode !== "morning";
  const savedRef = useRef(false);
  const voiceRef = useRef(true);
  const spokenRef = useRef(-1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const segments = useMemo(() => buildSegments(mode, retention && retentionAllowed, duration), [mode, retention, retentionAllowed, duration]);
  const total = useMemo(() => segments.reduce((s, x) => s + x.seconds, 0), [segments]);
  const current = segments[Math.min(index, segments.length - 1)];

  // Durée écoulée avant le segment en cours (pour l'anneau de progression).
  const elapsedBefore = useMemo(
    () => segments.slice(0, Math.min(index, segments.length)).reduce((s, x) => s + x.seconds, 0),
    [segments, index]
  );
  const elapsed = elapsedBefore + Math.max(0, current.seconds - Math.max(0, remaining));
  const progress = total > 0 ? elapsed / total : 0;
  const minutesLeft = Math.max(0, Math.ceil((total - elapsed) / 60));

  // Préférence de voix mémorisée sur l'appareil.
  useEffect(() => {
    try {
      if (localStorage.getItem(VOICE_KEY) === "off") {
        setVoiceOn(false);
        voiceRef.current = false;
      }
    } catch {
      /* stockage indisponible : on garde la voix activée */
    }
  }, []);

  // Préférence de musique mémorisée sur l'appareil.
  useEffect(() => {
    try {
      if (localStorage.getItem(MUSIC_KEY) === "off") {
        setMusicOn(false);
        musicOnRef.current = false;
      }
    } catch {
      /* stockage indisponible : on garde la musique activée */
    }
  }, []);

  /** Fait varier le volume de la musique en douceur ; coupe la lecture si le volume cible est 0. */
  function fadeMusic(to: number, ms: number) {
    const audio = musicRef.current;
    if (!audio) return;
    if (fadeRef.current) clearInterval(fadeRef.current);
    const from = audio.volume;
    const startedAt = Date.now();
    fadeRef.current = setInterval(() => {
      const k = Math.min(1, (Date.now() - startedAt) / ms);
      audio.volume = Math.min(1, Math.max(0, from + (to - from) * k));
      if (k >= 1) {
        if (fadeRef.current) clearInterval(fadeRef.current);
        fadeRef.current = null;
        if (to === 0) audio.pause();
      }
    }, 100);
  }

  function playMusic() {
    const audio = musicRef.current;
    if (!audio || !musicOnRef.current) return;
    audio.play().catch(() => {
      /* lecture refusée par le navigateur : la pratique continue sans musique */
    });
    fadeMusic(MUSIC_VOLUME, 4000);
  }

  function toggleMusic() {
    const next = !musicOn;
    setMusicOn(next);
    musicOnRef.current = next;
    try {
      localStorage.setItem(MUSIC_KEY, next ? "on" : "off");
    } catch {
      /* ignoré */
    }
    if (next) {
      if (status === "running") playMusic();
    } else {
      fadeMusic(0, 600);
    }
  }

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

  function start() {
    setIndex(0);
    setRemaining(segments[0].seconds);
    savedRef.current = false;
    // Le lecteur audio est créé dans le geste de l'utilisateur (nécessaire sur iPhone),
    // puis réutilisé pour toutes les phases.
    if (!audioRef.current) audioRef.current = new Audio();
    spokenRef.current = 0;
    if (hasMusic) {
      // Même principe que la voix : le lecteur est créé pendant le geste de l'utilisateur.
      if (!musicRef.current) {
        const m = new Audio(MUSIC_SRC);
        m.loop = true;
        m.volume = 0;
        musicRef.current = m;
      }
      musicRef.current.currentTime = 0;
      playMusic();
    }
    cue(segments[0].kind, voiceRef.current, audioRef.current);
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

  // Voix : un mot au début de chaque phase.
  useEffect(() => {
    if (status !== "running") return;
    if (spokenRef.current === index) return;
    spokenRef.current = index;
    cue(segments[index].kind, voiceRef.current, audioRef.current);
  }, [status, index, segments]);

  // La voix s'arrête en pause, à la fin, et quand on quitte la page.
  useEffect(() => {
    if (status === "paused" || status === "done") stopCue(audioRef.current);
  }, [status]);
  useEffect(() => {
    return () => stopCue(audioRef.current);
  }, []);

  // La musique : pause avec la pratique, reprise en douceur, fondu de sortie à la fin.
  useEffect(() => {
    if (!musicRef.current) return;
    if (status === "paused") fadeMusic(0, 800);
    if (status === "done") fadeMusic(0, 5000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);
  const prevStatus = useRef(status);
  useEffect(() => {
    if (prevStatus.current === "paused" && status === "running") playMusic();
    prevStatus.current = status;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);
  useEffect(() => {
    return () => {
      if (fadeRef.current) clearInterval(fadeRef.current);
      musicRef.current?.pause();
    };
  }, []);

  // Enregistrement automatique à la fin.
  useEffect(() => {
    if (status !== "done" || savedRef.current) return;
    savedRef.current = true;
    void completePractice(mode, total);
  }, [status, mode, total]);

  const active = status === "running" || status === "paused";
  const scale = active ? SCALE[current.kind] : 0.62;
  const dur = current.kind === "hold" ? 0.5 : current.seconds;
  const orbOpacity = dark ? 0.82 : 1;

  const shell = cn(
    "fixed inset-0 z-50 flex flex-col items-center justify-between overflow-y-auto px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]",
    dark ? "bg-[#07060a] text-rr-gris-clair" : "bg-rr-noir text-rr-ivoire"
  );

  return (
    <div className={shell}>
      <div className="flex w-full max-w-md items-center justify-between">
        <p className={cn("text-[11px] uppercase tracking-[0.3em]", dark ? "text-rr-gris" : "text-rr-or")}>
          {mode === "morning" ? "Routine du matin" : mode === "sleep" ? "Pour t'endormir" : "Routine du soir"}
        </p>
        <div className="flex items-center gap-1">
          {hasMusic && (
            <button
              type="button"
              onClick={toggleMusic}
              aria-label={musicOn ? "Couper la musique" : "Activer la musique"}
              aria-pressed={musicOn}
              className={cn(
                "relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:text-rr-ivoire",
                musicOn ? "text-rr-or" : "text-rr-gris"
              )}
            >
              <Music className="h-5 w-5" strokeWidth={1.75} />
              {!musicOn && <span className="absolute h-px w-6 rotate-45 bg-current" aria-hidden="true" />}
            </button>
          )}
          <button
            type="button"
            onClick={toggleVoice}
            aria-label={voiceOn ? "Couper la voix" : "Activer la voix"}
            aria-pressed={voiceOn}
            className="flex h-10 w-10 items-center justify-center rounded-full text-rr-gris transition-colors hover:text-rr-ivoire"
          >
            {voiceOn ? <Volume2 className="h-5 w-5" strokeWidth={1.75} /> : <VolumeX className="h-5 w-5" strokeWidth={1.75} />}
          </button>
          <Link
            href="/aujourdhui"
            aria-label="Quitter la pratique"
            className="flex h-10 w-10 items-center justify-center rounded-full text-rr-gris transition-colors hover:text-rr-ivoire"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </Link>
        </div>
      </div>

      <div className="flex w-full max-w-md flex-1 flex-col items-center justify-center py-8 text-center">
        {status === "idle" && (
          <>
            <RestingOrb />
            <h1 className="mt-10 font-rr-display text-3xl leading-tight">
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

            <p className="mt-8 text-xs text-rr-gris">
              {hasMusic ? (musicOn ? "Une musique douce t'accompagne. " : "La musique est coupée. ") : ""}
              {voiceOn
                ? "La voix te guide : « Inspire », « Retiens », « Expire ». Tu peux la couper en haut à droite."
                : "La voix est coupée. Tu peux la réactiver en haut à droite."}
            </p>

            <button
              type="button"
              onClick={start}
              className={cn(
                "mt-6 h-14 w-full rounded-full text-[15px] font-medium transition-opacity hover:opacity-90",
                dark ? "border border-rr-gris/50 text-rr-ivoire" : "bg-rr-or text-rr-noir"
              )}
            >
              Commencer
            </button>
          </>
        )}

        {active && (
          <>
            <div className="relative flex h-[296px] w-[296px] max-w-full items-center justify-center" aria-hidden="true">
              <ProgressRing progress={progress} />
              {/* Halo violet qui respire avec l'orbe */}
              <span
                className="absolute inset-[-12%] rounded-full blur-3xl transition-transform ease-in-out motion-reduce:transition-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(139,92,246,0.55) 0%, rgba(109,40,217,0.28) 45%, rgba(46,16,101,0) 72%)",
                  transform: `scale(${scale})`,
                  transitionDuration: `${dur}s`,
                  opacity: orbOpacity,
                }}
              />
              {/* L'orbe */}
              <span
                className="absolute inset-[22px] rounded-full transition-transform ease-in-out motion-reduce:transition-none"
                style={{
                  background:
                    "radial-gradient(circle at 35% 30%, #ddd6fe 0%, #a78bfa 22%, #7c3aed 52%, #4c1d95 82%, #2e1065 100%)",
                  boxShadow:
                    "0 0 70px 10px rgba(139,92,246,0.45), inset 0 0 50px rgba(255,255,255,0.14), inset 0 -20px 50px rgba(30,10,70,0.55)",
                  transform: `scale(${scale})`,
                  transitionDuration: `${dur}s`,
                  opacity: orbOpacity,
                }}
              />
              {/* Reflet de lumière */}
              <span
                className="absolute left-[26%] top-[20%] h-[20%] w-[28%] rounded-full bg-white/25 blur-xl transition-transform ease-in-out motion-reduce:transition-none"
                style={{ transform: `scale(${scale})`, transitionDuration: `${dur}s`, opacity: orbOpacity }}
              />
            </div>
            <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-rr-gris">{current.phase}</p>
            <p aria-live="polite" className="mt-3 font-rr-display text-3xl">
              {status === "paused" ? "En pause" : WORD[current.kind]}
            </p>
            <p className="mt-2 text-sm text-rr-gris">
              {minutesLeft <= 1 ? "Moins d'une minute" : `Encore ${minutesLeft} min`}
            </p>
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
            <RestingOrb full />
            {mode === "morning" ? (
              <>
                <h1 className="mt-10 font-rr-display text-3xl leading-tight">Routine du matin terminée</h1>
                <p className="mt-4 font-rr-serif text-lg italic text-rr-gris-clair">Ta journée peut commencer.</p>
              </>
            ) : (
              <p className="mt-10 font-rr-serif text-xl italic leading-relaxed text-rr-gris-clair">
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

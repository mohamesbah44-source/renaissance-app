"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

function format(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** Message vocal de Mohamed pour la semaine. Invisible tant que le fichier audio n'existe pas. */
export function CeremonyVoice({ week }: { week: number }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audioRef.current = audio;
    setReady(false);
    setPlaying(false);

    audio.onloadedmetadata = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      setReady(true);
    };
    audio.onerror = () => setReady(false);
    audio.onended = () => setPlaying(false);
    audio.src = `/audio/ceremonie/semaine-${week}.mp3`;

    return () => {
      audio.pause();
      audio.onloadedmetadata = null;
      audio.onerror = null;
      audio.onended = null;
      audio.src = "";
    };
  }, [week]);

  if (!ready) return null;

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? "Mettre en pause le message de Mohamed" : "Écouter le message de Mohamed"}
      className="mt-10 flex h-16 w-full max-w-[320px] items-center gap-4 rounded-full border border-rr-or/30 bg-white/[0.05] pl-3 pr-5 text-left transition-colors hover:bg-white/[0.08]"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rr-or text-rr-noir">
        {playing ? <Pause className="h-4 w-4" fill="currentColor" /> : <Play className="h-4 w-4" fill="currentColor" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-rr-display text-[19px] leading-none text-rr-ivoire">Un mot de Mohamed</span>
        <span className="mt-1.5 block text-[11.5px] text-rr-gris">
          Message vocal{duration > 0 ? ` · ${format(duration)}` : ""}
        </span>
      </span>
      <svg width="40" height="20" viewBox="0 0 40 20" fill="none" stroke="#c9a96e" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <path d="M2 10v0M6 6v8M10 3v14M14 7v6M18 4v12M22 8v4M26 5v10M30 8v4M34 6v8M38 10v0" />
      </svg>
    </button>
  );
}

export default CeremonyVoice;

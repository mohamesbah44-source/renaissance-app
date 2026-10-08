"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";

type Props = {
  onEnded?: () => void;
  className?: string;
};

export default function WelcomeVideo({ onEnded, className = "" }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  function start() {
    const v = ref.current;
    if (!v) return;
    setStarted(true);
    v.controls = true;
    void v.play().catch(() => {});
  }

  return (
    <div
      className={`relative mx-auto w-full max-w-[320px] overflow-hidden rounded-[2rem] border border-rr-or/30 bg-rr-noir shadow-[0_0_60px_rgba(120,70,220,0.28)] ${className}`}
      style={{ aspectRatio: "9 / 16" }}
    >
      <video
        ref={ref}
        src="/video/presentation.mp4"
        poster="/video/presentation-poster.jpg"
        playsInline
        preload="metadata"
        onEnded={() => {
          setStarted(false);
          onEnded?.();
        }}
        className="h-full w-full object-cover"
      />
      {!started && (
        <button
          type="button"
          onClick={start}
          aria-label="Lancer la vidéo de présentation"
          className="absolute inset-0 flex items-center justify-center bg-rr-noir/25 transition-colors hover:bg-rr-noir/10"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-rr-or/60 bg-rr-noir/50 backdrop-blur-sm">
            <Play className="ml-1 h-6 w-6 text-rr-or-clair" />
          </span>
        </button>
      )}
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";

const RadarSessionFlow = dynamic(
  () => import("@/components/features/radar/RadarSessionFlow").then((m) => m.RadarSessionFlow),
  {
    ssr: false,
    loading: () => (
      <p className="px-4 pt-20 text-center font-rr-serif text-lg italic text-rr-gris-clair">
        Un instant, ton Radar se prépare…
      </p>
    ),
  }
);

export default function BienvenueRadarPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 pb-8 pt-10">
      <p className="text-center text-[11px] uppercase tracking-[0.35em] text-rr-or">Ton point de départ</p>
      <RadarSessionFlow doneHref="/bienvenue/radar/resultat" />
    </main>
  );
}

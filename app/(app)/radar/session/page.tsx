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

export default function RadarSessionPage() {
  return (
    <div className="mx-auto max-w-2xl pb-8 pt-1">
      <RadarSessionFlow />
    </div>
  );
}

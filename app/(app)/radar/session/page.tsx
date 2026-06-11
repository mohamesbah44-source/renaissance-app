"use client";

import dynamic from "next/dynamic";

const RadarSessionFlow = dynamic(
  () => import("@/components/features/radar/RadarSessionFlow").then((m) => m.RadarSessionFlow),
  {
    ssr: false,
    loading: () => <p className="pt-16 text-center text-sm text-rr-gris">Chargement...</p>,
  }
);

export default function RadarSessionPage() {
  return (
    <div className="pb-8 pt-2">
      <RadarSessionFlow />
    </div>
  );
}

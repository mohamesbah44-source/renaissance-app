import type { ReactNode } from "react";

/**
 * Charte dédiée au Radar Renaissance™ (noir / or / ivoire, Cinzel /
 * Cormorant Garamond / Montserrat), scopée à /radar/*. Le header et le
 * BottomNav (AppShell) restent dans le thème cosmique actuel.
 */
export default function RadarLayout({ children }: { children: ReactNode }) {
  return (
    <div className="-mx-6 -mb-28 min-h-[calc(100dvh-4.5rem)] bg-rr-noir px-6 pb-32 pt-6 font-rr-sans text-rr-creme">
      <div className="mx-auto max-w-2xl">{children}</div>
    </div>
  );
}

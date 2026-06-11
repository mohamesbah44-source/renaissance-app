/**
 * Fond cosmique global : nuit profonde, halos violet / rose / or qui
 * dérivent lentement, voile de brouillard. Posé une fois dans le layout
 * racine, en position fixe derrière tout le contenu.
 */
export function CosmicBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-night-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-night-700)_0%,_var(--color-night-950)_60%)]" />

      <div className="animate-drift-slow absolute -left-1/3 -top-1/4 h-[70vmax] w-[70vmax] rounded-full bg-violet-600/25 blur-[120px]" />
      <div className="animate-drift-slower absolute -right-1/4 top-1/4 h-[60vmax] w-[60vmax] rounded-full bg-rose-500/15 blur-[140px]" />
      <div className="animate-drift-slow absolute bottom-[-25%] left-1/4 h-[50vmax] w-[50vmax] rounded-full bg-gold-500/10 blur-[130px]" />

      <div className="animate-glow absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,_rgba(255,255,255,0.05),_transparent_45%)]" />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-night-950/30 to-night-950" />
    </div>
  );
}

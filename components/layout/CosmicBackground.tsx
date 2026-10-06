/**
 * Fond cosmique global : nuit profonde, halos or qui dérivent
 * lentement, voile de brouillard — dans l'esprit du Phoenix Re-Naissance™.
 * Posé une fois dans le layout racine, en position fixe derrière tout le contenu.
 *
 * Les halos sont des dégradés radiaux (sans flou) : même rendu doux, mais
 * bien plus léger à animer sur téléphone. Le mouvement est coupé pour les
 * personnes qui préfèrent moins d'animations.
 */
export function CosmicBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-night-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-night-700)_0%,_var(--color-night-950)_60%)]" />

      <div className="animate-drift-slow motion-reduce:animate-none absolute -left-1/3 -top-1/4 h-[70vmax] w-[70vmax] transform-gpu rounded-full bg-[radial-gradient(circle,rgba(201,169,110,0.17)_0%,transparent_65%)]" />
      <div className="animate-drift-slower motion-reduce:animate-none absolute -right-1/4 top-1/4 h-[60vmax] w-[60vmax] transform-gpu rounded-full bg-[radial-gradient(circle,rgba(155,107,58,0.14)_0%,transparent_65%)]" />
      <div className="animate-drift-slow motion-reduce:animate-none absolute bottom-[-25%] left-1/4 h-[50vmax] w-[50vmax] transform-gpu rounded-full bg-[radial-gradient(circle,rgba(201,169,110,0.1)_0%,transparent_65%)]" />

      <div className="animate-glow motion-reduce:animate-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,_rgba(255,255,255,0.05),_transparent_45%)]" />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-night-950/30 to-night-950" />
    </div>
  );
}

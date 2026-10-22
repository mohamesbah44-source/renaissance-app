/**
 * Fond cosmique global : nuit profonde, halos or, violet et bleu nuit qui
 * dérivent lentement, grain fin et voile de brouillard — dans l'esprit du
 * Phoenix Re-Naissance™.
 * Posé une fois dans le layout racine, en position fixe derrière tout le contenu.
 *
 * Les halos sont des dégradés radiaux (sans flou) : même rendu doux, mais
 * bien plus léger à animer sur téléphone. Le mouvement est coupé pour les
 * personnes qui préfèrent moins d'animations.
 */
export function CosmicBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-rr-noir">
      <div className="absolute inset-0 bg-[radial-gradient(120%_55%_at_50%_12%,#241250_0%,#0f0824_46%,#07060d_80%)]" />

      {/* Halos violet cosmique et bleu nuit (très lents) */}
      <div className="rr-aurora rr-aurora-c" />
      <div className="rr-aurora rr-aurora-a" />

      {/* Halos or */}
      <div className="animate-drift-slow motion-reduce:animate-none absolute -left-1/3 -top-1/4 h-[70vmax] w-[70vmax] transform-gpu rounded-full bg-[radial-gradient(circle,rgba(212,175,106,0.07)_0%,transparent_65%)]" />
      <div className="animate-drift-slower motion-reduce:animate-none absolute -right-1/4 top-1/4 h-[60vmax] w-[60vmax] transform-gpu rounded-full bg-[radial-gradient(circle,rgba(155,107,58,0.05)_0%,transparent_65%)]" />
      <div className="animate-drift-slow motion-reduce:animate-none absolute bottom-[-25%] left-1/4 h-[50vmax] w-[50vmax] transform-gpu rounded-full bg-[radial-gradient(circle,rgba(212,175,106,0.04)_0%,transparent_65%)]" />

      <div className="animate-glow motion-reduce:animate-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,_rgba(255,255,255,0.05),_transparent_45%)]" />

      {/* Grain fin */}
      <div className="rr-grain absolute inset-0" />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-rr-noir/30 to-rr-noir" />
    </div>
  );
}

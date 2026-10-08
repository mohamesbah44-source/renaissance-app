/**
 * Fond vivant de l'application : trois halos très lents et un grain fin.
 * Purement décoratif, fixé derrière tout le contenu.
 */
export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="rr-aurora rr-aurora-a" />
      <div className="rr-aurora rr-aurora-b" />
      <div className="rr-aurora rr-aurora-c" />
      <div className="rr-grain absolute inset-0" />
    </div>
  );
}

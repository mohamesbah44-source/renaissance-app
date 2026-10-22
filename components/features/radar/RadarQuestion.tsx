export function RadarQuestion({ pilierNom, text }: { pilierNom: string; text: string }) {
  return (
    <div className="mt-14 text-center">
      <p className="font-rr-label text-[10px] uppercase tracking-[0.3em] text-rr-or">{pilierNom}</p>
      <p className="mt-5 font-rr-serif text-[30px] italic leading-[1.18] text-rr-ivoire">{text}</p>
      <p className="mt-5 text-[13.5px] leading-relaxed text-rr-gris-clair">
        Réponds comme tu le ressens aujourd&apos;hui. Il n&apos;y a pas de bonne réponse.
      </p>
    </div>
  );
}

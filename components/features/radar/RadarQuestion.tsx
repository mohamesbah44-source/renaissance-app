export function RadarQuestion({ pilierNom, text }: { pilierNom: string; text: string }) {
  return (
    <div className="mt-10 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-rr-or">{pilierNom}</p>
      <p className="mt-6 font-rr-serif text-2xl italic leading-relaxed text-rr-ivoire">{text}</p>
    </div>
  );
}

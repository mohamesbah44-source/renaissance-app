interface CerclesOrbsProps {
  moi: number | null;
  nous: number | null;
  monde: number | null;
}

function pct(value: number | null): string {
  return value === null ? "—" : String(value);
}

export function CerclesOrbs({ moi, nous, monde }: CerclesOrbsProps) {
  return (
    <div
      className="relative mx-auto h-[300px] w-full max-w-[340px]"
      role="img"
      aria-label={`Apaisement : Moi ${pct(moi)} pour cent, Nous ${pct(nous)} pour cent, Monde ${pct(monde)} pour cent`}
    >
      {/* Monde */}
      <div
        className="absolute rounded-full border border-[#b79cf5]/40"
        style={{
          left: 202,
          top: 96,
          width: 124,
          height: 124,
          background:
            "radial-gradient(circle at 40% 35%, rgba(183,156,245,0.4) 0%, rgba(76,29,149,0.18) 60%, rgba(15,8,36,0) 100%)",
        }}
      />
      {/* Nous */}
      <div
        className="absolute rounded-full border border-[#b79cf5]/50"
        style={{
          left: 104,
          top: 72,
          width: 150,
          height: 150,
          background:
            "radial-gradient(circle at 40% 35%, rgba(167,139,250,0.5) 0%, rgba(76,29,149,0.22) 62%, rgba(15,8,36,0) 100%)",
        }}
      />
      {/* Moi */}
      <div
        className="absolute rounded-full"
        style={{
          left: 6,
          top: 30,
          width: 200,
          height: 200,
          background:
            "radial-gradient(circle at 35% 30%, #ddd6fe 0%, #a78bfa 24%, #7c3aed 54%, #4c1d95 84%, #2e1065 100%)",
          boxShadow: "0 0 70px 8px rgba(139,92,246,0.45), inset 0 0 40px rgba(255,255,255,0.14)",
        }}
      />
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{ left: 6, top: 30, width: 200, height: 200, textShadow: "0 2px 12px rgba(30,10,70,0.6)" }}
      >
        <span className="font-rr-display text-[54px] leading-none text-white">
          {pct(moi)}
          {moi !== null && <span className="text-2xl opacity-80">%</span>}
        </span>
        <span className="mt-1 text-[10px] uppercase tracking-[0.3em] text-rr-ivoire">Moi</span>
      </div>

      {/* Nous */}
      <div className="absolute text-center" style={{ left: 122, top: 232, width: 130 }}>
        <span className="font-rr-display text-2xl text-rr-ivoire/90">
          {pct(nous)}
          {nous !== null && <span className="text-sm">%</span>}
        </span>
        <div className="mt-0.5 text-[9.5px] uppercase tracking-[0.3em] text-rr-gris">Nous</div>
      </div>

      {/* Monde */}
      <div className="absolute text-center" style={{ left: 222, top: 234, width: 84 }}>
        <span className="font-rr-display text-2xl text-rr-ivoire/90">
          {pct(monde)}
          {monde !== null && <span className="text-sm">%</span>}
        </span>
        <div className="mt-0.5 text-[9.5px] uppercase tracking-[0.3em] text-rr-gris">Monde</div>
      </div>
    </div>
  );
}

export default CerclesOrbs;

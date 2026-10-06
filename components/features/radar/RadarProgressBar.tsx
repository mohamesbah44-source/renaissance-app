export function RadarProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);

  return (
    <div>
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-rr-gris">
        <span>
          Question {current} / {total}
        </span>
        <span className="text-rr-or">{pct}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
        className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10"
      >
        <div
          className="h-full rounded-full bg-rr-or transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

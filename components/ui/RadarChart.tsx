const SIZE = 300;
const CENTER = SIZE / 2;
const RADIUS = 100;
const LEVELS = 5;

interface RadarChartSeries {
  label: string;
  values: number[];
  color: string;
}

interface RadarChartProps {
  axes: string[];
  series: RadarChartSeries[];
  max?: number;
}

function pointAt(index: number, total: number, ratio: number) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return {
    x: CENTER + RADIUS * ratio * Math.cos(angle),
    y: CENTER + RADIUS * ratio * Math.sin(angle),
  };
}

function polygonPoints(axesCount: number, ratio: number) {
  return Array.from({ length: axesCount }, (_, i) => {
    const { x, y } = pointAt(i, axesCount, ratio);
    return `${x},${y}`;
  }).join(" ");
}

/** Radar SVG à 8 axes, sans dépendance, pour visualiser les scores du Radar Renaissance™. */
export function RadarChart({ axes, series, max = 10 }: RadarChartProps) {
  const gridLevels = Array.from({ length: LEVELS }, (_, i) => (i + 1) / LEVELS);

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full" role="img" aria-label="Radar Renaissance">
      {gridLevels.map((ratio) => (
        <polygon key={ratio} points={polygonPoints(axes.length, ratio)} fill="none" stroke="rgba(255,255,255,0.08)" />
      ))}

      {axes.map((axis, i) => {
        const { x, y } = pointAt(i, axes.length, 1);
        return <line key={axis} x1={CENTER} y1={CENTER} x2={x} y2={y} stroke="rgba(255,255,255,0.08)" />;
      })}

      {series.map((s) => (
        <polygon
          key={s.label}
          points={axes
            .map((_, i) => {
              const ratio = Math.min(Math.max(s.values[i], 0), max) / max;
              const { x, y } = pointAt(i, axes.length, ratio);
              return `${x},${y}`;
            })
            .join(" ")}
          fill={s.color}
          fillOpacity={0.18}
          stroke={s.color}
          strokeWidth={2}
        />
      ))}

      {axes.map((axis, i) => {
        const { x, y } = pointAt(i, axes.length, 1.26);
        const dx = x - CENTER;
        const dy = y - CENTER;
        const textAnchor = Math.abs(dx) < 4 ? "middle" : dx > 0 ? "start" : "end";
        const dominantBaseline = Math.abs(dy) < 4 ? "middle" : dy > 0 ? "hanging" : "auto";

        return (
          <text
            key={axis}
            x={x}
            y={y}
            fontSize={9.5}
            fill="rgba(255,255,255,0.5)"
            textAnchor={textAnchor}
            dominantBaseline={dominantBaseline}
          >
            {axis}
          </text>
        );
      })}
    </svg>
  );
}

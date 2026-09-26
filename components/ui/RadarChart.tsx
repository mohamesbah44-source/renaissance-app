const SIZE = 480;
const CENTER = 240;
const RADIUS = 170;
const GRID_LEVELS = [0.25, 0.5, 0.75, 1] as const;

export interface RadarChartSeries {
  values: number[];
  color: string;
  /** Tracé en pointillés (ex : bilan précédent). */
  dashed?: boolean;
  /** Désactive le remplissage du polygone (par défaut rempli légèrement). */
  fill?: boolean;
}

interface RadarChartProps {
  /** Labels courts, un par axe (12 piliers du Renaissance Radar™). */
  axes: string[];
  series: RadarChartSeries[];
  /** Couleur du point de chaque axe (ex : or pour survie, vert pour alignement). */
  pointColors?: string[];
  gridColor?: string;
  textColor?: string;
}

function pointAt(index: number, total: number, ratio: number) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return {
    x: CENTER + RADIUS * ratio * Math.cos(angle),
    y: CENTER + RADIUS * ratio * Math.sin(angle),
  };
}

function polygonPoints(values: number[]) {
  return values
    .map((value, i) => {
      const ratio = Math.min(Math.max(value, 0), 1);
      const { x, y } = pointAt(i, values.length, ratio);
      return `${x},${y}`;
    })
    .join(" ");
}

/**
 * Radar SVG à N axes (12 piliers du Renaissance Radar™).
 * viewBox 0 0 480 480, centre 240/240, rayon 170, 4 grilles (25/50/75/100%).
 */
export function RadarChart({
  axes,
  series,
  pointColors,
  gridColor = "rgba(237,230,214,0.14)",
  textColor = "#ede6d6",
}: RadarChartProps) {
  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full" role="img" aria-label="Renaissance Radar™">
      {GRID_LEVELS.map((ratio) => (
        <polygon
          key={ratio}
          points={polygonPoints(axes.map(() => ratio))}
          fill="none"
          stroke={gridColor}
        />
      ))}

      {axes.map((axis, i) => {
        const { x, y } = pointAt(i, axes.length, 1);
        return <line key={axis} x1={CENTER} y1={CENTER} x2={x} y2={y} stroke={gridColor} />;
      })}

      {series.map((s, i) => (
        <polygon
          key={i}
          points={polygonPoints(s.values)}
          fill={s.fill === false ? "none" : s.color}
          fillOpacity={s.fill === false ? 0 : 0.16}
          stroke={s.color}
          strokeWidth={2}
          strokeDasharray={s.dashed ? "6 6" : undefined}
        />
      ))}

      {pointColors &&
        series[0]?.values.map((value, i) => {
          const ratio = Math.min(Math.max(value, 0), 1);
          const { x, y } = pointAt(i, axes.length, ratio);
          return <circle key={axes[i]} cx={x} cy={y} r={4.5} fill={pointColors[i]} />;
        })}

      {axes.map((axis, i) => {
        const { x, y } = pointAt(i, axes.length, 1.16);
        const dx = x - CENTER;
        const dy = y - CENTER;
        const textAnchor = Math.abs(dx) < 4 ? "middle" : dx > 0 ? "start" : "end";
        const dominantBaseline = Math.abs(dy) < 4 ? "middle" : dy > 0 ? "hanging" : "auto";

        return (
          <text
            key={axis}
            x={x}
            y={y}
            fontSize={13}
            fill={textColor}
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

import { useState } from 'react';

const SIZE = 200;
const CENTER = SIZE / 2;
const RADIUS = 70;
const STROKE = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 3; // path-length gap between adjacent segments

/**
 * Donut chart for a small, fixed set of categories (status-style: <= 4-5 slices).
 * data: [{ label, value, color }]. Identity is never color-alone — the legend
 * with counts/percentages always renders alongside the chart.
 */
export default function DonutChart({ data, centerLabel }) {
  const [hovered, setHovered] = useState(null);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  let cumulative = 0;
  const segments = data.map((d, i) => {
    const frac = total ? d.value / total : 0;
    const arcLen = frac * CIRCUMFERENCE;
    const visible = Math.max(arcLen - GAP, 0);
    const seg = {
      ...d,
      frac,
      dasharray: `${visible} ${CIRCUMFERENCE - visible}`,
      dashoffset: -cumulative,
      i,
    };
    cumulative += arcLen;
    return seg;
  });

  return (
    <div className="donut-chart">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE} role="img" aria-label={`${centerLabel.label}: ${centerLabel.value}`}>
        <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="var(--soft)" strokeWidth={STROKE} />
        <g transform={`rotate(-90 ${CENTER} ${CENTER})`}>
          {segments.map((s) => (
            <circle
              key={s.label}
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke={s.color}
              strokeWidth={hovered === s.i ? STROKE + 4 : STROKE}
              strokeDasharray={s.dasharray}
              strokeDashoffset={s.dashoffset}
              style={{ pointerEvents: 'stroke', cursor: 'pointer', transition: 'stroke-width 0.15s ease', opacity: hovered === null || hovered === s.i ? 1 : 0.45 }}
              onMouseEnter={() => setHovered(s.i)}
              onMouseLeave={() => setHovered(null)}
            >
              <title>{`${s.label}: ${s.value} (${Math.round(s.frac * 100)}%)`}</title>
            </circle>
          ))}
        </g>
        <text x={CENTER} y={CENTER - 4} textAnchor="middle" className="donut-total">{centerLabel.value}</text>
        <text x={CENTER} y={CENTER + 16} textAnchor="middle" className="donut-total-label">{centerLabel.label}</text>
      </svg>

      <ul className="donut-legend" aria-hidden="false">
        {segments.map((s) => (
          <li
            key={s.label}
            className={hovered !== null && hovered !== s.i ? 'is-dim' : ''}
            onMouseEnter={() => setHovered(s.i)}
            onMouseLeave={() => setHovered(null)}
          >
            <span className="donut-swatch" style={{ backgroundColor: s.color }} aria-hidden="true" />
            <span className="donut-legend-label">{s.label}</span>
            <span className="donut-legend-value text-muted">{s.value} · {Math.round(s.frac * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

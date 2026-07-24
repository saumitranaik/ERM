'use client';

import { chartColorVar, type TrendProps } from './types';

/** Line/area trend — native SVG placeholder behind the chart adapter. */
export function TrendLine({ points, height = 120, ariaLabel, threshold, color = 'chart-2' }: TrendProps) {
  const w = 320;
  const h = height;
  const pad = 8;
  const values = points.map((p) => p.value);
  const min = Math.min(...values, threshold ?? Infinity);
  const max = Math.max(...values, threshold ?? -Infinity, 1);
  const range = max - min || 1;
  const x = (i: number) => pad + (i / Math.max(1, points.length - 1)) * (w - pad * 2);
  const y = (v: number) => h - pad - ((v - min) / range) * (h - pad * 2);
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const area = `${path} L${x(points.length - 1).toFixed(1)},${h - pad} L${x(0).toFixed(1)},${h - pad} Z`;
  const stroke = chartColorVar[color];

  return (
    <div>
      <svg role="img" aria-label={ariaLabel} viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }}>
        {points.length > 1 && <path d={area} fill={stroke} opacity={0.12} />}
        {threshold !== undefined && (
          <line
            x1={pad} x2={w - pad} y1={y(threshold)} y2={y(threshold)}
            stroke="#ef4444" strokeWidth="1" strokeDasharray="4 3"
          />
        )}
        {points.length > 1 && <path d={path} fill="none" stroke={stroke} strokeWidth="2" />}
        {points.map((p, i) => (
          <circle key={i} cx={x(i)} cy={y(p.value)} r="2.5" fill={stroke}>
            <title>{`${p.label}: ${p.value}`}</title>
          </circle>
        ))}
      </svg>
      <div className="flex justify-between text-[10px] text-muted-foreground px-1">
        <span>{points[0]?.label}</span>
        <span>{points[points.length - 1]?.label}</span>
      </div>
    </div>
  );
}

/** Compact sparkline for table cells / stat tiles. */
export function Sparkline({ points, color = 'chart-2' }: { points: number[]; color?: TrendProps['color'] }) {
  const w = 80;
  const h = 24;
  const min = Math.min(...points);
  const max = Math.max(...points, 1);
  const range = max - min || 1;
  const x = (i: number) => (i / Math.max(1, points.length - 1)) * w;
  const y = (v: number) => h - 2 - ((v - min) / range) * (h - 4);
  const path = points.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true">
      <path d={path} fill="none" stroke={chartColorVar[color ?? 'chart-2']} strokeWidth="1.5" />
    </svg>
  );
}

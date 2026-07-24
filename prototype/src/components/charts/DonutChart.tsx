'use client';

import Link from 'next/link';
import { chartColorVar, type ChartCommonProps } from './types';

/** Donut chart — native SVG placeholder behind the chart adapter. */
export function DonutChart({ data, ariaLabel, height = 140 }: ChartCommonProps & { centerLabel?: string }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = 40;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <svg
        role="img"
        aria-label={ariaLabel}
        width={height}
        height={height}
        viewBox="0 0 100 100"
        className="shrink-0"
      >
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--muted)" strokeWidth="14" />
        {total > 0 &&
          data.map((d) => {
            const frac = d.value / total;
            const dash = frac * circumference;
            const el = (
              <circle
                key={d.label}
                cx="50" cy="50" r={r} fill="none"
                stroke={chartColorVar[d.color ?? 'chart-3']}
                strokeWidth="14"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 50 50)"
              />
            );
            offset += dash;
            return el;
          })}
        <text x="50" y="47" textAnchor="middle" className="fill-current" style={{ fontSize: 16, fontWeight: 500 }}>
          {total}
        </text>
        <text x="50" y="60" textAnchor="middle" fill="var(--muted-foreground)" style={{ fontSize: 7 }}>
          total
        </text>
      </svg>
      <ul className="space-y-1 min-w-0">
        {data.map((d) => {
          const row = (
            <span className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: chartColorVar[d.color ?? 'chart-3'] }} />
              <span className="text-muted-foreground truncate">{d.label}</span>
              <span className="tabular-nums font-medium">{d.value}</span>
            </span>
          );
          return (
            <li key={d.label}>
              {d.href ? <Link href={d.href} className="hover:underline">{row}</Link> : row}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

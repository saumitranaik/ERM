'use client';

import Link from 'next/link';
import { chartColorVar, type ChartCommonProps } from './types';

/** Horizontal bar chart — native CSS placeholder behind the chart adapter. */
export function BarChart({ data, ariaLabel }: ChartCommonProps) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div role="img" aria-label={ariaLabel} className="space-y-2">
      {data.map((d) => {
        const bar = (
          <div className="flex items-center gap-2 group">
            <span className="w-36 shrink-0 text-xs text-muted-foreground truncate text-right" title={d.label}>
              {d.label}
            </span>
            <span className="flex-1 h-5 bg-muted rounded overflow-hidden">
              <span
                className="block h-full rounded transition-all group-hover:opacity-80"
                style={{ width: `${(d.value / max) * 100}%`, backgroundColor: chartColorVar[d.color ?? 'chart-3'] }}
              />
            </span>
            <span className="w-10 shrink-0 text-xs tabular-nums">{d.value}</span>
          </div>
        );
        return d.href ? (
          <Link key={d.label} href={d.href} className="block">
            {bar}
          </Link>
        ) : (
          <div key={d.label}>{bar}</div>
        );
      })}
      {data.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">No data</p>}
    </div>
  );
}

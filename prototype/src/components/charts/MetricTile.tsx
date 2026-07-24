'use client';

import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight, Minus, type LucideIcon } from 'lucide-react';
import { cn } from '../ui/utils';
import { Sparkline } from './TrendLine';

/**
 * KPI stat tile — follows the PRSMTD dashboard StatCard convention
 * (icon tile + large value + label + optional drill-down link).
 */
export function StatCard({
  icon: Icon,
  label,
  value,
  color,
  href,
  sub,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  color: string; // e.g. 'bg-yellow-500'
  href?: string;
  sub?: string;
}) {
  const body = (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', color)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-3xl tabular-nums">{value}</span>
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      {href && <p className="text-xs text-blue-600 mt-2">View details →</p>}
    </>
  );
  const base = 'bg-card p-6 rounded-lg border border-border';
  if (href) {
    return (
      <Link href={href} className={cn(base, 'block hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-accent cursor-pointer transition-all')}>
        {body}
      </Link>
    );
  }
  return <div className={base}>{body}</div>;
}

/** Metric tile with threshold band + trend, used by ANALYTICS / KRIs. */
export function MetricTile({
  name,
  value,
  unit,
  band,
  trend,
  direction,
  href,
}: {
  name: string;
  value: number | string;
  unit?: string;
  band: 'GREEN' | 'AMBER' | 'RED' | 'NONE';
  trend?: number[];
  direction?: 'up' | 'down' | 'flat';
  href?: string;
}) {
  const bandTone =
    band === 'GREEN' ? 'bg-green-100 text-green-800' :
    band === 'AMBER' ? 'bg-yellow-100 text-yellow-800' :
    band === 'RED' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600';
  const DirIcon = direction === 'up' ? ArrowUpRight : direction === 'down' ? ArrowDownRight : Minus;

  const body = (
    <div className="bg-card p-4 rounded-lg border border-border h-full hover:border-blue-500 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs text-muted-foreground leading-snug">{name}</p>
        {band !== 'NONE' && <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0', bandTone)}>{band}</span>}
      </div>
      <div className="flex items-end justify-between mt-2 gap-2">
        <p className="text-2xl tabular-nums leading-none">
          {value}
          {unit && <span className="text-sm text-muted-foreground ml-1">{unit}</span>}
        </p>
        <span className="flex items-center gap-1">
          {direction && <DirIcon className={cn('w-4 h-4', direction === 'up' ? 'text-red-500' : direction === 'down' ? 'text-green-600' : 'text-muted-foreground')} />}
          {trend && trend.length > 1 && <Sparkline points={trend} />}
        </span>
      </div>
    </div>
  );
  return href ? <Link href={href} className="block h-full">{body}</Link> : body;
}

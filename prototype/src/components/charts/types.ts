/**
 * Chart abstraction layer.
 *
 * The prototype deliberately does NOT bind to a charting library. Every
 * dashboard/widget renders through these adapter interfaces; the current
 * implementations are lightweight native HTML/CSS/SVG placeholders. When
 * PRSMTD adopts an official visualization library, only the renderer
 * components in this folder change — widget composition, KPI presentation,
 * drill-down behaviour and dashboard layout are specified independently.
 */

export interface ChartDatum {
  label: string;
  value: number;
  /** Design-token chart color slot (1–5) or a status tone. */
  color?: 'chart-1' | 'chart-2' | 'chart-3' | 'chart-4' | 'chart-5' | 'green' | 'yellow' | 'orange' | 'red' | 'blue' | 'gray';
  /** Optional drill-down target. */
  href?: string;
}

export interface SeriesPoint {
  label: string;
  value: number;
}

export interface ChartCommonProps {
  data: ChartDatum[];
  height?: number;
  ariaLabel: string;
}

export interface TrendProps {
  points: SeriesPoint[];
  height?: number;
  ariaLabel: string;
  /** Optional threshold line (e.g. KRI amber threshold). */
  threshold?: number;
  color?: ChartDatum['color'];
}

export const chartColorVar: Record<NonNullable<ChartDatum['color']>, string> = {
  'chart-1': 'var(--chart-1)',
  'chart-2': 'var(--chart-2)',
  'chart-3': 'var(--chart-3)',
  'chart-4': 'var(--chart-4)',
  'chart-5': 'var(--chart-5)',
  green: '#22c55e',
  yellow: '#eab308',
  orange: '#f97316',
  red: '#ef4444',
  blue: '#3b82f6',
  gray: '#9ca3af',
};

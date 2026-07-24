'use client';

import { useRouter } from 'next/navigation';
import { cn } from '../ui/utils';

export interface HeatmapCellDatum {
  likelihood: number; // 1–5
  impact: number;     // 1–5
  count: number;
  href?: string;
}

/**
 * 5×5 likelihood × impact risk heat-map — native HTML/CSS grid (no chart
 * library, per the chart abstraction decision). Cell tone follows the
 * severity banding convention: score = likelihood × impact.
 */
function cellTone(score: number): string {
  if (score >= 17) return 'bg-red-500/85 text-white';
  if (score >= 10) return 'bg-orange-400/85 text-white';
  if (score >= 5) return 'bg-yellow-300/85 text-yellow-950';
  return 'bg-green-400/80 text-green-950';
}

const LIKELIHOOD_LABELS = ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost Certain'];
const IMPACT_LABELS = ['Insignificant', 'Minor', 'Moderate', 'Major', 'Severe'];

export function RiskHeatmap({ cells, ariaLabel }: { cells: HeatmapCellDatum[]; ariaLabel: string }) {
  const router = useRouter();
  const byKey = new Map(cells.map((c) => [`${c.likelihood}-${c.impact}`, c]));

  return (
    <div role="img" aria-label={ariaLabel} className="overflow-x-auto">
      <div className="min-w-[480px]">
        <div className="flex">
          {/* Y-axis label */}
          <div className="flex items-center justify-center w-6">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground -rotate-90 whitespace-nowrap">
              Likelihood →
            </span>
          </div>
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((likelihood) => (
              <div key={likelihood} className="grid grid-cols-[90px_repeat(5,1fr)] gap-1 mb-1">
                <div className="flex items-center justify-end pr-2">
                  <span className="text-[10px] text-muted-foreground text-right leading-tight">
                    {likelihood}. {LIKELIHOOD_LABELS[likelihood - 1]}
                  </span>
                </div>
                {[1, 2, 3, 4, 5].map((impact) => {
                  const cell = byKey.get(`${likelihood}-${impact}`);
                  const score = likelihood * impact;
                  const clickable = !!cell?.href && (cell?.count ?? 0) > 0;
                  return (
                    <button
                      key={impact}
                      type="button"
                      disabled={!clickable}
                      onClick={() => clickable && router.push(cell!.href!)}
                      title={`Likelihood ${likelihood} × Impact ${impact} (score ${score}): ${cell?.count ?? 0} risk(s)`}
                      className={cn(
                        'h-11 rounded flex items-center justify-center text-sm font-medium transition-transform',
                        cellTone(score),
                        clickable ? 'cursor-pointer hover:scale-[1.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring' : 'cursor-default',
                        (cell?.count ?? 0) === 0 && 'opacity-40',
                      )}
                    >
                      {cell?.count || ''}
                    </button>
                  );
                })}
              </div>
            ))}
            <div className="grid grid-cols-[90px_repeat(5,1fr)] gap-1 mt-1">
              <div />
              {IMPACT_LABELS.map((label, i) => (
                <div key={label} className="text-center">
                  <span className="text-[10px] text-muted-foreground leading-tight block">{i + 1}. {label}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground text-center mt-1">Impact →</p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3 pl-6">
          {[
            ['bg-green-400/80', 'Low (1–4)'],
            ['bg-yellow-300/85', 'Medium (5–9)'],
            ['bg-orange-400/85', 'High (10–16)'],
            ['bg-red-500/85', 'Critical (17–25)'],
          ].map(([tone, label]) => (
            <span key={label} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className={cn('w-3 h-3 rounded-sm', tone)} /> {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

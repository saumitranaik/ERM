'use client';

import { useRouter } from 'next/navigation';
import { resolveBand, validateMatrix, type ScoringMatrix } from '../../lib/riskMatrix';
import { cn } from '../ui/utils';

export interface HeatmapCellDatum {
  likelihood: number; // 1..matrix.likelihoodLevels
  impact: number;     // 1..matrix.impactLevels
  count: number;
  href?: string;
}

/**
 * Likelihood × impact risk heat-map — native HTML/CSS grid (no chart library, per the chart
 * abstraction decision). Dimensions, axis labels, bands and legend all come from the supplied
 * matrix; score = likelihood × impact. An invalid matrix renders an explanation, not a grid.
 */
const CELL_TONE = {
  red: 'bg-red-500/85 text-white',
  orange: 'bg-orange-400/85 text-white',
  yellow: 'bg-yellow-300/85 text-yellow-950',
  green: 'bg-green-400/80 text-green-950',
} as const;
function cellTone(score: number, matrix: ScoringMatrix): string {
  const band = resolveBand(score, matrix);
  return band ? CELL_TONE[band.tone] : 'bg-muted text-muted-foreground';
}

export function RiskHeatmap({ cells, ariaLabel, matrix }: { cells: HeatmapCellDatum[]; ariaLabel: string; matrix: ScoringMatrix | null }) {
  const router = useRouter();
  if (!matrix || validateMatrix(matrix).length) {
    return <p role="alert" className="text-sm text-muted-foreground">The scoring matrix is unavailable or invalid, so the heat map cannot be shown.</p>;
  }
  const lRange = Array.from({ length: matrix.likelihoodLevels }, (_, i) => matrix.likelihoodLevels - i);
  const iRange = Array.from({ length: matrix.impactLevels }, (_, i) => i + 1);
  const gridStyle = { gridTemplateColumns: `90px repeat(${matrix.impactLevels}, 1fr)` };
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
            {lRange.map((likelihood) => (
              <div key={likelihood} className="grid gap-1 mb-1" style={gridStyle}>
                <div className="flex items-center justify-end pr-2">
                  <span className="text-[10px] text-muted-foreground text-right leading-tight">
                    {likelihood}. {matrix.likelihoodLabels[likelihood - 1]}
                  </span>
                </div>
                {iRange.map((impact) => {
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
                        cellTone(score, matrix),
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
            <div className="grid gap-1 mt-1" style={gridStyle}>
              <div />
              {matrix.impactLabels.map((label, i) => (
                <div key={label} className="text-center">
                  <span className="text-[10px] text-muted-foreground leading-tight block">{i + 1}. {label}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground text-center mt-1">Impact →</p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3 pl-6">
          {matrix.bands.map((b) => [CELL_TONE[b.tone].split(' ')[0], `${b.label} (${b.min}–${b.max})`])
          .map(([tone, label]) => (
            <span key={label} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className={cn('w-3 h-3 rounded-sm', tone)} /> {label}
            </span>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 pl-6">
          {matrix.status === 'ILLUSTRATIVE'
            ? `Illustrative matrix ${matrix.id} v${matrix.version} — no AMC-approved risk scoring matrix is configured in this prototype.`
            : `Scoring matrix ${matrix.id} v${matrix.version}.`}
        </p>
      </div>
    </div>
  );
}

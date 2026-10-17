'use client';

import { Badge, type BadgeTone } from '../ui/badge';
import { resolveBand } from '../../lib/riskMatrix';
import { humanize } from '../../lib/format';

/**
 * Status → tone mapping shared across all modules. Follows the PRSMTD badge
 * convention (green approved / red rejected / yellow pending / gray retired).
 * Module entity configs can override tones per status; these are the
 * platform-wide defaults keyed by common state-name patterns.
 */
export function toneForStatus(status: string): BadgeTone {
  const s = status.toUpperCase();
  if (/PENDING|AWAITING|SUBMITTED|IN_REVIEW|UNDER_REVIEW/.test(s)) return 'warning';
  if (/ACTIVE|APPROVED|PUBLISHED|EFFECTIVE|COMPLETED|CLOSED_VERIFIED|PASSED|COMPLIANT|OPERATING|CURRENT|ACKNOWLEDGED|MET/.test(s)) return 'success';
  if (/REJECTED|FAILED|OVERDUE|BREACHED|NON_COMPLIANT|CRITICAL|MISSED/.test(s)) return 'danger';
  if (/DRAFT|PROPOSED|PLANNED|SCHEDULED/.test(s)) return 'info';
  if (/RETIRED|ARCHIVED|EXPIRED|SUPERSEDED|WITHDRAWN|INACTIVE|TERMINATED|CLOSED/.test(s)) return 'neutral';
  if (/ESCALATED|RETURNED|EXCEPTION|OPEN|IN_PROGRESS|REMEDIATION|MONITORING|INVESTIGATING|ACTIVATED/.test(s)) return 'orange';
  if (/ACCEPTED|WAIVED|MITIGATING/.test(s)) return 'purple';
  return 'secondary';
}

export function StatusBadge({ status, tone }: { status: string; tone?: BadgeTone }) {
  return <Badge variant={tone ?? toneForStatus(status)}>{humanize(status)}</Badge>;
}

/** Severity/rating badge (CRITICAL/HIGH/MEDIUM/LOW and scores). */
export function SeverityBadge({ value }: { value: string }) {
  const v = value.toUpperCase();
  const tone: BadgeTone =
    v === 'CRITICAL' ? 'danger' :
    v === 'HIGH' ? 'orange' :
    v === 'MEDIUM' || v === 'MODERATE' ? 'warning' :
    v === 'LOW' ? 'success' : 'secondary';
  return <Badge variant={tone}>{humanize(value)}</Badge>;
}

const SCORE_TONE = {
  red: 'bg-red-500 text-white',
  orange: 'bg-orange-400 text-white',
  yellow: 'bg-yellow-300 text-yellow-950',
  green: 'bg-green-400 text-green-950',
} as const;

/** Numeric risk score chip; band from the (illustrative) scoring matrix, neutral if a score does not resolve. */
export function ScoreChip({ score }: { score: number }) {
  const band = resolveBand(score);
  const cls = band ? SCORE_TONE[band.tone] : 'bg-muted text-muted-foreground';
  return (
    <span title={band ? `${band.label} (illustrative band)` : 'No band resolved'} className={`inline-flex items-center justify-center min-w-[28px] px-1.5 py-0.5 rounded text-xs font-medium tabular-nums ${cls}`}>
      {score}
    </span>
  );
}

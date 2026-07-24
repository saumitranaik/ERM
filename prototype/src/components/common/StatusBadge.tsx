'use client';

import { Badge, type BadgeTone } from '../ui/badge';
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

/** Numeric risk score chip banded by the 5×5 scoring convention. */
export function ScoreChip({ score }: { score: number }) {
  const cls =
    score >= 17 ? 'bg-red-500 text-white' :
    score >= 10 ? 'bg-orange-400 text-white' :
    score >= 5 ? 'bg-yellow-300 text-yellow-950' :
    'bg-green-400 text-green-950';
  return (
    <span className={`inline-flex items-center justify-center min-w-[28px] px-1.5 py-0.5 rounded text-xs font-medium tabular-nums ${cls}`}>
      {score}
    </span>
  );
}

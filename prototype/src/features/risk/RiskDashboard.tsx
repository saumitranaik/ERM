'use client';

import Link from 'next/link';
import { Gauge, AlertTriangle, Activity, CalendarClock } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/charts/MetricTile';
import { RiskHeatmap, type HeatmapCellDatum } from '../../components/charts/RiskHeatmap';
import { BarChart } from '../../components/charts/BarChart';
import { TrendLine } from '../../components/charts/TrendLine';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ScoreChip, SeverityBadge, StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/button';
import { useDb } from '../../lib/store';
import { humanize, formatDate } from '../../lib/format';
import type { EntityBase } from '../../types/core';

export function RiskDashboard() {
  const db = useDb();
  const risks = db.risks as EntityBase[];
  const kris = db.kris as EntityBase[];
  const measurements = db.kriMeasurements as EntityBase[];
  const escalations = db.escalations as EntityBase[];

  const open = risks.filter((r) => !['RETIRED', 'DRAFT'].includes(r.status));
  const escalated = risks.filter((r) => r.status === 'ESCALATED');
  const kriRed = kris.filter((k) => k.currentBand === 'RED');
  const now = new Date().toISOString().slice(0, 10);
  const overdue = open.filter((r) => typeof r.nextReviewDate === 'string' && (r.nextReviewDate as string) < now);

  const cells: HeatmapCellDatum[] = [];
  for (let l = 1; l <= 5; l++) {
    for (let i = 1; i <= 5; i++) {
      const count = open.filter((r) => r.residualLikelihood === l && r.residualImpact === i).length;
      cells.push({ likelihood: l, impact: i, count, href: '/modules/RISK/risks' });
    }
  }

  const byCategory = ['FUND_MANAGEMENT', 'OPERATIONS', 'CUSTOMER_SERVICE', 'MARKETING_DISTRIBUTION', 'OTHER_BUSINESS'].map((c) => ({
    label: humanize(c),
    value: open.filter((r) => r.category === c).length,
    color: 'chart-3' as const,
    href: '/modules/RISK/risks',
  }));

  const topRisks = [...open]
    .filter((r) => typeof r.residualScore === 'number')
    .sort((a, b) => (b.residualScore as number) - (a.residualScore as number))
    .slice(0, 5);

  const liquidityKri = kris.find((k) => k.id === 'kri-02');
  const liquiditySeries = measurements
    .filter((m) => m.kriId === 'kri-02')
    .map((m) => ({ label: formatDate(String(m.measurementDate)), value: Number(m.value) }));

  return (
    <div>
      <PageHeader
        title="Risk Management"
        description="Enterprise and operational risk register, assessments, treatment, acceptance and KRIs — SEBI_AMC regulatory profile."
        crumbs={[{ label: 'Risk Management' }]}
        actions={
          <Button asChild size="sm">
            <Link href="/modules/RISK/risks">Open Risk Register</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Gauge} label="Open Risks" value={open.length} color="bg-blue-500" href="/modules/RISK/risks" />
        <StatCard icon={AlertTriangle} label="Escalated (Appetite Breach)" value={escalated.length} color="bg-red-500" href="/modules/RISK/escalations" />
        <StatCard icon={Activity} label="KRIs in Red" value={kriRed.length} color="bg-orange-500" href="/modules/RISK/kris" />
        <StatCard icon={CalendarClock} label="Reviews Overdue" value={overdue.length} color="bg-yellow-500" href="/modules/RISK/risks" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader><CardTitle>Residual Risk Heat Map (Likelihood × Impact)</CardTitle></CardHeader>
          <CardContent>
            <RiskHeatmap cells={cells} ariaLabel="Residual risk heat map, 5 by 5 likelihood versus impact grid" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Open Risks by Category</CardTitle></CardHeader>
          <CardContent>
            <BarChart data={byCategory} ariaLabel="Open risks by SEBI_AMC taxonomy category" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Top Risks by Residual Score</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {topRisks.map((r) => (
              <Link
                key={r.id}
                href={`/modules/RISK/risks/${r.id}`}
                className="flex items-center gap-3 p-2 -mx-2 rounded hover:bg-accent transition-colors"
              >
                <ScoreChip score={Number(r.residualScore)} />
                <span className="flex-1 min-w-0">
                  <span className="block text-sm truncate">{String(r.title)}</span>
                  <span className="block text-xs text-muted-foreground">{String(r.code)} · {humanize(String(r.category))}</span>
                </span>
                <StatusBadge status={r.status} />
              </Link>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>KRI Watch — {String(liquidityKri?.name ?? 'Liquidity')}</CardTitle>
          </CardHeader>
          <CardContent>
            {liquidityKri && (
              <div className="flex items-center gap-2 mb-2">
                <SeverityBadge value={String(liquidityKri.currentBand)} />
                <span className="text-xs text-muted-foreground">
                  Red below {String(liquidityKri.thresholdRed)}{String(liquidityKri.unit)} · {humanize(String(liquidityKri.measurementFrequency))}
                </span>
              </div>
            )}
            <TrendLine
              points={liquiditySeries}
              threshold={Number(liquidityKri?.thresholdRed ?? 0)}
              ariaLabel="Liquid assets percentage trend against red threshold"
            />
            <div className="mt-3 text-xs text-muted-foreground">
              {escalations.filter((e) => e.status === 'PENDING_ACK').length} escalation(s) awaiting acknowledgement —{' '}
              <Link href="/modules/RISK/escalations" className="text-blue-600 hover:underline">view escalation log</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

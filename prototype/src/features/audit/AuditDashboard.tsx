'use client';

import Link from 'next/link';
import { ClipboardCheck, FileSearch, AlertTriangle, Percent } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/charts/MetricTile';
import { BarChart } from '../../components/charts/BarChart';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { SeverityBadge, StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/button';
import { useDb } from '../../lib/store';
import { formatDate } from '../../lib/format';
import type { EntityBase } from '../../types/core';

export function AuditDashboard() {
  const db = useDb();
  const engagements = db.auditEngagements as EntityBase[];
  const findings = db.findings as EntityBase[];
  const universe = db.auditUniverse as EntityBase[];

  const activeEngagements = engagements.filter((e) => !['CLOSED'].includes(e.status));
  const openFindings = findings.filter((f) => !['CLOSED', 'RISK_ACCEPTED'].includes(f.status));
  const highCritical = openFindings.filter((f) => ['HIGH', 'CRITICAL'].includes(String(f.severity)));
  const avgNcr = engagements
    .map((e) => e.nonComplianceRate)
    .filter((v): v is number => typeof v === 'number');
  const avgRate = avgNcr.length ? (avgNcr.reduce((s, v) => s + v, 0) / avgNcr.length).toFixed(1) : '—';

  const byUniverse = universe.map((u) => ({
    label: String(u.title),
    value: engagements.filter((e) => e.universeEntryId === u.id).length,
    color: 'chart-4' as const,
    href: '/modules/AUDIT/engagements',
  }));

  return (
    <div>
      <PageHeader
        title="Audit Management"
        description="Risk-based audit universe and planning, engagement lifecycle, working papers, findings and follow-up."
        crumbs={[{ label: 'Audit Management' }]}
        actions={
          <Button asChild size="sm">
            <Link href="/modules/AUDIT/engagements">Open Engagements</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={ClipboardCheck} label="Active Engagements" value={activeEngagements.length} color="bg-blue-500" href="/modules/AUDIT/engagements" />
        <StatCard icon={AlertTriangle} label="Open Findings" value={openFindings.length} color="bg-red-500" href="/modules/AUDIT/findings" />
        <StatCard icon={FileSearch} label="High/Critical Findings" value={highCritical.length} color="bg-orange-500" href="/modules/AUDIT/findings" />
        <StatCard icon={Percent} label="Avg. Non-Compliance Rate" value={`${avgRate}%`} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Engagements by Auditable Entity</CardTitle></CardHeader>
          <CardContent>
            <BarChart data={byUniverse} ariaLabel="Audit engagements by auditable entity" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Open Findings</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {openFindings.map((f) => (
              <Link key={f.id} href={`/modules/AUDIT/findings/${f.id}`} className="flex items-center gap-3 p-2 -mx-2 rounded hover:bg-accent transition-colors">
                <SeverityBadge value={String(f.severity)} />
                <span className="flex-1 min-w-0">
                  <span className="block text-sm truncate">{String(f.title)}</span>
                  <span className="block text-xs text-muted-foreground">
                    {String(f.code)} · target close {formatDate(String(f.targetCloseDate))}
                  </span>
                </span>
                <StatusBadge status={f.status} />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

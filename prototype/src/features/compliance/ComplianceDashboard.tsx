'use client';

import Link from 'next/link';
import { Scale, CalendarClock, FileWarning, Landmark } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/charts/MetricTile';
import { DonutChart } from '../../components/charts/DonutChart';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useDb } from '../../lib/store';
import { humanize, formatDate } from '../../lib/format';
import type { EntityBase } from '../../types/core';

export function ComplianceDashboard() {
  const db = useDb();
  const obligations = db.obligations as EntityBase[];
  const changes = db.regulatoryChanges as EntityBase[];
  const calendar = db.calendarEntries as EntityBase[];
  const exceptions = db.complianceExceptions as EntityBase[];

  const activeObligations = obligations.filter((o) => o.status === 'ACTIVE');
  const dueEntries = calendar.filter((c) => ['DUE', 'OVERDUE'].includes(c.status));
  const openExceptions = exceptions.filter((e) => !['CLOSED', 'RISK_ACCEPTED'].includes(e.status));
  const openChanges = changes.filter((c) => !['CLOSED'].includes(c.status));

  const byCompliance = [
    { label: 'Compliant', value: activeObligations.filter((o) => o.complianceStatus === 'COMPLIANT').length, color: 'green' as const },
    { label: 'Partially Compliant', value: activeObligations.filter((o) => o.complianceStatus === 'PARTIALLY_COMPLIANT').length, color: 'yellow' as const },
    { label: 'Non-Compliant', value: obligations.filter((o) => o.complianceStatus === 'NON_COMPLIANT').length, color: 'red' as const },
  ];

  const upcoming = [...calendar]
    .filter((c) => c.status !== 'COMPLETED')
    .sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate)))
    .slice(0, 6);

  return (
    <div>
      <PageHeader
        title="Compliance Management"
        description="Obligation register, regulatory change management, assessments, attestations and the compliance calendar."
        crumbs={[{ label: 'Compliance Management' }]}
        actions={
          <Button asChild size="sm">
            <Link href="/modules/COMPLIANCE/obligations">Open Obligation Register</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Scale} label="Active Obligations" value={activeObligations.length} color="bg-blue-500" href="/modules/COMPLIANCE/obligations" />
        <StatCard icon={CalendarClock} label="Calendar Items Due" value={dueEntries.length} color="bg-yellow-500" href="/modules/COMPLIANCE/calendar" />
        <StatCard icon={FileWarning} label="Open Exceptions" value={openExceptions.length} color="bg-red-500" href="/modules/COMPLIANCE/exceptions" />
        <StatCard icon={Landmark} label="Regulatory Changes In Flight" value={openChanges.length} color="bg-purple-500" href="/modules/COMPLIANCE/regulatory-changes" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Obligation Compliance Posture</CardTitle></CardHeader>
          <CardContent>
            <DonutChart data={byCompliance} ariaLabel="Obligations by compliance status" />
            <p className="text-xs text-muted-foreground mt-3">
              Posture reflects the latest approved compliance assessment per obligation.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Compliance Calendar — Next Deadlines</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {upcoming.map((c) => (
              <Link key={c.id} href={`/modules/COMPLIANCE/calendar/${c.id}`} className="flex items-center gap-3 p-2 -mx-2 rounded hover:bg-accent transition-colors">
                <span className="w-20 text-xs text-muted-foreground shrink-0">{formatDate(String(c.dueDate))}</span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm truncate">{String(c.title)}</span>
                  <span className="block text-xs text-muted-foreground">{humanize(String(c.entryType))} · {humanize(String(c.recurrence))}</span>
                </span>
                <StatusBadge status={c.status} />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader><CardTitle>Regulatory Change Pipeline</CardTitle></CardHeader>
        <CardContent className="space-y-1">
          {changes.map((c) => (
            <Link key={c.id} href={`/modules/COMPLIANCE/regulatory-changes/${c.id}`} className="flex items-center gap-3 p-2 -mx-2 rounded hover:bg-accent transition-colors">
              <Badge variant="secondary">{String(c.framework)}</Badge>
              <span className="flex-1 min-w-0">
                <span className="block text-sm truncate">{String(c.title)}</span>
                <span className="block text-xs text-muted-foreground">
                  Detected {formatDate(String(c.detectedDate))} · effective {formatDate(String(c.effectiveDate))}
                </span>
              </span>
              <StatusBadge status={c.status} />
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

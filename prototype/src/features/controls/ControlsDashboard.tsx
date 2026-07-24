'use client';

import Link from 'next/link';
import { ShieldCheck, FlaskConical, AlertOctagon, CalendarClock } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/charts/MetricTile';
import { BarChart } from '../../components/charts/BarChart';
import { DonutChart } from '../../components/charts/DonutChart';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { SeverityBadge, StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/button';
import { useDb } from '../../lib/store';
import { humanize, formatDate } from '../../lib/format';
import { CONTROL_FAMILIES } from '../../modules/controls';
import type { EntityBase } from '../../types/core';

export function ControlsDashboard() {
  const db = useDb();
  const controls = db.controls as EntityBase[];
  const tests = db.controlTests as EntityBase[];
  const exceptions = db.controlExceptions as EntityBase[];

  const active = controls.filter((c) => c.status === 'ACTIVE');
  const openExceptions = exceptions.filter((e) => !['CLOSED', 'RISK_ACCEPTED'].includes(e.status));
  const now = new Date().toISOString().slice(0, 10);
  const testsOverdue = active.filter((c) => typeof c.nextTestDueDate === 'string' && (c.nextTestDueDate as string) < now);
  const failedTests = tests.filter((t) => t.result === 'FAIL');

  const byEffectiveness = [
    { label: 'Effective', value: active.filter((c) => c.operatingEffectiveness === 'EFFECTIVE').length, color: 'green' as const },
    { label: 'Partially Effective', value: active.filter((c) => c.operatingEffectiveness === 'PARTIALLY_EFFECTIVE').length, color: 'yellow' as const },
    { label: 'Ineffective', value: active.filter((c) => c.operatingEffectiveness === 'INEFFECTIVE').length, color: 'red' as const },
    { label: 'Not Assessed', value: active.filter((c) => c.operatingEffectiveness === 'NOT_ASSESSED').length, color: 'gray' as const },
  ];

  const byFamily = CONTROL_FAMILIES.map((f) => ({
    label: f,
    value: controls.filter((c) => c.family === f).length,
    color: 'chart-2' as const,
    href: '/modules/CONTROLS/controls',
  })).filter((d) => d.value > 0);

  return (
    <div>
      <PageHeader
        title="Controls Management"
        description="Internal control library, design and operating effectiveness testing, exceptions and control-to-risk/obligation mapping."
        crumbs={[{ label: 'Controls Management' }]}
        actions={
          <Button asChild size="sm">
            <Link href="/modules/CONTROLS/controls">Open Control Library</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={ShieldCheck} label="Active Controls" value={active.length} color="bg-blue-500" href="/modules/CONTROLS/controls" />
        <StatCard icon={FlaskConical} label="Failed Tests (H1)" value={failedTests.length} color="bg-red-500" href="/modules/CONTROLS/tests" />
        <StatCard icon={AlertOctagon} label="Open Exceptions" value={openExceptions.length} color="bg-orange-500" href="/modules/CONTROLS/exceptions" />
        <StatCard icon={CalendarClock} label="Tests Overdue" value={testsOverdue.length} color="bg-yellow-500" href="/modules/CONTROLS/controls" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader><CardTitle>Operating Effectiveness (Active Controls)</CardTitle></CardHeader>
          <CardContent>
            <DonutChart data={byEffectiveness} ariaLabel="Active controls by operating effectiveness" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Controls by Family</CardTitle></CardHeader>
          <CardContent>
            <BarChart data={byFamily} ariaLabel="Controls by SEBI_AMC control family" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Exception Register — Open Items</CardTitle></CardHeader>
        <CardContent className="space-y-1">
          {openExceptions.map((e) => (
            <Link key={e.id} href={`/modules/CONTROLS/exceptions/${e.id}`} className="flex items-center gap-3 p-2 -mx-2 rounded hover:bg-accent transition-colors">
              <SeverityBadge value={String(e.severity)} />
              <span className="flex-1 min-w-0">
                <span className="block text-sm truncate">{String(e.title)}</span>
                <span className="block text-xs text-muted-foreground">
                  {String(e.code)} · {humanize(String(e.category))} · target close {formatDate(String(e.targetCloseDate))}
                </span>
              </span>
              <StatusBadge status={e.status} />
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

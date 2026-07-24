'use client';

import Link from 'next/link';
import { FileBarChart, FileClock, CheckCircle2, LayoutDashboard } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/charts/MetricTile';
import { DonutChart } from '../../components/charts/DonutChart';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useDb } from '../../lib/store';
import { formatDate } from '../../lib/format';
import type { EntityBase } from '../../types/core';

export function ReportingDashboard() {
  const db = useDb();
  const definitions = db.reportDefinitions as EntityBase[];
  const instances = db.reportInstances as EntityBase[];

  const pendingApproval = instances.filter((i) => i.status === 'PENDING_APPROVAL');
  const finalized = instances.filter((i) => ['FINALIZED', 'SUBMITTED'].includes(String(i.status)));
  const drafts = instances.filter((i) => i.status === 'DRAFT');

  const byCategory = [
    { label: 'Regulatory', value: definitions.filter((d) => d.reportCategory === 'REGULATORY').length, color: 'chart-1' as const },
    { label: 'Executive', value: definitions.filter((d) => d.reportCategory === 'EXECUTIVE').length, color: 'chart-2' as const },
    { label: 'Operational', value: definitions.filter((d) => d.reportCategory === 'OPERATIONAL').length, color: 'chart-3' as const },
    { label: 'Cross-Module', value: definitions.filter((d) => d.reportCategory === 'CROSS_MODULE').length, color: 'chart-4' as const },
  ];

  return (
    <div>
      <PageHeader
        title="Reporting"
        description="Regulatory and executive report catalogue, generated instances, approval-before-submission and distribution."
        crumbs={[{ label: 'Reporting' }]}
        actions={
          <Button asChild size="sm">
            <Link href="/modules/REPORTING/definitions">Open Report Catalogue</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={FileBarChart} label="Report Definitions" value={definitions.length} color="bg-blue-500" href="/modules/REPORTING/definitions" />
        <StatCard icon={FileClock} label="Pending Approval" value={pendingApproval.length} color="bg-yellow-500" href="/modules/REPORTING/instances" />
        <StatCard icon={CheckCircle2} label="Finalized/Submitted (YTD)" value={finalized.length} color="bg-green-500" href="/modules/REPORTING/instances" />
        <StatCard icon={LayoutDashboard} label="Dashboards" value={(db.dashboardDefinitions as EntityBase[]).length} color="bg-purple-500" href="/modules/REPORTING/dashboards" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Report Catalogue by Category</CardTitle></CardHeader>
          <CardContent>
            <DonutChart data={byCategory} ariaLabel="Report definitions by category" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent Report Instances</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {instances.map((i) => (
              <Link key={i.id} href={`/modules/REPORTING/instances/${i.id}`} className="flex items-center gap-3 p-2 -mx-2 rounded hover:bg-accent transition-colors">
                <Badge variant="secondary">{formatDate(String(i.generatedAt))}</Badge>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm truncate">{String(i.title)}</span>
                </span>
                <StatusBadge status={i.status} />
              </Link>
            ))}
            {drafts.length === 0 && instances.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">No report instances yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

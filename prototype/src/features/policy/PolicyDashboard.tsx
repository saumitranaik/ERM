'use client';

import Link from 'next/link';
import { BookOpen, CalendarClock, UserCheck, FileWarning } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/charts/MetricTile';
import { BarChart } from '../../components/charts/BarChart';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Progress } from '../../components/ui/progress';
import { Button } from '../../components/ui/button';
import { useDb } from '../../lib/store';
import { humanize, formatDate } from '../../lib/format';
import { POLICY_TYPES } from '../../modules/policy';
import type { EntityBase } from '../../types/core';

export function PolicyDashboard() {
  const db = useDb();
  const policies = db.policies as EntityBase[];
  const acknowledgements = db.policyAcknowledgements as EntityBase[];
  const exceptions = db.policyExceptions as EntityBase[];

  const active = policies.filter((p) => p.status === 'ACTIVE');
  const now = new Date().toISOString().slice(0, 10);
  const dueForReview = active.filter((p) => typeof p.nextReviewDue === 'string' && (p.nextReviewDue as string) < '2026-10-01' && (p.nextReviewDue as string) >= now);
  const activeCampaigns = acknowledgements.filter((a) => a.status === 'IN_PROGRESS');
  const openExceptions = exceptions.filter((e) => !['CLOSED', 'RISK_ACCEPTED'].includes(e.status));

  const byType = POLICY_TYPES.map((t) => ({
    label: humanize(t),
    value: policies.filter((p) => p.policyType === t).length,
    color: 'chart-1' as const,
    href: '/modules/POLICY/policies',
  }));

  return (
    <div>
      <PageHeader
        title="Policy Management"
        description="Governed policy lifecycle, versions, reviews, acknowledgement campaigns and exceptions."
        crumbs={[{ label: 'Policy Management' }]}
        actions={
          <Button asChild size="sm">
            <Link href="/modules/POLICY/policies">Open Policy Library</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={BookOpen} label="Active Policies" value={active.length} color="bg-blue-500" href="/modules/POLICY/policies" />
        <StatCard icon={CalendarClock} label="Due for Review" value={dueForReview.length} color="bg-yellow-500" href="/modules/POLICY/policies" />
        <StatCard icon={UserCheck} label="Acknowledgement Campaigns Active" value={activeCampaigns.length} color="bg-purple-500" href="/modules/POLICY/acknowledgements" />
        <StatCard icon={FileWarning} label="Open Exceptions" value={openExceptions.length} color="bg-red-500" href="/modules/POLICY/exceptions" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Policies by Type</CardTitle></CardHeader>
          <CardContent>
            <BarChart data={byType} ariaLabel="Policies by document type" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Acknowledgement Campaign Progress</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {acknowledgements.map((a) => (
              <Link key={a.id} href={`/modules/POLICY/acknowledgements/${a.id}`} className="block hover:opacity-80 transition-opacity">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm truncate">{String(a.title)}</span>
                  <span className="text-xs text-muted-foreground shrink-0 ml-2">{String(a.completionRate)}%</span>
                </div>
                <Progress value={Number(a.completionRate)} />
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">Ends {formatDate(String(a.campaignEnd))}</span>
                  <StatusBadge status={a.status} />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

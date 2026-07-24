'use client';

import Link from 'next/link';
import { LifeBuoy, Activity, CalendarClock, AlertOctagon } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/charts/MetricTile';
import { BarChart } from '../../components/charts/BarChart';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/button';
import { useDb } from '../../lib/store';
import { humanize, formatDate } from '../../lib/format';
import type { EntityBase } from '../../types/core';

export function BcpDashboard() {
  const db = useDb();
  const services = db.criticalServices as EntityBase[];
  const exercises = db.continuityExercises as EntityBase[];
  const exceptions = db.continuityExceptions as EntityBase[];

  const activeServices = services.filter((s) => s.status === 'ACTIVE');
  const upcomingExercises = exercises.filter((e) => e.status === 'PLANNED');
  const openExceptions = exceptions.filter((e) => !['CLOSED', 'RISK_ACCEPTED'].includes(e.status));

  const byTier = ['TIER_1_MISSION_CRITICAL', 'TIER_2_ESSENTIAL', 'TIER_3_SUPPORTING'].map((t) => ({
    label: humanize(t),
    value: activeServices.filter((s) => s.criticalityTier === t).length,
    color: 'chart-5' as const,
    href: '/modules/BCP/critical-services',
  }));

  return (
    <div>
      <PageHeader
        title="Business Continuity Management"
        description="Business impact analysis, continuity/DR plans, exercises and RTO/RPO targets."
        crumbs={[{ label: 'Business Continuity' }]}
        actions={
          <Button asChild size="sm">
            <Link href="/modules/BCP/critical-services">Open Critical Services</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={LifeBuoy} label="Active Critical Services" value={activeServices.length} color="bg-blue-500" href="/modules/BCP/critical-services" />
        <StatCard icon={Activity} label="Upcoming Exercises" value={upcomingExercises.length} color="bg-purple-500" href="/modules/BCP/exercises" />
        <StatCard icon={AlertOctagon} label="Open Exceptions" value={openExceptions.length} color="bg-red-500" href="/modules/BCP/exceptions" />
        <StatCard icon={CalendarClock} label="Reviews Due" value={services.filter((s) => typeof s.nextBiaDueDate === 'string').length} color="bg-yellow-500" href="/modules/BCP/critical-services" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Critical Services by Tier</CardTitle></CardHeader>
          <CardContent>
            <BarChart data={byTier} ariaLabel="Critical services by criticality tier" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Continuity Exercises</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {exercises.map((e) => (
              <Link key={e.id} href={`/modules/BCP/exercises/${e.id}`} className="flex items-center gap-3 p-2 -mx-2 rounded hover:bg-accent transition-colors">
                <span className="w-20 text-xs text-muted-foreground shrink-0">{formatDate(String(e.exerciseDate))}</span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm truncate">{String(e.title)}</span>
                  <span className="block text-xs text-muted-foreground">{humanize(String(e.exerciseType))}</span>
                </span>
                <StatusBadge status={e.status} />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { Siren, ListChecks, ClipboardList, AlertOctagon } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/charts/MetricTile';
import { DonutChart } from '../../components/charts/DonutChart';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { SeverityBadge, StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/button';
import { useDb } from '../../lib/store';
import { formatDate } from '../../lib/format';
import type { EntityBase } from '../../types/core';

export function IncidentDashboard() {
  const db = useDb();
  const incidents = db.incidents as EntityBase[];
  const issues = db.issues as EntityBase[];
  const capas = db.capas as EntityBase[];

  const openIncidents = incidents.filter((i) => !['CLOSED', 'RISK_ACCEPTED'].includes(i.status));
  const openIssues = issues.filter((i) => i.status !== 'CLOSED');
  const activeCapas = capas.filter((c) => !['CLOSED'].includes(c.status));

  const bySeverity = [
    { label: 'Critical', value: incidents.filter((i) => i.severity === 'CRITICAL').length, color: 'red' as const },
    { label: 'High', value: incidents.filter((i) => i.severity === 'HIGH').length, color: 'orange' as const },
    { label: 'Medium', value: incidents.filter((i) => i.severity === 'MEDIUM').length, color: 'yellow' as const },
    { label: 'Low', value: incidents.filter((i) => i.severity === 'LOW').length, color: 'green' as const },
  ];

  return (
    <div>
      <PageHeader
        title="Incident, Issue & CAPA Management"
        description="Incident intake, root cause analysis, issue register and corrective/preventive action tracking."
        crumbs={[{ label: 'Incident, Issue & CAPA' }]}
        actions={
          <Button asChild size="sm">
            <Link href="/modules/INCIDENT/incidents">Open Incident Register</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Siren} label="Open Incidents" value={openIncidents.length} color="bg-red-500" href="/modules/INCIDENT/incidents" />
        <StatCard icon={AlertOctagon} label="Open Issues" value={openIssues.length} color="bg-orange-500" href="/modules/INCIDENT/issues" />
        <StatCard icon={ListChecks} label="Active CAPAs" value={activeCapas.length} color="bg-blue-500" href="/modules/INCIDENT/capas" />
        <StatCard icon={ClipboardList} label="Total Incidents (YTD)" value={incidents.length} color="bg-purple-500" href="/modules/INCIDENT/incidents" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Incidents by Severity</CardTitle></CardHeader>
          <CardContent>
            <DonutChart data={bySeverity} ariaLabel="Incidents by severity" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Open Incidents</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {openIncidents.map((i) => (
              <Link key={i.id} href={`/modules/INCIDENT/incidents/${i.id}`} className="flex items-center gap-3 p-2 -mx-2 rounded hover:bg-accent transition-colors">
                <SeverityBadge value={String(i.severity)} />
                <span className="flex-1 min-w-0">
                  <span className="block text-sm truncate">{String(i.title)}</span>
                  <span className="block text-xs text-muted-foreground">{String(i.code)} · reported {formatDate(String(i.reportedDate))}</span>
                </span>
                <StatusBadge status={i.status} />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

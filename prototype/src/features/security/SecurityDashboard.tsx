'use client';

import Link from 'next/link';
import { Lock, ShieldAlert, KeyRound, UserCog } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/charts/MetricTile';
import { DonutChart } from '../../components/charts/DonutChart';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { SeverityBadge, StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/button';
import { useDb } from '../../lib/store';
import { formatDate } from '../../lib/format';
import type { EntityBase } from '../../types/core';

export function SecurityDashboard() {
  const db = useDb();
  const findings = db.securityFindings as EntityBase[];
  const assets = db.securityAssets as EntityBase[];
  const grants = db.accessGrants as EntityBase[];

  const openFindings = findings.filter((f) => !['CLOSED', 'RISK_ACCEPTED'].includes(f.status));
  const critical = findings.filter((f) => f.severity === 'CRITICAL' && !['CLOSED', 'RISK_ACCEPTED'].includes(f.status));
  const now = new Date().toISOString().slice(0, 10);
  const expiringAssets = assets.filter((a) => typeof a.expiryDate === 'string' && (a.expiryDate as string) < '2026-09-01' && (a.expiryDate as string) >= now);
  const pendingGrants = grants.filter((g) => g.status === 'REQUESTED');

  const bySeverity = [
    { label: 'Critical', value: findings.filter((f) => f.severity === 'CRITICAL').length, color: 'red' as const },
    { label: 'High', value: findings.filter((f) => f.severity === 'HIGH').length, color: 'orange' as const },
    { label: 'Medium', value: findings.filter((f) => f.severity === 'MEDIUM').length, color: 'yellow' as const },
    { label: 'Low', value: findings.filter((f) => f.severity === 'LOW').length, color: 'green' as const },
  ];

  return (
    <div>
      <PageHeader
        title="Security Management"
        description="Security assets, baselines, access governance and security findings, aligned to the SEBI Cyber Security & Cyber Resilience Framework."
        crumbs={[{ label: 'Security Management' }]}
        actions={
          <Button asChild size="sm">
            <Link href="/modules/SECURITY/findings">Open Findings Register</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={ShieldAlert} label="Open Findings" value={openFindings.length} color="bg-red-500" href="/modules/SECURITY/findings" />
        <StatCard icon={Lock} label="Critical Open" value={critical.length} color="bg-orange-500" href="/modules/SECURITY/findings" />
        <StatCard icon={KeyRound} label="Assets Expiring Soon" value={expiringAssets.length} color="bg-yellow-500" href="/modules/SECURITY/assets" />
        <StatCard icon={UserCog} label="Access Requests Pending" value={pendingGrants.length} color="bg-blue-500" href="/modules/SECURITY/access-grants" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Findings by Severity</CardTitle></CardHeader>
          <CardContent>
            <DonutChart data={bySeverity} ariaLabel="Security findings by severity" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Open Security Findings</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {openFindings.map((f) => (
              <Link key={f.id} href={`/modules/SECURITY/findings/${f.id}`} className="flex items-center gap-3 p-2 -mx-2 rounded hover:bg-accent transition-colors">
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

'use client';

import Link from 'next/link';
import { Handshake, ShieldAlert, FileClock, AlertOctagon } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatCard } from '../../components/charts/MetricTile';
import { DonutChart } from '../../components/charts/DonutChart';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { SeverityBadge, StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/button';
import { useDb } from '../../lib/store';
import { formatDate } from '../../lib/format';
import type { EntityBase } from '../../types/core';

export function TprDashboard() {
  const db = useDb();
  const vendors = db.vendors as EntityBase[];
  const exceptions = db.vendorExceptions as EntityBase[];
  const contracts = db.vendorContracts as EntityBase[];

  const activeVendors = vendors.filter((v) => v.status === 'ACTIVE');
  const criticalVendors = activeVendors.filter((v) => v.criticality === 'CRITICAL');
  const openExceptions = exceptions.filter((e) => !['CLOSED', 'RISK_ACCEPTED'].includes(e.status));
  const expiringContracts = contracts.filter((c) => c.status === 'EXPIRING_SOON');

  const byCriticality = [
    { label: 'Critical', value: activeVendors.filter((v) => v.criticality === 'CRITICAL').length, color: 'red' as const },
    { label: 'High', value: activeVendors.filter((v) => v.criticality === 'HIGH').length, color: 'orange' as const },
    { label: 'Medium', value: activeVendors.filter((v) => v.criticality === 'MEDIUM').length, color: 'yellow' as const },
    { label: 'Low', value: activeVendors.filter((v) => v.criticality === 'LOW').length, color: 'green' as const },
  ];

  return (
    <div>
      <PageHeader
        title="Third-Party Risk Management"
        description="Vendor inventory, due diligence assessments, contracts, SLAs and exceptions."
        crumbs={[{ label: 'Third-Party Risk' }]}
        actions={
          <Button asChild size="sm">
            <Link href="/modules/TPR/vendors">Open Vendor Inventory</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Handshake} label="Active Vendors" value={activeVendors.length} color="bg-blue-500" href="/modules/TPR/vendors" />
        <StatCard icon={ShieldAlert} label="Critical Vendors" value={criticalVendors.length} color="bg-red-500" href="/modules/TPR/vendors" />
        <StatCard icon={AlertOctagon} label="Open Exceptions" value={openExceptions.length} color="bg-orange-500" href="/modules/TPR/exceptions" />
        <StatCard icon={FileClock} label="Contracts Expiring Soon" value={expiringContracts.length} color="bg-yellow-500" href="/modules/TPR/contracts" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Active Vendors by Criticality</CardTitle></CardHeader>
          <CardContent>
            <DonutChart data={byCriticality} ariaLabel="Active vendors by criticality tier" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Open Vendor Exceptions</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {openExceptions.map((e) => (
              <Link key={e.id} href={`/modules/TPR/exceptions/${e.id}`} className="flex items-center gap-3 p-2 -mx-2 rounded hover:bg-accent transition-colors">
                <SeverityBadge value={String(e.severity)} />
                <span className="flex-1 min-w-0">
                  <span className="block text-sm truncate">{String(e.title)}</span>
                  <span className="block text-xs text-muted-foreground">{String(e.code)} · target close {formatDate(String(e.targetCloseDate))}</span>
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

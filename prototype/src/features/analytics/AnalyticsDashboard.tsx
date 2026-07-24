'use client';

import Link from 'next/link';
import { BarChart3 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { MetricTile } from '../../components/charts/MetricTile';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useDb } from '../../lib/store';
import { humanize } from '../../lib/format';
import { moduleByCode } from '../../lib/moduleCatalog';
import type { EntityBase } from '../../types/core';

const MODULE_ORDER = ['CROSS_MODULE', 'RISK', 'CONTROLS', 'COMPLIANCE', 'AUDIT', 'SECURITY', 'POLICY', 'INCIDENT', 'TPR', 'BCP'];

function categoryLabel(cat: string): string {
  if (cat === 'CROSS_MODULE') return 'Cross-Module';
  return moduleByCode(cat)?.displayName ?? humanize(cat);
}

export function AnalyticsDashboard() {
  const db = useDb();
  const metrics = db.metricDefinitions as EntityBase[];

  const redCount = metrics.filter((m) => m.band === 'RED').length;
  const amberCount = metrics.filter((m) => m.band === 'AMBER').length;

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="KPI and metric catalogue, threshold banding, trends and drill-downs across every module."
        crumbs={[{ label: 'Analytics' }]}
        actions={
          <Button asChild size="sm">
            <Link href="/modules/ANALYTICS/metrics">Open Metric Catalogue</Link>
          </Button>
        }
      />

      <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> {redCount} Red</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> {amberCount} Amber</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500" /> {metrics.length - redCount - amberCount} Green</span>
      </div>

      {MODULE_ORDER.map((cat) => {
        const rows = metrics.filter((m) => m.metricCategory === cat);
        if (rows.length === 0) return null;
        return (
          <Card key={cat} className="mb-4">
            <CardHeader className="pb-2"><CardTitle>{categoryLabel(cat)}</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {rows.map((m) => (
                  <MetricTile
                    key={m.id}
                    name={String(m.name)}
                    value={m.currentValue as number}
                    unit={String(m.unit) === 'count' || String(m.unit) === 'index' ? undefined : String(m.unit)}
                    band={m.band as 'GREEN' | 'AMBER' | 'RED'}
                    trend={m.trend as number[]}
                    direction={
                      Array.isArray(m.trend) && (m.trend as number[]).length > 1
                        ? (m.trend as number[])[(m.trend as number[]).length - 1] > (m.trend as number[])[0]
                          ? 'up'
                          : (m.trend as number[])[(m.trend as number[]).length - 1] < (m.trend as number[])[0]
                            ? 'down'
                            : 'flat'
                        : undefined
                    }
                    href={`/modules/ANALYTICS/metrics/${m.id}`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

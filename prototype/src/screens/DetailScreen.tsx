'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Pencil } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { CellValue, DataTable } from '../components/common/DataTable';
import { Timeline } from '../components/common/Timeline';
import { EvidencePanel } from '../components/common/EvidencePanel';
import { ErrorBanner } from '../components/common/ErrorBanner';
import { EmptyState } from '../components/common/EmptyState';
import { WorkflowActionBar } from '../components/module/WorkflowActions';
import { ApprovalDecision, DecidedActionCard } from '../components/module/ApprovalPanel';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useDb } from '../lib/store';
import { useSession } from '../lib/session';
import { moduleByCode } from '../lib/moduleCatalog';
import { entityHref, entityTitle, rowsFor, type EntityConfig } from '../lib/registry';
import { humanize } from '../lib/format';

export function DetailScreen({ cfg, id }: { cfg: EntityConfig; id: string }) {
  const db = useDb();
  const session = useSession();
  const [error, setError] = useState('');
  const mod = moduleByCode(cfg.module);
  const entity = rowsFor(db, cfg.collection).find((e) => e.id === id);

  if (!entity) {
    return (
      <EmptyState
        title={`${cfg.labelSingular} not found`}
        description="The record may have been removed, or the link is stale."
        action={
          <Button asChild variant="outline">
            <Link href={entityHref(cfg)}>Back to {cfg.labelPlural}</Link>
          </Button>
        }
      />
    );
  }

  const pending = db.pendingActions.find(
    (a) => a.collection === cfg.collection && a.entityId === id && a.status === 'pending',
  );
  const decided = db.pendingActions.filter(
    (a) => a.collection === cfg.collection && a.entityId === id && a.status !== 'pending',
  );
  const events = db.history.filter((h) => h.collection === cfg.collection && h.entityId === id);
  const canEdit = session?.has(`${cfg.module}_CREATE`) && cfg.editableStatuses.includes(entity.status) && !pending;

  const title = entityTitle(cfg, entity);

  return (
    <div>
      <PageHeader
        title={title}
        crumbs={[
          { label: mod?.displayName ?? cfg.module, href: `/modules/${cfg.module}` },
          { label: cfg.labelPlural, href: entityHref(cfg) },
          { label: String(entity.code ?? title) },
        ]}
        badge={
          <span className="flex items-center gap-2">
            {entity.code ? <span className="font-mono text-sm text-muted-foreground">{String(entity.code)}</span> : null}
            <StatusBadge status={entity.status} tone={cfg.statusTones?.[entity.status]} />
            {pending && <Badge variant="warning">Awaiting checker</Badge>}
          </span>
        }
        actions={
          <>
            {canEdit && (
              <Button asChild variant="outline" size="sm">
                <Link href={`${entityHref(cfg, id)}/edit`}>
                  <Pencil /> Edit
                </Link>
              </Button>
            )}
            <WorkflowActionBar cfg={cfg} entity={entity} onError={setError} />
          </>
        }
      />

      <ErrorBanner message={error} onDismiss={() => setError('')} />

      {pending && (
        <div className="mb-4">
          <ApprovalDecision action={pending} onError={setError} />
        </div>
      )}

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {cfg.relations.length > 0 && <TabsTrigger value="relationships">Relationships</TabsTrigger>}
          {cfg.hasEvidence && <TabsTrigger value="evidence">Evidence</TabsTrigger>}
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {entity.description ? (
              <Card className="lg:col-span-2">
                <CardHeader className="pb-2"><CardTitle>Description</CardTitle></CardHeader>
                <CardContent><p className="text-sm leading-relaxed">{String(entity.description)}</p></CardContent>
              </Card>
            ) : null}
            {cfg.detailSections.map((s) => (
              <Card key={s.title}>
                <CardHeader className="pb-2"><CardTitle>{s.title}</CardTitle></CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                    {s.fields.map((f) => (
                      <div key={f.key} className="min-w-0">
                        <dt className="text-xs text-muted-foreground">{f.label}</dt>
                        <dd className="text-sm mt-0.5 break-words">
                          <CellValue cell={f.cell} value={entity[f.key]} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {cfg.relations.length > 0 && (
          <TabsContent value="relationships">
            <div className="space-y-6">
              {cfg.relations.map((rel) => {
                const related = rel.foreignKey
                  ? rowsFor(db, rel.collection).filter((r) => {
                      const fk = r[rel.foreignKey!];
                      return Array.isArray(fk) ? fk.includes(id) : fk === id;
                    })
                  : rowsFor(db, rel.collection).filter((r) =>
                      Array.isArray(entity[rel.localKey!]) && (entity[rel.localKey!] as string[]).includes(r.id),
                    );
                return (
                  <div key={rel.label}>
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                      {rel.label}
                      <Badge variant="secondary">{related.length}</Badge>
                    </h3>
                    {related.length === 0 ? (
                      <p className="text-sm text-muted-foreground border border-dashed border-border rounded-lg p-4">
                        No linked records.
                      </p>
                    ) : (
                      <DataTable
                        rows={related}
                        columns={rel.columns}
                        searchKeys={['code', 'title', 'name']}
                        rowHref={(r) => `/modules/${rel.module}/${rel.entitySlug}/${r.id}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>
        )}

        {cfg.hasEvidence && (
          <TabsContent value="evidence">
            <EvidencePanel collection={cfg.collection} entityId={id} />
          </TabsContent>
        )}

        <TabsContent value="history">
          <Card>
            <CardContent className="pt-6">
              <Timeline events={events} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals">
          <div className="space-y-3">
            {pending && <ApprovalDecision action={pending} onError={setError} />}
            {decided.length === 0 && !pending && (
              <EmptyState
                title="No approval activity"
                description={`Governed workflow actions on this ${cfg.labelSingular.toLowerCase()} will appear here with their maker-checker trail.`}
              />
            )}
            {decided.map((a) => (
              <DecidedActionCard key={a.id} action={a} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

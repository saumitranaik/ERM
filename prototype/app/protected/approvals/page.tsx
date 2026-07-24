'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Clock, History as HistoryIcon } from 'lucide-react';
import { PageHeader } from '@/src/components/common/PageHeader';
import { ErrorBanner } from '@/src/components/common/ErrorBanner';
import { EmptyState } from '@/src/components/common/EmptyState';
import { ApprovalDecision, DecidedActionCard, personaDisplay } from '@/src/components/module/ApprovalPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { Card, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { useDb } from '@/src/lib/store';
import { useSession } from '@/src/lib/session';
import { humanize, formatDateTime } from '@/src/lib/format';

export default function ApprovalsPage() {
  const db = useDb();
  const session = useSession();
  const [error, setError] = useState('');
  if (!session) return null;

  const pendingForMe = db.pendingActions.filter(
    (a) => a.status === 'pending' && session.has(`${a.module}_APPROVE`) && a.createdBy !== session.persona.id,
  );
  const mySubmissions = db.pendingActions.filter((a) => a.createdBy === session.persona.id);
  const decidedByMe = db.pendingActions.filter((a) => a.decidedBy === session.persona.id);

  return (
    <div>
      <PageHeader
        title="Approvals"
        description="Cross-module maker-checker queue — decide pending actions where you hold the checker role, and track your own submissions."
      />
      <ErrorBanner message={error} onDismiss={() => setError('')} />

      <Tabs defaultValue="queue">
        <TabsList>
          <TabsTrigger value="queue">Checker Queue ({pendingForMe.length})</TabsTrigger>
          <TabsTrigger value="mine">My Submissions ({mySubmissions.length})</TabsTrigger>
          <TabsTrigger value="history">Decision History ({decidedByMe.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="queue">
          {pendingForMe.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="Nothing awaiting your decision"
              description="Items requiring approval from a role you hold will appear here. Switch persona to see other checker queues."
            />
          ) : (
            <div className="space-y-3">
              {pendingForMe.map((a) => (
                <Card key={a.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{a.module}</Badge>
                      <Link href={a.entityHref} className="text-xs text-blue-600 hover:underline">
                        View record →
                      </Link>
                    </div>
                    <ApprovalDecision action={a} onError={setError} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="mine">
          {mySubmissions.length === 0 ? (
            <EmptyState title="No submissions" description="Records you submit for approval will appear here." />
          ) : (
            <div className="space-y-2">
              {mySubmissions.map((a) => (
                <Link
                  key={a.id}
                  href={a.entityHref}
                  className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  <Badge variant="secondary">{a.module}</Badge>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm truncate">{humanize(a.actionType)} — {a.entityLabel}</span>
                    <span className="block text-xs text-muted-foreground">
                      Submitted {formatDateTime(a.createdAt)}
                      {a.decidedBy && ` · decided by ${personaDisplay(db, a.decidedBy)}`}
                    </span>
                  </span>
                  <Badge variant={a.status === 'pending' ? 'warning' : a.status === 'approved' ? 'success' : 'danger'}>
                    {humanize(a.status)}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          {decidedByMe.length === 0 ? (
            <EmptyState icon={HistoryIcon} title="No decisions yet" description="Actions you approve or reject will be logged here." />
          ) : (
            <div className="space-y-3">
              {decidedByMe.map((a) => (
                <DecidedActionCard key={a.id} action={a} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

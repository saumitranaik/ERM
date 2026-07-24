'use client';

import Link from 'next/link';
import { Clock, CheckSquare, Gauge, ShieldAlert } from 'lucide-react';
import { PageHeader } from '@/src/components/common/PageHeader';
import { StatCard } from '@/src/components/charts/MetricTile';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { StatusBadge } from '@/src/components/common/StatusBadge';
import { moduleCatalog } from '@/src/lib/moduleCatalog';
import { moduleIcon } from '@/src/components/common/moduleIcons';
import { useDb } from '@/src/lib/store';
import { useSession } from '@/src/lib/session';
import { timeAgo } from '@/src/lib/format';
import { notificationsForPersona } from '@/src/components/common/NotificationBell';
import type { EntityBase } from '@/src/types/core';

export default function HomePage() {
  const db = useDb();
  const session = useSession();
  if (!session) return null;

  const myPending = db.pendingActions.filter(
    (a) => a.status === 'pending' && session.has(`${a.module}_APPROVE`) && a.createdBy !== session.persona.id,
  );
  const mySubmissions = db.pendingActions.filter((a) => a.status === 'pending' && a.createdBy === session.persona.id);
  const myTasks = db.tasks.filter((t) => t.assigneePersonaId === session.persona.id && t.status !== 'DONE');
  const recentActivity = notificationsForPersona(db.notifications, session.persona.id, session.permissions).slice(0, 6);

  const risks = db.risks as EntityBase[];
  const escalatedRisks = risks.filter((r) => r.status === 'ESCALATED').length;
  const criticalSecurityOpen = (db.securityFindings as EntityBase[]).filter(
    (f) => f.severity === 'CRITICAL' && !['CLOSED', 'RISK_ACCEPTED'].includes(f.status),
  ).length;

  const visibleModules = moduleCatalog.filter((m) => session.has(`${m.code}_VIEW`));

  return (
    <div>
      <PageHeader
        title={`Welcome, ${session.user.name.split(' ')[0]}`}
        description={`${session.persona.label} — ${session.persona.summary}`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={CheckSquare} label="Pending My Approval" value={myPending.length} color="bg-yellow-500" href="/protected/approvals" />
        <StatCard icon={Clock} label="My Submissions Awaiting Decision" value={mySubmissions.length} color="bg-blue-500" href="/protected/approvals" />
        <StatCard icon={Gauge} label="Escalated Risks" value={escalatedRisks} color="bg-red-500" href="/modules/RISK/risks" />
        <StatCard icon={ShieldAlert} label="Critical Security Findings" value={criticalSecurityOpen} color="bg-orange-500" href="/modules/SECURITY/findings" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <Card className="xl:col-span-2">
          <CardHeader><CardTitle>My Tasks</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {myTasks.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">No open tasks assigned to you.</p>}
            {myTasks.map((t) => (
              <Link key={t.id} href={t.href} className="flex items-center gap-3 p-2 -mx-2 rounded hover:bg-accent transition-colors">
                <span className="flex-1 min-w-0">
                  <span className="block text-sm truncate">{t.title}</span>
                  <span className="block text-xs text-muted-foreground">{t.module} · due {t.dueDate}</span>
                </span>
                <StatusBadge status={t.status} />
              </Link>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">No recent activity.</p>}
            {recentActivity.map((n) => (
              <Link key={n.id} href={n.href} className="block">
                <p className="text-sm truncate">{n.title}</p>
                <p className="text-xs text-muted-foreground">{timeAgo(n.at)}</p>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <h2 className="text-sm font-medium text-muted-foreground mb-3">Modules</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleModules.map((m) => {
          const Icon = moduleIcon(m.icon);
          return (
            <Link
              key={m.code}
              href={`/modules/${m.code}`}
              className="bg-card border border-border rounded-lg p-4 flex items-start gap-3 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-accent transition-all"
            >
              <span className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium">{m.displayName}</span>
                <span className="block text-xs text-muted-foreground line-clamp-2 mt-0.5">{m.description}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

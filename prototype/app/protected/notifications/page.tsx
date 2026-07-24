'use client';

import Link from 'next/link';
import { Bell, CheckCheck } from 'lucide-react';
import { PageHeader } from '@/src/components/common/PageHeader';
import { EmptyState } from '@/src/components/common/EmptyState';
import { Button } from '@/src/components/ui/button';
import { useDb, mutate } from '@/src/lib/store';
import { useSession } from '@/src/lib/session';
import { notificationsForPersona } from '@/src/components/common/NotificationBell';
import { formatDateTime } from '@/src/lib/format';

const severityDot: Record<string, string> = {
  info: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
};

export default function NotificationsPage() {
  const db = useDb();
  const session = useSession();
  if (!session) return null;

  const mine = notificationsForPersona(db.notifications, session.persona.id, session.permissions);
  const unreadCount = mine.filter((n) => !n.read).length;

  const markAllRead = () => {
    mutate((d) => {
      for (const n of notificationsForPersona(d.notifications, session.persona.id, session.permissions)) {
        n.read = true;
      }
    });
  };

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Approval requests, decisions and workflow events relevant to your current persona."
        actions={
          unreadCount > 0 ? (
            <Button variant="outline" size="sm" onClick={markAllRead}>
              <CheckCheck /> Mark all read
            </Button>
          ) : undefined
        }
      />

      {mine.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up." />
      ) : (
        <ul className="divide-y divide-border border border-border rounded-lg bg-card">
          {mine.map((n) => (
            <li key={n.id}>
              <Link
                href={n.href}
                onClick={() => mutate((d) => { const x = d.notifications.find((y) => y.id === n.id); if (x) x.read = true; })}
                className="flex items-start gap-3 p-4 hover:bg-accent transition-colors"
              >
                <span className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${severityDot[n.severity] ?? 'bg-blue-500'} ${n.read ? 'opacity-30' : ''}`} />
                <span className="flex-1 min-w-0">
                  <span className={`block text-sm ${n.read ? 'text-muted-foreground' : 'font-medium'}`}>{n.title}</span>
                  <span className="block text-sm text-muted-foreground mt-0.5">{n.body}</span>
                  <span className="block text-xs text-muted-foreground mt-1">{formatDateTime(n.at)} · {n.module}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

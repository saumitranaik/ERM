'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, CheckCheck } from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useDb, mutate } from '../../lib/store';
import { useSession } from '../../lib/session';
import { timeAgo } from '../../lib/format';
import type { AppNotification } from '../../types/core';

export function notificationsForPersona(
  all: AppNotification[],
  personaId: string,
  permissions: Set<string>,
): AppNotification[] {
  return all.filter((n) => {
    if (n.recipientPersonaId) return n.recipientPersonaId === personaId;
    if (n.audience === 'checkers') return permissions.has(`${n.module}_APPROVE`);
    return true; // audience 'all' or unspecified
  });
}

const severityDot: Record<string, string> = {
  info: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
};

export function NotificationBell() {
  const db = useDb();
  const session = useSession();
  const router = useRouter();
  if (!session) return null;

  const mine = notificationsForPersona(db.notifications, session.persona.id, session.permissions);
  const unread = mine.filter((n) => !n.read);
  const recent = mine.slice(0, 8);

  const markAllRead = () => {
    mutate((d) => {
      for (const n of notificationsForPersona(d.notifications, session.persona.id, session.permissions)) {
        n.read = true;
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Notifications${unread.length ? ` (${unread.length} unread)` : ''}`}
        className="relative p-2 rounded hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Bell className="w-4 h-4 text-muted-foreground" />
        {unread.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
            {unread.length > 99 ? '99+' : unread.length}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <div className="flex items-center justify-between pr-2">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          {unread.length > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </button>
          )}
        </div>
        <DropdownMenuSeparator />
        {recent.length === 0 && (
          <p className="px-3 py-6 text-sm text-muted-foreground text-center">No notifications</p>
        )}
        {recent.map((n) => (
          <DropdownMenuItem
            key={n.id}
            className="items-start gap-2 py-2"
            onSelect={() => {
              mutate((d) => {
                const x = d.notifications.find((y) => y.id === n.id);
                if (x) x.read = true;
              });
              router.push(n.href);
            }}
          >
            <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${severityDot[n.severity] ?? 'bg-blue-500'} ${n.read ? 'opacity-30' : ''}`} />
            <span className="flex-1 min-w-0">
              <span className={`block text-sm truncate ${n.read ? 'text-muted-foreground' : 'font-medium'}`}>{n.title}</span>
              <span className="block text-xs text-muted-foreground truncate">{n.body}</span>
              <span className="block text-[11px] text-muted-foreground mt-0.5">{timeAgo(n.at)}</span>
            </span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/protected/notifications" className="justify-center text-blue-600">
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

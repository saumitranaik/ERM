'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, Bell, Search } from 'lucide-react';
import { moduleCatalog } from '../lib/moduleCatalog';
import { useSession } from '../lib/session';
import { moduleIcon } from './common/moduleIcons';
import { notificationsForPersona } from './common/NotificationBell';
import { useDb } from '../lib/store';
import { cn } from './ui/utils';

/**
 * Sidebar navigation, mirroring PRSMTD's SideNav zones: fixed enterprise
 * groups first, then module execution links derived exclusively from the
 * module catalog (never hardcoded — Frontend Hardcoding Guard).
 */
export default function SideNav({ onNavigate }: { onNavigate?: () => void }) {
  const session = useSession();
  const pathname = usePathname();
  const db = useDb();
  if (!session) return null;

  const pendingCount = db.pendingActions.filter(
    (a) => a.status === 'pending' && session.has(`${a.module}_APPROVE`) && a.createdBy !== session.persona.id,
  ).length;
  const unreadCount = notificationsForPersona(db.notifications, session.persona.id, session.permissions)
    .filter((n) => !n.read).length;

  const groups = [
    { id: 'home', label: 'Home', href: '/protected', icon: LayoutDashboard, badge: 0, exact: true },
    { id: 'approvals', label: 'Approvals', href: '/protected/approvals', icon: CheckSquare, badge: pendingCount, exact: false },
    { id: 'notifications', label: 'Notifications', href: '/protected/notifications', icon: Bell, badge: unreadCount, exact: false },
    { id: 'search', label: 'Global Search', href: '/protected/search', icon: Search, badge: 0, exact: false },
  ];

  const visibleModules = moduleCatalog.filter((m) => session.has(`${m.code}_VIEW`));

  const linkClass = (active: boolean) =>
    cn(
      'flex items-center gap-2 px-2 py-2 rounded text-sm transition-colors',
      active
        ? 'bg-blue-50 text-blue-700 font-medium dark:bg-accent dark:text-accent-foreground'
        : 'text-foreground/80 hover:bg-accent',
    );

  return (
    <nav className="p-2 flex flex-col h-full overflow-y-auto" aria-label="Primary">
      <div className="space-y-1">
        {groups.map((g) => {
          const active = g.exact ? pathname === g.href : pathname.startsWith(g.href);
          const Icon = g.icon;
          return (
            <Link key={g.id} href={g.href} onClick={onNavigate} aria-current={active ? 'page' : undefined} className={linkClass(active)}>
              <Icon className={cn('w-4 h-4', active ? 'text-blue-700 dark:text-accent-foreground' : 'text-muted-foreground')} />
              <span className="flex-1">{g.label}</span>
              {g.badge > 0 && (
                <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                  {g.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <p className="px-2 pt-5 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        Modules
      </p>
      <div className="space-y-1">
        {visibleModules.map((m) => {
          const href = `/modules/${m.code}`;
          const active = pathname === href || pathname.startsWith(href + '/');
          const Icon = moduleIcon(m.icon);
          return (
            <Link key={m.code} href={href} onClick={onNavigate} aria-current={active ? 'page' : undefined} className={linkClass(active)}>
              <Icon className={cn('w-4 h-4', active ? 'text-blue-700 dark:text-accent-foreground' : 'text-muted-foreground')} />
              {m.displayName}
            </Link>
          );
        })}
      </div>

      <div className="flex-1" aria-hidden="true" />
      <p className="px-2 py-3 text-[11px] text-muted-foreground">
        UX Reference Prototype
        <br />
        Mock data only — not production
      </p>
    </nav>
  );
}

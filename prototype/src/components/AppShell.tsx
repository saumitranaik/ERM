'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, ShieldCheck, X } from 'lucide-react';
import SideNav from './SideNav';
import { PersonaSwitcher } from './common/PersonaSwitcher';
import { NotificationBell } from './common/NotificationBell';
import { Hydrated } from './common/Hydrated';
import { useSession } from '../lib/session';
import { Skeleton } from './ui/skeleton';
import { TooltipProvider } from './ui/tooltip';

function ShellFrame({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Route guard: without a persona, everything redirects to mock login.
  useEffect(() => {
    if (!session) router.replace('/login');
  }, [session, router]);

  // Close the mobile drawer on navigation.
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  if (!session) return null;

  return (
    <div className="min-h-screen bg-muted/40 flex flex-col">
      {/* Global header — tenant context always visible (PRSMTD convention) */}
      <header className="bg-background border-b border-border sticky top-0 z-40">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              className="lg:hidden p-2 -ml-2 rounded hover:bg-accent"
              onClick={() => setMobileNavOpen((v) => !v)}
              aria-label={mobileNavOpen ? 'Close navigation' : 'Open navigation'}
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link href="/protected" className="flex items-center gap-3 min-w-0">
              <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-primary-foreground" />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-2 min-w-0">
                  <span className="text-xs text-muted-foreground hidden sm:inline">Tenant:</span>
                  <span className="text-sm truncate">Meridian Asset Management Ltd.</span>
                </span>
                <span className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-muted-foreground hidden sm:inline">Environment:</span>
                  <span className="text-[11px] px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded uppercase">Prototype</span>
                </span>
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <NotificationBell />
            <PersonaSwitcher />
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar — desktop */}
        <aside className="hidden lg:block w-60 shrink-0 border-r border-border bg-background">
          <div className="sticky top-[61px] h-[calc(100vh-61px)]">
            <SideNav />
          </div>
        </aside>

        {/* Sidebar — mobile drawer */}
        {mobileNavOpen && (
          <div className="lg:hidden fixed inset-0 z-30 top-[61px]">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileNavOpen(false)} aria-hidden="true" />
            <aside className="absolute left-0 top-0 bottom-0 w-64 bg-background border-r border-border overflow-y-auto">
              <SideNav onNavigate={() => setMobileNavOpen(false)} />
            </aside>
          </div>
        )}

        <main className="flex-1 min-w-0 p-4 sm:p-6">{children}</main>
      </div>

      <footer className="bg-background border-t border-border px-6 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>ERM / GRC Platform — UX Reference Prototype</span>
          <span>Specification blueprint for PRSMTD | All data fictional</span>
        </div>
      </footer>
    </div>
  );
}

function ShellSkeleton() {
  return (
    <div className="min-h-screen bg-muted/40 p-6 space-y-4">
      <Skeleton className="h-12 w-full" />
      <div className="flex gap-4">
        <Skeleton className="h-96 w-60 hidden lg:block" />
        <Skeleton className="h-96 flex-1" />
      </div>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Hydrated fallback={<ShellSkeleton />}>
      <TooltipProvider delayDuration={300}>
        <ShellFrame>{children}</ShellFrame>
      </TooltipProvider>
    </Hydrated>
  );
}

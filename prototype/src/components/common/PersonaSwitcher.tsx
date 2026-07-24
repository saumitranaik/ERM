'use client';

import { useRouter } from 'next/navigation';
import { ChevronDown, LogOut, UserRound, RotateCcw } from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useDb, resetDb } from '../../lib/store';
import { useSession, setPersonaId } from '../../lib/session';
import type { Persona } from '../../types/core';
import { ThemeToggleItem } from './ThemeToggle';

/**
 * Persona switcher — the prototype's substitute for re-authentication. Lets a
 * stakeholder act as maker, then switch to a checker persona to decide the
 * same item, demonstrating maker-checker end to end in one sitting.
 */
export function PersonaSwitcher() {
  const db = useDb();
  const session = useSession();
  const router = useRouter();
  if (!session) return null;
  const personas = db.personas as unknown as Persona[];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded hover:bg-accent text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <UserRound className="w-4 h-4 text-muted-foreground" />
        <span className="hidden sm:block max-w-[160px] truncate">{session.user.name}</span>
        <span className="hidden md:block text-xs text-muted-foreground max-w-[140px] truncate">{session.persona.label}</span>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Switch persona (demo)</DropdownMenuLabel>
        {personas.map((p) => {
          const user = db.users.find((u) => u.id === p.userId);
          const active = p.id === session.persona.id;
          return (
            <DropdownMenuItem
              key={p.id}
              onSelect={() => setPersonaId(p.id)}
              className={active ? 'bg-blue-50 text-blue-700 font-medium dark:bg-accent dark:text-accent-foreground' : ''}
            >
              <span className="flex-1 min-w-0">
                <span className="block truncate">{user?.name}</span>
                <span className="block text-xs text-muted-foreground truncate">{p.label}</span>
              </span>
              {active && <span className="text-xs">✓</span>}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <ThemeToggleItem />
        <DropdownMenuItem
          onSelect={() => {
            if (confirm('Reset all demo data to the pristine seed datasets? Your workflow actions will be discarded.')) {
              resetDb();
            }
          }}
        >
          <RotateCcw className="text-muted-foreground" />
          Reset demo data
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            setPersonaId(null);
            router.push('/login');
          }}
        >
          <LogOut className="text-muted-foreground" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

'use client';

import { CheckCircle, XCircle, RotateCcw, PlusCircle, Pencil, ArrowRight, CircleDot } from 'lucide-react';
import { useDb } from '../../lib/store';
import { formatDateTime, humanize } from '../../lib/format';
import { EmptyState } from './EmptyState';
import type { HistoryEvent, Persona } from '../../types/core';

function eventIcon(action: string) {
  if (action.includes('APPROVED')) return { Icon: CheckCircle, cls: 'text-green-600 bg-green-100' };
  if (action.includes('REJECTED')) return { Icon: XCircle, cls: 'text-red-600 bg-red-100' };
  if (action.includes('RETURNED')) return { Icon: RotateCcw, cls: 'text-orange-600 bg-orange-100' };
  if (action.includes('CREATED')) return { Icon: PlusCircle, cls: 'text-blue-600 bg-blue-100' };
  if (action.includes('UPDATED')) return { Icon: Pencil, cls: 'text-muted-foreground bg-muted' };
  return { Icon: CircleDot, cls: 'text-purple-600 bg-purple-100' };
}

const EVENT_LABELS: Record<string, string> = {
  ACTION_CREATED: 'Submitted for approval',
  ACTION_APPROVED: 'Approved',
  ACTION_REJECTED: 'Rejected',
  ACTION_RETURNED: 'Returned for rework',
  RECORD_CREATED: 'Created',
  RECORD_UPDATED: 'Updated',
};

/** Activity history timeline for one entity (or a module-wide feed). */
export function Timeline({ events }: { events: HistoryEvent[] }) {
  const db = useDb();
  const personas = db.personas as unknown as Persona[];

  if (events.length === 0) {
    return <EmptyState title="No activity yet" description="Workflow actions and record changes will appear here." />;
  }

  const actorName = (personaId: string) => {
    const p = personas.find((x) => x.id === personaId);
    const u = p && db.users.find((x) => x.id === p.userId);
    return u ? `${u.name} (${p!.label})` : 'System';
  };

  return (
    <ol className="relative space-y-0">
      {events.map((e, i) => {
        const { Icon, cls } = eventIcon(e.action);
        return (
          <li key={e.id} className="flex gap-3 pb-6 relative">
            {i < events.length - 1 && (
              <span className="absolute left-[15px] top-8 bottom-0 w-px bg-border" aria-hidden="true" />
            )}
            <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${cls}`}>
              <Icon className="w-4 h-4" />
            </span>
            <div className="min-w-0 pt-1">
              <p className="text-sm">
                <span className="font-medium">{EVENT_LABELS[e.action] ?? humanize(e.action)}</span>
                {e.fromStatus && e.toStatus && e.fromStatus !== e.toStatus && (
                  <span className="text-muted-foreground ml-2 inline-flex items-center gap-1 text-xs">
                    {humanize(e.fromStatus)} <ArrowRight className="w-3 h-3" /> {humanize(e.toStatus)}
                  </span>
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {actorName(e.actorId)} · {formatDateTime(e.at)}
              </p>
              {e.comment && <p className="text-sm text-muted-foreground mt-1 bg-muted/60 rounded p-2">{e.comment}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

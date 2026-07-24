'use client';

import { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { submitForApproval, applyTransition, pendingActionForEntity } from '../../lib/governance';
import { getDb } from '../../lib/store';
import { useSession } from '../../lib/session';
import { entityHref, type EntityConfig, type WorkflowActionDef } from '../../lib/registry';
import type { EntityBase } from '../../types/core';

/**
 * Renders the workflow verbs available on an entity in its current status for
 * the current persona. Governed verbs open a justification dialog and create a
 * pending action (maker-checker); direct verbs apply immediately with an
 * optional comment.
 */
export function WorkflowActionBar({
  cfg,
  entity,
  onError,
}: {
  cfg: EntityConfig;
  entity: EntityBase;
  onError: (msg: string) => void;
}) {
  const session = useSession();
  const [active, setActive] = useState<WorkflowActionDef | null>(null);
  const [justification, setJustification] = useState('');

  if (!session) return null;

  const pending = pendingActionForEntity(getDb(), cfg.collection, entity.id);
  const available = cfg.workflowActions.filter(
    (a) =>
      a.fromStatuses.includes(entity.status) &&
      session.has(`${cfg.module}_${a.permission}`) &&
      !pending,
  );

  if (available.length === 0) return null;

  const run = () => {
    if (!active) return;
    const label = String(entity[cfg.titleField] ?? entity.code ?? entity.id);
    let err: string | null = null;
    if (active.governed) {
      err = submitForApproval({
        module: cfg.module,
        collection: cfg.collection,
        entityId: entity.id,
        actionType: `${cfg.module}_${active.id}`,
        description: `${active.description}: ${label}`,
        justification: justification.trim(),
        pendingStatus: active.pendingStatus ?? 'PENDING_APPROVAL',
        targetStatus: active.targetStatus,
        rejectedStatus: active.rejectedStatus ?? active.fromStatuses[0],
        entityHref: entityHref(cfg, entity.id),
        payload: active.set,
      });
    } else {
      err = applyTransition({
        module: cfg.module,
        collection: cfg.collection,
        entityId: entity.id,
        action: `${cfg.module}_${active.id}`,
        toStatus: active.targetStatus,
        set: active.set,
        comment: justification.trim() || undefined,
      });
    }
    if (err) onError(err);
    setActive(null);
    setJustification('');
  };

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        {available.map((a) => (
          <Button
            key={a.id}
            variant={a.tone === 'destructive' ? 'destructive' : a.tone === 'outline' ? 'outline' : 'default'}
            size="sm"
            onClick={() => setActive(a)}
          >
            {a.governed && <Send />}
            {a.label}
          </Button>
        ))}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{active?.label}</DialogTitle>
            <DialogDescription>
              {active?.governed
                ? 'This action requires checker approval. It will be routed to the approval queue (maker-checker).'
                : 'This action takes effect immediately and is recorded in the activity history.'}
            </DialogDescription>
          </DialogHeader>
          {active?.governed && (
            <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800 dark:bg-yellow-100/10 dark:border-yellow-800">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>
                Once submitted, no further changes are allowed until a checker decides
                (single pending action per record).
              </span>
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="wf-justification">
              {active?.governed ? 'Justification *' : 'Comment (optional)'}
            </Label>
            <Textarea
              id="wf-justification"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              rows={3}
              placeholder={active?.governed ? 'Explain why this action is being requested…' : 'Add context for the activity history…'}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActive(null)}>Cancel</Button>
            <Button onClick={run} disabled={!!active?.governed && !justification.trim()}>
              {active?.governed ? 'Submit for approval' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

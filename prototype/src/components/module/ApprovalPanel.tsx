'use client';

import { useState } from 'react';
import { Clock, CheckCircle, XCircle, RotateCcw, ShieldAlert } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { decidePendingAction, type Decision } from '../../lib/governance';
import { useDb } from '../../lib/store';
import { useSession } from '../../lib/session';
import { formatDateTime, humanize } from '../../lib/format';
import type { PendingAction, Persona } from '../../types/core';

export function personaDisplay(db: ReturnType<typeof useDb>, personaId?: string): string {
  if (!personaId) return '—';
  const p = (db.personas as unknown as Persona[]).find((x) => x.id === personaId);
  const u = p && db.users.find((x) => x.id === p.userId);
  return u ? `${u.name} (${p!.label})` : personaId;
}

/**
 * Checker decision block shown wherever a pending action is surfaced — the
 * entity detail Approvals tab and the enterprise Approvals queue. Enforces
 * separation of duties (maker cannot decide own action) and the CHECKER role.
 */
export function ApprovalDecision({
  action,
  onError,
  compact,
}: {
  action: PendingAction;
  onError: (msg: string) => void;
  compact?: boolean;
}) {
  const db = useDb();
  const session = useSession();
  const [decision, setDecision] = useState<Decision | null>(null);
  const [comment, setComment] = useState('');

  if (!session) return null;

  const isMaker = action.createdBy === session.persona.id;
  const canDecide = session.has(`${action.module}_APPROVE`) && !isMaker;

  const confirm = () => {
    if (!decision) return;
    const err = decidePendingAction(action.id, decision, comment.trim());
    if (err) onError(err);
    setDecision(null);
    setComment('');
  };

  return (
    <div className={compact ? '' : 'border border-yellow-200 bg-yellow-50 dark:bg-yellow-100/10 dark:border-yellow-800 rounded-lg p-4'}>
      {!compact && (
        <div className="flex items-start gap-3 mb-3">
          <span className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-yellow-700" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium">{humanize(action.actionType)} — awaiting approval</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Submitted by {personaDisplay(db, action.createdBy)} · {formatDateTime(action.createdAt)}
            </p>
            {action.justification && (
              <p className="text-sm mt-2 bg-background/70 rounded p-2 border border-border">
                <span className="text-xs text-muted-foreground block mb-0.5">Maker justification</span>
                {action.justification}
              </p>
            )}
          </div>
        </div>
      )}

      {canDecide ? (
        <div className="flex items-center gap-2 flex-wrap">
          <Button size="sm" onClick={() => setDecision('approve')}>
            <CheckCircle /> Approve
          </Button>
          <Button size="sm" variant="destructive" onClick={() => setDecision('reject')}>
            <XCircle /> Reject
          </Button>
          <Button size="sm" variant="outline" onClick={() => setDecision('return')}>
            <RotateCcw /> Return for rework
          </Button>
        </div>
      ) : (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldAlert className="w-4 h-4" />
          {isMaker
            ? 'You submitted this action — separation of duties requires a different checker to decide it. Switch persona to demo the decision.'
            : `Deciding requires the ${action.module}_CHECKER role.`}
        </p>
      )}

      <Dialog open={!!decision} onOpenChange={(o) => !o && setDecision(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {decision === 'approve' ? 'Approve action' : decision === 'reject' ? 'Reject action' : 'Return for rework'}
            </DialogTitle>
            <DialogDescription>
              {action.description} — {action.entityCode || action.entityLabel}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="decision-comment">
              {decision === 'approve' ? 'Comment (optional)' : 'Reason *'}
            </Label>
            <Textarea
              id="decision-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder={decision === 'approve' ? 'Add an approval note…' : 'Explain what must change…'}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDecision(null)}>Cancel</Button>
            <Button
              variant={decision === 'reject' ? 'destructive' : 'default'}
              onClick={confirm}
              disabled={decision !== 'approve' && !comment.trim()}
            >
              Confirm {decision}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** Read-only card for a decided pending action (approval history). */
export function DecidedActionCard({ action }: { action: PendingAction }) {
  const db = useDb();
  const tone =
    action.status === 'approved'
      ? { Icon: CheckCircle, cls: 'text-green-600 bg-green-100' }
      : action.status === 'rejected'
        ? { Icon: XCircle, cls: 'text-red-600 bg-red-100' }
        : { Icon: RotateCcw, cls: 'text-orange-600 bg-orange-100' };
  const { Icon, cls } = tone;
  return (
    <div className="border border-border rounded-lg p-4 bg-card">
      <div className="flex items-start gap-3">
        <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${cls}`}>
          <Icon className="w-4 h-4" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium">
            {humanize(action.actionType)} — {humanize(action.status)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Maker: {personaDisplay(db, action.createdBy)} · {formatDateTime(action.createdAt)}
          </p>
          <p className="text-xs text-muted-foreground">
            Checker: {personaDisplay(db, action.decidedBy)} · {formatDateTime(action.decidedAt)}
          </p>
          {action.justification && (
            <p className="text-xs mt-1"><span className="text-muted-foreground">Justification:</span> {action.justification}</p>
          )}
          {action.decisionComment && (
            <p className="text-xs mt-0.5"><span className="text-muted-foreground">Decision comment:</span> {action.decisionComment}</p>
          )}
        </div>
      </div>
    </div>
  );
}

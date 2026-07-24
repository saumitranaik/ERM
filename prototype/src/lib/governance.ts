'use client';

/**
 * Mock governance ledger — simulates PRSMTD's maker-checker mechanism
 * (append-only pending_action ledger + projection, system.md §Governance):
 *  - one pending action per target (GOV-07 dedup)
 *  - submit → PENDING status on the entity + PendingAction row
 *  - approve/reject/return by a CHECKER → projection to entity status,
 *    history event, notification back to the maker.
 * Non-governed transitions (assign, acknowledge, close…) apply directly but
 * still write history + notifications.
 */
import type { Db, EntityBase, HistoryEvent, AppNotification, PendingAction } from '../types/core';
import { getDb, mutate } from './store';
import { newId, nowIso } from './id';
import { getSession } from './session';

export interface SubmitOptions {
  module: string;
  collection: string;
  entityId: string;
  actionType: string;          // SCREAMING_SNAKE_CASE, e.g. RISK_SUBMIT
  description: string;
  justification: string;
  pendingStatus: string;       // entity status while awaiting decision
  targetStatus: string;        // entity status when approved
  rejectedStatus: string;      // entity status when rejected/returned
  entityHref: string;
  payload?: Record<string, unknown>; // extra fields set on approval
}

function rows(db: Db, collection: string): EntityBase[] {
  return (db[collection] as EntityBase[]) ?? [];
}

function entityLabel(e: EntityBase): string {
  return (e.title as string) || (e.name as string) || e.id;
}

function pushHistory(db: Db, h: Omit<HistoryEvent, 'id' | 'at'>) {
  db.history.unshift({ ...h, id: newId(), at: nowIso() });
}

function pushNotification(db: Db, n: Omit<AppNotification, 'id' | 'at' | 'read'>) {
  db.notifications.unshift({ ...n, id: newId(), at: nowIso(), read: false });
}

export function pendingActionForEntity(db: Db, collection: string, entityId: string): PendingAction | undefined {
  return db.pendingActions.find(
    (a) => a.collection === collection && a.entityId === entityId && a.status === 'pending',
  );
}

/** Governed submission. Returns an error string if GOV-07 blocks it, else null. */
export function submitForApproval(opts: SubmitOptions): string | null {
  const session = getSession();
  if (!session) return 'No active session';
  const db = getDb();
  if (pendingActionForEntity(db, opts.collection, opts.entityId)) {
    return 'A pending action already exists for this record (GOV-07: single pending action per target).';
  }
  const entity = rows(db, opts.collection).find((e) => e.id === opts.entityId);
  if (!entity) return 'Record not found';
  const fromStatus = entity.status;

  mutate((d) => {
    const e = rows(d, opts.collection).find((x) => x.id === opts.entityId);
    if (!e) return;
    e.status = opts.pendingStatus;
    e.updatedAt = nowIso();
    d.pendingActions.unshift({
      id: newId(),
      module: opts.module,
      actionType: opts.actionType,
      collection: opts.collection,
      entityId: opts.entityId,
      entityCode: (e.code as string) ?? '',
      entityLabel: entityLabel(e),
      entityHref: opts.entityHref,
      description: opts.description,
      justification: opts.justification,
      payload: opts.payload,
      targetStatus: opts.targetStatus,
      rejectedStatus: opts.rejectedStatus,
      createdBy: session.persona.id,
      createdAt: nowIso(),
      status: 'pending',
    });
    pushHistory(d, {
      module: opts.module,
      collection: opts.collection,
      entityId: opts.entityId,
      action: 'ACTION_CREATED',
      fromStatus,
      toStatus: opts.pendingStatus,
      actorId: session.persona.id,
      comment: opts.justification,
    });
    pushNotification(d, {
      audience: 'checkers',
      module: opts.module,
      title: `Approval requested: ${opts.description}`,
      body: `${session.user.name} submitted "${entityLabel(e)}" for approval.`,
      href: '/protected/approvals',
      severity: 'info',
    });
  });
  return null;
}

export type Decision = 'approve' | 'reject' | 'return';

/** Checker decision on a pending action. Returns error string or null. */
export function decidePendingAction(actionId: string, decision: Decision, comment: string): string | null {
  const session = getSession();
  if (!session) return 'No active session';
  const db = getDb();
  const action = db.pendingActions.find((a) => a.id === actionId);
  if (!action || action.status !== 'pending') return 'Pending action not found or already decided';
  if (action.createdBy === session.persona.id) {
    return 'Separation of duties: the maker of an action cannot also decide it.';
  }
  if (!session.has(`${action.module}_APPROVE`)) {
    return `Your persona does not hold the ${action.module}_CHECKER role.`;
  }

  mutate((d) => {
    const a = d.pendingActions.find((x) => x.id === actionId);
    if (!a) return;
    a.status = decision === 'approve' ? 'approved' : decision === 'reject' ? 'rejected' : 'returned';
    a.decidedBy = session.persona.id;
    a.decidedAt = nowIso();
    a.decisionComment = comment;

    const e = rows(d, a.collection).find((x) => x.id === a.entityId);
    if (e) {
      const fromStatus = e.status;
      if (decision === 'approve') {
        e.status = a.targetStatus;
        if (a.payload) Object.assign(e, a.payload);
      } else {
        e.status = a.rejectedStatus;
      }
      e.updatedAt = nowIso();
      pushHistory(d, {
        module: a.module,
        collection: a.collection,
        entityId: a.entityId,
        action: decision === 'approve' ? 'ACTION_APPROVED' : decision === 'reject' ? 'ACTION_REJECTED' : 'ACTION_RETURNED',
        fromStatus,
        toStatus: e.status,
        actorId: session.persona.id,
        comment,
      });
    }
    pushNotification(d, {
      recipientPersonaId: a.createdBy,
      module: a.module,
      title:
        decision === 'approve'
          ? `Approved: ${a.description}`
          : decision === 'reject'
            ? `Rejected: ${a.description}`
            : `Returned for rework: ${a.description}`,
      body: `${session.user.name} ${decision === 'approve' ? 'approved' : decision === 'reject' ? 'rejected' : 'returned'} "${a.entityLabel}"${comment ? ` — ${comment}` : ''}.`,
      href: a.entityHref,
      severity: decision === 'approve' ? 'success' : decision === 'reject' ? 'error' : 'warning',
    });
  });
  return null;
}

/** Direct (non-governed) transition: assign/acknowledge/close/escalate/etc. */
export function applyTransition(opts: {
  module: string;
  collection: string;
  entityId: string;
  action: string;
  toStatus?: string;
  set?: Record<string, unknown>;
  comment?: string;
  notify?: { title: string; body: string; href: string; severity?: 'info' | 'success' | 'warning' | 'error'; audience?: 'all' | 'checkers'; recipientPersonaId?: string };
}): string | null {
  const session = getSession();
  if (!session) return 'No active session';
  mutate((d) => {
    const e = rows(d, opts.collection).find((x) => x.id === opts.entityId);
    if (!e) return;
    const fromStatus = e.status;
    if (opts.toStatus) e.status = opts.toStatus;
    if (opts.set) Object.assign(e, opts.set);
    e.updatedAt = nowIso();
    pushHistory(d, {
      module: opts.module,
      collection: opts.collection,
      entityId: opts.entityId,
      action: opts.action,
      fromStatus,
      toStatus: opts.toStatus ?? fromStatus,
      actorId: session.persona.id,
      comment: opts.comment,
    });
    if (opts.notify) {
      pushNotification(d, {
        module: opts.module,
        title: opts.notify.title,
        body: opts.notify.body,
        href: opts.notify.href,
        severity: opts.notify.severity ?? 'info',
        audience: opts.notify.audience,
        recipientPersonaId: opts.notify.recipientPersonaId,
      });
    }
  });
  return null;
}

/** Create a new record (DRAFT by convention) + history entry. */
export function createRecord(opts: {
  module: string;
  collection: string;
  record: EntityBase;
}): void {
  const session = getSession();
  mutate((d) => {
    const list = rows(d, opts.collection);
    list.unshift({
      ...opts.record,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      createdBy: session?.persona.id ?? 'unknown',
    });
    pushHistory(d, {
      module: opts.module,
      collection: opts.collection,
      entityId: opts.record.id,
      action: 'RECORD_CREATED',
      toStatus: opts.record.status,
      actorId: session?.persona.id ?? 'unknown',
    });
  });
}

/** Update editable fields on a record + history entry. */
export function updateRecord(opts: {
  module: string;
  collection: string;
  entityId: string;
  set: Record<string, unknown>;
}): void {
  const session = getSession();
  mutate((d) => {
    const e = rows(d, opts.collection).find((x) => x.id === opts.entityId);
    if (!e) return;
    Object.assign(e, opts.set);
    e.updatedAt = nowIso();
    pushHistory(d, {
      module: opts.module,
      collection: opts.collection,
      entityId: opts.entityId,
      action: 'RECORD_UPDATED',
      toStatus: e.status,
      actorId: session?.persona.id ?? 'unknown',
    });
  });
}

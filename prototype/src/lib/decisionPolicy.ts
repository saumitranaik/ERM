/**
 * Decision eligibility for a pending governed action — a pure function so the
 * UI (ApprovalDecision) and the ledger (decidePendingAction) share one rule set.
 *
 * Prototype-level control only: PRSMTD's `approved_by <> created_by` constraint
 * covers the maker rule; the risk-owner rule has no platform equivalent
 * (docs: prototype/docs/defects-and-observations.md, item A).
 */
export type DecisionKind = 'approve' | 'reject' | 'return';

/** Collections whose approve/reject is barred for the user named in the given entity field. */
export const OWNER_DECISION_RESTRICTIONS: Record<string, { ownerField: string; label: string }> = {
  risks: { ownerField: 'ownerId', label: 'risk' },
};

export interface DecisionContext {
  action: { module: string; collection: string; createdBy: string };
  entity?: Record<string, unknown>;
  personaId: string;
  userId: string;
  hasApprovePermission: boolean;
}

/** Returns a reason the decision is not allowed, or null if it is. */
export function decisionBlockReason(ctx: DecisionContext, decision: DecisionKind): string | null {
  if (ctx.action.createdBy === ctx.personaId) {
    return 'Separation of duties: the maker of an action cannot also decide it.';
  }
  if (!ctx.hasApprovePermission) {
    return `Your persona does not hold the ${ctx.action.module}_CHECKER role.`;
  }
  const rule = OWNER_DECISION_RESTRICTIONS[ctx.action.collection];
  if (rule && decision !== 'return' && ctx.entity?.[rule.ownerField] === ctx.userId) {
    return `Owner restriction: the owner of a ${rule.label} cannot approve or reject it. An independent checker must decide.`;
  }
  return null;
}

export interface DeciderCandidate {
  personaId: string;
  userId: string;
  hasApprovePermission: boolean;
}

/**
 * True if at least one candidate may approve or reject the action. Used only to *explain* a stalled
 * action; it never grants anything — `decisionBlockReason` remains the sole gate. An empty candidate
 * list yields false (no eligible decider can be shown to exist).
 */
export function hasEligibleDecider(
  action: DecisionContext['action'],
  entity: Record<string, unknown> | undefined,
  candidates: DeciderCandidate[],
): boolean {
  return candidates.some((c) =>
    (['approve', 'reject'] as const).some((d) => decisionBlockReason({ action, entity, ...c }, d) === null),
  );
}

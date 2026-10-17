# 0001 — Enforcement point for the risk-owner decision restriction

- **Status**: ACCEPTED for the ERM prototype scope only. Platform-wide enforcement is deferred to a future, separately authorised platform change.
- **Date**: 2026-10-17 (proposed); accepted for prototype scope 2026-10-17
- **Decides on**: [Enterprise Risk Management](../10-risk/01-enterprise-risk-management.md) (Assumption 6, FR-05, FR-17, Security Considerations)
- **Evidence**: [prototype defects and observations](../../prototype/docs/defects-and-observations.md), item A

## Context

Two distinct segregation-of-duties rules exist and must not be conflated:

| Rule | Compares | Status |
|---|---|---|
| **Submitter ≠ approver** | the user who submitted (`created_by`) with the user who decides (`approved_by`) on a governed action | **Existing PRSMTD capability** — `approved_by <> created_by` on `pending_action` (`PRSMTD/docs/authoritative/system.md §3`). |
| **Risk owner ≠ decision-maker** | `Risk.risk_owner_user_id` with the user who approves/rejects a governed action on that Risk | **Not provided by PRSMTD.** The platform constraint never reads `risk_owner_user_id`. |

A maker can submit a risk owned by the Chief Risk Officer, and the CRO — a different person from the submitter — can then approve it. The platform constraint is satisfied; the owner restriction is not. The ERM target requirement is that an owner must not approve or reject their own risk.

## Options considered

1. **Platform-wide decide-time guard (future PRSMTD capability).** The governance ledger accepts a module-supplied "subject user" on a pending action and rejects a decision by that user. Reusable by every module. Requires a PRSMTD change and architectural assessment.
2. **ERM module-level control.** The RISK module evaluates the rule at decision time. Faster, but repeated per module and bypassable by any path that does not go through the module.

## Decision

Enforce the risk-owner-versus-decision-maker restriction through an **ERM module-level control within the prototype** (`prototype/src/lib/decisionPolicy.ts`). No platform-wide guard is introduced or modified by this decision.

The prototype rule:

> The owner of a Risk record must not approve or reject that same Risk record. The decision must be made by an eligible independent checker who satisfies the applicable checker and maker-checker requirements.

The control **fails closed**: if no eligible independent checker is available, the decision remains blocked. Maker-checker and `RISK_CHECKER` requirements are unchanged.

## Rationale

- ERM is currently a prototype, not a production-certified platform module.
- The requirement can be demonstrated and tested within the ERM prototype without changing PRSMTD.
- Platform-wide enforcement requires a separate platform modification and architectural assessment.
- Implementing a platform-wide guard now would exceed the authorised scope and risk conflating a prototype control with an existing platform capability.
- A future platform change may introduce a shared enforcement mechanism, reconcile conflicting platform constraints, and determine whether the ERM module-level control is replaced, retained as defence in depth, or adapted.

## Boundaries

1. This decision applies only to the ERM prototype.
2. It does not assert that PRSMTD currently enforces risk-owner independence.
3. The existing `approved_by <> created_by` constraint concerns submitter-versus-approver separation and does not enforce risk-owner-versus-decision-maker separation.
4. No PRSMTD code, database schema, constraints, migrations, governance artefacts or platform-wide enforcement mechanisms are changed by this decision.
5. The prototype's client-side/localStorage architecture is not a trusted production security boundary.
6. Production enforcement remains subject to a future platform change, architectural review and security validation.
7. The prototype restriction applies to Approve/Reject on the Risk record. Return, child records and `ESCALATION_ACK` remain outside this decision unless separately authorised.

## Future platform-change trigger (future action, not a current task)

When the platform is next modified to support the production ERM module, reassess:

- Whether a shared platform-wide guard should enforce risk-owner independence.
- How the rule interacts with the existing submitter-versus-approver constraint.
- How the platform obtains and validates `risk_owner_user_id`.
- How independent-checker eligibility is enforced at a trusted boundary.
- Whether the ERM module-level check should remain as defence in depth.
- How enforcement is audited and tested across modules.

If a platform guard is then chosen, record it as a new PRSMTD capability requirement in `22-traceability` and adopt it into PRSMTD's ADR Traceability Matrix (`system.md §20`).

## Remaining AMC decisions (not reopening the architecture question)

- **Scope of actions** — whether the owner restriction also applies to Return, child records and `ESCALATION_ACK` (see the per-action scope in the ERM spec, Security Considerations).
- **Checker availability** — when the only `RISK_CHECKER` is the risk owner there is no eligible decider and the prototype stays blocked. The AMC decides whether to designate an alternate independent checker (FR-17 allows a Compliance Officer, Risk Management Committee member or external agency user) or formally approve a rule preventing the sole eligible checker from being assigned as owner.

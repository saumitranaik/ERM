# 0001 — Enforcement point for the risk-owner decision restriction

- **Status**: PROPOSED — no decision made. Decision authority: ERM/PRSMTD architecture governance (no more specific authority is established in this repository).
- **Date**: 2026-10-17
- **Decides on**: [Enterprise Risk Management](../10-risk/01-enterprise-risk-management.md) (Assumption 6, FR-05, FR-17, Security Considerations)
- **Evidence**: [prototype defects and observations](../../prototype/docs/defects-and-observations.md), item A

## Context

Two distinct segregation-of-duties rules exist and must not be conflated:

| Rule | Compares | Status |
|---|---|---|
| **Submitter ≠ approver** | the user who submitted (`created_by`) with the user who decides (`approved_by`) on a governed action | **Existing PRSMTD capability** — `approved_by <> created_by` on `pending_action` (`PRSMTD/docs/authoritative/system.md §3`). |
| **Risk owner ≠ decision-maker** | `Risk.risk_owner_user_id` with the user who approves/rejects a governed action on that Risk | **Not provided by PRSMTD.** The platform constraint never reads `risk_owner_user_id`. |

A maker can submit a risk owned by the Chief Risk Officer, and the CRO — a different person from the submitter — can then approve it. The platform constraint is satisfied; the owner restriction is not. The ERM target requirement is that an owner must not approve or reject their own risk.

## Options

1. **Platform-wide decide-time guard (proposed PRSMTD capability).** The governance ledger accepts a module-supplied "subject user" on a pending action and rejects a decision by that user. Reusable by every module (policy owner, control owner, CAPA owner…). Requires a PRSMTD change, which is outside this repository's remit.
2. **ERM module-level check (justified exception).** The RISK module evaluates the rule at decision time. Faster, but contradicts the "no bespoke SoD logic" principle, would be repeated per module, and is bypassable by any path that does not go through the module.

## Decision

**None yet.** Until it is made, option 1 is a *proposal*, not an existing capability, and the risk-owner restriction is a *target requirement* not enforced by PRSMTD. The prototype implements the rule as a prototype-level control only (`prototype/src/lib/decisionPolicy.ts`).

## Open sub-decisions (same decision-maker, with the AMC where noted)

- **Scope of actions** — see the per-action scope in the ERM spec (Security Considerations, Segregation of duties). Only approve/reject on the Risk record itself is covered; Return, child records and `ESCALATION_ACK` are *awaiting an explicit AMC decision*.
- **Checker availability** — when the only `RISK_CHECKER` is the risk owner there is no eligible decider. Recommendation (AMC decision): designate an alternate independent checker (FR-17 allows a Compliance Officer, Risk Management Committee member or external agency user) **or** formally approve a rule preventing the sole eligible checker from being assigned as owner. The system fails closed (no decision possible) in the meantime.

## Consequences

- Until decided, the spec must not claim the platform enforces the owner rule.
- If option 1 is chosen, it is recorded as a new PRSMTD capability requirement in `22-traceability` and adopted into PRSMTD's ADR Traceability Matrix (`system.md §20`).
- If option 2 is chosen, the exception to the "no bespoke SoD logic" statement is justified here and the Security Considerations are updated accordingly.

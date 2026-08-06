# Defects, Inconsistencies & Specification Gaps Observed — Demonstration Deck 01

Recorded during live execution of L1-01 (Risk Assessment Approval) against the running
`prototype/` UX reference application, 2026-07-25. Per scope, **nothing below was fixed** —
this is an observation log only.

## Prototype defects

**None encountered.** The workflow executed cleanly end to end on the first run, with no
errors, dead links, broken state transitions, or console/application failures:

- RSK-2026-0004's status transitioned exactly as specified: `ACTIVE → UNDER_REVIEW` on
  submission, `UNDER_REVIEW → ACTIVE` on approval.
- GOV-07 (single pending action per record) was enforced — all workflow-action buttons
  correctly disappeared while the reassessment was pending.
- Separation of duties was enforced structurally, not just cosmetically — the maker's own
  submission was correctly excluded from the maker's own checker queue and could only be
  decided from a different persona.
- The maker-checker decision trail (justification, decision comment, both actors, both
  timestamps) rendered correctly and completely on the Approvals tab after the decision.

## Inconsistencies

**None encountered** between the running prototype's behavior and either (a) the RISK module
specification (`docs/10-risk/01-enterprise-risk-management.md`) or (b) the documented journey
(`prototype/docs/user-journeys.md` §1). The `REASSESSMENT` workflow action's `fromStatuses`,
`pendingStatus`, and `targetStatus` (`prototype/src/modules/risk.ts`) match the spec's governed
re-assessment lifecycle exactly.

## Specification gaps

**None discovered specific to this workflow.** L1-01 exercises only the `RISK` module's own
governed re-assessment action — it does not touch any of the cross-module gaps the catalogue
already names in its own §12 (e.g., evidence object storage, Records Retention Schedule),
none of which this workflow's screens surface.

## Observations (not defects — recorded for future deck-building sessions)

1. **The checker queue is not empty at the start of a fresh session.** Priya Raghunathan's
   Checker Queue already contained 6 other pending items (across `RISK`, and presumably other
   modules she checks) from the prototype's own seed data before this walkthrough added a
   7th. This is intentional seed richness (Session 18), not a defect — but a facilitator
   wanting a visually "empty queue → one new item" moment for a live audience should either
   filter/scroll to the top item (where new submissions correctly appear via `unshift`,
   confirmed in this run) or narrate around the pre-seeded items rather than expect a clean
   queue.
2. **Module-code routing is case-insensitive.** `/modules/RISK/risks/r-004` and
   `/modules/risk/risks/r-004` both resolve to the same record (`getEntityConfig` uppercases
   the route segment before matching). Not a defect — worth knowing if a future deck script
   hard-codes lowercase routes and gets unexpected-looking-but-correct results.
3. **No temporary demo data was needed.** RSK-2026-0004 was already `ACTIVE` in the seed
   dataset, so this walkthrough required no data seeding, fixture edits, or `Reset demo data`
   action before or after capture. The prototype directory has zero uncommitted changes as a
   result of this deck's production (`git status --short prototype/` is empty).

## Traceability

- **Workflow executed**: L1-01, `docs/19-roadmap/01-demonstration-workflow-catalogue.md` §4.1
- **Journey followed**: `prototype/docs/user-journeys.md` §1
- **Specification exercised**: `docs/10-risk/01-enterprise-risk-management.md` (governed
  `REASSESSMENT` action)
- **Prototype build exercised**: `prototype/` as of 2026-07-25, unmodified

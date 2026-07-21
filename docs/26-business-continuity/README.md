# 26 — Business Continuity Management

## Purpose

The `BUSINESS CONTINUITY` bounded context (anticipated code `BCP`) — the *plan* side of the
SEBI DR/BCP mandate first flagged by `10-risk` (Session 1) and reserved in
[`../04-domain-model/01-enterprise-domain-model.md`](../04-domain-model/01-enterprise-domain-model.md#business-continuity-reserved)
since Session 3. This is explicitly **not** duplicate work against `12-controls`' existing
BCP/DR control family: `12-controls` tests a plan, `26-business-continuity` defines one — the
Compliance Coverage Assessment's Gap Assessment table already draws this exact distinction, and
this section's eventual spec must state the boundary explicitly in its own Integration with
Controls section.

## What belongs here

- Business Impact Analysis (BIA) aggregate
- Continuity/DR plan governed lifecycle (draft → approved → tested → active)
- RTO/RPO target definitions per critical business process
- DR test scheduling and results, cross-referencing (not duplicating) `12-controls`'
  `ControlTest` for actual test execution — this module owns the plan and target, `CONTROLS`
  owns the test
- Full security/authorization/audit/reporting/API surface, per the Documentation Standards
  checklist in [`../../CLAUDE.md`](../../CLAUDE.md)

## Cross-references

- [`../04-domain-model/`](../04-domain-model/) — the reserved context and its Customer-Supplier
  relationship to `RISK`
- [`../10-risk/`](../10-risk/) — the original DR/BCP flag this module resolves
- [`../12-controls/`](../12-controls/) — the plan-vs-test boundary this module's own spec must
  state explicitly
- [`../05-modules/`](../05-modules/) — index entry pointing back here
- [`../roadmap.md`](../roadmap.md#phase-9--business-continuity-management-module) — Master
  Execution Plan Phase 9, which authors this section's spec

## Status

**Authored** — [`01-business-continuity-management.md`](01-business-continuity-management.md)
(module code `BCP`), Session 13. Activates the `BUSINESS CONTINUITY` bounded context
reserved above; the plan-vs-`12-controls`-test boundary is stated explicitly in that
document's own Integration with Controls Management section, per Assumption 6. Six additive
changes remain proposed, not applied, across `10-risk`, `12-controls`, `11-compliance`,
`23-policy`, `13-audit`, and `24-incident-issue-capa`, plus a `04-domain-model`
status-label amendment — see that document's own Dependencies and Future Extension Points
sections.

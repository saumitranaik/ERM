# 24 — Incident / Issue / CAPA Management

## Purpose

The most cross-referenced bounded context this repository had left reserved — named as a
forward reference by five of the six previously frozen specs (`10-risk`, `12-controls`,
`11-compliance`, `13-audit`, `09-security`) and the seventh (`23-policy`). Authored as one
combined context in
[`../04-domain-model/01-enterprise-domain-model.md`](../04-domain-model/01-enterprise-domain-model.md#incident--issue--capa-reserved)
(Incident intake, Issue tracking, and CAPA remediation, kept together because "one Incident
may spawn one or more Issues; an Issue is remediated by one or more CAPAs").

Module code **`INCIDENT`** — resolved by
[`01-incident-issue-capa-management.md`](01-incident-issue-capa-management.md) Assumption 1,
closing `04-domain-model`'s own open naming question.

## What belongs here

- Incident intake, classification, and investigation lifecycle
- Root Cause Analysis (RCA)
- Issue tracking — explicitly a **complement** to, not a replacement of, the Finding/Exception
  entities `12-controls`, `11-compliance`, `13-audit`, `09-security`, and `23-policy` each
  already carry independently; see
  [`01-incident-issue-capa-management.md`](01-incident-issue-capa-management.md) Assumption 2
  for the full reasoning
- CAPA (Corrective and Preventive Action) governed lifecycle — action plans, action tracking,
  closure verification, effectiveness review
- Escalation management
- Full security/authorization/audit/reporting/API surface, per the Documentation Standards
  checklist in [`../../CLAUDE.md`](../../CLAUDE.md)

## Cross-references

- [`../04-domain-model/`](../04-domain-model/) — the reserved context and its Customer-Supplier
  relationship, generalized to every core-domain context
- [`../10-risk/`](../10-risk/), [`../12-controls/`](../12-controls/),
  [`../11-compliance/`](../11-compliance/), [`../13-audit/`](../13-audit/),
  [`../09-security/`](../09-security/), [`../23-policy/`](../23-policy/) — every frozen spec's
  own Finding/Exception entity this module complements; `13-audit` and `09-security` already
  reserve a `capa_ref_id` column, `12-controls`/`11-compliance`/`23-policy` gain one via a
  proposed, not-yet-applied additive change
- [`../05-modules/`](../05-modules/) — index entry pointing back here
- [`../roadmap.md`](../roadmap.md#phase-7--incident--issue--capa-module) — Master Execution
  Plan Phase 7

## Status

**Complete — Session 11.** [`01-incident-issue-capa-management.md`](01-incident-issue-capa-management.md)
is authored: the `Incident`/`RootCauseAnalysis`/`Issue`/`IssueSourceLink`/`CAPA`/
`CAPAActionItem`/`CAPAClosureVerification`/`CAPAEffectivenessReview`/`Escalation`/
`IncidentEvidence` domain and data model, the governed lifecycles for each, and the full
security/authorization/audit/reporting/API surface. `13-audit` and `09-security` needed **no**
schema change (both already reserve `capa_ref_id`) — only a proposed, not-yet-applied
initiating endpoint each. `12-controls`, `11-compliance`, and `23-policy` each gain a
**proposed, not yet applied**, additive `capa_ref_id` column plus initiating endpoint. See
[`01-incident-issue-capa-management.md`](01-incident-issue-capa-management.md)'s own
Traceability block and [`../roadmap.md`](../roadmap.md#phase-7--incident--issue--capa-module)
for the full record.

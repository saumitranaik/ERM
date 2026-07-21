# 24 — Incident / Issue / CAPA Management

## Purpose

The most cross-referenced still-reserved bounded context in the repository — named as a
forward reference by five of the six frozen specs (`10-risk`, `12-controls`, `11-compliance`,
`13-audit`, `09-security`). Reserved as one combined context in
[`../04-domain-model/01-enterprise-domain-model.md`](../04-domain-model/01-enterprise-domain-model.md#incident--issue--capa-reserved)
(Incident intake, Issue tracking, and CAPA remediation, kept together because "one Incident
may spawn one or more Issues; an Issue is remediated by one or more CAPAs" — splitting them
into three separate bounded contexts would fragment one governed remediation chain).

The exact `module.code` (`INCIDENT`? `ISSUE`? a combined code?) is an open naming question
`04-domain-model`'s own Future Enhancements section left unresolved — to be decided when this
section's spec is authored, not pre-decided here.

## What belongs here

- Incident intake and classification
- Issue tracking — and an explicit statement of whether this generalizes (replaces) or
  complements the Finding/Exception entities `12-controls`, `11-compliance`, `13-audit`, and
  `09-security` each already carry independently; this is the single highest-risk design
  decision for this section's spec, per the Master Execution Plan's own Phase 7 entry
- CAPA (Corrective and Preventive Action) governed lifecycle
- Full security/authorization/audit/reporting/API surface, per the Documentation Standards
  checklist in [`../../CLAUDE.md`](../../CLAUDE.md)

## Cross-references

- [`../04-domain-model/`](../04-domain-model/) — the reserved context, its Customer-Supplier
  relationship to `RISK`/`CONTROLS`, and the still-open module-code naming question
- [`../10-risk/`](../10-risk/), [`../12-controls/`](../12-controls/),
  [`../11-compliance/`](../11-compliance/), [`../13-audit/`](../13-audit/),
  [`../09-security/`](../09-security/) — every frozen spec's own Finding/Exception entity this
  module must explicitly complement or replace
- [`../05-modules/`](../05-modules/) — index entry pointing back here
- [`../roadmap.md`](../roadmap.md#phase-7--incident--issue--capa-module) — Master Execution
  Plan Phase 7, which authors this section's spec

## Status

Not yet authored.

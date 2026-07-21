# 25 — Third-Party Risk Management

## Purpose

The `THIRD-PARTY RISK` bounded context (anticipated code `TPR`) — vendor/counterparty risk as
a specialized source feeding the enterprise risk register. Reserved in
[`../04-domain-model/01-enterprise-domain-model.md`](../04-domain-model/01-enterprise-domain-model.md#third-party-risk-reserved)
since Session 3. Unlike `POLICY` and `INCIDENT`/`ISSUE`/`CAPA`, no frozen spec's own body
currently blocks on this context — its integration risk is lower, but its regulatory-citation
work is genuinely new (no frozen spec has yet mined the SEBI Master Circular Annexures for an
outsourcing/vendor-risk section).

## What belongs here

- Vendor/third-party inventory and risk classification (mirroring the
  regulatory-profile-seeded taxonomy shape)
- Due-diligence and onboarding assessment governed lifecycle
- Ongoing monitoring and periodic reassessment
- Third-party risk's contribution to the enterprise risk register (a `Risk.source =
  THIRD_PARTY` value, proposed as an additive change to `10-risk` when this spec is authored,
  not applied here)
- Full security/authorization/audit/reporting/API surface, per the Documentation Standards
  checklist in [`../../CLAUDE.md`](../../CLAUDE.md)

## Cross-references

- [`../04-domain-model/`](../04-domain-model/) — the reserved context and its Customer-Supplier
  relationship to `RISK`
- [`../10-risk/`](../10-risk/), [`../12-controls/`](../12-controls/) — the frozen specs this
  module extends additively (`Risk.source`, and a `Control.source` value if third-party
  controls need their own source tag)
- [`../05-modules/`](../05-modules/) — index entry pointing back here
- [`../roadmap.md`](../roadmap.md#phase-8--third-party-risk-management-module) — Master
  Execution Plan Phase 8, which authors this section's spec

## Status

**Authored — Session 12.** See
[`01-third-party-risk-management.md`](01-third-party-risk-management.md) (module code `TPR`)
— vendor/third-party lifecycle management (onboarding through offboarding), vendor
classification and criticality, due diligence, inherent/residual vendor-risk assessment,
security and compliance assessment of vendors, contract and SLA tracking, ongoing monitoring,
and periodic reassessment. Activates the `THIRD-PARTY RISK` bounded context
`04-domain-model` reserved and resolves that document's own open `VendorCategory`/
`RiskCategory` question. Proposes, but does not apply, additive changes to `10-risk`,
`12-controls`, `11-compliance`, `09-security`, `13-audit`, `24-incident-issue-capa`, and
`04-domain-model`'s own status label — see that spec's own Traceability block and
[`../roadmap.md`](../roadmap.md) for the current session's log entry.

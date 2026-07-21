# 23 — Policy Management

## Purpose

The `POLICY` bounded context — the authoritative source for governance policy documents that
a `CONTROLS` control's design, a `COMPLIANCE` obligation's satisfaction, or a `SECURITY`
policy domain's governance may cite as their basis. Reserved in
[`../04-domain-model/01-enterprise-domain-model.md`](../04-domain-model/01-enterprise-domain-model.md#policy-reserved)
since Session 3; named as an Open Host Service dependency by `12-controls`, `11-compliance`'s
"Integration with Future Policy Management," and `09-security`'s `SecurityPolicyDomain`
taxonomy.

## What belongs here

- Policy taxonomy (mirroring the regulatory-profile-seeded taxonomy shape `10-risk`'s
  `RiskCategory` and `12-controls`' `ControlFamily` already establish)
- The `Policy` aggregate's governed lifecycle (draft → review → approve → publish → periodic
  re-attestation → retire, via PRSMTD's `pending_action` ledger)
- Policy-to-control and policy-to-security-policy-domain mapping — activating the forward
  references `12-controls` and `09-security` each already carry
- Full security/authorization/audit/reporting/API surface, per the Documentation Standards
  checklist in [`../../CLAUDE.md`](../../CLAUDE.md)

## Cross-references

- [`../04-domain-model/`](../04-domain-model/) — the `POLICY` bounded context reservation and
  its Customer-Supplier/Open Host Service relationships to `CONTROLS`, `COMPLIANCE`, `SECURITY`
- [`../12-controls/`](../12-controls/), [`../11-compliance/`](../11-compliance/),
  [`../09-security/`](../09-security/) — the frozen specs whose own forward references this
  module activates
- [`../05-modules/`](../05-modules/) — index entry pointing back here
- [`../roadmap.md`](../roadmap.md#phase-6--policy-management-module-policy) — Master Execution
  Plan Phase 6, which authors this section's spec

## Status

Not yet authored.

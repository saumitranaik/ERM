# 11 — Compliance

## Purpose

Compliance Management and Regulatory Management capability specifications: tracking
applicable regulations, obligations, and compliance status.

## What belongs here

- Regulatory obligation register (SEBI Master Circular annexures as the first source —
  see [`../reference/`](../reference/))
- Regulatory change management workflow (new circular → obligation mapping → impact
  assessment → control/policy update)
- Compliance calendar and filing obligations
- Regulator-facing reporting requirements (feeds [`../14-reporting/`](../14-reporting/))

## Cross-references

- [`../12-controls/`](../12-controls/) — controls that satisfy compliance obligations
- [`../22-traceability/`](../22-traceability/) — regulatory requirement ↔ spec matrix
- [`../reference/`](../reference/) — SEBI source circulars

## Status

Authored — [`01-compliance-management.md`](01-compliance-management.md) (2026-07-20) covers
regulatory framework management, the regulatory obligation register (treated as one concept
with "compliance requirement" — see that spec's Assumption 4), regulatory profile
configuration, compliance assessment, regulatory mapping (obligation ↔ control, ↔ risk, ↔
future policy), regulatory change management, the compliance calendar, compliance
exceptions, compliance attestations, compliance status, and reporting. Confirms
`04-domain-model`'s Assumption 4 (Compliance Management and Regulatory Management are one
bounded context, `COMPLIANCE`, not two). Activates `10-risk`'s reserved `Risk.source`
enum slot and `12-controls`' reserved `module_controls_control_obligation_link` — neither
`10-risk/01-*.md` nor `12-controls/01-*.md` was modified.

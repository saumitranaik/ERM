# 22 — Traceability

## Purpose

Aggregates the Traceability block that every substantive spec in this repository carries
(per [`../../CLAUDE.md`](../../CLAUDE.md#traceability-rules)) into cross-cutting matrices, so
coverage and gaps are visible at a glance without reading every document.

## What belongs here

- **Business ↔ Regulatory matrix**: business requirements mapped to their regulatory driver
  (SEBI circular/section) or marked as non-regulatory
- **Capability ↔ PRSMTD matrix**: each ERM capability mapped to the PRSMTD mechanism it
  reuses, or flagged as a new PRSMTD capability requirement
- **Requirement ↔ Spec matrix**: which document(s) satisfy which requirement, and which
  requirements have no spec yet (the gap register)
- Matrices should be regenerated/updated whenever a new Traceability block is added
  elsewhere in the repository — this section must never fall out of sync with the specs it
  aggregates

## Cross-references

- Every section 01–19 — source of the traceability blocks aggregated here
- [`../20-adr/`](../20-adr/) — decisions that constrain traceability entries

## Status

- [`01-master-traceability-matrix.md`](01-master-traceability-matrix.md) — authored, seeded
  from the first spec ([`../10-risk/01-enterprise-risk-management.md`](../10-risk/01-enterprise-risk-management.md)).
  Update it whenever a new Traceability block is added elsewhere in the repository.
- [`02-compliance-coverage-assessment.md`](02-compliance-coverage-assessment.md) — authored
  (Session 5, 2026-07-20). A derived, regulation/framework-facing view over the master
  matrix plus PRSMTD's current capabilities: what PRSMTD implements today, what the current
  ERM specifications would additionally enable if implemented, and what remains unspecified,
  across the SEBI Mutual Fund regulatory profile and international standards (ISO
  27001/27701/22301/31000, COBIT, NIST CSF). Explicitly does not certify legal/regulatory
  compliance. Evolve this document in place when new specs are authored or PRSMTD capability
  changes — never recreate it from scratch.

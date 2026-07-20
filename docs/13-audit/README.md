# 13 — Audit

## Purpose

Internal/External Audit Management capability specifications: audit universe, planning,
fieldwork, findings, and evidence — built on PRSMTD's immutable audit trail as the evidentiary
substrate.

## What belongs here

- Audit universe and risk-based audit planning
- Audit engagement lifecycle (Planning → Fieldwork → Findings → Reporting → Follow-up)
- Working papers and evidence model, linkage to PRSMTD's Observability & Deterministic Trace
  Contract (§4.1) for system-of-record evidence
- Finding → Issue/CAPA linkage

## Cross-references

- [`../12-controls/`](../12-controls/) — control testing evidence audit relies on
- [`../07-workflows/`](../07-workflows/) — audit engagement workflow
- `PRSMTD/docs/authoritative/system.md §10, §4.1` — audit/compliance, trace contract

## Status

Authored — see
[`01-audit-management.md`](01-audit-management.md) (module code `AUDIT`). Activates the
`AUDIT` bounded context reserved by `04-domain-model`, the already-live
`Risk.source = AUDIT_FINDING` / `Control.source = AUDIT_FINDING` values, and all three
integration points `11-compliance` reserved in its own "Integration with Future Audit"
section. `10-risk/01-*.md`, `12-controls/01-*.md`, and `11-compliance/01-*.md` were not
modified.

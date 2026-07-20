# 07 — Workflows

## Purpose

Defines the governed processes that move ERM entities through their lifecycle — state
machines built on PRSMTD's maker-checker governance ledger rather than bespoke workflow
engines.

## What belongs here

- State machine per governed entity (e.g., Risk Assessment: Draft → Submitted → Reviewed →
  Accepted/Escalated; CAPA: Identified → Assigned → In Progress → Verified → Closed)
- Sequence diagrams (Mermaid) showing maker/checker interaction against PRSMTD's
  `pending_action` ledger and GOV-07 dedup rule
- Escalation and SLA rules (e.g., overdue control test escalates to Compliance Officer)
- Notification/observability hooks into PRSMTD's trace contract

## Cross-references

- [`../05-modules/`](../05-modules/) — the module each workflow belongs to
- [`../09-security/`](../09-security/) — roles authorized at each transition
- `PRSMTD/docs/authoritative/system.md §3` — governance model, GOV-07

## Status

Not yet authored.

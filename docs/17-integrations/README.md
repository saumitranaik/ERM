# 17 — Integrations

## Purpose

Specifications for how the platform connects to systems outside its own boundary: regulator
portals, market/fund data providers, email/notification systems, and enterprise systems
(HRMS, ITSM, etc.) an AMC already runs.

## What belongs here

- Per-integration spec: direction (inbound/outbound), protocol, data contract, auth model,
  failure/retry handling
- Regulator portal submission integrations (e.g., SEBI filing systems) — read
  [`../reference/`](../reference/) and [`../14-reporting/`](../14-reporting/) first
- Internal AMC system integrations (fund accounting, portfolio management, HRMS) relevant to
  risk/compliance data sourcing

## Cross-references

- [`../08-api/`](../08-api/) — this platform's own API surface exposed to integrations
- [`../14-reporting/`](../14-reporting/) — regulator submission content
- `PRSMTD/docs/authoritative/system.md §5` — execution context/request binding for inbound integration auth

## Status

Not yet authored.

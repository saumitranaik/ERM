# 05 — Modules

## Purpose

One specification per platform capability, each implementation-ready as a PRSMTD module
(`modules/{code}/module.yaml`) — roles, permissions, governance flows, lifecycle, and its
relationship to other modules.

## What belongs here

- One document per module (Risk, Controls, Audit, Policy, Incident, Issue/CAPA, Third-Party
  Risk, BCP/DR, Regulatory, Cybersecurity Governance, Privacy, etc.), each following the
  Documentation Standards checklist in [`../../CLAUDE.md`](../../CLAUDE.md)
- Module manifest content: `moduleId` intent, `code`, roles (MAKER/CHECKER/VIEWER plus any
  domain-specific roles), permissions, roleMappings
- Governed lifecycle: which state transitions require maker-checker approval via PRSMTD's
  `pending_action` ledger
- Inter-module dependencies (e.g., Controls module depends on Risk module's risk register)

## Cross-references

- [`../04-domain-model/`](../04-domain-model/) — the bounded context each module implements
- [`../07-workflows/`](../07-workflows/) — governed workflows within the module
- [`../08-api/`](../08-api/) — the module's API surface
- `PRSMTD/modules/README.md` — canonical module structure this must conform to

## Status

Not yet authored.

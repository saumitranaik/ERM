# 05 — Modules

## Purpose

The **module index/registry** — one entry per PRSMTD module (`modules/{code}/module.yaml`)
this repository's specifications map to. This section is an index, not a content home: it
never owns a module's domain model, data model, workflows, security model, or API contract.
Each module's actual specification lives in its own dedicated top-level section (`09-security`,
`10-risk`, `11-compliance`, `12-controls`, `13-audit`, `23-policy`, `24-incident-issue-capa`,
`25-third-party-risk`, `26-business-continuity`, and future business-domain sections) —
established precedent since Session 1 and made an explicit rule in
[`../../CLAUDE.md`](../../CLAUDE.md#repository-organization) (Session 9).

## What belongs here

- One index row per module: `code`, name, manifest summary (`moduleId` intent, roles
  MAKER/CHECKER/VIEWER plus any domain-specific roles, permissions, roleMappings), dependency
  list, and a pointer to the owning domain section's authoritative spec
- The whole-repository module list — authored and reserved contexts alike — so a reader sees
  every module without visiting each domain section individually
- **Does not belong here**: entity/aggregate definitions, data model tables, workflow state
  machines, or API endpoint contracts — those are owned exclusively by each module's own
  domain section and must only be cross-referenced from here, never restated

## Cross-references

- [`../04-domain-model/`](../04-domain-model/) — the bounded context each module implements
- [`../09-security/`](../09-security/), [`../10-risk/`](../10-risk/),
  [`../11-compliance/`](../11-compliance/), [`../12-controls/`](../12-controls/),
  [`../13-audit/`](../13-audit/), and (once authored) `../23-policy/` through
  `../26-business-continuity/` — the authoritative spec each index row points to
- [`../07-workflows/`](../07-workflows/) — governed workflows within each module
- [`../08-api/`](../08-api/) — each module's API surface
- `PRSMTD/modules/README.md` — canonical module structure this index must conform to

## Status

Not yet authored — see the Master Execution Plan's Phase 21
([`../roadmap.md`](../roadmap.md#phase-21--cross-module-rest-api-catalog-event-contracts--integration-contracts-08-api-05-modules)),
which authors `05-modules/01-module-index.md`.

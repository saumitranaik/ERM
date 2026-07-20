# 06 — Data Model

## Purpose

Entity/relationship models precise enough to become Liquibase changesets in PRSMTD without
further design work.

## What belongs here

- ER diagrams (Mermaid) per module/bounded context
- Table specs: columns, types, constraints, RLS tenant-scoping column, indexes
- Reference data / lookup tables (risk categories, control frameworks, regulatory taxonomies)
- Explicit note on Liquibase changeset placement — new changesets only, never modifying
  PRSMTD's immutable canonical baseline (see `PRSMTD/CLAUDE.md` core invariants)

## Cross-references

- [`../04-domain-model/`](../04-domain-model/) — aggregates this schema persists
- [`../09-security/`](../09-security/) — RLS and tenant-scoping requirements
- `PRSMTD/db/liquibase/` — target changeset location and canonical baseline

## Status

Not yet authored.

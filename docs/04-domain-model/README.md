# 04 — Domain Model

## Purpose

Defines the domain-driven design model underlying the platform: bounded contexts, the
ubiquitous language within each, and the aggregates/entities/value objects that data models
and APIs must be consistent with.

## What belongs here

- Bounded context map (e.g., Risk, Compliance, Controls, Audit, Policy, Incident/Issue/CAPA,
  Third-Party Risk, BCP/DR as candidate contexts) with explicit context boundaries and
  relationships (shared kernel, customer-supplier, anti-corruption layer, etc.)
- Ubiquitous language glossary per context — one authoritative definition per term, reused
  everywhere else in the repository
- Aggregate roots, entities, and value objects per context, with invariants
- Context boundaries vs. PRSMTD's existing module boundaries (`contacts`, `module-template`)

## Cross-references

- [`../02-business-architecture/`](../02-business-architecture/) — capabilities this model formalizes
- [`../05-modules/`](../05-modules/) — one module per bounded context (typically)
- [`../06-data-model/`](../06-data-model/) — persistence shape of these aggregates
- [`../21-standards/`](../21-standards/) — naming conventions for entities

## Status

Authored: [`01-enterprise-domain-model.md`](01-enterprise-domain-model.md) — the cross-context
bounded context map, canonical business glossary, shared modeling patterns, and dependency
rules for the ERM domain. Absorbs and supersedes the inline "Domain Model" sections of
[`10-risk/01-enterprise-risk-management.md`](../10-risk/01-enterprise-risk-management.md) and
[`12-controls/01-controls-management.md`](../12-controls/01-controls-management.md) for
cross-context vocabulary and integration rules (their own entity-level content remains
authoritative and unmodified). Reserves bounded-context boundaries for Compliance, Audit,
Policy, Incident/Issue/CAPA, Third-Party Risk, Business Continuity, and Reporting ahead of
their own specs.

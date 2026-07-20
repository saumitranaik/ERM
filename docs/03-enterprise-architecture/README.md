# 03 — Enterprise Architecture

## Purpose

Defines the target-state technical architecture of the platform and how the Architecture
Principles in [`../../CLAUDE.md`](../../CLAUDE.md) are applied concretely.

## What belongs here

- C4-style views (Context, Container, Component) of the ERM platform layered on PRSMTD
- Application of Hexagonal/DDD/Event-Driven/API-First/Zero-Trust principles to the concrete
  system
- Module boundary diagram — how `05-modules/` entries compose into the whole platform
- Non-functional architecture concerns spanning modules (scalability, multi-tenancy
  topology, resilience) that don't belong to any single module spec
- Explicit statement of what is reused from PRSMTD vs. net-new per the capability inventory

## Cross-references

- [`../../CLAUDE.md`](../../CLAUDE.md#prsmtd-capability-inventory) — the reuse baseline
- [`../04-domain-model/`](../04-domain-model/), [`../05-modules/`](../05-modules/) — detail behind these views
- `PRSMTD/docs/authoritative/system.md` — platform invariants this architecture must respect

## Status

Not yet authored.

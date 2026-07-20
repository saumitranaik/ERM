# 08 — API

## Purpose

API contracts for each module, specified to PRSMTD's actual stack (Spring Boot backend,
Next.js frontend) so they are directly implementable within the `api → service →
persistence` layering.

## What belongs here

- REST resource contracts: paths, methods, request/response shapes, pagination, error
  contract (aligned to PRSMTD's closed-world error response contract)
- Versioning strategy
- Event contracts where a module publishes domain events (`domain.entity.pastTenseVerb`
  naming per [`../21-standards/`](../21-standards/))
- Auth requirements per endpoint (role/permission required)

## Cross-references

- [`../05-modules/`](../05-modules/) — module each API belongs to
- [`../09-security/`](../09-security/) — permission model referenced by endpoint auth
- `PRSMTD/docs/authoritative/system.md §4` — runtime model, closed-world route enumeration

## Status

Not yet authored.

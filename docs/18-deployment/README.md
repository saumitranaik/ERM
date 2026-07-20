# 18 — Deployment

## Purpose

Specifies how the ERM capabilities are deployed and operated on PRSMTD's infrastructure —
environments, tenancy topology, and the platform's own business continuity/DR posture (as
distinct from BCP/DR as a *product capability* in [`../05-modules/`](../05-modules/)).

## What belongs here

- Environment topology (dev/UAT/production/DR) mapped to PRSMTD's `platformctl`
  environments
- Tenant onboarding/provisioning model for AMCs (and later other regulated entities)
- Platform-level DR/business continuity requirements (RTO/RPO for the ERM platform itself)
- Capacity/scale assumptions per module

## Cross-references

- `PRSMTD/docs/guides/platform_operations_guide.md`,
  `PRSMTD/docs/guides/rollback_and_disaster_recovery_guide.md` — operational substrate this
  builds on
- [`../19-roadmap/`](../19-roadmap/) — phased environment rollout

## Status

Not yet authored.

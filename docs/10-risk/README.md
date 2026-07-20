# 10 — Risk

## Purpose

Core Enterprise and Operational Risk Management capability specifications: the risk
register, assessment methodology, KRIs, and risk treatment workflows.

## What belongs here

- Risk taxonomy (risk categories/sub-categories, aligned to SEBI Risk Management System for
  Mutual Funds circular in [`../reference/`](../reference/))
- Risk register data/entity model, risk scoring methodology (likelihood × impact, inherent
  vs. residual)
- Key Risk Indicators (KRIs): definitions, thresholds, escalation
- Risk assessment workflow (links to [`../07-workflows/`](../07-workflows/))
- Risk treatment/acceptance/escalation governance

## Cross-references

- [`../04-domain-model/`](../04-domain-model/) — Risk bounded context
- [`../12-controls/`](../12-controls/) — controls that treat identified risks
- [`../reference/`](../reference/) — SEBI Risk Management System circular

## Status

- [`01-enterprise-risk-management.md`](01-enterprise-risk-management.md) — authored. Covers
  the risk register, scoring methodology (inherent/residual, likelihood × impact),
  risk treatment/acceptance/escalation governance, and KRIs for the SEBI Mutual Fund AMC
  profile. This is the repository's first authoritative specification and the canonical
  source for the Risk domain and data model until `../04-domain-model/` and
  `../06-data-model/` are authored.

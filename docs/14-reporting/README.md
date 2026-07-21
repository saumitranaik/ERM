# 14 — Reporting

## Purpose

Regulatory and Executive Reporting specifications: what must be reported, to whom, on what
cadence, and in what format.

## What belongs here

- Regulator-facing report specs (SEBI-mandated filings first) with field-level provenance
  back to source modules
- Board/Executive risk reporting (risk heat maps, KRI dashboards, control effectiveness
  summaries) — content spec here, visualization detail in [`../15-analytics/`](../15-analytics/)
- Report generation workflow and approval-before-submission governance
- Report versioning/audit trail requirements

## Cross-references

- [`../10-risk/`](../10-risk/) through [`../13-audit/`](../13-audit/) — data sources
- [`../15-analytics/`](../15-analytics/) — dashboard/visualization layer
- [`../reference/`](../reference/) — SEBI filing requirements

## Status

**Complete — Session 14 (2026-07-21).** Authored
[`01-reporting-management.md`](01-reporting-management.md) — module code `REPORTING`, the
eleventh authoritative specification and the tenth and final bounded context
[`04-domain-model/01-enterprise-domain-model.md`](../04-domain-model/01-enterprise-domain-model.md#reporting-reserved)
reserves. Covers the report/dashboard catalogue (69 seeded reports across nine source modules
plus six new cross-module reports), field-level provenance (`ReportFieldMapping`,
`ReportCitation`), on-demand report generation, approval-before-submission governance for
regulator/board-facing reports, distribution record-keeping, and evidence-ready export
construction. `15-analytics/` (KPI/metric catalog, dashboard visualization composition) remains
explicitly deferred — see that section's own README and `01-reporting-management.md`
Assumption 16.

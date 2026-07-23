# 15 — Analytics

## Purpose

KPI/metrics definitions and dashboard specifications that turn raw module data into
decision-ready views for risk owners, compliance, and executives.

## What belongs here

- KPI/metric catalog: definition, formula, source module(s), refresh cadence, owner
- Dashboard specs (composition of metrics, not pixel-level UI design)
- Threshold/alerting definitions distinct from KRIs in [`../10-risk/`](../10-risk/) (KRIs are
  risk-specific leading indicators; this section covers broader operational/performance
  metrics)

## Cross-references

- [`../10-risk/`](../10-risk/) — KRI definitions feed into risk dashboards here
- [`../14-reporting/`](../14-reporting/) — reporting content vs. this section's interactive
  dashboard layer
- [`../16-ai/`](../16-ai/) — AI-derived analytics build on this metric catalog

## Status

**Complete — Session 16 (2026-07-22).** Authored
[`01-analytics-management.md`](01-analytics-management.md) — module code `ANALYTICS`, the
twelfth authoritative specification and the second of the two documents realizing
[`04-domain-model/01-enterprise-domain-model.md`](../04-domain-model/01-enterprise-domain-model.md)'s
"Reporting and Analytics" Supporting Subdomain (that document's own Assumption 5), the KPI/
metric catalog and dashboard visualization layer
[`14-reporting/01-reporting-management.md`](../14-reporting/01-reporting-management.md)
Assumption 16 explicitly deferred. Covers a 48-row seed KPI/Metric Catalogue (42 consolidated
from the nine authored business-domain modules' own data models, 6 new cross-module composite
metrics), field-level provenance (`MetricFieldMapping`), threshold/banding measurement
(`MetricValue`, mirroring `KRI`/`VendorSLA`'s green/amber/red shape), and a visualization/
composition layer (`MetricView` — heat maps, trend lines, drill-downs) that activates
`14-reporting`'s already-reserved `DashboardWidget.widget_type = METRIC_REFERENCE` slot with
**zero** additive change to that module's schema. `DashboardDefinition`/`DashboardWidget`
themselves remain exclusively owned by `REPORTING` — this module supplies their metric content,
not a competing dashboard aggregate. Proposes, but does not apply, an eleventh-bounded-context
amendment to `04-domain-model` and two small additive changes to `14-reporting` (a
`dependencies:` addition; a `DashboardDefinition.audience = REGULATORY` value) — see that
spec's own Assumptions 3 and 11.

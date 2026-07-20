# ERM — Enterprise Risk Management / GRC Platform Specification

Architecture, domain, and specification repository for the evolution of
[PRSMTD](../PRSMTD) into a full Enterprise Risk Management / Governance, Risk & Compliance
(GRC) platform. This repository is **specification-first**: it contains architecture
decisions, domain models, workflows, data models, API contracts, and regulatory
traceability — not application code.

Primary target: a SEBI-regulated Mutual Fund Asset Management Company (AMC) in India, with
an architecture generic enough to extend to Banking, Insurance, Healthcare, Government,
Manufacturing, Technology, and Critical Infrastructure via regulatory-profile configuration.

See [`CLAUDE.md`](CLAUDE.md) for the full operating model, PRSMTD relationship, and
documentation standards this repository follows.

## Repository layout

| Path | Purpose |
|---|---|
| [`docs/01-vision/`](docs/01-vision/) | Vision, mission, target markets, platform thesis |
| [`docs/02-business-architecture/`](docs/02-business-architecture/) | Capability maps, value streams, personas |
| [`docs/03-enterprise-architecture/`](docs/03-enterprise-architecture/) | Target-state architecture, C4 views |
| [`docs/04-domain-model/`](docs/04-domain-model/) | Bounded contexts, ubiquitous language, aggregates |
| [`docs/05-modules/`](docs/05-modules/) | Per-capability module specs (maps to PRSMTD `modules/`) |
| [`docs/06-data-model/`](docs/06-data-model/) | Entity models, Liquibase-changeset-ready schemas |
| [`docs/07-workflows/`](docs/07-workflows/) | State machines, maker-checker flows |
| [`docs/08-api/`](docs/08-api/) | API contracts, versioning, error contracts |
| [`docs/09-security/`](docs/09-security/) | AuthN/Z model, roles/permissions, threat models |
| [`docs/10-risk/`](docs/10-risk/) | Enterprise & operational risk, KRIs, risk assessments |
| [`docs/11-compliance/`](docs/11-compliance/) | Compliance management, regulatory management |
| [`docs/12-controls/`](docs/12-controls/) | Internal controls, control testing |
| [`docs/13-audit/`](docs/13-audit/) | Audit management, evidence, working papers |
| [`docs/14-reporting/`](docs/14-reporting/) | Regulatory & executive reporting |
| [`docs/15-analytics/`](docs/15-analytics/) | KPIs, metrics, dashboards |
| [`docs/16-ai/`](docs/16-ai/) | AI-assisted risk analytics |
| [`docs/17-integrations/`](docs/17-integrations/) | External systems, regulator portals, market data |
| [`docs/18-deployment/`](docs/18-deployment/) | Environments, tenancy topology, DR/BCP |
| [`docs/19-roadmap/`](docs/19-roadmap/) | Phasing, release planning |
| [`docs/20-adr/`](docs/20-adr/) | Architecture Decision Records |
| [`docs/21-standards/`](docs/21-standards/) | Naming, documentation, and modeling standards |
| [`docs/22-traceability/`](docs/22-traceability/) | Cross-cutting traceability matrices |
| [`docs/reference/`](docs/reference/) | Primary source material (regulatory circulars, external inputs) |

## Relationship to PRSMTD

PRSMTD is the authoritative implementation repository this platform is built on — its
multi-tenant governance ledger, RBAC, module framework, and audit trail are the reusable
substrate for ERM capabilities. PRSMTD is treated as **read-only** from this repository; see
[`CLAUDE.md`](CLAUDE.md#relationship-to-prsmtd) for the capability inventory and reuse rules.

## Status

Early specification phase. See [`docs/roadmap.md`](docs/roadmap.md) for the live progress
tracker (completed work, current status, next milestone, assumptions, risks, open
decisions), and [`docs/19-roadmap/`](docs/19-roadmap/) for phasing once that specification is
authored.

# ERM Documentation

Specification-first documentation for the ERM/GRC platform. See [`../CLAUDE.md`](../CLAUDE.md)
for the operating model, PRSMTD relationship, documentation standards, and naming
conventions that govern everything under this directory — read it before authoring here.

See [`roadmap.md`](roadmap.md) for the live progress tracker (completed work, current
status, next milestone, assumptions, risks, open decisions) — read it after `CLAUDE.md` and
before starting new work in any session. It is distinct from [`19-roadmap/`](19-roadmap/),
which holds the phasing/release-plan specification.

## Sections

| # | Section | Contents |
|---|---|---|
| 01 | [vision](01-vision/) | Vision, mission, target markets, platform thesis |
| 02 | [business-architecture](02-business-architecture/) | Capability maps, value streams, personas |
| 03 | [enterprise-architecture](03-enterprise-architecture/) | Target-state architecture, C4 views |
| 04 | [domain-model](04-domain-model/) | Bounded contexts, ubiquitous language, aggregates |
| 05 | [modules](05-modules/) | Per-capability module specs (maps to PRSMTD `modules/`) |
| 06 | [data-model](06-data-model/) | Entity models, Liquibase-changeset-ready schemas |
| 07 | [workflows](07-workflows/) | State machines, maker-checker flows |
| 08 | [api](08-api/) | API contracts, versioning, error contracts |
| 09 | [security](09-security/) | AuthN/Z model, roles/permissions, threat models |
| 10 | [risk](10-risk/) | Enterprise & operational risk, KRIs, risk assessments |
| 11 | [compliance](11-compliance/) | Compliance management, regulatory management |
| 12 | [controls](12-controls/) | Internal controls, control testing |
| 13 | [audit](13-audit/) | Audit management, evidence, working papers |
| 14 | [reporting](14-reporting/) | Regulatory & executive reporting |
| 15 | [analytics](15-analytics/) | KPIs, metrics, dashboards |
| 16 | [ai](16-ai/) | AI-assisted risk analytics |
| 17 | [integrations](17-integrations/) | External systems, regulator portals, market data |
| 18 | [deployment](18-deployment/) | Environments, tenancy topology, DR/BCP |
| 19 | [roadmap](19-roadmap/) | Phasing, release planning |
| 20 | [adr](20-adr/) | Architecture Decision Records |
| 21 | [standards](21-standards/) | Naming, documentation, and modeling standards |
| 22 | [traceability](22-traceability/) | Cross-cutting traceability matrices |
| — | [reference](reference/) | Primary source material (regulatory circulars, external inputs) |

## Conventions

- Individual specs: `NN-descriptive-kebab-name.md`, numbered locally within their section.
- ADRs: `NNNN-kebab-case-title.md` under `20-adr/`, numbered monotonically across the whole
  repository.
- Every substantive spec carries the Traceability block defined in
  [`../CLAUDE.md`](../CLAUDE.md#traceability-rules) and is aggregated into
  [`22-traceability/`](22-traceability/).

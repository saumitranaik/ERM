# ERM — Enterprise Risk Management / GRC Platform Specification Repository

## What this repository is

ERM is the **specification repository** for the next evolution of PRSMTD into a full
Enterprise Risk Management / Governance, Risk & Compliance (GRC) platform. It contains
architecture, domain models, workflows, data models, APIs, security models, and regulatory
traceability — not application code. Read this file first in every session; it exists to
keep future sessions from having to re-derive context that is already decided here.

**Primary target**: a SEBI-regulated Mutual Fund Asset Management Company (AMC) in India.
Source regulatory material lives in [`docs/reference/`](docs/reference/) (SEBI Master
Circular annexures, the SEBI Cyber Security and Cyber Resilience Framework for Mutual Funds
AMCs, and the Risk Management System for Mutual Funds circular). The architecture must stay
generic enough that SEBI-specific rules are one configured regulatory profile among several
— Banking, Insurance, Healthcare, Government, Manufacturing, Technology, and Critical
Infrastructure are anticipated future profiles, added by configuration, not by forking the
platform.

## Relationship to PRSMTD

PRSMTD (`c:\development\projects\PRSMTD`) is the authoritative **implementation** repository
and the platform substrate ERM specs are designed to run on.

- **PRSMTD is read-only from this repository's perspective.** Never edit, generate files in,
  rename, or restructure anything under PRSMTD. Read it freely for grounding.
- **ERM is specification-first.** Do not write PRSMTD implementation code from this
  repository. If a task requires touching PRSMTD, say so explicitly and stop — that is a
  separate, deliberate engagement in the PRSMTD repo, not a side effect of ERM work.
- Every ERM capability must be evaluated first against **what PRSMTD already provides**
  before being designed as new. See the capability inventory below.

### PRSMTD capability inventory (reusable substrate)

Authoritative source: `PRSMTD/docs/authoritative/system.md` (§1–§22, doctrine index in
`PRSMTD/CLAUDE.md`). Summary for ERM design purposes — verify against system.md before
relying on specifics, it evolves:

| Capability | PRSMTD mechanism | ERM implication |
|---|---|---|
| Multi-tenancy | Postgres RLS on all tenant-scoped tables, single centralized session setter, GUC-based tenant/platform scope resolution | Reuse as-is. Every ERM entity (risk, control, incident, policy...) is tenant-scoped through this mechanism, not a new one. |
| Maker-checker governance | Append-only `pending_action` ledger, GOV-07 single-pending-action-per-target dedup, Governance Ledger + Projection pattern | Reuse for every ERM workflow that needs approval (risk acceptance, control sign-off, policy publication, CAPA closure, etc.) instead of designing bespoke approval state machines. |
| Module framework | `modules/{code}/module.yaml` manifest (moduleId, code, name, version, roles MAKER/CHECKER/VIEWER, permissions, roleMappings), `ModuleCatalogRegistrar`, lifecycle state derived from governance | Each ERM capability (§05-modules) should map to one or more PRSMTD modules. As of this writing PRSMTD ships only a `contacts` module and `module-template` — the ERM domain modules are greenfield, but the *mechanism* to host them is not. |
| RBAC | §8 RBAC model, module-scoped roles/permissions, platform vs. tenant navigation zones | Reuse. ERM security specs define role/permission *content* (what a Risk Owner or Compliance Officer can do), not a new authorization mechanism. |
| Authentication | JWT, decoupled identity model, issuer/audience invariants (§21) | Reuse as-is; out of scope for ERM to redesign. |
| Audit & observability | §10 audit/compliance, §4.1 Observability & Deterministic Trace Contract (T1–T7 trace invariants, closed event taxonomy) | Reuse as the immutable audit trail substrate for risk/control/audit-management evidence. ERM specs define *what* must be captured, not a new logging pipeline. |
| Layering & determinism | ArchUnit-enforced `api → service → persistence`, no `controller` package, closed-world routing, deterministic rebuild from source of truth | Any implementation-ready ERM API/module spec must respect this layering so it is directly buildable in PRSMTD without translation. |
| Data platform | PostgreSQL + Liquibase (immutable baseline from `release-1.0`, new changes as new changesets only) | ERM data model specs (§06) are Liquibase-changeset-ready, not raw ERDs. |
| Stack | Spring Boot / Java 21 backend, Next.js 14 / TypeScript frontend, Docker Compose + `platformctl` orchestration | API and UI specs should target this stack directly. |
| Frontend/UI shell | Next.js App Router (`frontend/app`, `frontend/src`); dynamic module navigation built from `GET /api/v1/modules` — module codes are never hardcoded (Frontend Hardcoding Guard, system.md §5b15); closed-world UI/BFF route enumeration (system.md §4.1 T4/T5); a shared component library (`src/components/{ui,common,module}`); existing `approvals` and `dashboard` feature areas (`src/features/`) | `27-user-experience` specs must reuse this shell, navigation model, and component structure — not design a competing frontend architecture. A new UI pattern is introduced only where no PRSMTD equivalent exists, explicitly flagged as such. |
| Governance/ADR process | §16 Governance Program Board Doctrine, §17 Runtime Validator Harness Doctrine, §20 ADR Traceability Matrix | ERM's own ADRs (§20-adr) should be written so they could be adopted into PRSMTD's ADR Traceability Matrix without rework. |

When a needed capability is **not** in this table, treat it as a genuine gap — design it in
ERM and flag it explicitly as a new PRSMTD capability requirement (see Traceability Rules).

## Repository rules

1. PRSMTD is read-only. No exceptions.
2. ERM is specification-first. Do not scaffold or write platform implementation code here
   unless the user explicitly instructs implementation for *this* repository.
3. No duplication of PRSMTD content — cross-reference (`PRSMTD/docs/authoritative/system.md
   §N`) instead of restating platform invariants.
4. Reuse before redesign — always check the capability inventory above and PRSMTD directly
   before proposing a new mechanism.
5. Maintain traceability — every non-trivial specification carries the traceability block
   defined below.
6. Do not create root-level documentation files beyond `CLAUDE.md`, `README.md`, and
   `.gitignore` unless explicitly instructed. All documentation content lives under `docs/`.

## Architecture principles

Domain-Driven Design · Modular architecture · Hexagonal architecture (ports/adapters at
module boundaries) · Event-driven where it reduces coupling (not by default) · API-first ·
Security by Design · Zero Trust · Privacy by Design · Compliance by Design · Cloud-native ·
Multi-tenant · Configurable over custom (regulatory variation is config, not fork) ·
Immutable audit · Least privilege · Separation of duties.

Apply these as design constraints on every specification, not as a checklist to recite. If a
design violates one, the document must say so explicitly and justify the exception.

## Documentation principles

- **Hierarchy**: `docs/NN-section-name/` per the structure below. Each section has an
  index `README.md`. Individual specs live inside their section, named
  `NN-descriptive-kebab-name.md` (two-digit sequence local to the section).
- **No duplicate content.** If a concept is defined elsewhere (in ERM or PRSMTD), link to it
  — `[Risk Taxonomy](../10-risk/02-risk-taxonomy.md)` or
  `PRSMTD/docs/authoritative/system.md §8` — never re-explain it.
- **Cross-reference over restating.** ADRs reference the specs they decide on; specs
  reference the ADRs that constrain them; traceability docs reference both.
- **Implementation-ready.** A finished spec should let an engineering team build the
  capability in PRSMTD with minimal ambiguity: concrete entities, states, transitions, API
  shapes, role/permission names — not prose aspirations.
- **Diagrams where they earn their place** (Mermaid, inline in the `.md` file) — sequence
  diagrams for workflows, ER diagrams for data models, C4-style diagrams for architecture.
  Don't diagram what a table or list already says clearly.
- **No placeholders, no incomplete specs.** A section `README.md` that scopes future work is
  fine (it's an index, not a spec). An actual capability document under that section must be
  complete per the Documentation Standards below or not be created yet.

## Working rules

1. Understand existing documentation first — read the relevant section(s) and any linked
   PRSMTD material before writing.
2. Extend documentation rather than replacing it; if a change conflicts with an existing
   spec, surface the conflict explicitly rather than silently overwriting.
3. Preserve consistency of terminology, entity names, and structure across all sections.
4. Avoid conflicting specifications — check §22-traceability and related sections for
   existing decisions before introducing a new one.
5. Maintain architecture integrity — every new spec must respect the principles above and
   the PRSMTD capability inventory.
6. Cross-reference instead of duplicating.

## Repository organization

```
docs/
    01-vision/                  Vision, mission, target markets, platform thesis
    02-business-architecture/   Capability maps, value streams, stakeholder/persona models
    03-enterprise-architecture/ Target-state architecture, C4 views, principles application
    04-domain-model/            Bounded contexts, ubiquitous language, aggregates
    05-modules/                 Module index/registry only — one entry per module, pointing to
                                 its authoritative spec elsewhere; never module content itself
    06-data-model/              Entity models, Liquibase-changeset-ready schemas
    07-workflows/               State machines, maker-checker flows, BPMN/sequence diagrams
    08-api/                     API contracts (REST/event), versioning, error contracts
    09-security/                AuthN/Z model, roles/permissions, threat models, Zero Trust
    10-risk/                    Enterprise & operational risk, KRIs, risk assessments
    11-compliance/              Compliance management, regulatory management, mapping
    12-controls/                Internal controls, control testing, control library
    13-audit/                   Audit management, evidence, working papers
    14-reporting/                Regulatory & executive reporting specs
    15-analytics/               KPIs, metrics, dashboards
    16-ai/                      AI-assisted risk analytics specs
    17-integrations/            External systems, regulator portals, market data, etc.
    18-deployment/               Environments, tenancy topology, DR/BCP for the platform itself
    19-roadmap/                 Phasing, release planning
    20-adr/                     Architecture Decision Records
    21-standards/               Naming, documentation, and modeling standards
    22-traceability/            Cross-cutting traceability matrices
    23-policy/                  Policy taxonomy, governed lifecycle, policy-to-control/obligation mapping
    24-incident-issue-capa/     Incident intake, issue tracking, corrective/preventive action (CAPA)
    25-third-party-risk/        Vendor/third-party inventory, due diligence, ongoing risk monitoring
    26-business-continuity/     Business impact analysis, continuity/DR plans, RTO/RPO targets
    27-user-experience/         Presentation-layer specs: screens, navigation, dashboards, forms,
                                 maker-checker UX, notifications, accessibility, responsive behavior
    reference/                  Primary source material (regulatory PDFs, external inputs) — not authored here
```

Preserve this structure. If a new top-level section seems necessary, propose it to the user
explicitly rather than inventing one silently. Sections `23`–`26` extend the numbering beyond
the original `01`–`22` scaffold, following the same one-section-per-bounded-context precedent
`09`–`13` already established for business-domain modules; `27` is the shared presentation
layer for all business-domain sections (`09`–`13`, `23`–`26`), not a bounded context of its
own.

`05-modules/` is a module index/registry only — one entry per module (code, manifest summary,
dependencies, and a pointer to that module's authoritative spec in its own dedicated section).
It must never duplicate or own module content; a module's domain model, data model, workflows,
security model, and API contract live exclusively under that module's own numbered section.

`27-user-experience/` owns presentation-layer specifications only — screens, navigation,
dashboards-as-UI, forms, maker-checker UX, notifications, accessibility, and responsive
behavior. It must not redefine or own business rules, workflows, domain models, APIs, or data
ownership; those remain owned by their respective domain sections. Every UX specification must
reuse PRSMTD's existing frontend conventions (see the Frontend/UI shell row in the capability
inventory above) rather than redefine them — a new UI pattern is introduced only where no
PRSMTD equivalent exists, and must be explicitly identified and justified as a new capability
requirement, per the Traceability Rules.

## Traceability rules

Every specification of consequence (module spec, workflow, data model, security model, API
contract) ends with a traceability block:

```markdown
## Traceability
- **Business Requirement**: <what business need this serves>
- **Regulatory Requirement**: <SEBI circular/section, or "none" — cite docs/reference/ source>
- **PRSMTD Capability**: <reused mechanism + system.md § reference, or "none — new capability required">
- **ERM Capability**: <the capability this document defines, cross-referenced to 22-traceability>
- **Dependencies**: <other ERM specs or PRSMTD capabilities this assumes>
- **Future Work**: <known gaps, deferred decisions>
```

`docs/22-traceability/` aggregates these into master matrices (business↔regulatory,
capability↔PRSMTD, requirement↔spec). Update the relevant matrix whenever a new
traceability block is added elsewhere.

## Naming standards

- **Documents**: `NN-kebab-case-name.md`, two-digit sequence, scoped to its section folder.
- **ADRs**: `docs/20-adr/NNNN-kebab-case-title.md`, four-digit sequence, monotonic across the
  whole repository (never reused, never renumbered).
- **Diagrams**: inline Mermaid inside the owning `.md` file where possible; standalone
  diagram files (if needed) live beside the spec as `NN-name.mmd`.
- **APIs**: REST resource paths use plural lower-kebab nouns (`/risk-assessments`); event
  names use `domain.entity.pastTenseVerb` (`risk.assessment.completed`), mirroring PRSMTD's
  closed event taxonomy style (system.md §4.1).
- **Workflows**: named as `<Entity> <Verb> Workflow` (e.g., "Risk Acceptance Approval
  Workflow"); states use `SCREAMING_SNAKE_CASE` to match PRSMTD lifecycle-state conventions.
- **Entities**: `PascalCase` in prose/diagrams, `snake_case` in schema specs (matches
  PRSMTD's Postgres conventions).
- **Modules**: `UPPERCASE` module codes matching PRSMTD's `module.code` convention (e.g.,
  `RISK`, `CONTROLS`, `AUDIT`, `POLICY`).

## Decision-making principles

- Prefer extension of an existing ERM or PRSMTD capability over introducing a replacement.
- Avoid unnecessary complexity — the simplest design that satisfies the regulatory and
  business requirement wins.
- Favour reusable platform services (PRSMTD governance ledger, RBAC, audit trail) over
  bespoke per-module mechanisms.
- Avoid duplicate modules — check `05-modules/` and PRSMTD's `modules/` before proposing a
  new one.
- Explicitly identify PRSMTD capabilities that are reusable vs. capabilities that are gaps
  requiring new platform work.
- Document assumptions inline, in the spec's own "Assumptions" section — don't leave them
  implicit.
- Explicitly identify gaps rather than glossing over them with a placeholder.

## Long-term vision

ERM is intended to evolve into a full enterprise Governance, Risk and Compliance platform
covering: Governance, Enterprise Risk Management, Operational Risk, Compliance Management,
Internal Controls, Audit Management, Policy Management, Regulatory Management, Cybersecurity
Governance, Privacy Management, Third-Party Risk, Business Continuity, Disaster Recovery
Governance, Incident Management, Issue Management, CAPA, Risk Assessments, Control Testing,
KRIs, KPIs, Regulatory Reporting, Executive Reporting, and AI-assisted Risk Analytics —
starting from a SEBI-regulated Mutual Fund AMC and generalizing to Banking, Insurance,
Healthcare, Government, Manufacturing, Technology, and Critical Infrastructure through
regulatory-profile configuration rather than platform forks.

## Documentation standards (per-document checklist)

Every substantive specification document (not section index READMEs) must contain: Purpose,
Scope, Business Context, Assumptions, Dependencies, Architecture, Functional Specification,
Non-Functional Requirements, Security Considerations, Compliance Considerations,
Traceability (per the block above), and Future Enhancements. No placeholder or "TBD"
sections — if a section has nothing substantive yet, the document isn't ready to be created.

## Instruction loading

- Starting a new capability area → read this file, then the relevant `docs/NN-*/README.md`,
  then the corresponding PRSMTD `system.md` §, before writing.
- Design/architecture questions → apply Architecture Principles + Decision-Making
  Principles above; do not jump to code.
- Any request that implies writing PRSMTD code, or ERM platform code, is out of scope unless
  explicitly instructed — stop and confirm instead of proceeding.

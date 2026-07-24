# Defects and Observations

Per the governance rules in `CLAUDE.md` and this phase's instructions:
authoritative specifications are not modified during prototype construction
except for genuine defects, which are documented here with a proposed
correction rather than silently redesigned. This is a log, not an
authoritative document.

## Found and corrected

### 1. `docs/README.md` section index was stale (missing sections 23–27)

**Defect**: the repository-root `docs/README.md` section table only listed
sections 01–22. Sections `23-policy`, `24-incident-issue-capa`,
`25-third-party-risk`, `26-business-continuity` and `27-user-experience` were
added at Session 9 (per `docs/roadmap.md`) but this index was never updated
to include them — a reader following only `docs/README.md` would not
discover four fully authored modules or the UX section.

**Correction applied**: added rows for sections 23–27 to the table, matching
the section descriptions already given in `CLAUDE.md`'s Repository
Organization list. This is a pure index/documentation fix — no content in any
numbered spec was touched.

**Also corrected in the same table**: the `05-modules` row described it as
"Per-capability module specs (maps to PRSMTD `modules/`)", which contradicts
the binding rule established at Session 9 and stated explicitly in
`CLAUDE.md` — that `05-modules/` is index-only and must never own module
content. Updated the description to match the binding rule.

## Observations (no correction needed)

### Internal consistency of the 12 authored specs

While grounding every module's entity model, lifecycle states, and workflow
actions directly in the corresponding spec (`docs/09-security/`,
`docs/10-risk/`, `docs/11-compliance/`, `docs/12-controls/`,
`docs/13-audit/`, `docs/14-reporting/`, `docs/15-analytics/`,
`docs/23-policy/`, `docs/24-incident-issue-capa/`,
`docs/25-third-party-risk/`, `docs/26-business-continuity/`, and
`docs/04-domain-model/`), no functional or business-logic contradictions were
found across the 12 documents. Cross-module integration points (e.g.
`Risk.source` values activated by Compliance/Security/Incident/TPR/BCP; the
opaque cross-context reference pattern; the shared immediate-raise/
governed-closure exception shape) are consistently named and consistently
applied everywhere they are used. This is a strong signal that the repo's own
Session 15 "Additive Change Consolidation" pass did its job.

### Genuine platform gaps surfaced again by building against the specs

Building the mock evidence/attachment panel (`EvidencePanel.tsx`) reconfirmed
the gap already tracked in
`docs/22-traceability/01-master-traceability-matrix.md`: PRSMTD has no
document/object storage capability. The prototype simulates evidence as
metadata-only records with no actual file storage, exactly matching what a
real implementation would be blocked on until that platform capability
exists. No new gap — just an implementation-level confirmation of a
gap already on record.

### Minor field-naming latitude taken in the prototype (not a spec defect)

A small number of prototype-only field names were introduced where the spec
describes a concept but the exact column name is an implementation detail
deferred to `06-data-model/` (not yet authored) — e.g. `capaType`,
`criticalityTier`, `assessmentType` enumerations were named to match the
prose in each spec's Data Model section as closely as possible, but should be
treated as illustrative rather than a preemptive schema decision. This is
expected and appropriate for a UX prototype: `CLAUDE.md` explicitly defers
schema-level naming to `06-data-model/`, which does not exist yet.

## Process note

No authoritative specification's business rules, entity definitions,
workflows, or traceability blocks were altered. The only edits made to files
outside `prototype/` are the `docs/README.md` index correction above and the
`docs/roadmap.md` update recording this phase's progress (see that file's
latest session entry).

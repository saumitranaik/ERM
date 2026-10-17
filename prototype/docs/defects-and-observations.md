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

## Open governance gaps found while verifying risk logging (decisions required)

### A. Risk Owner may also be the approving Checker — spec is internally inconsistent

**What the specs say.** `docs/10-risk/01-enterprise-risk-management.md` Assumption 6
states "Risk Owner and Checker are always distinct individuals", and the Security
Considerations threat note names "a `RISK_CHECKER` account being the same person as the
risk owner" as the primary module threat. Both say this is "prevented structurally" by
PRSMTD's `approved_by <> created_by` constraint on `pending_action` (system.md §3), and that
the module "defines no bespoke SoD logic".

**Why that does not hold.** The constraint compares the *submitter* to the *approver*. It
does not look at `risk_owner_user_id`. A Risk Manager (maker) can log a risk naming the CRO
as owner, submit it, and the CRO — a different person from the submitter — can approve it
while being its owner. The mechanism the spec relies on does not enforce the rule the spec
states. Observed in the prototype: Arjun (RISK_MAKER) logs a risk owned by Priya (CRO);
Priya sees Approve/Reject on it. The prototype correctly enforces what the platform
constraint does (the submitter never sees Approve on their own submission).

**What is not specified.** Whether owner≠checker is a hard rule or a stated intent; whether
it is enforced at decision time (block the owner from deciding), at owner selection
(not possible by role alone — the checker is whoever later decides), or both; and whether
it is a new PRSMTD platform capability (a decide-time guard keyed on a module-supplied
"subject user"), since the spec forbids bespoke module SoD logic.

**Not implemented.** No governance policy was invented. Decision needed from the owner:
*"Must the Risk Owner be barred from deciding the approval of their own risk, and if so is
that a PRSMTD platform guard (preferred, reusable across modules that name an owner) or a
RISK-module rule?"* Once answered, the prototype change is small (extend the `canDecide`
check in `ApprovalPanel.tsx` with an owner comparison, plus one E2E/unit case).

### B. `RiskScoringMatrix` bands are not specified; prototype bands are invented

**What the specs establish.** `RiskScoringMatrix` is tenant-editable reference data
(`module_risk_scoring_matrix`: `likelihood_levels`, `impact_levels`, `matrix_definition`
jsonb, `is_default`), FR-03 requires a numeric score *and* a band label "e.g.,
Low/Medium/High/Critical" from a configurable likelihood × impact matrix, and
non-functional requirements make it configurable rather than hardcoded.

**What is not specified anywhere in `docs/`.** The number of levels (a 5×5 grid is not
stated), the score thresholds, the band names beyond the "e.g.", and the SEBI_AMC seed
matrix. `matrix_definition` is described only as "band labels/thresholds".

**Prototype divergence.** The 1–5 input range (`validation`/form field config), the
`ScoreChip` and heat-map colour cut-offs (≥5, ≥10, ≥17) and the dashboard legend
"Low (1–4) / Medium (5–9) / High (10–16) / Critical (17–25)" are prototype conventions, not
specified values. Score arithmetic (likelihood × impact) is specified; band labels and
thresholds are not. The legend is therefore labelled output of an unmodelled matrix, not a
conflict with a specified one.

**Not implemented.** Decision needed: the tenant's default matrix (levels and band
thresholds/labels for the SEBI_AMC profile), ideally supplied by the AMC's risk function.
Next step once decided: seed one `RiskScoringMatrix` record and drive `ScoreChip`, the
heat-map and the legend from it, and make form range validation read its level counts.

### C. Related gaps deliberately left out of the risk-logging scope

Residual score from an approved assessment (spec: assessments are `module_risk_assessment`
rows with maker-checker approval; the prototype still takes residual L×I on the risk form),
reference-data-backed categories/sub-categories (`module_risk_category`; the prototype uses a
fixed `RISK_CATEGORIES` list and free-text sub-category) and the full assessment,
assignment and review lifecycle. Each depends on the scoring-matrix decision (B) or on
reference-data modelling, and none was changed.

## Process note

No authoritative specification's business rules, entity definitions,
workflows, or traceability blocks were altered. The only edits made to files
outside `prototype/` are the `docs/README.md` index correction above and the
`docs/roadmap.md` update recording this phase's progress (see that file's
latest session entry).

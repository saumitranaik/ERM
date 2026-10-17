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

### A. Risk Owner may also be the approving Checker — spec is internally inconsistent (prototype control added)

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

**Resolved at prototype level (decision received).** The accountable owner decided: *a Risk Owner
must not approve or reject their own risk, even if someone else created or submitted it.*
Implemented in `prototype/src/lib/decisionPolicy.ts` (`decisionBlockReason`), enforced in
`decidePendingAction` (`src/lib/governance.ts`) and mirrored by `ApprovalDecision`
(`src/components/module/ApprovalPanel.tsx`), which hides Approve/Reject and shows the reason. The
rule is separate from, and evaluated after, the maker≠checker and `RISK_CHECKER` checks. Verified by
unit tests (`tests/unit/risk-logging.test.mjs`) and the E2E run (`tests/e2e/risk-logging.e2e.mjs`).

**Limits of this control — not claimed as platform enforcement.**
- Prototype only. It is **not** a PRSMTD capability; the PRSMTD `approved_by <> created_by`
  constraint is unchanged and still does not compare against the risk owner. A platform-wide guard
  (decide-time check keyed on a module-supplied subject user) remains an unimplemented, separate
  PRSMTD proposal, and `docs/10-risk` Assumption 6 / the Security note have not been amended.
- Applies to Approve and Reject on governed actions whose target is the `risks` record. **Return for
  rework is deliberately not restricted** (not in the decision); governed actions on child records
  (assessments, treatment plans, acceptances) and the direct `ESCALATION_ACK` action are not covered.
  Whether an owner may decide those is an open decision.
- Ownership is read from the risk's current `ownerId` at decision time (re-assigning the owner after
  submission changes eligibility). Comparison is by user, so any persona of the owner is blocked.
- Consequence in the seed data: only one persona holds `RISK_CHECKER` (the CRO), so a risk owned by
  the CRO has no eligible decider. Whether to add a second checker (e.g. a deputy) or to forbid
  nominating the sole checker as owner is a business decision, not made here.
  `docs/10-risk/01-enterprise-risk-management.md` FR-17 says `RISK_CHECKER` may be assigned to a
  Compliance Officer, Risk Management Committee member or external agency user, but no seeded persona
  other than the CRO holds it and the specs name no designated alternate; granting it to an existing
  persona would change the prototype's security model, so none was granted. Decision required: which
  persona (if any) the AMC designates as alternate checker.
- Direct-invocation coverage: the shared pure rule is unit-tested, and the ledger function calls it;
  the ledger function itself is not exercised in isolation (it depends on browser storage) — the E2E
  test confirms only UI outcomes and resulting database state.

**Proposed specification correction — not applied; requires governance approval.** The wording in
`docs/10-risk/01-enterprise-risk-management.md` (Assumption 6; Security Considerations "Segregation of
duties" and "Threat model note") that owner≠checker is "enforced by"/"prevented structurally by" the
PRSMTD `approved_by <> created_by` constraint is inaccurate: that constraint compares submitter and
approver, not the risk owner. Proposed replacement: state owner≠checker as a requirement that the
platform constraint does *not* satisfy, and either (a) record it as a new PRSMTD capability
requirement (decide-time guard keyed on a module-supplied subject user) or (b) accept a module-level
check as a justified exception to the "no bespoke SoD logic" statement. Choosing (a) or (b), and the
scope (Approve/Reject only, or also Return, child records and `ESCALATION_ACK`), is an architecture
decision, so the authoritative spec was left unchanged. PRSMTD was not modified.

**Visual check of the owner restriction (recaptured, not committed).** Owner (CRO) view of a
risk-owned pending submission at 1440px light, 1440px dark, 390px dark, and the 390px dark Approvals
queue: no Approve/Reject controls; only "Return for rework" plus the message "the owner of a risk
cannot approve or reject it. An independent checker must decide."; message legible and placed under
the actions in the amber panel; no horizontal page overflow at 390px (scrollWidth − clientWidth = 0).
Independent-checker behaviour (Approve and Reject shown) is covered by the E2E run, not a screenshot,
because the seed data has no second `RISK_CHECKER` persona.

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

**Investigation summary (re-checked against `docs/` for this pass).** Explicitly specified:
score = likelihood × impact (FR-03, numeric score plus band label); matrix is tenant-editable
reference data with `likelihood_levels`/`impact_levels`/`matrix_definition`/`is_default`
(`docs/10-risk/01-enterprise-risk-management.md`, data model; Configurability NFR); heat-map and
risk-register report exist as requirements (FR-15). **Unresolved (no source anywhere):** grid
dimensions, level ranges (1–5 is a prototype choice), band names beyond "e.g.", thresholds,
SEBI_AMC seed values, who owns/approves matrix changes (not stated as governed), and how
inherent vs. residual use the matrix (the spec has one matrix per risk via `scoring_matrix_id`, and
a separate `methodology_matrix_id` on assessments). Residual scores are specified to come from an
approved `RiskAssessment` (`RISK_ASSESSMENT_APPROVAL` updates `Risk.residual_*`); the prototype's
risk form accepts residual L×I directly, unapproved. Mitigation made in this pass: the heat-map
legend now states that the bands are illustrative and that no approved matrix is configured; no
threshold or label was changed.

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

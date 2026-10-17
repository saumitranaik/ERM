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

**Enforcement point resolved for the prototype (2026-10-17); platform-wide enforcement deferred.**
[ADR 0001](../../docs/20-adr/0001-risk-owner-decision-restriction-enforcement.md) is ACCEPTED for the ERM prototype
scope only: the owner restriction on Approve/Reject of the Risk record is an ERM module-level, fail-closed control
(`decisionPolicy.ts`). It does not assert that PRSMTD enforces risk-owner independence, and the client-side/localStorage
prototype is not a trusted production boundary. A shared platform guard, `risk_owner_user_id` validation at a trusted
boundary, and defence-in-depth are reassessed only in a future authorised platform change. No implementation change was
needed to the owner rule itself (uncommitted, separately tracked prototype changes add only a no-eligible-checker notice and matrix-validation hardening); PRSMTD was not modified.

**Specification corrected (2026-10-17).** `docs/10-risk/01-enterprise-risk-management.md`
(Assumption 6, FR-05, Security Considerations "Segregation of duties" and "Threat model note", the approval sequence
diagram note) no longer says PRSMTD's `approved_by <> created_by` enforces owner ≠ decision-maker. It now separates
(a) *submitter ≠ approver* — existing PRSMTD capability — from (b) *risk owner ≠ decision-maker* — an ERM target
requirement, prototype-enforced only, not provided by PRSMTD. The platform-wide decide-time guard is a deferred
future option; the prototype control is recorded in
[ADR 0001](../../docs/20-adr/0001-risk-owner-decision-restriction-enforcement.md) (ACCEPTED, prototype scope). PRSMTD was not modified.

**Scope of the owner restriction by action (Decision 3 — recommendation: no blanket extension).**

| Action | Status | Basis |
|---|---|---|
| Approve / Reject of a governed action on the Risk record | **Covered** (prototype-implemented; unit-tested) | Accountable-owner decision recorded above. |
| Return for rework on the Risk record | Governed by maker-checker + `RISK_CHECKER`; owner restriction **awaiting AMC decision** | Return is not a final decision; no authority extends the restriction. Prototype leaves it unrestricted (tested). |
| Governed actions on child records (assessments, treatment plans, acceptances) | **Awaiting AMC decision** | Decision authority differs per record (e.g. acceptance is an accountability transfer). Not implemented. |
| `ESCALATION_ACK` (direct, non-governed) | **Awaiting AMC decision** | Acknowledgement is by the escalation recipient (`RISK_CHECKER`); barring the owner could block a legitimate escalation path. Not implemented. |

AMC question: *"For which risk-related actions, beyond approve/reject of the risk record, must the risk owner be excluded
as decision-maker?"* Recommendation: decide per action after defining its decision authority; do not extend by analogy.

**Checker availability (Decision 4) — implemented fail-closed behaviour + AMC decision pending.** When the only
`RISK_CHECKER` (the CRO) owns the risk, `decisionBlockReason` blocks them and no other persona is eligible, so the
action stays pending; nothing is permitted silently. No second checker was seeded and no role was granted. Unit tests
(isolated fixtures, seed data unchanged) show the owner is denied, nobody is eligible when the sole checker owns the risk,
and an independent checker can decide. **Blocked on AMC decision:** recommended sustainable control — the AMC designates
an alternate independent checker (FR-17 permits a Compliance Officer, Risk Management Committee member or external agency
user) **or** formally approves a rule preventing the sole eligible checker from being assigned as owner. Neither is
implemented. A pending action stranded this way has no escalation or reassignment path in the prototype.

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

**Prototype improvements made (2026-10-17, illustrative values unchanged).** `prototype/src/lib/riskMatrix.ts` now models the
matrix explicitly (`status: 'ILLUSTRATIVE'`, version `illustrative-1`, grid size, bands) with `validateMatrix`
(bands start at 1, contiguous, non-overlapping, cover 1..L×I, unique non-empty labels) and `resolveBand` (fails closed — null for
an invalid matrix or an out-of-range score). `ScoreChip`, the heat-map cell tones and the legend are driven from it, so the bands
live in one place. Band names, thresholds and the 5×5 grid remain illustrative, not approved policy or a regulatory requirement.
Tests: consistency, every score 1..25 and every L×I product resolves, invalid/missing configuration, 4×4 grid.

**Matrix governance — required, unspecified (not invented).** The spec does not say who proposes or approves matrix changes,
nor that changes are governed. Recommended default: matrix changes are a governed (maker-checker) `pending_action` with a
`RISK_ADMIN` maker and an AMC-designated checker (the authority is **not established** and is an AMC decision); each approved
change creates a new immutable matrix **version** with an effective date; approved assessments snapshot
`(matrix_id, matrix_version)` and keep the score and band they were approved with (historical traceability — they are not
silently recalculated); a re-score against a new version is an explicit re-assessment. None of this exists in the spec or
prototype. **AMC decisions required:** the matrix values (grid, bands, thresholds), the matrix approver, and the
recalculate-vs-retain policy for existing risks.

### C. Related gaps deliberately left out of the risk-logging scope

**Residual-score derivation (Decision 6) — assessed, not implemented.** The spec models `module_risk_assessment` with
`residual_likelihood`/`residual_impact`, maker-checker approval and `RISK_ASSESSMENT_APPROVAL` updating `Risk.residual_*`.
The prototype has no such projection: approving a `riskAssessments` record does not update the Risk, assessments carry no
matrix id/version, and the Risk form still accepts residual likelihood × impact directly (unapproved). Deriving the residual
score from approved assessments would therefore require inventing the projection, recalculation and version-snapshot rules,
so it was **not** done. The current direct-entry behaviour is retained for existing flows and is a labelled prototype
limitation. Target design (recommendation): residual score = approved residual likelihood × impact from the latest APPROVED
assessment, banded by the matrix version recorded on that assessment; inherent and residual remain separate inputs, scores
and bands; matrix changes do not alter approved scores (see matrix governance above). Remaining lifecycle gap: assessment
approval → Risk projection, matrix-version snapshot, and the rule for superseded assessments. Categories/sub-categories
backed by `module_risk_category` reference data are likewise unchanged.

## Consolidated outstanding AMC decisions (none decided or implemented)

Index of items already detailed in A and B above; no policy value, checker assignment or approval authority is assumed.

1. Whether owner independence applies to Return, child records and `ESCALATION_ACK` (A, scope table).
2. Whether the AMC designates an alternate independent checker or prevents the sole checker being assigned as owner (A, checker availability).
3. The approved scoring-matrix grid, bands and thresholds (B).
4. The matrix-change approval authority and governance process (B, matrix governance).
5. How existing risk scores are handled when the matrix changes (B, recalculate-vs-retain).
6. How residual scores are derived from approved assessments and linked to matrix versions (B, investigation summary; residual is currently entered directly and unapproved in the prototype).

Future platform work (separately authorised, not implemented): shared owner-independence guard; trusted-boundary validation
of `risk_owner_user_id` and checker eligibility; whether the module-level control stays as defence in depth; cross-module
enforcement, auditing and testing. See [ADR 0001](../../docs/20-adr/0001-risk-owner-decision-restriction-enforcement.md).

## Process note

No authoritative specification's business rules, entity definitions,
workflows, or traceability blocks were altered. Outside `prototype/`, the edits are the `docs/README.md` index correction
above, the `docs/roadmap.md` update recording the earlier phase, and (2026-10-17) the
correction to `docs/10-risk/01-enterprise-risk-management.md` and new ADR 0001 described in item A.

# Source Workflow — Demonstration Video 02 (L1-02, Risk Treatment Plan Approval)

Every claim, screen, persona, and line of narration in this package's companion documents is
grounded in one of the sources below. Nothing in this package invents business behavior not
already present in the specification or the running prototype.

## Workflow definition

- **Catalogue row**: `docs/19-roadmap/01-demonstration-workflow-catalogue.md` §4.1, row `L1-02`
  — "Risk Treatment Plan Approval". Objective: "Show mitigation planning tied to a risk."
  Module: `RISK`. Primary persona: Arjun Mehta (Risk Manager). Secondary persona: Priya
  Raghunathan (CRO). Trigger: "Maker proposes ACCEPT/MITIGATE/TRANSFER/AVOID plan." Start → End
  screen: "Risk Detail → Treatment Plan Detail." `MC·Ex·Rp·An` = `Y·N·N·N` (maker-checker
  involved; no executive dashboard, reporting, or analytics touchpoints). Complexity: Simple.
  Priority · Value: High · Business.
- **Selected per** `demos/video-production-manifest.md` §26/§28's automation rule — the first
  "Not Started" row in Video Number order whose dependency (V01, Production Package Complete
  and Rendered) is already satisfied.

## Journey followed

No entry in `prototype/docs/user-journeys.md` covers Treatment Plan approval directly (the
document's own §1 "Risk assessment approval" journey ends at the Risk Detail decision history,
one step before treatment planning begins); per the framework's own "How to use this document"
instruction, this workflow is grounded directly against the `RISK` module specification's own
state machine and workflow-action definitions instead (below), and against the running
prototype's own entity configuration for `treatment-plans`.

## Specification exercised

- `docs/10-risk/01-enterprise-risk-management.md` — the `RISK` module specification.
  Specifically: the `RiskTreatmentPlan` entity (§ Domain Model — "One or more per Risk; only
  one may be non-terminal"), FR-06 ("The system shall support a risk treatment plan with
  strategy `ACCEPT`, `MITIGATE`, `TRANSFER`, or `AVOID`, subject to governed approval"), FR-08
  ("A treatment plan may link to zero or more Controls-module control references via an
  opaque, non-FK cross-module reference"), the `module_risk_treatment_plan` table definition
  (`status` ∈ `PROPOSED, APPROVED, IN_PROGRESS, COMPLETED, VERIFIED, CANCELLED`), the
  `RISK_TREATMENT_APPROVAL` governed action type (`treatment_plan_id` → `status = APPROVED`),
  and the `RISK_TREAT` / `RISK_APPROVE` permissions (maker proposes, checker approves/rejects).
- The module's own cross-module reference mechanism (FR-08, `module_risk_treatment_control_link`,
  "Activated" per that document's Session 2 note, resolved via the `12-controls` module's
  reference-resolution API) is the same opaque-reference pattern this framework's Cross-Module
  Transition chapter type (framework §13) generalizes for Level 2+ workflows — not exercised as
  its own chapter here (this is an L1 video), but the existing `CTL-2026-0007` link on
  `RSK-2026-0004` is visible on screen and named once in narration as a preview of that pattern.

## Governance mechanism referenced

- PRSMTD's maker-checker governance ledger (`CLAUDE.md` capability inventory, "Maker-checker
  governance" row) — the same append-only `pending_action` ledger and GOV-07
  single-pending-action-per-target dedup rule Video 01 already demonstrated
  (`demos/video-01-risk-assessment-approval/source-workflow.md`). This video reuses that
  explanation near-verbatim (framework §26, "Narration sections" row 2) rather than
  re-deriving it, since separation-of-duties rationale is platform-level, not module-specific.

## Prototype build exercised

- `prototype/` (Next.js 14.2.4 UX reference application), run unmodified via its own documented
  `npm run dev` script (port 3100), against its own seed dataset —
  `prototype/src/data/risk.json`, `prototype/src/data/org.json`. No fixture edits, no staged
  demo data, no changes to any prototype file. `RSK-2026-0004` had zero linked Treatment Plans
  in the seed data (`prototype/src/data/risk.json`'s `treatmentPlans` array has no entry with
  `riskId: "r-004"`), exactly as the workflow trigger requires — a genuinely new plan being
  proposed, not a status change on an existing one.
- `prototype/src/modules/risk.ts` — the `treatment-plans` entity configuration: `codePrefix:
  'TRT'`, `initialStatus: 'PROPOSED'`, form fields (Title, Risk, Strategy, Owner, Target
  Residual Score, Due Date, Description), and the `TREATMENT_APPROVAL` workflow action
  (`fromStatuses: ['PROPOSED']`, `governed: true`, `targetStatus: 'APPROVED'`,
  `permission: 'CREATE'`) — confirmed live against the running application, not read from the
  config file alone.

## Personas used

Both drawn directly from `prototype/src/data/org.json`, identical to Video 01 — not invented
for this video:

| Persona | User record | Role in this workflow |
|---|---|---|
| Arjun Mehta | `u-arjun`, Risk Manager, Risk Management department | Maker (proposes and submits the treatment plan; also assigned as its owner) |
| Priya Raghunathan | `u-priya`, Chief Risk Officer, Risk Management department (department head) | Checker |

## Entity used

`RSK-2026-0004` (`r-004`), the same risk record Video 01 used, from
`prototype/src/data/risk.json` — selected per `demos/video-production-manifest.md` §26's own
recommendation to reuse this record for continuity and screenshot-reuse purposes:

- Title: "Credit default of a portfolio issuer below investment grade." Category: `FUND_
  MANAGEMENT` / Credit Risk. Status: `ACTIVE`. Inherent score 10, residual score 8. One linked
  control, `CTL-2026-0007` ("Issuer credit review and watchlist," Preventive, Effective).
- Zero linked Treatment Plans at the start of this capture pass (confirmed live on the
  Relationships tab, `02-risk-relationships-no-treatment-plan.png`).

A new Treatment Plan was created live against this risk, through the prototype's own UI, with
the code the application itself assigned (`TRT-2026-0009` — the next sequential code after the
seed data's existing `TRT-2026-0001`–`TRT-2026-0008`, not chosen or edited by this capture
pass):

| Field | Value |
|---|---|
| Code | `TRT-2026-0009` |
| Title | "Enhanced issuer credit monitoring and watchlist escalation" |
| Strategy | `MITIGATE` |
| Owner | Arjun Mehta |
| Target Residual Score | 6 (down from the risk's current residual score of 8) |
| Due Date | 30 Nov 2026 |
| Description | "Increase issuer credit surveillance from quarterly to monthly review, add automated rating-agency outlook alerts, and formalise a watchlist exit trigger at a two-notch downgrade from investment grade, building on the existing issuer credit review control (CTL-2026-0007)." |

Maker justification (entered at submission): "Proposing enhanced monitoring for RSK-2026-0004
given the existing issuer credit review control alone has not been tested against a rapid
multi-notch downgrade scenario. Escalating surveillance cadence and adding an automated
early-warning trigger targets a reduction in residual score from 8 to 6 without waiting for the
next scheduled re-assessment."

Checker decision comment (entered at approval): "Concur with the enhanced monitoring approach —
the added early-warning trigger and monthly review cadence are proportionate given the current
one-notch outlook pressure on this issuer. Approved."

## Precedent and continuity with Video 01

This is the second video-medium deliverable produced under `video-production-framework.md`
(Session 24) and `video-production-manifest.md` (Session 27), following
`demos/video-01-risk-assessment-approval/` (Session 23/26). Per the manifest's own §26
expectation and the framework's Asset Reuse Determinations (§20, §26), two screenshots are
reused verbatim from Video 01 rather than recaptured, because the underlying business state is
identical and no prototype change occurred between the two capture passes:

| Reused file (this package) | Original file (Video 01) | Why identical |
|---|---|---|
| `00-login-persona-picker.png` | `00-login-persona-picker.png` | Pre-sign-in persona picker — no persona, tenant, or seed-data change between videos. |
| `01-risk-detail-active.png` | `02-risk-detail-active.png` | `RSK-2026-0004`, status `ACTIVE`, inherent 10 / residual 8, four maker actions available — unchanged, since Video 01's own capture pass ran in an isolated browser context whose in-session changes are not persisted (`localStorage`-scoped, resets to shipped seed data every fresh context — see Video 01's own `recording-log.md`). |

All other screenshots (`02`–`10`) are fresh captures from this session's own pass (see
`recording-log.md`), since they show UI states (the empty Relationships tab, the treatment-plan
creation form, and every treatment-plan-specific screen) Video 01 never captured.

## Traceability

- **Business Requirement**: Demonstrate how the platform's canonical maker-checker governance
  pattern (established in Video 01) extends unchanged to a second governed action type on the
  same risk record — risk treatment planning — to a mixed executive/technical/regulatory
  audience.
- **Regulatory Requirement**: SEBI Risk Management System for Mutual Funds circular (documented
  risk treatment/mitigation planning with independent sign-off; see
  `docs/10-risk/01-enterprise-risk-management.md` FR-06, FR-08) — cited via that spec, not
  restated here.
- **PRSMTD Capability**: Reused — governance ledger / maker-checker (`system.md §3, §9`, per
  `docs/10-risk/01-enterprise-risk-management.md`'s own traceability block); no new PRSMTD
  capability required.
- **ERM Capability**: `10-risk` — Enterprise Risk Management, governed `RISK_TREATMENT_APPROVAL`
  action.
- **Dependencies**: `docs/19-roadmap/01-demonstration-workflow-catalogue.md` (workflow
  definition); `demos/video-production-manifest.md` (sequencing and status tracking);
  `demos/video-production-framework.md` (production standards and templates);
  `demos/video-01-risk-assessment-approval/` (the validated precedent this package follows, and
  the source of two reused screenshots).
- **Future Work**: See `observations.md` for gaps/notes carried forward for future demonstration
  videos in this series.

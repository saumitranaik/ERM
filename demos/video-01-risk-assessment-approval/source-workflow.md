# Source Workflow — Demonstration Video 01 (L1-01, Risk Assessment Approval)

Every claim, screen, persona, and line of narration in this deck's companion documents is
grounded in one of the sources below. Nothing in this package invents business behavior not
already present in the specification or the running prototype.

## Workflow definition

- **Catalogue row**: `docs/19-roadmap/01-demonstration-workflow-catalogue.md` §4.1, row `L1-01`
  — "Risk Assessment Approval *(validated journey 1)*". Objective: "Show the canonical
  maker-checker pattern." Module: `RISK`. Primary persona: Arjun Mehta (Risk Manager).
  Secondary persona: Priya Raghunathan (CRO). Trigger: "Maker submits (re)assessment on an
  ACTIVE risk." Start → End screen: "Risk Register list → Risk Detail (Decision History)."
  `MC·Ex·Rp·An` = `Y·N·N·N` (maker-checker involved; no executive dashboard, reporting, or
  analytics touchpoints). Complexity: Simple. Priority · Value: Critical · Business/Operations.
- Named the catalogue's own **recommended Day-1 deck** (§10 of the same document), on the
  strength of being both a validated prototype journey and the platform's simplest complete
  demonstration of governed maker-checker.

## Journey followed

- `prototype/docs/user-journeys.md` §1, "Risk assessment approval (Risk Manager → Chief Risk
  Officer)" — the 7-step guided walkthrough this video's scene list follows exactly, in order.

## Specification exercised

- `docs/10-risk/01-enterprise-risk-management.md` — the `RISK` module specification.
  Specifically: the `Risk` and `RiskAssessment` entities (§ Domain Model), the governed
  `REASSESSMENT` workflow action (`ACTIVE`/`ESCALATED` → `UNDER_REVIEW` → `ACTIVE`), FR-05
  ("The assessor and the approver of any governed action on a Risk shall never be the same
  individual — enforced by the platform's `approved_by <> created_by` constraint"), and the
  status lifecycle state machine (`UNDER_REVIEW --> ACTIVE: assessment APPROVED, residual
  within appetite`).

## Governance mechanism referenced

- PRSMTD's maker-checker governance ledger (`CLAUDE.md` capability inventory, "Maker-checker
  governance" row) — append-only `pending_action` ledger, single-pending-action-per-target
  dedup rule. In the running prototype this is implemented as a mock of the same mechanism:
  `prototype/src/lib/governance.ts`, whose own header comment identifies it as "simulates
  PRSMTD's maker-checker mechanism (append-only `pending_action` ledger + projection,
  `system.md` §Governance) — one pending action per target (**GOV-07** dedup)."

## Prototype build exercised

- `prototype/` (Next.js 14 UX reference application), run unmodified via its own documented
  `npm run dev` script (port 3100), against its own seed dataset —
  `prototype/src/data/risk.json`, `prototype/src/data/org.json`. No fixture edits, no staged
  demo data, no changes to any prototype file. `RSK-2026-0004` ("Credit default of a
  portfolio issuer below investment grade") was already `ACTIVE` in the seed data, exactly as
  the workflow trigger requires.

## Personas used

Both drawn directly from `prototype/src/data/org.json`, not invented for this video:

| Persona | User record | Role in this workflow |
|---|---|---|
| Arjun Mehta | `u-arjun`, Risk Manager, Risk Management department | Maker |
| Priya Raghunathan | `u-priya`, Chief Risk Officer, Risk Management department (department head) | Checker |

## Entity used

`RSK-2026-0004` (`r-004`), from `prototype/src/data/risk.json`:

- Title: "Credit default of a portfolio issuer below investment grade"
- Description: "Downgrade or default of a held issuer may require side-pocketing, valuation
  markdowns and investor communication under SEBI segregated-portfolio norms."
- Category: `FUND_MANAGEMENT` / Credit Risk. Owner: Ritu Agarwal. Source: `MANUAL`.
- Status at start: `ACTIVE`. Inherent score 10 (L2 × I5). Residual score 8 (L2 × I4).
- Identified 2026-02-05, last assessed 2026-06-18, next review due 2026-09-18.
- Linked control: `c-007`.

## Precedent

This is the second demonstration deliverable built against L1-01, after
`demos/deck-01-risk-assessment-approval/` (a static PowerPoint deck, Session 22). That deck's
own screenshot inventory and defects log confirmed the workflow runs cleanly end to end with
zero prototype defects and zero specification inconsistencies — reconfirmed independently by
this video package's own capture pass (see `recording-log.md` and `observations.md`).

## Traceability

- **Business Requirement**: Demonstrate the platform's canonical maker-checker governance
  pattern to a mixed executive/technical/regulatory audience unfamiliar with PRSMTD or ERM.
- **Regulatory Requirement**: SEBI Risk Management System for Mutual Funds circular
  (independent risk management function; see `docs/10-risk/01-enterprise-risk-management.md`
  functional requirements table, FR-05, FR-11) — cited via that spec, not restated here.
- **PRSMTD Capability**: Reused — governance ledger / maker-checker (`system.md §3, §9`, per
  `docs/10-risk/01-enterprise-risk-management.md`'s own traceability block); no new PRSMTD
  capability required.
- **ERM Capability**: `10-risk` — Enterprise Risk Management, governed `REASSESSMENT` action.
- **Dependencies**: `docs/19-roadmap/01-demonstration-workflow-catalogue.md` (workflow
  definition); `prototype/docs/user-journeys.md` §1 (journey steps);
  `demos/deck-01-risk-assessment-approval/` (prior deliverable against the same workflow).
- **Future Work**: See `observations.md` for gaps/notes carried forward for future
  demonstration videos in this series.

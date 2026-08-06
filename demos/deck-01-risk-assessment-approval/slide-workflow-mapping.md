# Slide ↔ Workflow-Step Mapping — Demonstration Deck 01 (L1-01, Risk Assessment Approval)

Maps every slide in `deck-01-risk-assessment-approval.pptx` (16 slides) to the workflow
definition in `docs/19-roadmap/01-demonstration-workflow-catalogue.md` §4.1 (row `L1-01`) and,
for the step-by-step slides, to the corresponding step of `prototype/docs/user-journeys.md`
§1 ("Risk assessment approval").

| Slide # | Slide title | Catalogue / journey reference | Screenshot used |
|---|---|---|---|
| 1 | Title | Catalogue row `L1-01`; §10 "Recommended Day-1 deck" | — |
| 2 | Executive Summary | Catalogue §1 (Executive Summary), §10 (Day-1 rationale) | — |
| 3 | Business Objective | Catalogue §12 regulatory grounding note for `10-risk`; `docs/10-risk/01-enterprise-risk-management.md` | — |
| 4 | Personas | Catalogue "Primary"/"Secondary" columns for `L1-01`; `prototype/src/data/org.json` | — |
| 5 | Workflow Overview | Catalogue row `L1-01` in full (ID, Modules, Trigger, Start→End, MC·Ex·Rp·An, Complexity, Priority) | — |
| 6 | Step 1 — Sign In as Risk Manager | Journey §1 step 1 | `00-login-persona-picker.png` |
| 7 | Step 2 — Open the Risk Register | Journey §1 step 2 (first half); catalogue "Start Screen" = Risk Register list | `01-risk-register-list.png` |
| 8 | Step 3 — Open the Risk Record | Journey §1 step 2 (second half) | `02-risk-detail-active.png` |
| 9 | Step 4 — Submit the Re-assessment Justification | Journey §1 step 3 | `03-reassessment-justification-dialog.png` |
| 10 | Step 5 — Risk Enters UNDER_REVIEW | Journey §1 step 4 | `04-risk-under-review-pending.png` |
| 11 | Step 6 — Checker Opens the Approval Queue | Journey §1 steps 5–6 (first half) | `05-checker-queue-pending-item.png` |
| 12 | Step 7 — Checker Records the Decision | Journey §1 step 6 (second half) | `06-approve-decision-dialog.png` |
| 13 | Step 8 — Final Governed Outcome | Journey §1 step 7; catalogue "End Screen" = Risk Detail (Decision History) | `07-risk-detail-approved-decision-history.png` |
| 14 | Governance / Maker-Checker Events | Catalogue MC flag = Y; `docs/10-risk/01-*` governed-action model; PRSMTD `pending_action` ledger (CLAUDE.md capability inventory) | — |
| 15 | Final Business Outcome | Catalogue "Start → End Screen" end state; journey §1 step 7 | — |
| 16 | Key Takeaways | Catalogue §5 (dependency matrix — L1-01 is a foundational, no-prerequisite workflow that others build on), §10 | — |

## Coverage check

- All 7 journey steps in `prototype/docs/user-journeys.md` §1 are represented (steps 2 and 6
  each span two deck slides, since each contains two distinct on-screen states worth a separate
  screenshot).
- All catalogue-defined fields for row `L1-01` (ID, Name, Objective, Modules, Primary/Secondary
  personas, Trigger, Start→End Screen, Scr/Act, MC·Ex·Rp·An, Complexity, Priority·Value) appear
  in the deck, concentrated on the Workflow Overview slide (5) plus the Personas slide (4).
- No slide introduces a claim, screen, or persona not already present in the catalogue row or
  the journey document.

# Screenshot Inventory — Demonstration Deck 01 (L1-01, Risk Assessment Approval)

All screenshots were captured on 2026-07-25 against the running `prototype/` UX reference
application (`npm run dev`, port 3100), using its unmodified seed dataset. Capture tool:
Playwright (Chromium, headless, 1440×900 viewport), driven by a script that exercises the app
exclusively through its own UI/routes — no direct data-file edits, no staged fixtures beyond
what `prototype/src/data/risk.json` already seeds (RSK-2026-0004 is ACTIVE in the seed data).

Each row after the first is the deck's official 7-screen workflow capture (matching the
catalogue's `Scr/Act` figure for L1-01); row 1 (`00-*`) is a supplementary context screenshot
used only on the Personas/sign-in illustration, not counted in that 7.

| # | File | Persona (as-of) | App screen | Business-state captured |
|---|---|---|---|---|
| 0 | `00-login-persona-picker.png` | — (pre-session) | `/login` | Persona picker — supplementary context, not a workflow state transition |
| 1 | `01-risk-register-list.png` | Arjun Mehta (Risk Manager) | `/modules/RISK/risks` | Entry point — RSK-2026-0004 visible, status ACTIVE |
| 2 | `02-risk-detail-active.png` | Arjun Mehta (Risk Manager) | `/modules/RISK/risks/r-004` | RSK-2026-0004 detail, ACTIVE, all four maker actions available (no pending action exists) |
| 3 | `03-reassessment-justification-dialog.png` | Arjun Mehta (Risk Manager) | `/modules/RISK/risks/r-004` (dialog) | "Submit Re-assessment" dialog, justification entered, pre-submit |
| 4 | `04-risk-under-review-pending.png` | Arjun Mehta (Risk Manager) | `/modules/RISK/risks/r-004` | Governed transition applied — status ACTIVE → UNDER_REVIEW, "Awaiting checker" badge, action buttons withdrawn (GOV-07) |
| 5 | `05-checker-queue-pending-item.png` | Priya Raghunathan (Chief Risk Officer) | `/protected/approvals` (Checker Queue tab) | Checker queue showing the new pending Risk Reassessment request at top, with maker's justification |
| 6 | `06-approve-decision-dialog.png` | Priya Raghunathan (Chief Risk Officer) | `/protected/approvals` (dialog) | "Approve action" dialog, decision comment entered, pre-confirm |
| 7 | `07-risk-detail-approved-decision-history.png` | Priya Raghunathan (Chief Risk Officer) | `/modules/RISK/risks/r-004` (Approvals tab) | Governed transition applied — status UNDER_REVIEW → ACTIVE, full maker-checker decision record visible |

## Reuse notes for future decks

Per the catalogue's screenshot-reuse guidance (§5), the following screens captured here are
directly reusable, unmodified, by later decks in the recommended build order (§7) rather than
being recaptured:

- `01-risk-register-list.png` and `02-risk-detail-active.png` — reusable by any other RISK
  Foundations workflow (L1-02, L1-03, L1-04) that also opens the Risk Register or a risk in
  ACTIVE status, and by every Level 2+ chain that starts from or returns to a Risk record
  (L2-01, L2-05, L3-01).
- `05-checker-queue-pending-item.png`'s Approvals-page chrome (sidebar, tab structure) is
  representative of every other module's checker-queue screenshot — later decks need only
  recapture the pending-item card itself, not the surrounding page.

## Assets not produced

No screen recordings, GIFs, or video were produced — per the deck's scope, static screenshots
only. No screenshots were retouched, cropped, or annotated after capture; all are used exactly
as captured.

# Timeline — Demonstration Video 02: Risk Treatment Plan Approval

**This is the authoritative timing document.** It reconciles `narration-script.md`'s
cue-level timestamps (narration only) with `chapters.md`'s chapter-card timestamps by adding a
fixed **3-second card offset per chapter card already played** (see `chapters.md` for the
offset derivation) — the identical method Video 01 established. Total runtime: **6:47**
(6:42 narration+cards + 5s closing card). Format `M:SS`.

| Video TC (in–out) | Ch. | Type | Screen / Screenshot | Cue | Business state on screen |
|---|---|---|---|---|---|
| 0:00–0:03 | 1 | Chapter card | — | — | "ERM — Enterprise Risk Management / GRC Platform" |
| 0:03–0:29 | 1 | Narration | — (title plate) | 1.1 | Cold open |
| 0:29–0:32 | 2 | Chapter card | — | — | "Quick Reminder" |
| 0:32–1:05 | 2 | Narration | — (concept plate: risk register / maker-checker recap) | 2.1 | RISK module quick reminder |
| 1:05–1:08 | 3 | Chapter card | — | — | "Meet the Personas, Again" |
| 1:08–1:20 | 3 | Narration | `00-login-persona-picker.png` (persona card overlay: Arjun) | 3.1 | Maker re-introduced |
| 1:20–1:30 | 3 | Narration | `00-login-persona-picker.png` (persona card overlay: Priya) | 3.2 | Checker re-introduced |
| 1:30–1:33 | 4 | Chapter card | — | — | "Reviewing the Risk" |
| 1:33–1:57 | 4 | Narration | `01-risk-detail-active.png` | 4.1 | RSK-2026-0004, ACTIVE, inherent 10 / residual 8, 1 linked control |
| 1:57–2:15 | 4 | Narration | `02-risk-relationships-no-treatment-plan.png` | 4.2 | Relationships tab, Treatment Plans: 0 |
| 2:15–2:18 | 5 | Chapter card | — | — | "Proposing a Treatment Plan" |
| 2:18–2:40 | 5 | Narration | `03-new-treatment-plan-form.png` | 5.1 | New Treatment Plan form, filled, pre-submit |
| 2:40–3:00 | 5 | Narration | `04-treatment-plan-proposed.png` | 5.2 | TRT-2026-0009 created, status PROPOSED |
| 3:00–3:03 | 6 | Chapter card | — | — | "Submitting for Approval" |
| 3:03–3:23 | 6 | Narration | `05-submit-justification-dialog.png` | 6.1 | "Submit for Approval" clicked, justification entered |
| 3:23–3:41 | 6 | Narration | `06-treatment-plan-awaiting-checker.png` | 6.2 | PROPOSED + "Awaiting checker" badge, action bar withdrawn |
| 3:41–3:44 | 7 | Chapter card | — | — | "Governance Review" |
| 3:44–4:09 | 7 | Narration | `06-treatment-plan-awaiting-checker.png` (hold) | 7.1 | Governance rationale (condensed) |
| 4:09–4:24 | 7 | Narration | Persona switch → `07-checker-queue-pending-item.png` | 7.2 | Checker Queue, item at top |
| 4:24–4:27 | 8 | Chapter card | — | — | "Checker Approval" |
| 4:27–4:37 | 8 | Narration | `07-checker-queue-pending-item.png` | 8.1 | Approve / Reject / Return options |
| 4:37–4:50 | 8 | Narration | `08-approve-decision-dialog.png` | 8.2 | Approve clicked, comment entered |
| 4:50–5:03 | 8 | Narration | `08-approve-decision-dialog.png` | 8.3 | "Confirm approve" clicked |
| 5:03–5:06 | 9 | Chapter card | — | — | "Audit Trail" |
| 5:06–5:29 | 9 | Narration | `09-treatment-plan-approved-decision-history.png` | 9.1 | Approvals tab, decision record: Approved |
| 5:29–5:32 | 10 | Chapter card | — | — | "Final Business Outcome" |
| 5:32–5:46 | 10 | Narration | `10-risk-relationships-treatment-plan-linked.png` | 10.1 | Risk's own Relationships tab, Treatment Plans: 1 |
| 5:46–6:05 | 10 | Narration | `10-risk-relationships-treatment-plan-linked.png` | 10.2 | Business value framing |
| 6:05–6:27 | End | Narration | — (recap plate: dual-workflow pattern diagram) | E.1 | Pattern recap |
| 6:27–6:42 | End | Narration | — (roadmap plate: next demonstrations) | E.2 | Series preview |
| 6:42–6:47 | — | Closing card | — | — | "Thank You — ERM Demonstration Series" |

## Screenshot reuse

Two screenshots are reused **across videos**, not just within this one — see
`source-workflow.md` "Precedent and continuity with Video 01" for the full mapping:
`00-login-persona-picker.png` and `01-risk-detail-active.png` are the identical files Video 01
captured (`00-login-persona-picker.png` and `02-risk-detail-active.png` there respectively),
renumbered for this package per framework §18's numbering convention but not recaptured.

Within this video, `06-treatment-plan-awaiting-checker.png` is held across the Chapter 6/7
boundary (Cue 6.2 through the opening of Cue 7.1) and `07-checker-queue-pending-item.png` /
`08-approve-decision-dialog.png` each span two narration cues — the same "one screenshot, held
across an adjacent camera/callout change" pattern Video 01 used for its own Chapters 9–10.

## Concept plates (no screenshot)

Four timeline entries reference a "concept plate" instead of a prototype screenshot (Chapter
2's shortened recap, and the two Ending beats). These are narration-only explanatory graphics,
scaled down from Video 01's five-plate Chapter 2 and three-plate Ending to match this video's
own shortened-overview and shortened-recap content — see `scene-list.md` for what each plate
shows.

## Traceability

- **Business Requirement**: Provide a single, frame-referenced production timeline an editor
  can build the actual video against.
- **Regulatory Requirement**: None.
- **PRSMTD Capability**: None — production planning document.
- **ERM Capability**: N/A.
- **Dependencies**: `narration-script.md`, `chapters.md`, `scene-list.md`, `screenshots/`.
- **Future Work**: Re-time against the real recorded narration track once produced (see
  `asset-inventory.md`) — the 150 wpm estimate will not match a real performance exactly.

# Chapters — Demonstration Video 02: Risk Treatment Plan Approval

Chapter title cards, in play order. Each card is a **3-second** full-screen or lower-third
title card (see `scene-list.md` for exact treatment), inserted immediately before that
chapter's first narration cue — the same mechanic Video 01 established (framework §13 "Chapter
card mechanics"). A single 5-second closing card plays after the Ending narration completes and
does not shift anything before it; the Ending section itself has no chapter card of its own
(narration continues directly from Chapter 10 — see `narration-script.md`). Full reconciliation
of both timestamp tracks is in `timeline.md`.

| # | Chapter | Card text | Card subtitle | Video timestamp (card in) |
|---|---|---|---|---|
| 1 | Introduction | "ERM — Enterprise Risk Management / GRC Platform" | "Demonstration 02 · Risk Treatment Plan Approval" | 00:00 |
| 2 | RISK Module Overview | "Quick Reminder" | "The Risk Register, Revisited" | 00:29 |
| 3 | Meet the Personas | "Meet the Personas, Again" | "Meridian Asset Management Ltd." | 01:05 |
| 4 | Reviewing the Risk | "Reviewing the Risk" | "RSK-2026-0004, Revisited" | 01:30 |
| 5 | Proposing a Treatment Plan | "Proposing a Treatment Plan" | "Accept · Mitigate · Transfer · Avoid" | 02:15 |
| 6 | Submitting for Approval | "Submitting for Approval" | "Proposed → Awaiting Checker" | 03:00 |
| 7 | Governance Review | "Governance Review" | "One Ledger, Every Decision" | 03:41 |
| 8 | Checker Approval | "Checker Approval" | "The Chief Risk Officer Decides, Again" | 04:24 |
| 9 | Audit Trail | "Audit Trail" | "A Second Permanent Record" | 05:03 |
| 10 | Final Business Outcome | "Final Business Outcome" | "From Zero Plans to One, Governed" | 05:29 |
| — | Closing card (post-Ending) | "Thank You" | "ERM Demonstration Series — Video 02 of 46" | 06:42 |

## Notes

- Ten numbered chapter cards plus one closing card — the identical shape Video 01 used (ten
  numbered chapters, one closing card), holding the series' chapter-count convention steady
  even though this video's per-chapter content is shorter (framework §13's chapter formula
  scales runtime per chapter, not chapter count, for two Simple-tier RISK-module videos this
  close together in the sequence).
- Chapters 2 and 3 are the shortened, second-appearance form of the "Domain/Module Overview" and
  "Meet the Personas" bookend chapters (framework §13) — their card text ("Quick Reminder,"
  "Meet the Personas, Again") signals this explicitly to the viewer rather than silently
  compressing the same card language Video 01 used.
- Card 7 (Governance Review) keeps its required beat (framework §13 item 4) but is not the
  video's single longest chapter the way it was in Video 01 — see `narration-script.md`'s tone
  direction and `observations.md` for why.
- No chapter card duplicates a business claim — each is a label, not a sentence requiring its
  own traceability, matching Video 01's own convention.

## Traceability

- **Business Requirement**: Provide navigable chapter markers for an executive audience
  skimming or rewatching specific sections (e.g., a CRO jumping directly to Chapter 7).
- **Regulatory Requirement**: None.
- **PRSMTD Capability**: None — presentation-layer collateral for demonstration purposes only.
- **ERM Capability**: N/A.
- **Dependencies**: `narration-script.md`, `timeline.md`.
- **Future Work**: Chapter markers should be embedded in the final MP4's container metadata
  (standard MP4 chapter atoms) once the video is actually assembled — not yet done, see
  `asset-inventory.md`.

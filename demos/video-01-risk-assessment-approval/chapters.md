# Chapters — Demonstration Video 01: Risk Assessment Approval

Chapter title cards, in play order. Each card is a **3-second** full-screen or lower-third
title card (see `scene-list.md` for exact treatment), inserted immediately before that
chapter's first narration cue — this is what shifts the "video timestamp" column below ahead
of the narration-only timestamps in `narration-script.md` by a cumulative 3 seconds per prior
chapter. A single 5-second closing card plays after the Ending narration completes and does
not shift anything before it. Full reconciliation of both timestamp tracks is in `timeline.md`.

| # | Chapter | Card text | Card subtitle | Video timestamp (card in) |
|---|---|---|---|---|
| 1 | Introduction | "ERM — Enterprise Risk Management / GRC Platform" | "Demonstration 01 · Risk Assessment Approval" | 00:00 |
| 2 | Enterprise Risk Management Overview | "Why Governance Matters" | "Risk registers, maker-checker, and auditability" | 00:23 |
| 3 | Meet the Personas | "Meet the Personas" | "Meridian Asset Management Ltd." | 02:44 |
| 4 | Reviewing Existing Risks | "Reviewing Existing Risks" | "The Risk Register" | 04:35 |
| 5 | Updating the Risk Assessment | "Updating the Risk Assessment" | "Submitting a Periodic Re-assessment" | 06:18 |
| 6 | Submitting for Approval | "Submitting for Approval" | "Active → Under Review" | 07:51 |
| 7 | Governance Review | "Governance Review" | "Why Maker-Checker Exists" | 09:06 |
| 8 | Checker Approval | "Checker Approval" | "The Chief Risk Officer Decides" | 11:21 |
| 9 | Audit Trail | "Audit Trail" | "A Permanent, Defensible Record" | 13:10 |
| 10 | Final Business Outcome | "Final Business Outcome" | "From Proposal to Governed Fact" | 14:21 |
| — | Closing card (post-Ending) | "Thank You" | "ERM Demonstration Series — Video 01 of N" | 16:50 |

## Notes

- Card 7 (Governance Review) is the video's centerpiece card — held for the full 3 seconds
  with no cursor motion on screen, giving the narration's pacing shift (see
  `narration-script.md` Chapter 7 pacing note) a clean visual break to land in.
- Card text matches the "Suggested chapters" list in the originating brief exactly, in order
  and in count (ten numbered chapters, no additions, no omissions).
- No chapter card duplicates a business claim — each is a label, not a sentence requiring its
  own traceability.

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

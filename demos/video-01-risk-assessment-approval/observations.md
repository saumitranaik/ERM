# Observations — Demonstration Video 01: Risk Assessment Approval

Recorded during production of this package, 2026-08-06. Per repository constraints, **nothing
below was fixed** — this is an observation log only, covering both the prototype/specification
(re-confirming `deck-01-risk-assessment-approval/defects-and-gaps-observed.md`'s findings
independently) and this package's own production process.

## Prototype defects

**None encountered**, reconfirming `deck-01-risk-assessment-approval/defects-and-gaps-observed.md`'s
finding on an independent capture pass five sessions later: RSK-2026-0004 transitioned
`ACTIVE → UNDER_REVIEW` on submission and `UNDER_REVIEW → ACTIVE` on approval exactly as
specified; GOV-07 correctly withdrew every workflow-action button while the reassessment was
pending; separation of duties was enforced structurally (Arjun's own submission was excluded
from his own view of the checker queue and could only be decided after switching to Priya);
the maker-checker decision trail rendered completely and correctly on the Approvals tab.

## Inconsistencies

**None encountered** between the running prototype's behavior, `docs/10-risk/01-enterprise-risk-management.md`,
or `prototype/docs/user-journeys.md` §1 — same conclusion as `deck-01`'s own review, reconfirmed.

## Specification gaps

**None discovered specific to this workflow** — same conclusion as `deck-01`. This video, like
that deck, exercises only the `RISK` module's own governed re-assessment action.

## Observations carried forward from `deck-01` (reconfirmed, not new)

1. The checker queue is not empty at the start of a fresh session (6 other pre-seeded pending
   items were present alongside the new submission). Confirmed again on this capture pass;
   `narration-script.md` Chapter 7 and `scene-list.md` Scene 23 narrate around this directly
   ("6 other items already pending — this queue is never artificially emptied for a demo")
   rather than pretending the queue starts empty, consistent with the brief's own instruction
   not to invent behavior the prototype doesn't exhibit.
2. Module-code routing is case-insensitive — not exercised directly by this package's capture
   script (which used the canonical uppercase `/modules/RISK/...` route throughout), noted
   only for completeness.
3. No temporary demo data was needed — `git status --short prototype/` was empty both before
   and after this session's entire capture pass (see `recording-log.md`).

## New observations from this package's own production

4. **The suggested 90–120 second introduction runtime, taken literally, undercounts the
   brief's own required content for that section.** The brief's "INTRODUCTION" section lists
   seven distinct required beats (what is ERM, why risk registers, why governance, why
   maker-checker, why auditability, how PRSMTD provides governance, how ERM extends it, plus a
   workflow preview). Scripted at a natural, unhurried professional-narrator pace (150
   words/minute — the industry-standard estimation rate used throughout this package, see
   `narration-script.md`), covering all seven beats runs to approximately 2 minutes 38
   seconds, not 90–120 seconds. Compressing further would require cutting one of the seven
   required beats rather than tightening prose. This is flagged as an observation, not
   corrected unilaterally, since the brief's time guidance and content-completeness
   requirements are in mild tension and a future session or the requester should decide which
   takes precedence if a hard time cap is actually required.
5. **This deliverable is a director-ready production package, not a rendered video file.**
   Per the explicit, recorded decision at the start of this session (the user selected "Full
   production package, no final MP4" when asked how to handle a hard tooling gap — no
   `ffmpeg`, no professional text-to-speech engine, no motion-graphics/compositing tool, and no
   licensed music library are available in this environment), `video-01-risk-assessment-approval.mp4`
   does not exist. Every other required document (`narration-script.md`, `subtitles.srt`,
   `chapters.md`, `timeline.md`, `scene-list.md`, `asset-inventory.md`, `recording-log.md`,
   `source-workflow.md`, this file) was produced in full, at production quality, together with
   real 1920×1080 screenshots of the actual running prototype. See `asset-inventory.md` for the
   complete accounting of what exists versus what a future assembly pass still needs to
   produce, and why.
6. **Subtitle timing is a disciplined estimate, not a measurement.** `subtitles.srt` was timed
   by allocating each narration cue's script text proportionally across that cue's
   `timeline.md`-defined video window (word-count-weighted, snapped to land exactly on each
   cue's known start/end second) — internally consistent with the rest of this package's
   timing model, but necessarily approximate until a real narrator's recorded track exists to
   re-time against.

## Traceability

- **Workflow executed**: L1-01, `docs/19-roadmap/01-demonstration-workflow-catalogue.md` §4.1.
- **Journey followed**: `prototype/docs/user-journeys.md` §1.
- **Specification exercised**: `docs/10-risk/01-enterprise-risk-management.md` (governed
  `REASSESSMENT` action).
- **Prototype build exercised**: `prototype/` as of 2026-08-06, unmodified.
- **Prior deliverable cross-checked**: `demos/deck-01-risk-assessment-approval/`.

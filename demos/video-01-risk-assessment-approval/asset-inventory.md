# Asset Inventory — Demonstration Video 01: Risk Assessment Approval

Full accounting of every file this package was asked to produce: what exists, what doesn't,
and why. This file is the single place to check "is this deliverable actually finished."

## Produced

| Required output | Status | Notes |
|---|---|---|
| `narration-script.md` | **Produced** | Full voice-over script, all 10 chapters + intro + ending, cue-timed. |
| `subtitles.srt` | **Produced** | 169 cues, SRT format, timed against `timeline.md`'s video timestamps. |
| `chapters.md` | **Produced** | 10 chapter cards + closing card, reconciled timestamps. |
| `timeline.md` | **Produced** | Authoritative master timeline (cards + narration + screens). |
| `scene-list.md` | **Produced** | Shot-by-shot camera/callout/transition direction, 33 scenes. |
| `asset-inventory.md` | **Produced** | This file. |
| `recording-log.md` | **Produced** | How the screenshots were actually captured. |
| `observations.md` | **Produced** | Defects/gaps/inconsistencies log (none found) plus production notes. |
| `source-workflow.md` | **Produced** | Grounding of every claim in the package to a spec/prototype source. |
| `screenshots/` | **Produced** | 8 PNGs, 1920×1080, real captures of the running prototype. |
| `video-01-risk-assessment-approval.mp4` | **Not produced** | See "Not produced" below. |
| `audio/` | **Not produced (directory present, empty of audio)** | See below. |
| `project/` | **Not produced (directory present, empty of an editor project file)** | See below. |

## Screenshots

All 8 in `screenshots/`, 1920×1080 PNG, captured 2026-08-06 against the running `prototype/`
(see `recording-log.md` for method). Filenames match `deck-01-risk-assessment-approval`'s own
naming convention for the same workflow, for cross-deliverable consistency:

| File | Business state captured | Used in |
|---|---|---|
| `00-login-persona-picker.png` | Persona picker, pre-sign-in | Chapter 3 |
| `01-risk-register-list.png` | Risk Register list, RSK-2026-0004 visible | Chapter 4 |
| `02-risk-detail-active.png` | RSK-2026-0004 detail, ACTIVE, all 4 maker actions available | Chapters 4–5 |
| `03-reassessment-justification-dialog.png` | "Submit Re-assessment" dialog, justification entered | Chapters 5–6 |
| `04-risk-under-review-pending.png` | ACTIVE → UNDER_REVIEW, GOV-07 badge, buttons withdrawn | Chapters 6–7 |
| `05-checker-queue-pending-item.png` | Checker Queue, new item at top of Priya's queue | Chapter 7–8 |
| `06-approve-decision-dialog.png` | "Approve action" dialog, decision comment entered | Chapter 8 |
| `07-risk-detail-approved-decision-history.png` | UNDER_REVIEW → ACTIVE, full decision history | Chapters 9–10 |

`07-*.png` is deliberately reused across Chapters 9 and 10 rather than recaptured — the
underlying business state does not change between those two chapters (see `timeline.md`
"Screenshot reuse"), consistent with the brief's own "reuse screenshots only where appropriate"
instruction.

## Not produced, and why

This session opened with an explicit tooling-gap disclosure and a recorded user decision (see
`observations.md` item 5) before any production work began. The environment available for this
session has no:

- **Video encoder** — no `ffmpeg` (or equivalent) installed, so there is no way to composite
  screenshots, motion graphics, narration audio, and music into an actual H.264/AAC MP4
  container.
- **Professional text-to-speech or voice talent** — no TTS engine wired into this session's
  tools capable of "experienced enterprise product trainer" quality narration. (Windows'
  built-in SAPI voice was identified as a fallback and explicitly declined in favor of not
  producing a lower-quality synthetic voice at all — see the session's initial scoping
  decision.)
- **Motion-graphics / compositing tool** — nothing equivalent to a video editor or animation
  engine to actually build the cursor spotlights, zooms, callout balloons, and transitions
  `scene-list.md` specifies.
- **Licensed background music** — no music library this session is authorized to draw from;
  the brief's "subtle professional background music" requirement cannot be fulfilled without
  either a licensed source or original composition, neither available here.

Given that gap, producing `video-01-risk-assessment-approval.mp4` was not attempted — doing so
would have meant either fabricating a lower-quality artifact (e.g., a plain slideshow-with-TTS
video) and presenting it as meeting the brief's explicit "not merely a screen recording,"
"executive-quality," "SAP/Salesforce-comparable" bar, or silently omitting the file. Neither is
acceptable; instead, every planning and script document a video editor or voice-over artist
would need to actually produce that file was completed in full. `audio/` and `project/` are
present as directories (per the brief's required output structure) with a short `README.md`
in each explaining what belongs there once recording/assembly tooling is available — see those
files directly.

## Traceability

- **Business Requirement**: Give an honest, complete accounting of deliverable status rather
  than an implicit claim that everything listed in the original brief was produced.
- **Regulatory Requirement**: None.
- **PRSMTD Capability**: None.
- **ERM Capability**: N/A.
- **Dependencies**: All other files in this directory.
- **Future Work**: Record narration against `narration-script.md`; assemble
  `video-01-risk-assessment-approval.mp4` per `scene-list.md` and `timeline.md` using a real
  video-editing/compositing tool once available; re-time `subtitles.srt` against the actual
  recorded track.

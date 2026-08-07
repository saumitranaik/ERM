# Asset Inventory — Demonstration Video 01: Risk Assessment Approval

Full accounting of every file this package was asked to produce: what exists, what doesn't,
and why. This file is the single place to check "is this deliverable actually finished."

## Produced

| Required output | Status | Notes |
|---|---|---|
| `narration-script.md` | **Produced** | Full voice-over script, all 10 chapters + intro + ending, cue-timed. Reference document — not spoken in Version 1 (see below). |
| `subtitles.srt` | **Produced** | 169 cues, SRT format, timed against `timeline.md`'s video timestamps. Burned into the rendered MP4. |
| `chapters.md` | **Produced** | 10 chapter cards + closing card, reconciled timestamps. |
| `timeline.md` | **Produced** | Authoritative master timeline (cards + narration + screens). |
| `scene-list.md` | **Produced** | Shot-by-shot camera/callout/transition direction, 33 scenes. |
| `asset-inventory.md` | **Produced** | This file. |
| `recording-log.md` | **Produced** | How the screenshots were captured, and (Session 26) how the MP4 was rendered. |
| `observations.md` | **Produced** | Defects/gaps/inconsistencies log (none found) plus production notes. |
| `source-workflow.md` | **Produced** | Grounding of every claim in the package to a spec/prototype source. |
| `screenshots/` | **Produced** | 8 PNGs, 1920×1080, real captures of the running prototype. |
| `video-01-risk-assessment-approval.mp4` | **Produced — Version 1 (Silent Demonstration)** | See "Version 1 (Silent Demonstration)" below. |
| `audio/` | **Not produced (directory present, empty of audio)** | By design for Version 1 — see `audio/README.md`. |
| `project/` | **Produced** | `render_pipeline.py`, the Python/ffmpeg compositing pipeline that rendered the MP4 — see `project/README.md`. |

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

## Version 1 (Silent Demonstration)

**Session 23** (2026-08-06) produced every document above except the MP4 itself, and disclosed
a hard tooling gap that blocked rendering at that time: no video encoder, no professional
text-to-speech/voice-talent resource, no motion-graphics/compositing tool, and no licensed
music source were available in that session's environment. The user's recorded decision at that
time was "full production package, no final MP4" rather than fabricating a lower-quality
artifact.

**Session 26** (2026-08-07) revisited that gap. A portable static `ffmpeg` build was obtained
(no admin rights required — see `recording-log.md`), and a Python/Pillow compositing pipeline
(`project/render_pipeline.py`) was written to perform the same role a dedicated video-editing
tool would have: zoom/pan camera moves, a cursor spotlight, callout balloons, chapter cards,
concept plates, cross-fade/hard-cut transitions, and burned-in subtitles, all driven directly by
this package's own `scene-list.md` / `timeline.md` / `chapters.md` / `subtitles.srt`.

Two constraints were **not** resolved and define this as "Version 1 (Silent Demonstration)"
rather than the originally-briefed fully-narrated video:

- **No narration.** No professional voice-over resource exists in this environment, and Windows'
  built-in SAPI voice was again explicitly declined as a substitute (same reasoning as Session
  23: it would not meet an "experienced enterprise product trainer" quality bar). The user's
  instruction for this session was explicit: render a *silent* version, with `narration-script.md`
  retained as the recording brief for a future real voice-over pass. Burned-in subtitles
  (`subtitles.srt`) carry the narration content in the interim.
- **No background music.** No licensed or royalty-free music file was available locally, and
  the user's instruction for this session explicitly prohibited downloading or synthesizing one
  as a substitute. The video is silent except for its (silent) AAC audio track, present only for
  container/player compatibility.

The rendering pipeline is explicitly narration-ready: supplying a real `narration.wav`/`.mp3` to
`render_pipeline.py --narration` re-renders the identical visual program with that track muxed
in, and `--music` mixes in a real music bed at low volume — no change to any other file in this
package is required. See `project/README.md`.

**Rendered file**: `video-01-risk-assessment-approval.mp4` — H.264, 1920×1080, 30fps, yuv420p,
AAC 48kHz stereo (silent), duration 16:55 (1015.00s, matching `timeline.md` exactly), ~50MB.

## Traceability

- **Business Requirement**: Give an honest, complete accounting of deliverable status rather
  than an implicit claim that everything listed in the original brief was produced.
- **Regulatory Requirement**: None.
- **PRSMTD Capability**: None.
- **ERM Capability**: N/A.
- **Dependencies**: All other files in this directory.
- **Future Work**: Record real narration against `narration-script.md` and re-render with
  `project/render_pipeline.py --narration <track>` (and `--music <bed>` once a licensed source
  is available) to produce a fully-narrated Version 2, per the original brief. No visual asset,
  timeline, or subtitle change is expected to be required.

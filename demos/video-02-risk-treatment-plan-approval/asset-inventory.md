# Asset Inventory — Demonstration Video 02: Risk Treatment Plan Approval

Full accounting of every file this package was asked to produce: what exists, what doesn't, and
why. This file is the single place to check "is this deliverable actually finished."

## Produced

| Required output | Status | Notes |
|---|---|---|
| `narration-script.md` | **Produced** | Full voice-over script, all 10 chapters + intro + ending, cue-timed. Reference document — not spoken in Version 1 (see below). |
| `subtitles.srt` | **Produced** | 108 cues, SRT format, timed against `timeline.md`'s video timestamps. Burned into the rendered MP4. |
| `chapters.md` | **Produced** | 10 chapter cards + closing card, reconciled timestamps. |
| `timeline.md` | **Produced** | Authoritative master timeline (cards + narration + screens). |
| `scene-list.md` | **Produced** | Shot-by-shot camera/callout/transition direction, 21 scenes (incl. 2 hard cuts). |
| `asset-inventory.md` | **Produced** | This file. |
| `recording-log.md` | **Produced** | How the screenshots were captured and how the MP4 was rendered. |
| `observations.md` | **Produced** | Defects/gaps/inconsistencies log (none found) plus production notes. |
| `source-workflow.md` | **Produced** | Grounding of every claim in the package to a spec/prototype source. |
| `screenshots/` | **Produced** | 11 PNGs, 1920×1080 — 2 reused verbatim from Video 01, 9 newly captured against the running prototype. |
| `video-02-risk-treatment-plan-approval.mp4` | **Produced — Version 1 (Silent Demonstration)** | See "Version 1 (Silent Demonstration)" below. |
| `audio/` | **Not produced (directory present, empty of audio)** | By design for Version 1 — see `audio/README.md`. |
| `project/` | **Produced** | `render_pipeline.py` (imports Video 01's primitives) + `README.md` — see `project/README.md`. |

## Screenshots

All 11 in `screenshots/`, 1920×1080 PNG. `00` and `01` are reused verbatim from Video 01 (same
files, renumbered); `02`–`10` were newly captured 2026-08-07 against the running `prototype/`
(see `recording-log.md` for method).

| File | Business state captured | Used in | Source |
|---|---|---|---|
| `00-login-persona-picker.png` | Persona picker, pre-sign-in | Chapter 3 | Reused from Video 01's `00-login-persona-picker.png` |
| `01-risk-detail-active.png` | RSK-2026-0004 detail, ACTIVE, all 4 maker actions available | Chapter 4 | Reused from Video 01's `02-risk-detail-active.png` |
| `02-risk-relationships-no-treatment-plan.png` | Relationships tab, Treatment Plans: 0, Linked Controls: 1 | Chapter 4 | New capture |
| `03-new-treatment-plan-form.png` | New Treatment Plan form, filled, pre-submit | Chapter 5 | New capture |
| `04-treatment-plan-proposed.png` | TRT-2026-0009 created, status PROPOSED | Chapter 5 | New capture |
| `05-submit-justification-dialog.png` | "Submit for Approval" dialog, justification entered | Chapter 6 | New capture |
| `06-treatment-plan-awaiting-checker.png` | PROPOSED + "Awaiting checker" badge, action bar withdrawn | Chapters 6–7 | New capture |
| `07-checker-queue-pending-item.png` | Checker Queue, new item at top of Priya's queue | Chapters 7–8 | New capture |
| `08-approve-decision-dialog.png` | "Approve action" dialog, decision comment entered | Chapter 8 | New capture |
| `09-treatment-plan-approved-decision-history.png` | PROPOSED → APPROVED, full decision history | Chapter 9 | New capture |
| `10-risk-relationships-treatment-plan-linked.png` | Risk's own Relationships tab, Treatment Plans: 1, APPROVED | Chapter 10 | New capture |

`06-*.png` and `07-*.png` are each held across two adjacent chapters rather than recaptured —
the underlying business state does not change between them (see `timeline.md` "Screenshot
reuse"), the same within-video reuse pattern Video 01 established.

## Version 1 (Silent Demonstration)

This session produced every document above, including a full render, in a single pass — unlike
Video 01, which split Stage 1–7/9 (Session 23) from Stage 8 rendering (Session 26) across two
sessions. The same standing tooling gap Video 01 disclosed still applies and was re-confirmed
directly (framework §17 standing disclosure protocol, not assumed): no professional
text-to-speech/voice-talent resource meeting the framework §14 quality bar, and no licensed
background music source, are available in this environment. Per this session's own explicit
instruction ("Produce a silent Version 1 video unless the manifest specifies otherwise"), no
narration or music was fabricated or substituted with a lower-quality alternative — the same
disclosed, non-negotiable standard Video 01 already established (framework §2 rule 3).

**What made rendering possible in the same session** (rather than needing a second session, as
Video 01 required): the portable `ffmpeg` build Video 01's Session 26 obtained was still present
and working on this machine, and this package's own `project/render_pipeline.py` reuses Video
01's already-hardened compositing primitives (fonts, gradients, callouts, spotlight, zoom/pan,
pulse rings, chapter cards, concept-plate helpers, subtitle burn-in) via direct Python import,
rather than re-implementing or re-debugging them — see `recording-log.md` "Rendering pass" for
the full account, including why no rendering-pipeline defects surfaced at the preview-validation
stage this time (Video 01's own two defects were already fixed in the primitives being reused).

**Rendered file**: `video-02-risk-treatment-plan-approval.mp4` — H.264, 1920×1080, 30fps,
yuv420p, AAC 48kHz stereo (silent), duration 6:47 (407.00s, matching `timeline.md` exactly),
~23.2MB.

The rendering pipeline is explicitly narration-ready, inherited from Video 01's own design:
supplying a real `narration.wav`/`.mp3` to `render_pipeline.py --narration` re-renders the
identical visual program with that track muxed in, and `--music` mixes in a real music bed at
low volume — no change to any other file in this package is required. See `project/README.md`.
Per `demos/video-production-manifest.md` §18, a real voice-over pipeline should be applied to
Video 01 first (the series' original durable silent baseline) before being used for a new
video's first version — this package's own narration remains future work for that same reason,
not a gap specific to Video 02.

## Traceability

- **Business Requirement**: Give an honest, complete accounting of deliverable status rather
  than an implicit claim that everything listed in the original brief was produced.
- **Regulatory Requirement**: None.
- **PRSMTD Capability**: None.
- **ERM Capability**: N/A.
- **Dependencies**: All other files in this directory;
  `demos/video-01-risk-assessment-approval/` (reused screenshots and imported render pipeline).
- **Future Work**: Record real narration against `narration-script.md` and re-render with
  `project/render_pipeline.py --narration <track>` (and `--music <bed>` once a licensed source
  is available) to produce a fully-narrated Version 2, per the manifest's own series-wide
  narration strategy (§18) — Video 01 first, then this video. No visual asset, timeline, or
  subtitle change is expected to be required.

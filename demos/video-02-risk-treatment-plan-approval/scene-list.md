# Scene List — Demonstration Video 02: Risk Treatment Plan Approval

Shot-by-shot visual direction for an editor assembling the final video from the captured
screenshots (`screenshots/`) and the chapter cards (`chapters.md`). Every scene lists its
source frame, camera/motion treatment, callouts, and transition in/out. Visual language is
identical to Video 01's — nothing below introduces a one-off treatment (framework §3 "one
system, not a patchwork").

**Visual language, held constant across the whole series** (framework §3–§11, unchanged from
Video 01): callout balloons are a single accent color (`#F5A623`) with a 2px rounded-rect
border; the cursor spotlight is a soft 120px radial dim-everything-else vignette that follows
the (virtual) pointer, appearing only when narration is actively directing attention to
something specific; zooms ease in/out over 400ms and never exceed 1.6× source resolution
(source frames are already 1920×1080); section transitions are a 400ms cross-fade through 10%
black, except the two scenes below that call for a hard cut to convey an instantaneous governed
state change (framework §8).

---

## Chapter 1 — Introduction

**Scene 1** (0:03–0:29) — Title plate, not a screenshot. Platform wordmark centered, subtitle
fades in 0.5s after title. Slow 20px upward drift over the full duration (framework §6 "slow
drift, title/opening plate only"). No cursor.

## Chapter 2 — RISK Module Overview

**Scene 2** (0:32–1:05) — One concept plate (not a screenshot): a condensed version of Video
01's risk-register-row diagram, now with a small "✓ seen in Demonstration 01" tag in the
corner and the Submit → Review → Approve strip motif shown briefly alongside it — a compressed
callback rather than the five-plate build-up Video 01 used for the same concept, appropriate
to a shortened second-appearance chapter (framework §13). Static hold with only its own
fade-in; no cursor, no zoom.

## Chapter 3 — Meet the Personas

**Scene 3** (1:08–1:20) — `00-login-persona-picker.png` (reused from Video 01, see
`timeline.md`), full-frame, static. Cursor spotlight arrives on the "Arjun Mehta" row 2s before
a callout balloon animates in: "Arjun Mehta · Risk Manager · Maker, again." No zoom — a single
static callout is enough for a reminder beat, unlike Video 01's slower zoom-and-pan
introduction.

**Scene 4** (1:20–1:30) — Same frame. Spotlight and callout retarget to "Priya Raghunathan":
"Priya Raghunathan · Chief Risk Officer · Checker, again." Cross-fade (400ms) out to Chapter
4's card.

## Chapter 4 — Reviewing the Risk

**Scene 5** (1:33–1:57) — `01-risk-detail-active.png` (reused from Video 01, see
`timeline.md`), full-frame. Cursor spotlight sweeps across Status / Inherent Score / Residual
Score / Linked Control as each is named, matching Video 01's "look at all the options" pacing
(framework §10) — no zoom, since narration is enumerating, not isolating.

**Scene 6** (1:57–2:15) — Cross-fade to `02-risk-relationships-no-treatment-plan.png`. Zoom in
(1.0×→1.25×) on the "Treatment Plans — 0 — No linked records" panel as it's named. Callout:
"Zero treatment plans — nothing is being done about this risk yet." Cursor spotlight leads the
callout by 2s, per the standing rule (framework §7).

## Chapter 5 — Proposing a Treatment Plan

**Scene 7** (2:18–2:40) — Cross-fade to `03-new-treatment-plan-form.png`. Cursor spotlight
sweeps down the filled form fields in order (Title, Risk, Strategy, Owner, Target Residual
Score, Due Date) as each is named in narration — a "look at all the options" beat, static
zoom at 1.0×.

**Scene 8** (2:40–3:00) — Cursor "clicks" (150ms scale-pulse, the series' standard
click-affordance) Create Treatment Plan; cross-fade (400ms — not a hard cut, since this is a
draft creation, not yet a governed action) to `04-treatment-plan-proposed.png`. Callout points
at the "Proposed" status badge and the three-button action bar in sequence: "Edit," "Submit for
Approval," "Cancel."

## Chapter 6 — Submitting for Approval

**Scene 9** (3:03–3:23) — Cursor "clicks" Submit for Approval on
`04-treatment-plan-proposed.png`; cross-fade to `05-submit-justification-dialog.png`. Zoom in
(1.0×→1.2×) on the justification textarea as it's discussed. Callout on the mandatory
"Justification *" label — a direct visual callback to Video 01's own equivalent callout
(same style, same wording pattern), reinforcing that this is the identical governed-action
mechanic in a new context.

**Scene 10** (3:23–3:41) — Cursor "clicks" Submit for approval on the dialog; **hard cut**
(the video's first of two — an actual instantaneous governed-state change, matching the
series' reserved-hard-cut rule, framework §8) to `06-treatment-plan-awaiting-checker.png`. The
"Awaiting checker" badge area gets the standard 600ms highlight-ring pulse the instant the cut
lands. Callout: "GOV-07 — one pending action per record," then a small fading "✕ ghost marker"
over the now-empty action-bar space, matching Video 01's Scene 18 treatment exactly.

## Chapter 7 — Governance Review

**Scene 11** (3:44–4:09) — Same frame (`06-treatment-plan-awaiting-checker.png`), static hold,
no cursor, no zoom, no callout — the video's one deliberate "governance pause" beat (framework
§9), shorter than Video 01's own two-scene pause-then-concept-plate treatment since this
chapter's explanation is condensed (see `narration-script.md`).

**Scene 12** (4:09–4:24) — Cut to the persona-switcher dropdown (same UI-detail treatment as
Video 01 Scene 22 — an honest adaptation anchored at the real user-menu coordinates, not a
fabricated screen; flagged again here per `observations.md`, since it was never separately
screenshotted in this pass either). Cursor "clicks" Priya's row; brief highlight flash. Cross-
fade to `07-checker-queue-pending-item.png`. Callout on the top card: "New submission — arrived
at top of queue. 6 other items already pending."

## Chapter 8 — Checker Approval

**Scene 13** (4:27–4:37) — Same frame, held. Cursor spotlight sweeps across Approve / Reject /
Return for rework, matching Scene 3's "look at all the options" pacing.

**Scene 14** (4:37–4:50) — Cursor "clicks" Approve; cross-fade to
`08-approve-decision-dialog.png`. Zoom in (1.0×→1.2×) on the comment textarea. Callout on
"Comment (optional)," a callback to Scene 9's mandatory-justification callout, contrasting the
two field types exactly as Video 01's Scene 25 did.

**Scene 15** (4:50–5:03) — Cursor "clicks" Confirm approve; standard click-pulse, then the
video's **second and final hard cut** (instantaneous governed-state change, matching Scene
10's rule) toward Chapter 9's opening frame.

## Chapter 9 — Audit Trail

**Scene 16** (5:06–5:29) — `09-treatment-plan-approved-decision-history.png`, full-frame,
zoomed to 1.15× on the Approvals-tab decision card. Callout balloons animate in sequentially:
"Maker: Arjun Mehta," then "Checker: Priya Raghunathan," each with its timestamp underlined —
identical treatment to Video 01's Scene 27.

## Chapter 10 — Final Business Outcome

**Scene 17** (5:32–5:46) — Cross-fade to `10-risk-relationships-treatment-plan-linked.png`.
Zoom in (1.0×→1.3×) on the "Treatment Plans — 1" row showing TRT-2026-0009. Callout: "From
zero to one — governed, approved, on the record."

**Scene 18** (5:46–6:05) — Same frame, zoom eases back to 1.0× (full frame), symmetrical
book-end with Scene 6's opening zoom-in on this same relation panel, mirroring Video 01's own
Scene 12/Scene 30 symmetry convention (framework §9 "symmetric zoom-out bookend"). Static hold
through the "prove it, not just say it" line.

## Ending

**Scene 19** (6:05–6:27) — Concept plate: a simple two-box diagram — "Risk Assessment (Demo 01)"
and "Risk Treatment (Demo 02)" — both feeding into the identical Submit → Review → Approve
strip motif, visually showing one ledger serving two different decision types.

**Scene 20** (6:27–6:42) — Concept plate: "ERM Demonstration Series" with Videos 01–02 marked
complete and a short greyed-out preview list (Risk Acceptance, KRI Breach → Escalation
Acknowledgement, Control Test Execution & Result Capture) — matching exactly the workflows
named in the narration and scheduled next by `demos/video-production-manifest.md` §25, no
others invented.

**Closing card** (6:42–6:47) — "Thank You." Standard chapter-card treatment, held 5s, fade to
black.

## Cross-cutting rules applied throughout

- **Cursor spotlight** appears only when narration is actively directing attention to a
  specific control (never during concept plates, never during static holds) — Scene 11 is the
  video's one fully inert shot for exactly this reason.
- **Zoom** never exceeds 1.6× native resolution and always eases in/out over 400ms; no snap
  zooms anywhere in the video.
- **Hard cuts** are reserved exclusively for the two moments that represent an actual
  instantaneous governed-state change (Scenes 10 and 15) — everywhere else uses the standard
  400ms cross-fade, preserving the series-wide learned signal Video 01 established.
- **Callouts** never stack more than one at a time and always fade out before the next one
  fades in.

## Traceability

- **Business Requirement**: Give an editor exact, consistent visual direction so the finished
  video reads as one polished system rather than a loosely narrated screen recording, and reads
  as the same system Video 01 already established.
- **Regulatory Requirement**: None.
- **PRSMTD Capability**: None — production planning document.
- **ERM Capability**: N/A.
- **Dependencies**: `timeline.md`, `narration-script.md`, `screenshots/`.
- **Future Work**: Actual assembly requires the same compositing pipeline Video 01 used
  (`demos/video-01-risk-assessment-approval/project/render_pipeline.py`) — see
  `recording-log.md` for how this package adapted it.

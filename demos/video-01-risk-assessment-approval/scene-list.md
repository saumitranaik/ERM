# Scene List — Demonstration Video 01: Risk Assessment Approval

Shot-by-shot visual direction for an editor assembling the final video from the captured
screenshots (`screenshots/`) and the chapter cards (`chapters.md`). Every scene lists its
source frame, camera/motion treatment, callouts, and transition in/out. Effects are used only
where they aid understanding, per the brief's "avoid distracting animations" instruction —
several scenes below are deliberately static holds.

**Visual language, held constant across the whole video** (so it reads as one system, not a
patchwork): callout balloons are a single accent color with a 2px rounded-rect border; the
cursor spotlight is a soft 120px radial dim-everything-else vignette that follows the (virtual)
pointer; zooms ease in/out over 400ms and never exceed 1.6× source resolution (source frames
are already 1920×1080, so any zoom stays within native pixel resolution — no upscaling
softness); section transitions are a 400ms cross-fade through 10% black, never a hard cut,
except where a scene explicitly calls for a hard cut to convey an instantaneous state change.

---

## Chapter 1 — Introduction

**Scene 1** (0:03–0:23) — Title plate, not a screenshot. Platform wordmark centered, subtitle
fades in 0.5s after title. Slow 20px upward drift on the whole plate over the full 20s (barely
perceptible — avoids a static, dead-feeling cold open without being distracting). No cursor.

## Chapter 2 — Enterprise Risk Management Overview

**Scenes 2–6** (0:26–2:44) — Five concept plates, not screenshots (see `timeline.md`
"Concept plates" note): (2) a single risk-register row diagram labeled Risk → Owner →
Category → Score → Review Date; (3) the same diagram with a "single source of truth" badge
overlay; (4) a two-box diagram, "Maker proposes" / "Checker decides", connected by a locked
padlock icon; (5) a two-layer stack diagram, PRSMTD (governance ledger, RBAC, multi-tenancy)
beneath ERM (Risk / Controls / Compliance / Audit / Policy / Incident / Third-Party Risk / …);
(6) a simple 3-icon workflow strip — Submit → Review → Approve — that will recur as a
recognizable motif at each governance beat later in the video. Each plate is a static hold with
only its own fade-in; no cursor, no zoom — this chapter is conceptual, not on-screen action.

## Chapter 3 — Meet the Personas

**Scene 7** (2:47–3:17) — `00-login-persona-picker.png`, full-frame, static. Lower-third badge
fades in: "Meridian Asset Management Ltd. — SEBI-regulated Mutual Fund AMC (illustrative)."

**Scene 8** (3:17–3:47) — Same frame. Slow zoom (1.0×→1.15× over 30s) toward the "Arjun Mehta"
row in the persona list. At 3:24, a callout balloon animates in from the row, pointing at
Arjun's name: "Arjun Mehta · Risk Manager · Maker." Cursor spotlight follows the zoom target,
arriving on the row 2s before the callout appears (spotlight leads callout, never the reverse).

**Scene 9** (3:47–4:17) — Same frame, continued slow zoom retargets to the "Priya Raghunathan"
row (1.15×→1.15×, pan only, no further scale change). Callout balloon: "Priya Raghunathan ·
Chief Risk Officer · Checker." Cursor spotlight pans with it.

**Scene 10** (4:17–4:35) — Zoom eases back out to 1.0× (full frame). Two small role-tag chips
("Risk Management dept.") animate onto both rows simultaneously to visually reinforce "same
department, different roles." Fade to black transition out (400ms) into Chapter 4's card.

## Chapter 4 — Reviewing Existing Risks

**Scene 11** (4:38–5:08) — `01-risk-register-list.png`, full-frame. Slow pan left-to-right
across the table header row (Code / Title / Category / Status / Inherent / Residual) as each
column is named in narration; a thin highlight underline sweeps under each header in sync.

**Scene 12** (5:08–5:48) — Same frame. Cursor spotlight moves to the RSK-2026-0004 row; zoom in
(1.0×→1.3×) centered on that row over 1.5s, then hard cut to `02-risk-detail-active.png`
(this is the one intentional hard cut in the chapter — it represents an actual navigation
click, not a continuous camera move, and a cross-fade here would misleadingly imply the two
frames are the same screen). Callout balloons animate in sequentially, each pointing at one
field: Status: Active, Inherent Score: 10, Residual Score: 8.

**Scene 13** (5:48–6:18) — Same frame (`02-risk-detail-active.png`). Cursor spotlight sweeps
across the four action buttons left to right (Submit Re-assessment, Escalate, Propose Risk
Acceptance, Propose Retirement) as they're named. Zoom holds at 1.0× — this is a "look at all
the options" beat, not a "look at one thing" beat, so no scale change.

## Chapter 5 — Updating the Risk Assessment

**Scene 14** (6:21–6:51) — `02-risk-detail-active.png`, held. Callout balloon points at
"Last Assessed: 18 Jun 2026" and "Next Review Due: 18 Sept 2026" fields in sequence.

**Scene 15** (6:51–7:21) — Cursor moves to and "clicks" (a brief 150ms scale-pulse on the
button, the video's standard click-affordance treatment used consistently at every button
press in the video) Submit Re-assessment; cross-fade (400ms) to
`03-reassessment-justification-dialog.png`. Callout points at the warning banner: "Governed
action — no further changes until a checker decides."

**Scene 16** (7:21–7:51) — Same frame, zoom in (1.0×→1.25×) on the justification textarea.
Callout points at the asterisked "Justification *" label: "Mandatory — this is the record an
auditor will read."

## Chapter 6 — Submitting for Approval

**Scene 17** (7:54–8:12) — Cursor "clicks" Submit for approval on
`03-reassessment-justification-dialog.png`; hard cut (instantaneous state change, not a
navigation — matches the actual UI behavior of the dialog closing and the status badge
updating in place) to `04-risk-under-review-pending.png`. Status badge area is ringed with a
brief animated highlight rectangle (600ms pulse) the instant the cut lands, drawing the eye
straight to "Active → Under Review."

**Scene 18** (8:12–8:52) — Same frame. Callout balloon on the "Awaiting checker" badge: "GOV-07
— one pending action per record." Cursor spotlight then moves to where the four action buttons
used to be (now empty space) with a small animated "✕" ghost marker fading in and out once,
visually reinforcing "these are gone now."

**Scene 19** (8:52–9:06) — Same frame, static hold, no further motion — a deliberate breath
before the governance-review pause begins in Chapter 7.

## Chapter 7 — Governance Review

**Scene 20** (9:09–9:21) — Same frame (`04-risk-under-review-pending.png`), completely static,
no cursor, no zoom, no callout. This is the video's one fully inert shot — matching the
narration's own instruction to "pause briefly" before the governance explanation. Held plain.

**Scene 21** (9:21–10:09) — Cut to a concept plate (not a screenshot): the same Submit → Review
→ Approve strip motif from Scene 6, now with a padlock icon over the arrow between "Submit" and
"Approve," and small "✕ same person" annotation crossed out beside it. Static hold.

**Scene 22** (10:09–10:39) — Cut to the persona-switcher dropdown, captured as a UI detail
within the app chrome (the dropdown itself, opened, showing "Switch persona (demo)" and the
Priya Raghunathan row with a checkmark being selected). Cursor "clicks" Priya's row; brief
highlight flash confirms the switch. Header name/role text is called out changing from "Arjun
Mehta · Risk Manager" to "Priya Raghunathan · Chief Risk Officer."

**Scene 23** (10:39–11:21) — Cross-fade to `05-checker-queue-pending-item.png`. Slow zoom
(1.0×→1.2×) toward the top card (the new submission). Callout: "New submission — arrived at
top of queue." A second, smaller callout gestures (without zooming away from the main target)
at the queue-count badges lower in frame: "6 other items already pending — this queue is never
artificially emptied for a demo."

## Chapter 8 — Checker Approval

**Scene 24** (11:24–12:00) — Same frame, held on the top card. Cursor spotlight sweeps across
the three decision buttons (Approve / Reject / Return for rework) as each is named, matching
the Scene 13 treatment for consistency (same "look at all the options" pacing).

**Scene 25** (12:00–12:36) — Cursor "clicks" Approve; cross-fade to
`06-approve-decision-dialog.png`. Zoom in (1.0×→1.2×) on the comment textarea as the decision
comment is discussed. Callout on the "Comment (optional)" label distinguishing it from the
earlier mandatory justification field (a callback to Scene 16 — same visual callout style, so
the contrast reads instantly).

**Scene 26** (12:36–13:10) — Cursor "clicks" Confirm approve; the button gets the standard
click-pulse, then hard cut (instantaneous governed-state change, matching Scene 17's hard-cut
rule) toward Chapter 9's opening frame.

## Chapter 9 — Audit Trail

**Scene 27** (13:13–13:45) — `07-risk-detail-approved-decision-history.png`, full-frame,
zoomed to 1.15× on the Approvals-tab decision card. Callout balloons animate in sequentially:
"Maker: Arjun Mehta," then "Checker: Priya Raghunathan," each with its timestamp underlined.

**Scene 28** (13:45–14:21) — Same frame. Zoom eases further in (1.15×→1.35×) on the
justification/decision-comment text block as immutability is discussed. No new callout — the
zoom itself is the emphasis; adding a callout on top of two paragraphs of already-readable text
would be visual clutter the brief's "avoid distracting animations" guidance rules out.

## Chapter 10 — Final Business Outcome

**Scene 29** (14:24–14:56) — Cross-fade to the Overview tab of the same risk record (still
`07-risk-detail-approved-decision-history.png` reused per `timeline.md`; the editor should
frame this shot on the status badge / scoring panel region of that same capture rather than
re-crop the Approvals-tab region used in Scenes 27–28). Callout on the "Active" status badge
and the unchanged Inherent/Residual scores.

**Scene 30** (14:56–15:20) — Same frame, zoom eases back to 1.0× (full frame, symmetrical
book-end with Scene 12's opening zoom-in on this same record). Static hold through the "prove
it, not just say it" line.

## Ending

**Scene 31** (15:20–15:54) — Concept plate: the Submit → Review → Approve motif one final time,
now with small icons branching off it labeled Controls / Compliance / Audit / Policy / Incident
/ Third-Party Risk, visually showing the one pattern feeding many modules.

**Scene 32** (15:54–16:26) — Concept plate: a simple two-column list, left "Audience" (Board,
CRO, CISO, Compliance, Implementation Team) right "Value" (assurance, defensible control,
one engine to build once), each row fading in as its persona is named in narration.

**Scene 33** (16:26–16:50) — Concept plate: "ERM Demonstration Series" with Video 01 marked
complete and a short greyed-out preview list (Control Exception Handling, Compliance
Assessment Approval, Audit Finding Closure) — matching exactly the three workflows named in the
narration, no others invented.

**Closing card** (16:50–16:55) — "Thank You." Standard chapter-card treatment, held 5s, fade
to black.

## Cross-cutting rules applied throughout

- **Cursor spotlight** appears only when narration is actively directing attention to a
  specific control (never during concept plates, never during static holds).
- **Zoom** never exceeds 1.6× native resolution and always eases in/out over 400ms; no snap
  zooms anywhere in the video.
- **Hard cuts** are reserved exclusively for the two moments that represent an actual
  instantaneous governed-state change (Scenes 17 and 26) — everywhere else uses the standard
  400ms cross-fade, so a hard cut itself becomes a learned visual signal for "the system just
  recorded something."
- **Callouts** never stack more than one at a time and always fade out before the next one
  fades in, per the brief's "avoid distracting animations" instruction.

## Traceability

- **Business Requirement**: Give an editor exact, consistent visual direction so the finished
  video reads as one polished system rather than a loosely narrated screen recording.
- **Regulatory Requirement**: None.
- **PRSMTD Capability**: None — production planning document.
- **ERM Capability**: N/A.
- **Dependencies**: `timeline.md`, `narration-script.md`, `screenshots/`.
- **Future Work**: Actual assembly requires a compositing/animation tool (see
  `asset-inventory.md`) — not yet available in this environment.

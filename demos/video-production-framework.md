# ERM Demonstration Video Production Framework

**Status**: Authored 2026-08-06 (Session 24). Infrastructure and process document — not a
business specification, not a PRSMTD artifact, not a video. Governs how future ERM
demonstration videos get produced so each one does not re-derive conventions Session 22
(`demos/deck-01-risk-assessment-approval/`) and Session 23
(`demos/video-01-risk-assessment-approval/`) already worked out and validated once.

## Purpose

Video 01 was produced as a bespoke, one-off effort: every naming choice, timing method, visual
rule, and honesty-about-tooling-gaps decision was made fresh, in-session, and recorded only in
that video's own companion documents. That was correct for a first attempt — there was no prior
art to reuse yet — but it does not scale to the 45 remaining workflows in
[`docs/19-roadmap/01-demonstration-workflow-catalogue.md`](../docs/19-roadmap/01-demonstration-workflow-catalogue.md).
This document extracts what Video 01 (and, where the pattern is shared, Deck 01) already proved
works, generalizes it into standards and reusable templates, and fixes the ambiguities Video 01
left implicit (an unnamed callout accent color, an undocumented directory contract, no QA
checklist) so any future session can produce Video 02 through Video 46 consistently, without
re-litigating decisions this document already settles.

## Scope

**In scope**: production standards, visual/narration/audio language, reusable templates,
directory and naming conventions, QA, versioning, defect logging, and governance for the video
medium specifically, generalized across the catalogue's four complexity tiers (L1–L4).

**Out of scope** (explicitly, per this session's instruction):

- Producing Demonstration Video 02 or any other video.
- Regenerating or modifying Video 01 or Deck 01.
- Modifying the prototype (`prototype/`) or any authoritative `docs/` specification.
- Modifying PRSMTD (read-only, per `CLAUDE.md`).
- Implementing any of the templates or tooling this document describes — every template below
  is a documented structure, not a built asset, script, or project file.
- The static-deck medium (`.pptx`). Deck 01 established its own lighter-weight, screenshot-only
  pattern (`screenshot-inventory.md`, `slide-workflow-mapping.md`,
  `defects-and-gaps-observed.md`); it is referenced here for continuity but not re-specified —
  a future session should write a companion `deck-production-framework.md` only if and when a
  second deck is actually commissioned, rather than speculatively now.

## How to use this document

Before starting work on any future ERM demonstration video: read this file in full, then the
target workflow's row in `docs/19-roadmap/01-demonstration-workflow-catalogue.md`, then
`prototype/docs/user-journeys.md` (if the workflow has a validated journey) or the relevant
module spec's state machine directly. Produce the standard package (§19) using the templates
(§25) and standards (§1–§24) below. Do not re-derive a naming convention, timing method, or
visual rule already fixed here — propose a change to this document instead (§21, §23) if one is
genuinely needed.

---

## 1. Video Production Architecture

The pipeline is nine stages, each producing one or more of the standard package's artifacts
(§19). Every stage after Stage 1 is grounded in the stage before it — nothing downstream
invents a claim, screen, or persona the upstream stage didn't already establish.

| Stage | Input | Output artifact(s) | Owner activity |
|---|---|---|---|
| 1. Selection | `docs/19-roadmap/01-demonstration-workflow-catalogue.md` row | — | Pick one catalogue workflow ID, respecting its dependency-matrix prerequisites (catalogue §5) |
| 2. Grounding | Catalogue row, module spec, `prototype/docs/user-journeys.md` (if validated) | `source-workflow.md` | Trace every claim, persona, and entity to a spec/prototype source before writing anything else |
| 3. Capture | Running `prototype/` (unmodified), grounded workflow steps | `screenshots/*.png` | Drive the prototype through its own UI only (Playwright), one screenshot per meaningful business-state transition |
| 4. Script | `source-workflow.md`, screenshots | `narration-script.md` | Write chapter-grouped, cue-numbered voice-over, grounded per cue |
| 5. Timing | `narration-script.md` | `chapters.md`, `timeline.md` | Apply the chapter-card offset method (§13) to produce the reconciled master timeline |
| 6. Visual direction | `timeline.md`, screenshots | `scene-list.md` | Apply the standing visual language (§3–§11) scene-by-scene |
| 7. Subtitling | `timeline.md`, `narration-script.md` | `subtitles.srt` | Word-count-weighted proportional cue allocation (§5) |
| 8. Assembly | All of the above, plus recorded narration/music once available | `audio/`, `project/`, `video-NN-<slug>.mp4` | Record narration, composite per `scene-list.md`, render per §17 — currently blocked (§17 tooling gap) |
| 9. QA & log | Everything produced | `observations.md`, `asset-inventory.md`, `docs/roadmap.md` update | Run the QA checklist (§16); log defects (§22); update the roadmap (§23) |

Stages 2–7 and 9 require no tooling beyond what this repository's sessions already have
(reading, writing, Playwright screenshot capture). Stage 8 is the only stage currently blocked
by an environment gap (§17); every other stage should be completed in full for every future
video regardless of whether Stage 8 can run yet, exactly as Video 01 did.

---

## 2. Production Standards

1. **Grounding-first, always.** No cue, screen, persona, or claim is written before
   `source-workflow.md` exists and cites its source. This is not a style preference — Video 01's
   own zero-defect, zero-inconsistency result came directly from this discipline, and Sessions
   21–23 all independently confirmed the catalogue and prototype agree when checked this way.
2. **Live capture only.** Screenshots are always captured from the actually-running,
   unmodified `prototype/`, driven through its own UI/routes — never mocked up, retouched, or
   composited from unrelated captures. `git status --short prototype/` must be empty before and
   after every capture pass (§16).
3. **No fabrication under schedule or tooling pressure.** If a required asset (voice talent,
   compositing tool, licensed music) is unavailable, disclose the gap and offer the user scoping
   options before producing anything — do not silently downgrade quality or invent a
   lower-quality substitute and present it as the deliverable. This is the standing protocol
   Session 23 improvised once; it is now a fixed rule (§17).
4. **Immutability once produced.** A published video package is not silently edited. A defect
   found later is a new dated entry in that package's own `observations.md`, and, if it requires
   a content change, a new numbered addendum — the same append-only discipline the platform's
   own governance ledger enforces for business data (`CLAUDE.md` capability inventory).
5. **Specification-first traceability.** Every substantive document in a video package ends
   with the `CLAUDE.md` Traceability block, exactly as Video 01's nine companion documents
   already do.
6. **PRSMTD and prototype are read-only.** No video production step edits either. Where a
   capture script needs tooling (e.g., Playwright), it is installed outside the repository
   (session scratchpad / user profile cache), never added to `prototype/package.json` or
   `prototype/node_modules` (Session 23's own precedent, §19).
7. **One workflow, one package.** A video package covers exactly one catalogue workflow ID
   (or, for L4-01, the explicit compilation the catalogue already scopes it as). Bundling
   multiple workflows into one video the way Deck production bundles module-foundation decks
   (catalogue §7) is out of scope for this framework unless a future revision explicitly extends
   it.

---

## 3. Visual Standards

One visual language across the entire series, declared once here and inherited by every video,
not re-derived per video the way Video 01 had to define it from scratch:

- **Resolution**: 1920×1080, matching the target render resolution — screenshots are captured
  at this resolution (§17) so zooms (§10) never upscale past native pixel detail.
- **Color**: the platform's own UI tokens are not repurposed for video overlays — the
  prototype's `--primary`/`--accent` tokens (`prototype/app/globals.css`) are a neutral
  application chrome palette, not designed for on-screen legibility over varied screenshot
  content. This framework defines a distinct, video-specific accent for callouts and highlight
  rings (§7) as a new standard, since no prior video-specific palette exists in either PRSMTD or
  the prototype (reuse-before-redesign check performed; nothing to reuse here).
- **Typography**: chapter cards and concept plates use one consistent title/subtitle type
  treatment across the series (title case for card text, sentence case for subtitles — matching
  `chapters.md`'s existing card-text convention) — a specific typeface is an assembly-tool
  decision (§8 tooling gap), not fixed here.
- **One system, not a patchwork.** Every rule in §3–§11 below applies uniformly to every video
  in the series. A future video should never introduce a one-off visual treatment without
  proposing it as a framework amendment first (§21).

---

## 4. Narration Standards

- **Tone**: experienced enterprise product trainer — warm, unhurried, confident; not a
  list-reader. Fixed across the series for narrator-voice continuity (§14).
- **Pace**: 150 words/minute (2.5 words/second), the industry-standard corporate voice-over
  estimation rate. Used for planning-stage timing only; re-time against the real recorded track
  once one exists (§21).
- **Structure**: numbered, chapter-grouped cues; every factual claim traces to
  `source-workflow.md` and is not repeated inline in the script itself.
- **Runtime bands by complexity tier** (derived from the catalogue's own `Dur/Slides/Shots`
  column, §4 of the catalogue, cross-checked against Video 01's measured 16:55 for a Simple/L1
  workflow):

  | Tier | Catalogue Scr/Act range | Target narration runtime |
  |---|---|---|
  | L1 (Simple) | 5–8 screens | 6–10 min (Video 01: 16:55 — see note below) |
  | L1 (Medium) | 7–10 screens | 8–14 min |
  | L2 | 10–15 screens | 15–20 min |
  | L3 | 20–28 screens | 28–35 min |
  | L4 | 40+ screens | 60–85 min |

  Video 01 ran longer than a bare Scr/Act-based estimate would suggest because its Chapters 1–2
  carry fixed, once-per-series platform-orientation content (what is ERM, why governance, the
  PRSMTD/ERM relationship) that does not repeat in every video — see the Opening Sequence
  template (§25) for how later videos shorten this same section.
- **Required-beats over arbitrary time caps.** If a section's required content genuinely does
  not compress into a suggested time band, keep the content and flag the overrun as an
  observation (`observations.md`) rather than cutting a required beat to hit a number — this is
  Video 01 Observation 4, now a standing rule rather than a one-off judgment call.
- **Governance-beat pacing.** Any chapter narrating an actual maker-checker decision (submit,
  approval, rejection) slows down noticeably relative to descriptive chapters — this is a
  deliberate pacing signal, not an accident of the 150 wpm estimate.

---

## 5. Subtitle Standards

- **Format**: SRT, one file per video, named `subtitles.srt`.
- **Derivation method** (until real recorded narration exists): allocate each narration cue's
  script text into subtitle-sized chunks, distributed proportionally by word count across that
  cue's known `timeline.md` video window, with the final chunk snapped to the window's known end
  second — the exact method Video 01 used to produce 169 internally-consistent cues.
- **Re-timing requirement**: once a real narration track is recorded, `subtitles.srt` must be
  re-timed against it (forced alignment, manual, or AI-assisted per §24) — the proportional
  estimate is directional, not frame-exact, and must never ship as final without this pass.
- **Chunk sizing**: standard subtitle-readability limits apply (≤2 lines, ≤42 characters/line as
  a target ceiling) — not exercised as a hard constraint in Video 01's estimate-based pass, but
  binding once real timing exists.

---

## 6. Animation Standards

Restraint is the standard, not an afterthought — "avoid distracting animations" is a repeated
instruction across every Video 01 planning document, generalized here as a fixed catalog:

**Allowed motion types**: fade-in/out, 400ms cross-fade, slow drift (title/concept plates only,
≤20px over the full plate duration), horizontal pan (table header sweeps), zoom-in/out
(§10), 150ms click-affordance scale-pulse on a clicked button, 600ms highlight-ring pulse on a
just-changed state (e.g., a status badge), a brief fading "✕ ghost marker" to mark something
that just disappeared.

**Forbidden**: bounce, spring/elastic easing, spin, parallax layering, snap zooms, any motion
during a concept plate that isn't the plate's own single fade-in, more than one callout animating
at once (§7).

**Default state is static.** A scene holds with no motion unless the narration is actively
directing attention to something specific — motion is the exception that earns its place, not
the default.

---

## 7. Callout Standards

- **Style**: single accent color, 2px rounded-rectangle border, consistent across the entire
  series. This framework fixes the accent as **`#F5A623`** (a warm amber) for callout borders
  and highlight-ring pulses — chosen for legibility against both light and dark regions of a
  1920×1080 screenshot and deliberate visual distinctness from the prototype's own neutral
  `--primary`/`--accent` UI chrome (§3), so a callout never reads as part of the application
  itself. This is a new standard, not reused from an existing source — flagged for explicit
  confirmation at the next opportunity to revise this document (§21).
- **One at a time.** Callouts never stack; each fades out before the next fades in.
- **Spotlight leads callout.** The cursor spotlight (§11) always arrives at its target at least
  2 seconds before a callout balloon referencing that target appears — never the reverse.
- **Sequencing**: when multiple fields on one screen are called out in sequence (e.g., Status,
  Inherent Score, Residual Score), each balloon animates in, holds through its narration cue,
  and fades before the next.

---

## 8. Transition Standards

- **Default**: 400ms cross-fade through 10% black, between every scene and every chapter card.
- **Hard cut — reserved exclusively** for the moment a scene represents an actual instantaneous
  governed-state change (a click that fires a workflow transition, e.g. Submit for approval,
  Confirm approve). Nowhere else. This reservation is deliberate: a hard cut becomes a learned
  visual signal across the series meaning "the system just recorded something," reinforcing the
  platform's own immutable-ledger narrative (§2 rule 4) rather than being a generic edit.
- **Chapter cards**: 3-second hold, matching the `chapters.md`/`timeline.md` offset-reconciliation
  method (§13) — never shorter (illegible) or longer (pacing drag) without a documented reason.

---

## 9. Camera Movement Standards

There is no real camera — "camera movement" means virtual pan/zoom applied to static
1920×1080 screenshots during compositing (§17 gap notwithstanding, direction is written now so
assembly is mechanical once tooling exists). Fixed movement vocabulary:

| Movement | When used |
|---|---|
| Static hold | Default state; concept plates; the one deliberate "governance pause" beat per governed workflow (§13) |
| Slow drift | Title/opening plate only |
| Horizontal pan | Sweeping across a table's column headers as they're named in narration |
| Zoom-in on a row/card | Directing attention to one list entry before a navigation cut |
| Zoom-in on a field/control | Directing attention to one specific value or button |
| Symmetric zoom-out bookend | Closing a chapter by returning to the same full-frame view it zoomed in from — used at both the workflow's opening screen and its final-outcome screen for narrative symmetry |

Movement direction is written into `scene-list.md` at Stage 6 (§1) and never improvised during
assembly.

---

## 10. Zoom Standards

- **Ceiling**: 1.6× native resolution, never exceeded — since source screenshots are already
  captured at the target 1920×1080 output resolution (§17), any zoom within this ceiling stays
  within native pixel detail; no upscaling softness.
- **Easing**: 400ms ease in/out on every zoom transition; no snap zooms anywhere in the series.
- **Two zoom modes, chosen deliberately per scene**:
  - *"Look at one thing"* — zoom in on a single row, field, or button as it's individually
    named.
  - *"Look at all the options"* — hold at 1.0× and let the cursor spotlight (§11) sweep across
    multiple elements instead of zooming; used when narration is enumerating options (e.g., the
    four action buttons on a detail screen) rather than isolating one.

---

## 11. Cursor Highlighting Standards

- **Treatment**: a soft 120px-radius radial spotlight that dims everything outside it, following
  the virtual pointer.
- **Appears only when narration is actively directing attention** to a specific control — never
  during concept plates, never during static holds, never as ambient decoration.
- **Click affordance**: every button press in the video gets the same 150ms scale-pulse on the
  target element, used consistently at every click across the series so it reads as a learned
  signal ("something was just pressed") rather than a one-off effect.
- **Leads, never follows**, a callout balloon referencing the same target (§7).

---

## 12. Persona Introduction Standards

- **Source**: personas are drawn exclusively from `prototype/src/data/org.json` — never
  invented, never renamed, never given attributes the seed data doesn't carry. This is a hard
  rule, not a style preference: every persona claim in Video 01 traces to a specific `org.json`
  record (`source-workflow.md` §Personas used).
- **Standard persona card**: Name · Role · Department · Maker/Checker tag for this workflow.
  Rendered as a lower-third or overlay card on the persona-picker screenshot, never a separate
  concept plate (keeps the persona grounded in the actual UI, not an abstraction).
- **Sequencing**: introduce the maker before the checker, in the order the workflow's trigger
  actually invokes them; if a workflow involves more than two personas (L2+), introduce them in
  the order they first act, not alphabetically or by seniority.
- **Tenant-context beat**: one fixed beat, reusable near-verbatim across the whole series,
  establishing Meridian Asset Management Ltd. as the fictional-but-realistic SEBI-regulated AMC
  tenant every persona and record belongs to (Template §25, "Persona Introduction").
- **Role-vs-department distinction beat**: included whenever the maker and checker share a
  department (as Arjun and Priya do) — reinforces that separation of duties is structural
  (role-based), not organizational happenstance. Omit this specific beat when the personas sit
  in different departments; the distinction wouldn't need making.

---

## 13. Workflow Chapter Standards

Video 01's 10-chapter shape does not fit every catalogue tier unchanged — an L1 workflow with
5 screens does not need 10 chapters, and an L3/L4 workflow with 20–55 screens needs more. The
chapter formula below generalizes the shape rather than fixing a chapter count:

**Fixed bookend chapters** (every video, every tier):
1. **Introduction** — series-consistent cold open (Template §25).
2. **Domain/Module Overview** — shortened after Video 01 for later videos in the same module
   family (a returning viewer doesn't need "what is a risk register" re-explained in a Controls
   video); full-length only the first time a given module appears in the series.
3. **Meet the Personas** — per §12.
4. *(if the workflow's `MC` flag is `Y`)* **Governance Review** — the maker-checker explainer
   beat (Template §25), included once per video at the point the workflow's first governed
   action goes pending. Omitted (or replaced with a narrower "business-rule enforcement" beat)
   for the rare `MC=N` workflows the catalogue itself flags (e.g., L1-16, L1-31).
5. **Audit Trail / Decision Record** — the permanent-record reveal, for any workflow with at
   least one governed action.
6. **Final Business Outcome** — per Template §25.
7. **Ending** — series-consistent close (Template §25).

**Variable middle chapters** (scale with the workflow):

- One chapter per 1–2 meaningful business-state transitions the workflow's own Scr/Act figure
  names (catalogue §3 "Scr/Act" column) — matching Video 01's own Chapters 4–8 pattern of one
  chapter per screen-state cluster, not one chapter per screenshot.
- **Cross-Module Transition chapter** (new chapter type, first needed at L2): inserted every
  time a workflow's own catalogue row shows a module handoff (e.g., L2-01 Control Failure → Risk
  Register Entry) — narrates the `source`/`ref_id` linkage mechanism connecting the two modules'
  records, grounded in the target module spec's own opaque-reference model.
- **L3/L4 arc chapters**: for multi-chain narratives, group by story arc segment (per catalogue
  §4.3/§4.4's own "Start → End Screen" chain), each segment following the same
  Overview→Walkthrough→Governance→Outcome micro-shape as a full L1 video, nested inside the
  larger runtime.

**Chapter card mechanics** (fixed, from Video 01, unchanged): 3-second hold per card (§8);
cumulative offset added to narration-only cue timestamps to produce the reconciled
`timeline.md`; one closing card (5-second hold) after the Ending chapter, not counted in the
per-chapter offset arithmetic.

---

## 14. Audio Standards

- **Narrator continuity**: one consistent voice/narrator profile across the entire series —
  chosen once, reused for every video, so the series reads as one product, not a rotating cast.
- **File format** (once recorded): one continuous track per video, or one file per chapter —
  either is compatible with `timeline.md`'s per-cue timestamps; a video's `audio/README.md`
  states which was used.
- **Quality bar**: "experienced enterprise product trainer" — explicitly ruled out a lower bar
  (e.g., default OS text-to-speech) once already, in Session 23; that decision is now standing
  policy, not re-evaluated per video. See §17 for the current tooling gap this creates.
- **Sync discipline**: narration is recorded against `narration-script.md`'s cue numbers, not
  free-performed — cue boundaries must remain identifiable in the final track so
  `timeline.md`/`subtitles.srt` re-timing (§5) is mechanical rather than a full re-transcription.

---

## 15. Background Music Standards

- **Treatment**: subtle, non-intrusive bed, ducked well under narration level at all times;
  never present during the Governance Review pause beat (§13) — that beat's silence is
  deliberate and must not be scored over.
- **Series continuity**: one music bed (or a small consistent set — e.g., a theme plus a
  lower-energy variant for governance-pause beats) reused across the whole series, not a fresh
  track per video.
- **Licensing**: must be either originally composed for this project or drawn from a properly
  licensed library with clear commercial-use rights recorded in the video's `audio/README.md`.
  No unlicensed or unattributed source, ever.
- **Current gap**: no licensed music source is available in this environment (confirmed,
  Session 23). This is a standing production blocker, not a per-video decision — every future
  video's `asset-inventory.md` should cite this document rather than re-discovering the gap.

---

## 16. Quality Assurance Checklist

Run before any video package is considered complete, whether or not Stage 8 assembly (§1) has
run yet:

- [ ] Every claim in `narration-script.md` traces to a citation in `source-workflow.md`.
- [ ] `git status --short prototype/` was empty immediately before and immediately after the
      capture pass (§2 rule 2).
- [ ] Zero prototype defects and zero specification inconsistencies encountered, or every one
      that was encountered is logged in `observations.md` (never silently fixed — §2 rule 4,
      matching the repository's own "do not modify the prototype" constraint).
- [ ] All screenshots are 1920×1080, captured from the live prototype, named per §18.
- [ ] `chapters.md` + narration cue timestamps reconcile exactly into `timeline.md` (no gaps, no
      overlaps).
- [ ] `subtitles.srt` cues fall entirely within their `timeline.md` video window.
- [ ] `scene-list.md` conforms to the fixed visual language (§3–§11) — no one-off treatment
      introduced without a framework amendment (§21).
- [ ] Personas and entities used are verified against `org.json` / the module's own seed JSON,
      not invented (§12).
- [ ] `asset-inventory.md` accounts for every required file, honestly marking anything not
      produced and why (§2 rule 3) — never silently omitted.
- [ ] Directory and file naming match §18/§19 exactly.
- [ ] `docs/roadmap.md` Current Status and Completed Work updated (§23).

---

## 17. Rendering Standards

**Target render spec** (fixed for the series, matching the brief that produced Video 01):
MP4 container, H.264 video codec, 1920×1080, 30fps, AAC audio.

**Current tooling gap** (confirmed, Session 23, still current as of this document): this
environment has no video encoder (`ffmpeg` or equivalent), no professional text-to-speech or
voice-over resource meeting the §14 quality bar, no motion-graphics/compositing tool capable of
executing `scene-list.md` direction, and no licensed music source (§15). This blocks Stage 8
(§1) only — every planning, scripting, and screenshot artifact (Stages 1–7, 9) is unaffected and
should be produced in full regardless.

**Standing disclosure protocol** (§2 rule 3, now fixed process rather than an improvised
one-off): before starting production on any future video, confirm current tooling availability
first. If the gap persists, present the same three scoping options Session 23 used as precedent
— (a) full production package, no final render; (b) best-effort render using whatever
lower-quality tooling is actually available, explicitly disclosed as such; (c) planning
documents only, no screenshots — and let the user choose explicitly rather than assuming option
(a) is always correct. Do not silently produce a degraded MP4 and present it as meeting the
"executive-quality, not a screen recording" bar this document and the original brief both set.

---

## 18. Naming Conventions

- **Video package directory**: `demos/video-NN-<workflow-slug>/`, where `NN` is a two-digit,
  monotonically increasing sequence across the whole video series (not per-module, not reused —
  Video 01 already occupies `01`), and `<workflow-slug>` is a kebab-case rendering of the
  catalogue workflow's name, matching its `deck-NN-<slug>` counterpart's slug exactly when both
  exist for the same workflow (cross-deliverable consistency, established Session 23 practice —
  `video-01-risk-assessment-approval` mirrors `deck-01-risk-assessment-approval`).
- **Fixed filenames within every package** (§19): `source-workflow.md`, `narration-script.md`,
  `chapters.md`, `timeline.md`, `scene-list.md`, `subtitles.srt`, `recording-log.md`,
  `observations.md`, `asset-inventory.md`, `video-NN-<slug>.mp4` (once rendered).
- **Screenshots**: `NN-descriptive-kebab-name.png`, two-digit sequence in workflow-transition
  order starting at `00` for any pre-workflow context screen (e.g., the login/persona picker),
  then `01` for the workflow's actual entry screen onward. Numbers and descriptive names are
  held stable across a deck and a video covering the same workflow — a future session producing
  both a deck and a video for the same catalogue row should reuse identical screenshot filenames
  where the captured business state is identical, not invent parallel numbering.
- **Chapters**: named for their business content ("Governance Review," "Audit Trail"), not
  numbered-only labels — matches `chapters.md`'s existing card-text convention.

---

## 19. Directory Structure

```
demos/
  video-production-framework.md      # this document — read first, every future video
  README.md                          # index of everything under demos/
  deck-01-risk-assessment-approval/  # static-deck precedent (Session 22) — out of this
                                      # framework's scope; referenced, not re-specified
  video-01-risk-assessment-approval/ # first video package (Session 23) — the validated
                                      # reference instance this framework generalizes from
  video-NN-<workflow-slug>/          # every future video package, same fixed shape:
    source-workflow.md
    narration-script.md
    chapters.md
    timeline.md
    scene-list.md
    subtitles.srt
    recording-log.md
    observations.md
    asset-inventory.md
    screenshots/
      00-<context-screen>.png
      01-<entry-screen>.png
      ...
    audio/
      README.md                      # placeholder until narration/music tooling exists
    project/
      README.md                      # placeholder until a compositing tool exists
    video-NN-<workflow-slug>.mp4      # once Stage 8 (§1) is unblocked
```

**Not created by this document** (documented as a recommendation only, per this task's
"document only, no implementation" instruction): a `demos/_shared/` directory to hold assets
that become reusable *across* videos once they physically exist — the concept-plate templates,
chapter-card graphic template, and icon set named in §26. Creating that directory is future
work requiring the same explicit-choice discipline `CLAUDE.md` and this repository's own
precedent (Assumption 52, `docs/roadmap.md`) already apply to every new top-level or
cross-cutting location: propose it explicitly to the user at the point a second video's assets
actually need to be shared, rather than scaffolding an empty directory speculatively now.

---

## 20. Asset Reuse Strategy

Two reuse mechanisms operate at different layers:

1. **Within-video reuse** (already established, Video 01): a single screenshot capturing one
   business state is referenced by multiple chapters/scenes when the state doesn't change
   between them (e.g., `07-risk-detail-approved-decision-history.png` used across Chapters 9–10)
   — an editor framing decision (`scene-list.md`), not a recapture.
2. **Cross-video reuse** (new — the reason this framework exists): screens, narration beats,
   chapter templates, concept plates, and transition motifs that do not change across workflows
   or only change in their labeled specifics. Full determination in §26; the mechanism itself:
   a future video's `scene-list.md`/`narration-script.md` should explicitly cite which prior
   video's asset or beat it is reusing (mirroring how `source-workflow.md` cites specs), so
   reuse is traceable rather than silently re-typed from memory.

The catalogue's own §5 (screenshot reuse across decks, building in dependency order) is the
authoritative source for *which workflows* share underlying screens — this framework does not
duplicate that analysis, only extends it to the video-specific assets the catalogue doesn't
cover (narration patterns, chapter templates, concept plates).

---

## 21. Versioning Strategy

- **This document** carries an Amendment Log (bottom of file, empty at v1.0) — every future
  revision (a new standard, a corrected ambiguity, a retired rule) is a dated, numbered entry
  there, never a silent edit to the standards above. This mirrors the Amendment Log pattern
  already used by every authored module spec under `docs/`.
- **A published video package is immutable once complete** (§2 rule 4). "Complete" means every
  Stage 1–7 and 9 artifact (§1) exists and passes the QA checklist (§16) — Stage 8 (rendering)
  remaining blocked does not make a package incomplete or subject to later silent rewrites once
  unblocked; a defect found post-hoc is a new dated entry in that package's own
  `observations.md`.
- **Framework version is independent of video series numbering.** A framework revision does not
  retroactively invalidate already-produced videos; it governs videos produced after the
  revision. If a revision changes something a prior video visibly violates (e.g., a callout
  color), that is noted in the framework's Amendment Log, not fixed by regenerating the prior
  video.

---

## 22. Defect Logging

Two tiers, reusing existing repository mechanisms rather than inventing a third registry
(`CLAUDE.md`'s reuse-before-redesign principle):

- **Per-video defects** (prototype behavior, specification inconsistency, or this package's own
  production issues): logged in that video's own `observations.md`, in the same three-category
  shape Video 01 and Deck 01 both already use — Prototype defects / Inconsistencies /
  Specification gaps / Production observations. Per repository constraint, nothing found this
  way is fixed as a side effect of video production; it is only ever recorded.
- **Framework-level defects** (a standard in this document that doesn't fit a workflow's shape,
  an ambiguity a future session had to resolve on its own): escalated to `docs/roadmap.md`'s
  existing Risks register as a new row, and reflected back into this document's own Amendment
  Log (§21) once resolved — not a new standalone defect tracker.

---

## 23. Repository Governance

- `demos/` is established precedent as a deliberate, narrowly-scoped exception to the
  specification-first `docs/` tree — the same category of exception `prototype/` already is
  (`docs/roadmap.md` Assumption 52). This framework document, living at `demos/`'s top level
  rather than inside a per-deliverable subdirectory, extends that same precedent: it is
  planning/process content governing how demo output gets produced, not authoritative
  specification content itself, so it does not belong under `docs/`.
- `CLAUDE.md` rule 6 ("no root-level documentation files beyond `CLAUDE.md`/`README.md`/
  `.gitignore`") does not apply here — this document is not at the repository root, it is inside
  `demos/`, the same location Video 01's and Deck 01's own companion documents already occupy.
- **Read this document before any future video work**, per `CLAUDE.md`'s own "Instruction
  loading" pattern (read the relevant governing document before starting new work in an area).
  A future session should not re-derive a convention this document already fixes.
- **New standards require the same explicit-choice discipline** this repository already applies
  to every additive spec change and every new top-level directory (`docs/roadmap.md`
  Assumptions 18, 51, 52): propose the change, let the user confirm it, then record it in this
  document's Amendment Log (§21) — never silently adopt a new visual or narration rule mid-video
  and leave this document stale.
- **PRSMTD remains read-only and out of scope** for every stage of this pipeline, without
  exception — no stage in §1 ever requires writing to PRSMTD, and none should ever be designed
  to.

---

## 24. Future AI-Assisted Production Opportunities

Documented only, per this task's explicit instruction — nothing below is implemented, and
adopting any of it requires the same explicit-confirmation discipline as any other framework
change (§21, §23):

- **AI-assisted capture-script generation**: generate the Playwright capture script for a new
  workflow directly from its catalogue row plus `prototype/docs/user-journeys.md` (when a
  validated journey exists), rather than hand-authoring one per video the way Session 23 did.
- **AI-assisted narration drafting**: draft `narration-script.md` cues from `source-workflow.md`
  citations plus this framework's tone/pace standards (§4), with a human pass required before
  acceptance — grounding discipline (§2 rule 1) must remain enforced regardless of who drafts
  the first pass.
- **Forced-alignment subtitle re-timing**: once real narration audio exists, use automated
  speech-to-text alignment to re-time `subtitles.srt` against the actual track (§5), replacing
  the current word-count-weighted estimate with a measured one.
- **AI-assisted regression detection**: diff each new capture pass's screenshots against the
  prior session's captures of the same screens (where a workflow reuses a screen across videos,
  §20) to flag unexpected prototype drift automatically, rather than relying solely on manual
  visual review (§16).
- **AI-assisted grounding verification**: automatically cross-check every claim in a draft
  `narration-script.md` against its cited `source-workflow.md` line, flagging unsupported claims
  before they reach the QA checklist (§16) — the same category of check Session 21 performed
  manually on the catalogue itself.
- **Text-to-speech narration**, only once an engine meeting the §14 "experienced enterprise
  product trainer" quality bar is available and explicitly authorized for use — not the
  lower-quality OS-default TTS already considered and declined once (§14, §17).

---

## 25. Reusable Templates

Nine templates, each a documented structure — not a built asset. A future video's own
`narration-script.md`/`scene-list.md` fills in the workflow-specific specifics; the shape,
sequencing, and pacing below stay fixed.

### Opening Sequence
**Purpose**: series-consistent cold open. **Fixed content**: title card (platform wordmark +
"Demonstration NN: <Workflow Name>"), one-paragraph cold-open narration naming what the viewer
is about to watch. **Duration**: ~20s, fixed regardless of tier. **Reuse note**: identical
structure every video; only the workflow name and one sentence of preview content change.

### Chapter Card
**Purpose**: navigable chapter marker. **Fixed content**: card text + subtitle, 3-second hold,
no cursor motion, 400ms fade transition in/out (§8). **Reuse note**: the visual treatment (§3)
is completely fixed; only text content varies per chapter, per §13's chapter formula.

### Persona Introduction
**Purpose**: introduce each workflow participant. **Fixed content**: tenant-context beat
(Meridian AMC framing, reusable near-verbatim across the series the first time a video airs it,
shortened to a one-line reminder in later videos), then one persona card per participant in
trigger order (§12), then a role-vs-department distinction beat when applicable. **Duration**:
~30s per persona plus ~30s tenant context (full) or ~10s (shortened reminder).

### Workflow Explanation
**Purpose**: the variable middle chapters (§13) — walk the actual screen-by-screen business
action. **Fixed content shape**: one chapter per 1–2 business-state transitions; each opens on
the relevant screenshot, narrates the on-screen action, and closes on either a static hold (if
the next chapter is conceptual) or a hard/cross-fade transition (per §8's rule) into the next
captured state.

### Maker-Checker Explanation
**Purpose**: the Governance Review chapter (§13, item 4) — the series' recurring "why does
separation of duties exist" beat. **Fixed content**: a static-hold pause beat, a concept plate
(Submit → Review → Approve motif with a padlock over the maker-checker boundary), a persona
switch beat, then the checker's queue reveal, framed as "the same rule that blocked the maker a
moment ago would block anyone, on any record, in any module built on this governance ledger" —
the module-agnostic phrasing already proven in Video 01, reusable verbatim since it is a
platform-level claim, not a Risk-specific one.

### Business Outcome Summary
**Purpose**: the Final Business Outcome chapter (§13) — translate the governed state change back
into a business/regulatory statement (what changed, what the organization can now prove).
**Fixed shape**: state-before → state-after → "the difference between an organization that can
say X and one that can prove it" framing (proven phrasing from Video 01, module-agnostic).

### Executive Summary
**Purpose**: a short, dashboard/board-oriented variant of the Business Outcome Summary, used
only for catalogue rows flagged `Ex=Y` (executive dashboard involved) or any L2-10-style
workflow. **Fixed content**: leads with business/regulatory framing before any screen detail,
defers governance mechanics to a cross-reference rather than re-explaining them.

### Closing Sequence
**Purpose**: series-consistent wind-down. **Fixed content**: pattern recap ("this same pattern —
not a different one per module — governs X, Y, Z"), audience-value framing (Board/CRO/CISO/
Compliance/Implementation-team value, per the two-column template Video 01 Scene 32 already
established), series preview (naming only workflows the catalogue actually schedules next per
its recommended build order, catalogue §7 — never inventing upcoming content).

### End Credits
**Purpose**: closing card. **Fixed content**: "Thank You," 5-second hold, "ERM Demonstration
Series — Video NN of 46" (or of the currently-scoped total, whichever this framework's Amendment
Log most recently confirmed — see §21).

---

## 26. Asset Reuse Determinations

Per the task's explicit review requirement — what can be reused across the remaining 45
workflows, and what cannot:

| Asset type | Reusable? | Detail |
|---|---|---|
| Screenshots | **Partially, per workflow chain** | Governed by the catalogue's own §5 dependency/reuse matrix, not restated here — e.g., `01-risk-register-list.png`/`02-risk-detail-active.png` are directly reusable by any other RISK-module workflow (L1-02/03/04, L2-01/05, L3-01) per that matrix. Cross-module screens (Approvals-queue chrome, module dashboards) are reusable as *layout reference* even when the specific pending item differs. |
| Narration sections | **Yes — three categories** | (1) Platform-orientation content (Chapters 1–2 of Video 01: what is ERM, why governance, PRSMTD/ERM relationship) — shortened to a brief reminder after its first full airing, per the Opening Sequence template. (2) The Maker-Checker Explanation beat (§25) — reusable near-verbatim, since separation-of-duties rationale is platform-level, not module-specific. (3) The tenant-context beat (Meridian AMC framing) — reusable near-verbatim. Workflow-specific narration (the actual walkthrough chapters) is never reused — it is grounded fresh in each workflow's own `source-workflow.md`. |
| Chapter animations | **Yes — the motion vocabulary, not the specific instances** | §6's fixed catalog (fades, pans, zooms, click-pulses, highlight-rings) is the reusable asset; the specific target coordinates for each are necessarily per-screenshot. |
| Icons | **Not yet — none exist to reuse** | No icon set has been produced in either Deck 01 or Video 01 (both used plain screenshots and text callouts, no custom iconography). A reusable icon set (module glyphs, maker/checker padlock icon, Submit→Review→Approve strip motif) is proposed future work (§19's `demos/_shared/` recommendation), not an existing asset — do not claim icons exist to reuse until they are actually produced once and confirmed reusable. |
| Transitions | **Yes — codified as repository standards** | §8's 400ms-cross-fade-default / hard-cut-only-for-governed-state-change rule is now the fixed series standard, not a per-video choice. |
| Concept plates | **Structurally, not pixel-for-pixel** | The specific diagrams Video 01's Chapter 2 and Ending used (register-row diagram, maker/checker two-box diagram, PRSMTD/ERM layer stack, Submit→Review→Approve strip, audience/value two-column list) are reusable *compositions* — same diagram, same framing — every time their underlying concept recurs (which is most videos, since maker-checker and the PRSMTD/ERM relationship are platform-wide claims). No concept-plate graphic file exists yet to literally reuse (§17 tooling gap); the composition is documented here so whoever builds the first one builds it once, reusably. |
| Callout style | **Yes — fully fixed** | §7, no variation permitted without a framework amendment. |
| Persona cards | **Structurally, not by content** | The card layout and field set (§12) is fully reusable; the actual persona (name, role, department) is never reused across workflows unless the same person genuinely appears in both (e.g., Priya Raghunathan as CRO checker recurs across most RISK-adjacent workflows). |

---

## Traceability

- **Business Requirement**: Enable the remaining 45 catalogued demonstration workflows
  (`docs/19-roadmap/01-demonstration-workflow-catalogue.md`) to be produced as videos
  consistently, at the same executive-quality bar Video 01 targeted, without re-deriving
  production conventions from scratch each time.
- **Regulatory Requirement**: None directly — this is a production-process artifact. Individual
  future videos inherit the regulatory grounding of the workflows they depict, via their own
  `source-workflow.md`, exactly as Video 01's did.
- **PRSMTD Capability**: None consumed or required — this document governs demonstration-video
  production only; no stage in the pipeline (§1) reads from or writes to PRSMTD.
- **ERM Capability**: N/A — this is demonstration/process collateral (`demos/`), not an ERM
  domain capability, and is not added to `docs/22-traceability/`'s matrices, consistent with how
  the catalogue itself and Video 01's own companion documents are scoped.
- **Dependencies**: `docs/19-roadmap/01-demonstration-workflow-catalogue.md` (workflow
  selection and dependency ordering); `demos/deck-01-risk-assessment-approval/` and
  `demos/video-01-risk-assessment-approval/` (the validated precedent this framework
  generalizes from); `prototype/docs/README.md` and `prototype/docs/user-journeys.md` (capture
  and journey grounding); `CLAUDE.md` (repository-wide governance and traceability rules).
- **Future Work**: Produce Video 02 using this framework once selected (out of scope for this
  session); create `demos/_shared/` and its first reusable concept-plate/icon assets once a
  second video's production actually needs them (§19); resolve the §17/§15 tooling gaps
  (video encoder, licensed narration/music) before any video's Stage 8 can complete; write a
  companion `deck-production-framework.md` only if static decks are commissioned again; revisit
  this document's Amendment Log discipline (§21) at that time rather than treating this v1.0 as
  final.

## Amendment Log

*(Empty at v1.0 — authored in full for the first time this session. Future revisions to any
standard in §1–§26 are recorded here as dated, numbered entries, per §21.)*

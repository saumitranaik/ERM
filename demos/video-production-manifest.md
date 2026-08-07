# ERM Demonstration Video Production Manifest

**Status**: Authored 2026-08-07 (Session 27). Planning and governance artifact — not a
specification, not a PRSMTD artifact, not a video, and not the production of Demonstration
Video 02. This document is the single authoritative source for **which video is produced
next, production order, dependencies, completion status, output locations, and production
readiness** across the entire 46-workflow demonstration video series.

## Purpose

Two documents already govern parts of this series: the
[Demonstration Workflow Catalogue](../docs/19-roadmap/01-demonstration-workflow-catalogue.md)
(what the 46 workflows are, and a *deck*-oriented bundled build order) and the
[Video Production Framework](video-production-framework.md) (how any one video is produced —
standards, templates, naming, QA). Neither answers, on its own and unambiguously, "which video
gets produced next, right now, and what is its current status?" The catalogue's own recommended
build order (§7) is a 26-item **bundled deck** sequence; the framework fixes a **one-workflow,
one-package** rule for video (§2 rule 7), so the deck sequence cannot be used unmodified as the
video sequence. Nothing before this document resolved that gap or tracked per-video status at
all — Video 01 was selected, produced, and rendered across four sessions (22–26) with its status
recorded only inside its own package, not in any cross-video index. This manifest closes that
gap once, for all 46 videos, so a future session can be given the instruction "produce the next
pending video" and act without re-deriving sequencing or re-reading four other documents first.

## Scope

**In scope**: production order and numbering for the video series; per-video status tracking
across four independent axes (production package, rendering, QA, approval); dependency
resolution between videos; naming/output-location conventions for the video medium; quality
gates; and the automation rule that lets a future session select the next video without manual
judgment.

**Out of scope** (explicitly, per this session's instruction):
- Producing Demonstration Video 02 or any other video.
- Regenerating or modifying Video 01's package or its rendered MP4.
- Modifying the prototype (`../prototype/`), any authoritative `docs/` specification, or any
  Liquibase changeset — none exists to modify or add to; this document adds none.
- Modifying PRSMTD (read-only, per `CLAUDE.md`).
- Redesigning the repository, the catalogue, or the framework — this document references both,
  duplicates neither, and does not alter their content.
- The static-deck medium (`.pptx`) — Deck 01 remains the only deck; this manifest governs the
  video series, not a future deck-production sequence (see `video-production-framework.md`
  Scope for why a deck framework is deferred).

## How to use this document

Before starting work on any future ERM demonstration video: read this manifest first (not the
catalogue or the framework directly) to determine *which* video is next (§27) and its current
status (§25). Then follow the framework's own instruction (`video-production-framework.md`, "How
to use this document") to actually produce it. After any production session, update this
manifest's status columns (§25) and `docs/roadmap.md` (§21, and the repository's own Traceability
rules) — never leave this manifest stale relative to a package's own `asset-inventory.md`.

---

## 1. Relationship to the Demonstration Workflow Catalogue

The [catalogue](../docs/19-roadmap/01-demonstration-workflow-catalogue.md) remains the sole
authoritative source for **what the 46 workflows are**: their objective, modules, personas,
trigger, screen chain, complexity, priority, and dependency-matrix familiarity relationships
(catalogue §5). This manifest does not redefine, rename, or reprioritize any workflow — every
row in the Video Manifest Table (§25) cites its catalogue row directly and inherits that row's
Name, Modules, Personas, and Complexity verbatim. Where this manifest's own **video sequencing**
(§25, §6) diverges from the catalogue's own **deck** sequencing (catalogue §7), that divergence
is explained in §6, not silently substituted.

## 2. Relationship to the Video Production Framework

The [framework](video-production-framework.md) remains the sole authoritative source for **how**
any one video is produced: the nine-stage pipeline (framework §1), all visual/narration/audio/
subtitle/animation/callout/transition/camera/zoom/cursor/persona/chapter standards (framework
§2–§16), rendering standards (§17), naming/directory conventions (§18–§19), and the nine reusable
templates (§25). This manifest does not restate those standards; it cross-references them by
number throughout. What this manifest adds — and the framework explicitly does not cover — is
cross-video sequencing, per-video status tracking, and the dependency/automation logic needed to
answer "what's next" without a human re-reading the catalogue's dependency matrix each time.

## 3. Repository Governance Rules

- `demos/` remains a deliberate, narrowly-scoped exception to the specification-first `docs/`
  tree (`demos/README.md`; `docs/roadmap.md` Assumption 52) — this manifest lives at `demos/`'s
  top level, alongside `video-production-framework.md` and `README.md`, not under `docs/`.
  `CLAUDE.md` rule 6 (no root-level docs beyond `CLAUDE.md`/`README.md`/`.gitignore`) does not
  apply here for the same reason it does not apply to the framework document.
- **PRSMTD and `../prototype/` remain read-only** from every stage this manifest governs, without
  exception (framework §2 rule 6, §23).
- **No authoritative `docs/` specification is modified** by producing or planning any video.
- **No Liquibase changeset is added or implied** — this repository's data model is
  narratively specified, never scaffolded here (`CLAUDE.md` repository rules).
- **A published video package is immutable once complete** (framework §21) — a defect found
  later is a new dated entry in that package's own `observations.md`, never a silent rewrite.
  This manifest's own status columns follow the same discipline: a status only ever advances
  forward via a new dated production session, recorded in this file's Amendment Log if the
  change reflects a manifest-level correction rather than ordinary status progress.
- **Obsolete planning artifacts are archived, never deleted**, with every reference to them
  updated at the same time — there is no obsolete artifact to archive as of this session (Deck
  01, Video 01, the catalogue, and the framework are all still current); this rule governs any
  future revision of this manifest that supersedes part of itself.
- **`docs/roadmap.md` is updated** after every session that changes this manifest's status
  columns or production order (§21; Post-Execution requirement below).

## 4. Video Numbering Convention

- Two-digit, monotonically increasing sequence across the **entire** 46-workflow series, never
  reused and never renumbered once a package's directory exists (framework §18) — `01` remains
  permanently assigned to L1-01 (Risk Assessment Approval).
- This manifest (§25) pre-assigns Video Numbers `02`–`46` to the 45 remaining catalogue
  workflows, in the recommended production order derived in §6. This is a **recommended
  default**, not an immutable schedule: a future session may resequence *not-yet-started*
  videos by explicit user decision, recorded in this document's Amendment Log — never silently
  reordered mid-series. Any video whose package directory already exists (currently only `01`)
  keeps its number permanently, per the immutability rule above.
- If the catalogue is ever revised to add a 47th workflow (e.g., following authoring of `16-ai`
  or `17-integrations`, per catalogue §13 Future Work), it is appended as Video `47` — never
  inserted mid-sequence, to avoid renumbering any already-produced package.

## 5. Folder Naming Convention

`demos/video-NN-<workflow-slug>/`, exactly as fixed by framework §18–§19 — `NN` is the Video
Number from §25's table; `<workflow-slug>` is the kebab-case slug in that same table, matching
the corresponding `deck-NN-<slug>` slug where both exist (only true for Video 01 today).
**No folder for Videos 02–46 is created by this manifest** — assigning a number and slug is a
planning act; the directory itself is created only when that video's own Stage 1–2 production
work actually begins (framework §1), consistent with this session's planning-only scope.

## 6. Output File Naming Convention

Fixed nine-document-plus-MP4 package shape per framework §18–§19, unchanged here:
`source-workflow.md`, `narration-script.md`, `chapters.md`, `timeline.md`, `scene-list.md`,
`subtitles.srt`, `recording-log.md`, `observations.md`, `asset-inventory.md`,
`video-NN-<slug>.mp4`, plus `screenshots/`, `audio/`, `project/` subdirectories. This manifest
adds no new required file — every "Output MP4 Name" cell in §25 is this same convention applied
to that row's own Video Number and slug.

**Video sequencing rationale** (why §25's order is not catalogue §7's order): catalogue §7
recommends 26 **decks**, ten of which bundle multiple Level 1 workflows into one module-wide
deck (e.g., "RISK Foundations" bundles L1-02/03/04). The framework's one-workflow-one-package
rule (framework §2 rule 7) forbids that bundling for video, so this manifest **unbundles** each
catalogue-§7 deck into its constituent workflow(s), preserving their relative order exactly,
and keeps catalogue §7's own two hard sequencing rules from catalogue §11 intact:

1. Never sequence a Level 2+ fan-out video before the Level 1 video(s) it depends on
   (catalogue §5 dependency matrix).
2. L2-07 (Cross-Module Drill-Down) and L2-10 (Executive Dashboard) are sequenced immediately
   after all Level 1 module videos and before the Level 2 fan-out chains (catalogue §11 rule 2).
3. L4-01 is always last — a compilation, not a standalone story (catalogue §11 rule 3).

The resulting order: Video 01 (already produced) → Videos 02–31 (the 30 remaining Level 1
workflows, in catalogue §7's own per-module order, unbundled) → Video 32 (L2-07) → Video 33
(L2-10) → Videos 34–41 (the remaining eight Level 2 fan-outs, in catalogue §7's own priority
order) → Videos 42–45 (the four Level 3 journeys, in catalogue §4.3's own order) → Video 46
(L4-01, capstone). Full assignment in §25.

---

## 7. Production Status Definitions

Eight status values, shared vocabulary across this manifest's four status axes (§25 Table C).
Not every value applies to every axis — each axis below states which subset it uses.

| Status | Meaning |
|---|---|
| **Not Started** | No production activity has begun on this video beyond its catalogue entry existing. |
| **In Progress** | At least one framework Stage 1–7/9 artifact (§source-workflow.md, narration-script.md, etc.) exists, but the full nine-document package is not yet complete. |
| **Production Package Complete** | Every Stage 1–7 and Stage 9 artifact exists and passes the framework §16 QA checklist for those stages; Stage 8 (rendering) may still be pending. This is the state Video 01 reached at the end of Session 23. |
| **Rendered** | Stage 8 has produced a playable `.mp4` per framework §17's target spec, whether or not it carries real narration (see "Narrated" below) — Video 01 reached this state at the end of Session 26, as a silent render. |
| **Narrated** | The rendered `.mp4` carries a real recorded voice-over track meeting the framework §14 quality bar (not TTS) — a strictly later state than "Rendered," never skipped. No video has reached this state as of this session. |
| **QA Complete** | The framework §16 checklist has been run and passed against the current rendered state (silent-visual QA if not yet Narrated; full narration-sync QA once Narrated) — always cite which scope it covers. |
| **Approved** | An explicit, recorded stakeholder/user decision that this package is fit for its intended audience — a distinct governance step from QA passing, deliberately mirroring the platform's own maker-checker separation (QA is technical verification; Approval is a business sign-off decision). No video has reached this state as of this session. |
| **Published** | The video has been distributed outside this repository (e.g., shared with a stakeholder, uploaded to a hosting destination) — an explicit, hard-to-reverse action per the repository's own risk-and-blast-radius discipline; requires an Approved package and explicit user authorization each time (§18). No video has reached this state. |

---

## 8. Production Readiness Checklist

Before starting Stage 1 (Selection) on any video:

- [ ] This manifest (§25) identifies it as the next eligible video per §29's automation rule.
- [ ] Its catalogue row (§25 "Related Catalogue Entry") has been re-read in full, not assumed
      from this manifest's summary columns.
- [ ] `prototype/docs/user-journeys.md` has been checked for a validated journey covering this
      workflow; if none exists, the relevant module spec's state machine is the grounding source
      instead (framework "How to use this document").
- [ ] Current tooling availability has been re-confirmed per framework §17's standing disclosure
      protocol — do not assume Video 01/Session 26's partial `ffmpeg` availability still holds
      without re-checking.
- [ ] `git status --short prototype/` is empty before capture begins (framework §2 rule 2).

Before marking a package **Production Package Complete**: the full framework §16 QA checklist,
unchanged, run against that package's own nine documents.

## 9. Quality Gates

Status axes advance only in the following order, never skipped or reversed without a new dated
`observations.md` entry explaining why:

```
Not Started → In Progress → Production Package Complete → Rendered → [Narrated] → QA Complete → Approved → Published
```

- A video cannot be marked **Rendered** while its Production Package Status is anything other
  than **Production Package Complete** (Stage 8 consumes Stage 1–7/9 outputs; framework §1).
- A video cannot be marked **Approved** while its QA Status is anything other than **QA
  Complete** (§7) — QA is a precondition for approval, not a parallel track.
- A video cannot be marked **Published** while its Approval Status is anything other than
  **Approved** — publishing without approval is exactly the kind of hard-to-reverse,
  externally-visible action this repository's own operating discipline requires explicit
  confirmation for (see §18).
- **Narrated** is optional relative to **Rendered**, not a required intermediate — a package may
  ship as a durable silent Version 1 (as Video 01 has) and gain a Narrated Version 2 later
  without re-doing Stages 1–7 (asset-inventory.md's own "Future Work" pattern, Video 01).

## 10. Rendering Standards

Fully governed by framework §17 (MP4/H.264/1920×1080/30fps/AAC) and its standing disclosure
protocol — not restated here. This manifest's only addition: **before rendering any video**,
re-run framework §17's tooling-gap check explicitly (§8 above) rather than assuming Session 26's
finding (portable `ffmpeg` usable, no admin rights required) still holds; environments change
between sessions.

## 11. Narration Standards

Fully governed by framework §4 (tone, pace, runtime bands) and §14 (audio/voice continuity) —
not restated here. This manifest's addition: the **Estimated Duration** column in §25 Table B
applies framework §4's tier bands directly, with one caveat carried forward from Video 01's own
measured result (16:55 against an estimated 6–10 min band) — see §25 Table B's own footnote.
Every video's `narration-script.md` remains a required Stage-4 artifact regardless of whether a
real voice-over is recorded yet (framework §1); "Narrated" (§7) is a separate, later status from
having a complete script.

## 12. Asset Reuse Rules

Fully governed by framework §20 and §26 (within-video and cross-video reuse mechanisms,
determinations of what is/isn't reusable today) — not restated here. This manifest's addition:
the **Dependencies** column in §25 Table B is the practical index of *which* prior video's
screenshots, persona cards, and narration beats a given video should check for reuse first,
consistent with the catalogue's own §5 screenshot-reuse note. A video's own `scene-list.md`/
`narration-script.md` must still cite the specific prior asset being reused (framework §20), not
just "per the manifest."

## 13. Versioning Rules

Fully governed by framework §21 (framework-version independence from video-series numbering,
package immutability once complete) — not restated here. This manifest's addition: a single
video package may itself carry sub-versions (Version 1 Silent, Version 2 Narrated — Video 01's
own precedent), and this manifest's Rendering/QA/Approval Status columns (§25 Table C) always
reflect the **latest** version reached, with the version explicitly named in the Notes column
whenever more than one exists for that video.

## 14. Naming Standards

Fully governed by framework §18 (package directory, fixed filenames, screenshot numbering,
chapter naming) — not restated here. This manifest's own file (`video-production-manifest.md`)
follows the same `demos/`-top-level naming precedent as `video-production-framework.md` and
`README.md`.

## 15. Video Dependency Rules

Each row's **Dependencies** column (§25 Table B) lists the Video Number(s) whose catalogue
workflow the catalogue's own §5 dependency matrix names as prerequisite familiarity for that
row's workflow, translated from Workflow ID to Video Number via §25's own assignment. Two
categories:

- **Foundational** (catalogue §5's own list: L1-01/05/07/11/13/15/19/23/26/30, L2-07) — no
  dependency; safe to produce first within their tier.
- **Builds on** — every other row cites the specific prior Video Number(s) per catalogue §5's
  "Builds on" table (for Level 1) or its own dependency prose (Level 2/3/4).

**Automation note**: because §6's video ordering already sequences every row after its own
dependencies (by construction), the Dependencies column is a traceability/audit record, not a
separate runtime gate the automation rule (§29) needs to re-check — with one flagged exception,
below.

**Known ordering tension (not resolved by this manifest, flagged per repository discipline)**:
catalogue §5 lists Video 21 (L1-21, Issue → CAPA Full Lifecycle) as a "Builds on" prerequisite
for Video 18 (L1-18, Policy Exception → CAPA)'s CAPA-concept familiarity, but catalogue §7's own
deck order (and this manifest's unbundling of it) places Video 18 before Video 21, because L1-18
belongs to the POLICY module group and L1-21 to the INCIDENT/CAPA module group, and POLICY is
sequenced before INCIDENT/CAPA throughout. This is a pre-existing tension in the catalogue's own
two ordering systems (module-grouped deck order vs. workflow-level familiarity dependency), not
introduced by this manifest — see Known Constraints (§23). **Recommended mitigation, not
mandated**: Video 18's own `narration-script.md` should include a brief, self-contained
explanation of the CAPA concept at the point it is first invoked, rather than assuming the
audience has already seen Video 21 — the same "required-beats over arbitrary time caps"
discipline framework §4 already applies elsewhere. L1-29 and L1-31 have no dependency entry in
catalogue §5 at all (neither foundational nor listed in "Builds on"); this manifest recommends
treating them as following their own module's immediately preceding videos (V27/V28 for L1-29;
V30 for L1-31) as a sensible default, flagged as a catalogue gap rather than a documented rule.

## 16. Release Readiness Rules

A video reaches **Published** (§7) only when: (a) its Approval Status is **Approved**, and (b)
the user has explicitly authorized that specific act of distribution at that time — publishing
is an externally-visible, hard-to-reverse action under this repository's own operating
discipline (see the top-level "Executing actions with care" guidance this repository's sessions
already operate under) and is never inferred from an earlier, unrelated approval.

## 17. Production Metrics

| Metric | Value |
|---|---|
| Total videos in series | 46 (matches catalogue's 46 cataloged workflows exactly; §25) |
| Videos with a Production Package Complete or later status | 1 (Video 01) |
| Videos Rendered | 1 (Video 01, Version 1 — Silent Demonstration) |
| Videos Narrated | 0 |
| Videos Approved | 0 |
| Videos Published | 0 |
| Videos Not Started | 45 |

**No validated per-video effort or runtime model exists yet for the video medium specifically.**
The catalogue's own §8–§9 effort estimates (~25–28 person-days) are for the **deck** medium, a
materially lighter production (screenshots + slides only, no script/timeline/scene-list/subtitle
production). Video 01 is the only video-medium data point, and it does not cleanly decompose
into a reusable per-video effort figure: Session 23 produced its full Stage 1–7/9 package,
Session 26 separately produced Stage 8 rendering only, and both sessions carried first-of-series
setup cost (framework authorship itself happened in Session 24, between them) that will not
recur for Videos 02–46. Treat per-video effort as unestimated until at least 2–3 more videos are
produced under stable tooling — tracked as a Known Constraint (§23), not fabricated here.

## 18. Future Narration Strategy

Governed by framework §14 (quality bar), §17 (current tooling gap: no professional TTS/voice
resource meeting that bar, confirmed as recently as Session 26), and §24 (AI-assisted narration
drafting, forced-alignment subtitle re-timing, and TTS once an engine meets the quality bar —
all documented-only, none adopted). This manifest's addition: track narration strategy as a
**series-wide** decision, not a per-video one — once a real voice-over pipeline (human talent or
qualifying TTS) is confirmed for one video, it should be applied as Version 2 to Video 01 first
(the only video with a durable Version 1 silent baseline to upgrade) before being used for a new
video's first version, preserving one consistent narrator profile across the whole series
(framework §14).

## 19. Repository Maintenance Rules

- This manifest must remain synchronized with the catalogue, the framework, and
  `docs/roadmap.md` (per this session's own instruction) — a status change in a video package's
  own `asset-inventory.md` is not complete until reflected here, and vice versa.
- No content from the catalogue or the framework is duplicated here beyond what is needed for a
  self-contained status table (workflow name, modules, personas, complexity) — everything else
  is cross-referenced by section number, per `CLAUDE.md`'s "cross-reference over restating"
  principle.
- Obsolete planning artifacts are archived (e.g., to a dated subfolder or an explicit
  "superseded" note), never deleted, with every reference to them updated in the same change —
  no artifact requires this treatment as of this session.

## 20. Lessons Learned

Carried forward from Video 01's four production sessions (22–23, capture/scripting; 24,
framework authorship; 26, rendering), for any future video session to inherit without
re-discovering:

- **Grounding-first discipline produced a zero-defect result twice** (Deck 01's independent
  capture pass and Video 01's own) — every claim traced to `source-workflow.md`, no invented
  screen or persona. Keep this as the non-negotiable first step of every future video (framework
  §2 rule 1).
- **Disclosure-before-fabrication, not disclosure-then-silent-downgrade, is the correct response
  to a tooling gap** — Session 23's three-option pattern (full package/no render; disclosed
  best-effort; planning-only) and Session 26's `AskUserQuestion` re-check before acting are both
  now fixed protocol (framework §17), not one-off judgment calls.
- **A partial tooling capability is not the same as full capability** — Session 26 found a
  portable `ffmpeg` build usable without admin rights, closing the rendering gap, but TTS/voice
  and licensed music gaps remained separately open; treat each tooling dependency (encoder, TTS,
  compositing, music) as independently re-checkable, not as one bundled "blocked" flag.
- **Small rendering-pipeline defects (an off-by-one arrow coordinate, un-renderable emoji glyphs)
  are caught cheaply by short `--preview` slices before committing to a full ~17-minute render**
  — validate incrementally, every future video, not just Video 01.
- **An honest, disclosed adaptation (Video 01's Scene 22 persona-dropdown overlay, Scene 29–30
  status-badge-only callout) is acceptable when a screen state was never actually captured;
  fabricating a full fake screen is not** — the line is disclosure, logged in `observations.md`,
  not invention.
- **A first video in a new module family runs longer than its tier's baseline band** (Video 01:
  16:55 measured vs. a 6–10 min L1-Simple baseline) because Chapters 1–2 carry one-time
  platform-orientation content — later videos in the same family should trend toward or below
  the baseline once that content is framework-mandated to shorten (framework §13 item 2).

## 21. Known Constraints

- **Tooling**: no professional TTS/voice-over resource meeting the framework §14 quality bar,
  and no licensed background music source, are confirmed available as of Session 26 — both
  block reaching "Narrated" status for any video, not just future ones; re-check per video
  (§8), do not assume resolved.
- **The L1-18/L1-21 sequencing tension** (§15) — a pre-existing catalogue ordering conflict
  between module-grouped build order and workflow-level dependency familiarity, not resolved by
  this manifest, flagged for the producing session's own judgment.
- **L1-29 and L1-31 have no documented dependency** in catalogue §5 (§15) — this manifest
  supplies a recommended default, not an authoritative one.
- **No per-video effort/runtime model exists yet** (§17) beyond framework §4's tier bands and
  Video 01's own single data point.
- **45 of 46 video package directories do not yet exist** — this manifest assigns numbers and
  slugs to all of them as a planning act (§4–§6) but creates none; each is created only when its
  own Stage 1–2 production work actually begins.
- **This manifest itself has not been reviewed against a second, independently-produced video**
  — its automation rule (§29) and dependency-translation logic (§15) are validated only against
  Video 01's already-known history, not against a live production run. Treat the first video
  produced after this manifest as a validation pass on the manifest's own mechanics, and correct
  this document (via its Amendment Log) if that run reveals a gap.

## 22. Future Enhancements

- Apply framework §24's AI-assisted opportunities (capture-script generation, narration
  drafting, forced-alignment subtitle re-timing, regression detection, grounding verification)
  once each is explicitly authorized — none is adopted by this manifest.
- Create `demos/_shared/` (framework §19's deferred recommendation) once a second video's
  assets genuinely need cross-video sharing (concept-plate graphics, an icon set) — propose
  explicitly at that time, per the same discipline this manifest itself was created under.
- Write a companion `deck-production-framework.md` only if a second static deck is actually
  commissioned (framework Scope) — this manifest does not schedule that.
- Once 2–3 more videos are produced, populate §17's currently-unestimated per-video effort
  model from real data rather than leaving it a named gap.
- Revisit the L1-18/L1-21 and L1-29/L1-31 catalogue gaps (§15, §21) the next time the catalogue
  itself is revised, rather than leaving the workaround permanently in this manifest.

---

## 23. Current Status

**Video 01 — Risk Assessment Approval (L1-01)** is the only video with any production activity:

| Axis | Status | Detail |
|---|---|---|
| Production Package Status | **Production Package Complete** | All nine documents plus 8 screenshots produced and QA-checked, Session 23. |
| Rendering Status | **Rendered — Version 1 (Silent Demonstration)** | `.mp4` produced Session 26: H.264, 1920×1080, 30fps, AAC (silent), 16:55, ~50MB. No spoken narration, no background music (explicit user scope for this version); burned-in subtitles carry narration content. |
| QA Status | **QA Complete — Version 1 scope only** | Framework §16 checklist run against the silent render (frame sampling across all chapters, transition/callout/subtitle-sync verification per `recording-log.md`'s Rendering Pass section). Narration-sync QA does not apply until a Version 2 exists. |
| Approval Status | **Not Started** | No explicit stakeholder/user sign-off decision has been recorded for this package as a distinct governance act, separate from the QA pass itself. |

All other 45 videos: **Not Started** on every axis — no package directory exists, no artifact
has been produced, per this session's explicit "do not produce Video 02" instruction.

---

## 24. Production Workflow

Standard lifecycle every video package follows (maps onto framework §1's nine stages and this
manifest's four status axes):

```
Workflow Selected (§29 automation rule)
        ↓
Production Package  (Stages 1–7, 9 — Selection → Grounding → Capture → Script →
        ↓             Timing → Visual Direction → Subtitling → QA)
Rendering            (Stage 8 — Assembly: record/composite/render to .mp4)
        ↓
Quality Assurance    (framework §16 checklist against the current render)
        ↓
Approval             (explicit stakeholder/user sign-off — distinct from QA)
        ↓
Repository Update    (this manifest's status columns + docs/roadmap.md, §19/§21)
        ↓
Complete
```

```mermaid
flowchart LR
    A[Not Started] --> B[In Progress]
    B --> C[Production Package Complete]
    C --> D[Rendered]
    D -.optional.-> E[Narrated]
    D --> F[QA Complete]
    E --> F
    F --> G[Approved]
    G --> H[Published]
```

---

## 25. Video Manifest Table

One row per catalogue workflow, 46 total, split across three linked tables (by **Video Number**)
for readability — a single 20-column table would be unmaintainable at this width. Every workflow
appears exactly once; numbering is sequential 01–46; no orphan rows exist (validated against the
catalogue's own 46-row total, §4.1–§4.4).

### Table A — Workflow Identification & Scope

Video Title is identical to Workflow Name by design: framework §25's Opening Sequence template
titles every video "Demonstration NN: `<Workflow Name>`" verbatim, so the two are not
independently authored.

| # | Workflow ID | Video Title / Workflow Name | Business Area | Primary Module(s) |
|---|---|---|---|---|
| 01 | L1-01 | Risk Assessment Approval | Enterprise & Operational Risk Management | RISK |
| 02 | L1-02 | Risk Treatment Plan Approval | Enterprise & Operational Risk Management | RISK |
| 03 | L1-03 | Risk Acceptance | Enterprise & Operational Risk Management | RISK |
| 04 | L1-04 | KRI Breach → Escalation Acknowledgement | Enterprise & Operational Risk Management | RISK |
| 05 | L1-05 | Control Test Execution & Result Capture | Internal Controls | CONTROLS |
| 06 | L1-06 | Control Exception Lifecycle | Internal Controls | CONTROLS |
| 07 | L1-07 | Compliance Assessment Approval | Compliance Management | COMPLIANCE |
| 08 | L1-08 | Regulatory Change → Obligation Update | Compliance Management | COMPLIANCE |
| 09 | L1-09 | Compliance Exception Disposition | Compliance Management | COMPLIANCE |
| 10 | L1-10 | Compliance Attestation | Compliance Management | COMPLIANCE |
| 11 | L1-11 | Audit Plan Approval | Audit Management | AUDIT |
| 12 | L1-12 | Audit Finding Closure | Audit Management | AUDIT |
| 13 | L1-13 | Security Finding Remediation & Closure | Cybersecurity Governance | SECURITY |
| 14 | L1-14 | Privileged Access Grant Lifecycle | Cybersecurity Governance | SECURITY |
| 15 | L1-15 | Policy Authoring → Review → Publication | Policy Management | POLICY |
| 16 | L1-16 | Policy Acknowledgement Campaign | Policy Management | POLICY |
| 17 | L1-17 | Policy Periodic Review / Re-Attestation | Policy Management | POLICY |
| 18 | L1-18 | Policy Exception → CAPA | Policy Management → Incident/CAPA | POLICY, INCIDENT |
| 19 | L1-19 | Incident Intake → Investigation → Closure | Incident, Issue & CAPA Management | INCIDENT |
| 20 | L1-20 | Root Cause Analysis Approval | Incident, Issue & CAPA Management | INCIDENT |
| 21 | L1-21 | Issue → CAPA Full Lifecycle | Incident, Issue & CAPA Management | INCIDENT |
| 22 | L1-22 | SLA/Escalation Acknowledgement | Incident, Issue & CAPA Management | INCIDENT |
| 23 | L1-23 | Vendor Onboarding Due Diligence | Third-Party Risk Management | TPR |
| 24 | L1-24 | Vendor SLA Breach → Exception → CAPA | Third-Party Risk → Incident/CAPA | TPR, INCIDENT |
| 25 | L1-25 | Vendor Offboarding | Third-Party Risk Management | TPR |
| 26 | L1-26 | Critical Service BIA Approval | Business Continuity Management | BCP |
| 27 | L1-27 | Continuity/DR Plan Authoring → Publication | Business Continuity Management | BCP |
| 28 | L1-28 | Continuity Exercise → Exception → CAPA | Business Continuity → Incident/CAPA | BCP, INCIDENT |
| 29 | L1-29 | DR/Crisis Plan Activation | Business Continuity Management | BCP |
| 30 | L1-30 | Report Instance Generation → Approval → Distribution | Regulatory & Executive Reporting | REPORTING |
| 31 | L1-31 | KPI/Metric Catalogue & Threshold Banding Walkthrough | Risk Analytics & KPI Management | ANALYTICS |
| 32 | L2-07 | Cross-Module Drill-Down & Global Search | Cross-Module Navigation & Search | RISK, CONTROLS, SECURITY, INCIDENT |
| 33 | L2-10 | Executive/Board Dashboard Review | Executive & Board Reporting | REPORTING, ANALYTICS, all modules |
| 34 | L2-02 | Audit Finding → Risk + Control + CAPA Fan-Out | Audit → Risk + Controls + Incident/CAPA | AUDIT, RISK, CONTROLS, INCIDENT |
| 35 | L2-03 | Compliance Breach → Risk → Audit Validation | Compliance → Risk → Audit | COMPLIANCE, RISK, AUDIT |
| 36 | L2-04 | Security Finding → Risk + Incident + CAPA | Cybersecurity → Risk + Incident/CAPA | SECURITY, RISK, INCIDENT |
| 37 | L2-01 | Control Failure → Risk Register Entry | Internal Controls → Enterprise Risk | CONTROLS, RISK |
| 38 | L2-05 | Risk Treatment → Control Mapping Closure | Enterprise Risk → Internal Controls | RISK, CONTROLS |
| 39 | L2-06 | Third-Party Risk Fan-Out | Third-Party Risk → Controls + Compliance + Incident | TPR, CONTROLS, COMPLIANCE, INCIDENT |
| 40 | L2-09 | Multi-Source Exception → Unified CAPA | Policy + Controls + Compliance → Incident/CAPA | POLICY, CONTROLS, COMPLIANCE, INCIDENT |
| 41 | L2-08 | Control–Compliance Obligation Mapping | Internal Controls ↔ Compliance Management | CONTROLS, COMPLIANCE |
| 42 | L3-01 | Enterprise Risk-to-Assurance Full Lifecycle | Enterprise Risk → Assurance | RISK, CONTROLS, AUDIT, REPORTING |
| 43 | L3-02 | Regulatory Inspection Readiness Journey | Regulatory Inspection Readiness | COMPLIANCE, AUDIT, POLICY, REPORTING |
| 44 | L3-03 | Incident-to-Board-Reporting Journey | Security Incident → Board Reporting | SECURITY, INCIDENT, RISK, REPORTING |
| 45 | L3-04 | Third-Party & Business Continuity Resilience Journey | Third-Party & Business Continuity Resilience | TPR, BCP, CONTROLS, INCIDENT, REPORTING |
| 46 | L4-01 | Complete Governance Approval Journey | Enterprise-Wide GRC (capstone) | All 11 modules |

### Table B — Personas, Duration, Complexity, Dependencies, Prototype Scope

Estimated Duration applies framework §4's tier bands (L1 Simple 6–10 min; L1 Medium 8–14 min;
L2 15–20 min; L3 28–35 min; L4 60–85 min). Video 01's own *measured* result (16:55) exceeded its
nominal band due to one-time platform-orientation content (§11, §20) — treat every band below as
a baseline that a first-in-module-family video may exceed and a repeat-module video should
approach or beat. Required Prototype Features are the catalogue's own Start → End Screen scope
(catalogue §4) as the pre-production baseline; every video additionally requires the prototype's
persona-picker/switcher as standing infrastructure, and any `MC=Y` workflow additionally requires
the Checker Queue.

| # | Maker Persona | Checker / Secondary Persona | Est. Duration | Est. Complexity | Dependencies (Video #) | Required Prototype Scope (Start → End Screen) |
|---|---|---|---|---|---|---|
| 01 | Arjun Mehta (Risk Manager) | Priya Raghunathan (CRO) | 16:55 (measured) | Simple | None (foundational) | Risk Register list → Risk Detail (Decision History) |
| 02 | Arjun Mehta | Priya Raghunathan | 6–10 min | Simple | V01 | Risk Detail → Treatment Plan Detail |
| 03 | Arjun Mehta | Priya Raghunathan | 6–10 min | Simple | V01 | Risk Detail → Acceptance record (Approved/Expired) |
| 04 | System (auto) | Priya Raghunathan | 8–14 min | Medium | V01 | KRI Dashboard → Escalation acknowledged |
| 05 | Sneha Kulkarni (Control Owner) | Deepak Malhotra (Head of Compliance) | 6–10 min | Simple | None (foundational) | Control Detail → Test result recorded |
| 06 | Sneha Kulkarni | Deepak Malhotra | 6–10 min | Simple | V05 | Exceptions list → Exception Detail (CLOSED) |
| 07 | Kavitha Subramanian (Compliance Officer) | Deepak Malhotra | 6–10 min | Simple | None (foundational) | Obligation Detail → Assessment Detail (Approved) |
| 08 | Kavitha Subramanian | Deepak Malhotra | 8–14 min | Medium | V07 | Regulatory Change list → Obligation updated (SUPERSEDED/ACTIVE) |
| 09 | Kavitha Subramanian | Deepak Malhotra | 8–14 min | Medium | V07 | Exceptions list → Exception Detail (CLOSED/RISK_ACCEPTED) |
| 10 | Kavitha Subramanian | Deepak Malhotra | 6–10 min | Simple | V07 | Attestations list → Attestation Detail (ATTESTED) |
| 11 | Vikram Singh (Internal Auditor) | Meera Krishnan (Head of Internal Audit) | 6–10 min | Simple | None (foundational) | Audit Plans list → Plan Detail (APPROVED) |
| 12 | Vikram Singh | Meera Krishnan | 6–10 min | Simple | V11 | Findings list → Finding Detail (CLOSED) |
| 13 | Imran Shaikh (Security Analyst) | Rohan Nair (CISO) | 6–10 min | Simple | None (foundational) | Findings list → Finding Detail (CLOSED) |
| 14 | Imran Shaikh | Rohan Nair | 6–10 min | Simple | V13 | Access Grants list → Grant ACTIVE/EXPIRED/REVOKED |
| 15 | Anita Deshpande (Company Secretary & Policy Owner) | Deepak Malhotra | 6–10 min | Simple | None (foundational) | Policies list → Policy Detail (ACTIVE) |
| 16 | Any employee | Anita Deshpande | 6–10 min | Simple | V15 | Policy Detail → Acknowledgement recorded |
| 17 | Anita Deshpande | Deepak Malhotra | 6–10 min | Simple | V15 | Policy Detail → Review Detail (APPROVED) |
| 18 | Anita Deshpande | Lakshmi Venkataraman (Incident & CAPA Manager) | 8–14 min | Medium | V15 or V17; informally V21* (see §15) | Exception Detail → CAPA request created (INCIDENT) |
| 19 | Lakshmi Venkataraman | Priya Raghunathan | 6–10 min | Simple | None (foundational) | Incidents list → Incident Detail (CLOSED) |
| 20 | Lakshmi Venkataraman | Priya Raghunathan | 6–10 min | Simple | V19 | RCA Detail (Draft) → RCA Detail (APPROVED) |
| 21 | Lakshmi Venkataraman | Priya Raghunathan | 8–14 min | Medium | V19 or V20 | Issue Detail → CAPA Detail (CLOSED, effectiveness reviewed) |
| 22 | System (auto) | Priya Raghunathan | 6–10 min | Simple | V19 | Escalation list → Escalation ACKNOWLEDGED |
| 23 | Farhan Qureshi (Vendor Risk Manager) | Rajesh Iyer (COO) | 8–14 min | Medium | None (foundational) | Vendors list → Vendor Detail (ACTIVE) |
| 24 | System (auto), then Farhan Qureshi | Rajesh Iyer | 8–14 min | Medium | V23 | SLA Detail → Exception Detail → CAPA request |
| 25 | Farhan Qureshi | Rajesh Iyer | 6–10 min | Simple | V23 | Vendor Detail (ACTIVE) → Vendor Detail (TERMINATED) |
| 26 | Suresh Menon (BCM Manager) | Rajesh Iyer | 6–10 min | Simple | None (foundational) | Critical Services list → Service Detail (ACTIVE, RTO/RPO set) |
| 27 | Suresh Menon | Rajesh Iyer | 6–10 min | Simple | V26 | Plans list → Plan Detail (ACTIVE) |
| 28 | Suresh Menon | Rajesh Iyer, Lakshmi Venkataraman | 8–14 min | Medium | V27 | Exercise Detail → Exception Detail → CAPA → Action Items |
| 29 | Suresh Menon | Rajesh Iyer | 8–14 min | Medium | V27, V28 (recommended — not in catalogue §5, see §15/§21) | Plan Detail → Activation record (DEACTIVATED, RTO met?) |
| 30 | Divya Pillai (MIS & Reporting Analyst) | Deepak Malhotra | 6–10 min | Simple | None (foundational) | Report Definitions list → Report Instance Detail (APPROVED) |
| 31 | Divya Pillai | Priya Raghunathan | 6–10 min | Simple | V30 (recommended — not in catalogue §5, see §15/§21) | Analytics Dashboard → MetricView drill-down |
| 32 | Any persona | — | 15–20 min | Medium | None (foundational) | Risk Detail (Relationships tab) → Global Search results |
| 33 | Nandini Rao (Board Risk Committee) | — | 15–20 min | Medium | None strictly; recommended after V01 | Enterprise Home → all 11 module dashboards → Board & Executive GRC Summary |
| 34 | Vikram Singh | Meera Krishnan, Priya Raghunathan, Sneha Kulkarni, Lakshmi Venkataraman | 15–20 min | Complex | V11, V12, V06, V21 | Finding Detail → linked Risk + new Control + Follow-Up CAPA |
| 35 | Kavitha Subramanian | Deepak Malhotra, Vikram Singh | 15–20 min | Complex | V07, V09, V01, V12 | Exception Detail → Risk Detail → Audit Finding (COMPLIANCE_GAP) |
| 36 | Imran Shaikh | Rohan Nair, Priya Raghunathan, Lakshmi Venkataraman | 15–20 min | Complex | V13, V01, V21 | Finding Detail → Risk Detail + Issue/CAPA thread |
| 37 | Sneha Kulkarni | Priya Raghunathan, Deepak Malhotra | 15–20 min | Medium | V05, V06, V01 | Control Test Detail → new Risk Detail (source=CONTROL_TEST) |
| 38 | Arjun Mehta | Sneha Kulkarni | 15–20 min | Medium | V02, V05 | Treatment Plan Detail → Control Detail (linked) → Risk residual score updated |
| 39 | Farhan Qureshi | Rajesh Iyer, Sneha Kulkarni, Kavitha Subramanian | 15–20 min | Complex | V23, V05, V07 | Vendor Detail → linked Control + Obligation + Incident |
| 40 | Varies by exception source | Lakshmi Venkataraman | 15–20 min | Complex | V06, V09, V18 | Three Exception Detail screens → one Issue/CAPA thread each |
| 41 | Sneha Kulkarni | Kavitha Subramanian | 15–20 min | Medium | V05, V07 | Control Detail (Relationships) → Obligation Detail |
| 42 | Arjun Mehta | Sneha Kulkarni, Vikram Singh, Meera Krishnan, Priya Raghunathan, Divya Pillai | 28–35 min | Complex | V01, V05, V06, V11, V12, V30 | Risk Register → Control Test → Audit Finding/Engagement → Board Report |
| 43 | Kavitha Subramanian | Deepak Malhotra, Vikram Singh, Anita Deshpande, Divya Pillai | 28–35 min | Complex | V07, V08, V09, V10, V11, V12, V15 | Obligation Register → Evidence/Attestation trail → Audit Findings → Quarterly Compliance Report |
| 44 | Imran Shaikh | Rohan Nair, Lakshmi Venkataraman, Priya Raghunathan, Divya Pillai | 28–35 min | Complex | V13, V19, V20, V21, V30 | Finding Detail → Incident/RCA/CAPA → Risk update → Board Report |
| 45 | Farhan Qureshi | Suresh Menon, Sneha Kulkarni, Lakshmi Venkataraman, Rajesh Iyer | 28–35 min | Complex | V23, V24, V26, V27, V28 | Vendor Detail → Critical Service/BIA → DR Exercise → Exception/CAPA → Resilience Report |
| 46 | Rotates across all 16 personas | — | 60–85 min | Complex | All of V01–V45 (compilation) | Login (persona picker) → all 11 module walkthroughs → Board & Executive GRC Summary → Reset demo data |

### Table C — Status, Repository Output & Traceability

| # | Production Package | Rendering | QA | Approval | Repository Folder | Output MP4 | Related Deck | Related Catalogue Entry |
|---|---|---|---|---|---|---|---|---|
| 01 | Production Package Complete | Rendered (Version 1 — Silent) | QA Complete (Version 1 scope) | Not Started | `demos/video-01-risk-assessment-approval/` | `video-01-risk-assessment-approval.mp4` | `deck-01-risk-assessment-approval/` | Catalogue §4.1, row L1-01 |
| 02 | Not Started | Not Started | Not Started | Not Started | `demos/video-02-risk-treatment-plan-approval/` | `video-02-risk-treatment-plan-approval.mp4` | Not produced | Catalogue §4.1, row L1-02 |
| 03 | Not Started | Not Started | Not Started | Not Started | `demos/video-03-risk-acceptance/` | `video-03-risk-acceptance.mp4` | Not produced | Catalogue §4.1, row L1-03 |
| 04 | Not Started | Not Started | Not Started | Not Started | `demos/video-04-kri-breach-escalation-acknowledgement/` | `video-04-kri-breach-escalation-acknowledgement.mp4` | Not produced | Catalogue §4.1, row L1-04 |
| 05 | Not Started | Not Started | Not Started | Not Started | `demos/video-05-control-test-execution-result-capture/` | `video-05-control-test-execution-result-capture.mp4` | Not produced | Catalogue §4.1, row L1-05 |
| 06 | Not Started | Not Started | Not Started | Not Started | `demos/video-06-control-exception-lifecycle/` | `video-06-control-exception-lifecycle.mp4` | Not produced | Catalogue §4.1, row L1-06 |
| 07 | Not Started | Not Started | Not Started | Not Started | `demos/video-07-compliance-assessment-approval/` | `video-07-compliance-assessment-approval.mp4` | Not produced | Catalogue §4.1, row L1-07 |
| 08 | Not Started | Not Started | Not Started | Not Started | `demos/video-08-regulatory-change-obligation-update/` | `video-08-regulatory-change-obligation-update.mp4` | Not produced | Catalogue §4.1, row L1-08 |
| 09 | Not Started | Not Started | Not Started | Not Started | `demos/video-09-compliance-exception-disposition/` | `video-09-compliance-exception-disposition.mp4` | Not produced | Catalogue §4.1, row L1-09 |
| 10 | Not Started | Not Started | Not Started | Not Started | `demos/video-10-compliance-attestation/` | `video-10-compliance-attestation.mp4` | Not produced | Catalogue §4.1, row L1-10 |
| 11 | Not Started | Not Started | Not Started | Not Started | `demos/video-11-audit-plan-approval/` | `video-11-audit-plan-approval.mp4` | Not produced | Catalogue §4.1, row L1-11 |
| 12 | Not Started | Not Started | Not Started | Not Started | `demos/video-12-audit-finding-closure/` | `video-12-audit-finding-closure.mp4` | Not produced | Catalogue §4.1, row L1-12 |
| 13 | Not Started | Not Started | Not Started | Not Started | `demos/video-13-security-finding-remediation-closure/` | `video-13-security-finding-remediation-closure.mp4` | Not produced | Catalogue §4.1, row L1-13 |
| 14 | Not Started | Not Started | Not Started | Not Started | `demos/video-14-privileged-access-grant-lifecycle/` | `video-14-privileged-access-grant-lifecycle.mp4` | Not produced | Catalogue §4.1, row L1-14 |
| 15 | Not Started | Not Started | Not Started | Not Started | `demos/video-15-policy-authoring-review-publication/` | `video-15-policy-authoring-review-publication.mp4` | Not produced | Catalogue §4.1, row L1-15 |
| 16 | Not Started | Not Started | Not Started | Not Started | `demos/video-16-policy-acknowledgement-campaign/` | `video-16-policy-acknowledgement-campaign.mp4` | Not produced | Catalogue §4.1, row L1-16 |
| 17 | Not Started | Not Started | Not Started | Not Started | `demos/video-17-policy-periodic-review-reattestation/` | `video-17-policy-periodic-review-reattestation.mp4` | Not produced | Catalogue §4.1, row L1-17 |
| 18 | Not Started | Not Started | Not Started | Not Started | `demos/video-18-policy-exception-to-capa/` | `video-18-policy-exception-to-capa.mp4` | Not produced | Catalogue §4.1, row L1-18 |
| 19 | Not Started | Not Started | Not Started | Not Started | `demos/video-19-incident-intake-investigation-closure/` | `video-19-incident-intake-investigation-closure.mp4` | Not produced | Catalogue §4.1, row L1-19 |
| 20 | Not Started | Not Started | Not Started | Not Started | `demos/video-20-root-cause-analysis-approval/` | `video-20-root-cause-analysis-approval.mp4` | Not produced | Catalogue §4.1, row L1-20 |
| 21 | Not Started | Not Started | Not Started | Not Started | `demos/video-21-issue-capa-full-lifecycle/` | `video-21-issue-capa-full-lifecycle.mp4` | Not produced | Catalogue §4.1, row L1-21 |
| 22 | Not Started | Not Started | Not Started | Not Started | `demos/video-22-sla-escalation-acknowledgement/` | `video-22-sla-escalation-acknowledgement.mp4` | Not produced | Catalogue §4.1, row L1-22 |
| 23 | Not Started | Not Started | Not Started | Not Started | `demos/video-23-vendor-onboarding-due-diligence/` | `video-23-vendor-onboarding-due-diligence.mp4` | Not produced | Catalogue §4.1, row L1-23 |
| 24 | Not Started | Not Started | Not Started | Not Started | `demos/video-24-vendor-sla-breach-exception-capa/` | `video-24-vendor-sla-breach-exception-capa.mp4` | Not produced | Catalogue §4.1, row L1-24 |
| 25 | Not Started | Not Started | Not Started | Not Started | `demos/video-25-vendor-offboarding/` | `video-25-vendor-offboarding.mp4` | Not produced | Catalogue §4.1, row L1-25 |
| 26 | Not Started | Not Started | Not Started | Not Started | `demos/video-26-critical-service-bia-approval/` | `video-26-critical-service-bia-approval.mp4` | Not produced | Catalogue §4.1, row L1-26 |
| 27 | Not Started | Not Started | Not Started | Not Started | `demos/video-27-continuity-dr-plan-authoring-publication/` | `video-27-continuity-dr-plan-authoring-publication.mp4` | Not produced | Catalogue §4.1, row L1-27 |
| 28 | Not Started | Not Started | Not Started | Not Started | `demos/video-28-continuity-exercise-exception-capa/` | `video-28-continuity-exercise-exception-capa.mp4` | Not produced | Catalogue §4.1, row L1-28 |
| 29 | Not Started | Not Started | Not Started | Not Started | `demos/video-29-dr-crisis-plan-activation/` | `video-29-dr-crisis-plan-activation.mp4` | Not produced | Catalogue §4.1, row L1-29 |
| 30 | Not Started | Not Started | Not Started | Not Started | `demos/video-30-report-instance-generation-approval-distribution/` | `video-30-report-instance-generation-approval-distribution.mp4` | Not produced | Catalogue §4.1, row L1-30 |
| 31 | Not Started | Not Started | Not Started | Not Started | `demos/video-31-kpi-metric-catalogue-threshold-banding-walkthrough/` | `video-31-kpi-metric-catalogue-threshold-banding-walkthrough.mp4` | Not produced | Catalogue §4.1, row L1-31 |
| 32 | Not Started | Not Started | Not Started | Not Started | `demos/video-32-cross-module-drill-down-global-search/` | `video-32-cross-module-drill-down-global-search.mp4` | Not produced | Catalogue §4.2, row L2-07 |
| 33 | Not Started | Not Started | Not Started | Not Started | `demos/video-33-executive-board-dashboard-review/` | `video-33-executive-board-dashboard-review.mp4` | Not produced | Catalogue §4.2, row L2-10 |
| 34 | Not Started | Not Started | Not Started | Not Started | `demos/video-34-audit-finding-risk-control-capa-fan-out/` | `video-34-audit-finding-risk-control-capa-fan-out.mp4` | Not produced | Catalogue §4.2, row L2-02 |
| 35 | Not Started | Not Started | Not Started | Not Started | `demos/video-35-compliance-breach-risk-audit-validation/` | `video-35-compliance-breach-risk-audit-validation.mp4` | Not produced | Catalogue §4.2, row L2-03 |
| 36 | Not Started | Not Started | Not Started | Not Started | `demos/video-36-security-finding-risk-incident-capa/` | `video-36-security-finding-risk-incident-capa.mp4` | Not produced | Catalogue §4.2, row L2-04 |
| 37 | Not Started | Not Started | Not Started | Not Started | `demos/video-37-control-failure-risk-register-entry/` | `video-37-control-failure-risk-register-entry.mp4` | Not produced | Catalogue §4.2, row L2-01 |
| 38 | Not Started | Not Started | Not Started | Not Started | `demos/video-38-risk-treatment-control-mapping-closure/` | `video-38-risk-treatment-control-mapping-closure.mp4` | Not produced | Catalogue §4.2, row L2-05 |
| 39 | Not Started | Not Started | Not Started | Not Started | `demos/video-39-third-party-risk-fan-out/` | `video-39-third-party-risk-fan-out.mp4` | Not produced | Catalogue §4.2, row L2-06 |
| 40 | Not Started | Not Started | Not Started | Not Started | `demos/video-40-multi-source-exception-unified-capa/` | `video-40-multi-source-exception-unified-capa.mp4` | Not produced | Catalogue §4.2, row L2-09 |
| 41 | Not Started | Not Started | Not Started | Not Started | `demos/video-41-control-compliance-obligation-mapping/` | `video-41-control-compliance-obligation-mapping.mp4` | Not produced | Catalogue §4.2, row L2-08 |
| 42 | Not Started | Not Started | Not Started | Not Started | `demos/video-42-enterprise-risk-to-assurance-full-lifecycle/` | `video-42-enterprise-risk-to-assurance-full-lifecycle.mp4` | Not produced | Catalogue §4.3, row L3-01 |
| 43 | Not Started | Not Started | Not Started | Not Started | `demos/video-43-regulatory-inspection-readiness-journey/` | `video-43-regulatory-inspection-readiness-journey.mp4` | Not produced | Catalogue §4.3, row L3-02 |
| 44 | Not Started | Not Started | Not Started | Not Started | `demos/video-44-incident-to-board-reporting-journey/` | `video-44-incident-to-board-reporting-journey.mp4` | Not produced | Catalogue §4.3, row L3-03 |
| 45 | Not Started | Not Started | Not Started | Not Started | `demos/video-45-third-party-business-continuity-resilience-journey/` | `video-45-third-party-business-continuity-resilience-journey.mp4` | Not produced | Catalogue §4.3, row L3-04 |
| 46 | Not Started | Not Started | Not Started | Not Started | `demos/video-46-complete-governance-approval-journey/` | `video-46-complete-governance-approval-journey.mp4` | Not produced | Catalogue §4.4, row L4-01 |

**Notes** (only rows with a note beyond "standard, no exceptions" are listed):

- **#01**: See §23 Current Status for full detail. Version 1 is silent by explicit user
  instruction (Session 26), not a tooling failure — the rendering pipeline is narration-ready for
  a future Version 2 (`asset-inventory.md` Future Work).
- **#18**: See §15's flagged ordering tension (informal CAPA-concept dependency on V21, produced
  later) and the recommended mitigation (self-contained CAPA explanation within this video's own
  script).
- **#28**: Introduces the framework's Cross-Module Transition chapter type (framework §13) for
  the first time in the Level 1 tier — the Exercise → Exception → CAPA chain crosses BCP into
  INCIDENT.
- **#29**: Dependency is a manifest recommendation, not a catalogue-documented rule (§15, §21).
- **#31**: Dependency is a manifest recommendation, not a catalogue-documented rule (§15, §21);
  `MC=N` per catalogue (Analytics has no governed action) — Governance Review chapter (framework
  §13 item 4) is omitted for this video.
- **#32, #33**: `MC=N`/mixed per catalogue — L2-07 has no governance choreography at all; L2-10
  is a pure dashboard read session. Both omit or narrow the Governance Review chapter accordingly
  (framework §13 item 4).
- **#34–#41**: First appearance of the framework's Cross-Module Transition chapter as a
  *required*, not incidental, chapter type (framework §13) — every Level 2 video names an
  explicit module handoff in its own catalogue row.
- **#42–#45**: Level 3 videos nest multiple Overview→Walkthrough→Governance→Outcome micro-arcs
  inside one runtime (framework §13, "L3/L4 arc chapters") — expect proportionally higher
  production effort per video than any Level 1/2 entry, consistent with catalogue §8's own
  Complex-tier effort multiplier (deck medium) as a directional (not literal) signal.
- **#46**: Capstone; reuses the overwhelming majority of its screenshots and narration beats from
  Videos 01–45 per framework §20 — expect this to be the lowest *net-new* capture effort per
  runtime-minute in the series despite being its longest single video.

---

## 26. Next Recommended Video

**Video 02 — Risk Treatment Plan Approval (L1-02).**

- **Why it is next**: it is the first Not Started row in Video Number order (§25 Table C) whose
  Dependencies are already satisfied — §29's automation rule, applied directly.
- **Dependencies satisfied**: V01 (Risk Assessment Approval) is Production Package Complete and
  Rendered — the only prerequisite catalogue §5 names for L1-02.
- **Expected effort**: Simple tier, 6–10 min framework band (§25 Table B) — and, unlike Video 01,
  this is the *second* video in the RISK module family, so its Domain/Module Overview chapter
  (framework §13 item 2) should be the shortened variant, not Video 01's full-length one,
  plausibly bringing its actual runtime closer to the nominal band than Video 01's own 16:55.
- **Personas involved**: Arjun Mehta (Risk Manager, maker) and Priya Raghunathan (CRO, checker) —
  the identical maker/checker pair as Video 01, so their persona cards (framework §12) and the
  tenant-context beat (Meridian AMC framing) are directly reusable in shortened form (framework
  §25 Persona Introduction template).
- **Expected deliverables**: the full nine-document package (`source-workflow.md` through
  `asset-inventory.md`) plus a `screenshots/` capture of RSK-2026-0004 or an equivalent
  `ACTIVE` risk's treatment-plan submission/approval flow (catalogue's Start → End Screen:
  Risk Detail → Treatment Plan Detail), following the same live-capture, zero-modification
  discipline Video 01 established. Rendering (Stage 8) requires re-confirming current tooling
  availability first (§8, §10) rather than assuming Session 26's findings still hold, and an
  explicit decision — the same three-option pattern framework §17 already fixes — on whether this
  video ships as another Version 1 Silent Demonstration or attempts real narration.

---

## 27. Production Workflow

See §24 above (numbered ahead of this section only because the task brief's own section list
placed "Production Status Definitions" through "Known Constraints" before it; retained here as
its own numbered heading for direct reference from §29).

## 28. Automation Guidance

Designed so a future session can be given exactly the instruction **"Produce the next pending
video from the Video Production Manifest"** and proceed without manual workflow selection:

1. Read this manifest's §25 Table C, top to bottom by Video Number.
2. The next pending video is the **first row whose Production Package Status is "Not Started."**
   Because §6's video ordering already sequences every row after its own dependencies by
   construction, no separate dependency check is needed in the common case — the Dependencies
   column (§25 Table B) exists for audit/traceability, not as a second gate.
3. **Exception**: if that row is #18 (the flagged L1-18/L1-21 tension, §15/§21) or #29/#31 (the
   recommended-not-documented dependencies, §15/§21), a producing session should read §15's full
   note before proceeding — not because the automation rule breaks, but because those three rows
   carry a documented judgment call the producing session should make consciously rather than
   silently inherit.
4. Proceed through the standard lifecycle (§24/§27) using that row's own Table A/B data (Workflow
   ID, Modules, Personas, Required Prototype Scope) as the Stage 1–2 starting point, per the
   framework's own "How to use this document" instruction.
5. On completion of any stage, update that row's status cell(s) in §25 Table C in the same
   session, then update `docs/roadmap.md` per §19/§21 — this manifest is never left stale
   relative to the package it describes.

No step above requires the requesting user to name a workflow, a module, or a Video Number —
this manifest is deliberately structured so that instruction alone is sufficient.

---

## Traceability

- **Business Requirement**: Provide a single, authoritative planning and status-tracking
  artifact for the entire 46-video ERM demonstration series, so future production sessions can
  act on the instruction "produce the next pending video" without re-deriving sequencing,
  dependencies, or status from the catalogue and framework documents separately each time.
- **Regulatory Requirement**: None directly — this is a production-planning artifact. Individual
  future videos inherit the regulatory grounding of the workflows they depict, via their own
  `source-workflow.md`, exactly as Video 01's did; this manifest cites but does not restate that
  grounding.
- **PRSMTD Capability**: None consumed or required — this document governs demonstration-video
  sequencing and status only; no stage of the pipeline it references (framework §1) reads from
  or writes to PRSMTD.
- **ERM Capability**: N/A — demonstration/process collateral (`demos/`), not an ERM domain
  capability; not added to `docs/22-traceability/`'s matrices, consistent with how the catalogue,
  the framework, and Video 01's own companion documents are all scoped.
- **Dependencies**: [`docs/19-roadmap/01-demonstration-workflow-catalogue.md`](../docs/19-roadmap/01-demonstration-workflow-catalogue.md)
  (authoritative workflow definitions, dependency matrix, deck build order);
  [`video-production-framework.md`](video-production-framework.md) (authoritative production
  standards and templates); [`video-01-risk-assessment-approval/`](video-01-risk-assessment-approval/)
  (the only currently-existing video package, and this manifest's sole real status/effort data
  point); `docs/roadmap.md` (session history and repository-wide progress tracking).
- **Future Work**: Produce Video 02 using this manifest once explicitly commissioned (out of
  scope for this session); resolve the L1-18/L1-21 catalogue sequencing tension and the L1-29/
  L1-31 missing-dependency gap the next time the catalogue itself is revisited (§15, §21);
  populate a real per-video effort/runtime model once 2–3 more videos exist (§17); create
  `demos/_shared/` when cross-video asset sharing first becomes concrete (§22); resolve the
  standing TTS/voice-talent and licensed-music tooling gaps before any video can reach "Narrated"
  (§18, §21).

## Amendment Log

*(Empty at v1.0 — authored in full for the first time this session. Future revisions to any rule
or status value in this document are recorded here as dated, numbered entries, mirroring
`video-production-framework.md`'s own Amendment Log discipline, §21 of this document.)*

# Recording Log — Demonstration Video 01: Risk Assessment Approval

Chronological log of what was actually executed to produce this package's screenshots,
distinct from `source-workflow.md` (what the workflow *is*) and `asset-inventory.md` (what
files exist). Dated 2026-08-06.

## Environment

- Repository: `c:\development\projects\ERM`, branch `main`.
- Application under capture: `prototype/` (Next.js 14.2.4 UX reference application), started
  via its own documented `npm run dev` script, unmodified, on port 3100.
- Capture tool: Playwright (Node.js), Chromium 151.0.7922.34, headless, viewport
  **1920×1080**, device scale factor 1 — matching the brief's target final video resolution,
  and a step up from `deck-01-risk-assessment-approval`'s 1440×900 captures.
- Playwright itself was installed **outside the repository**: as an npm package in this
  session's scratchpad working directory (`npm install playwright@1.62.1 --no-save`), with
  its Chromium/Chromium-headless-shell browser binaries downloaded to the user profile's
  `%LOCALAPPDATA%\ms-playwright` cache (Playwright's standard, project-independent install
  location). Nothing was added to `prototype/package.json`, `prototype/package-lock.json`, or
  `prototype/node_modules`.

## Sequence

1. Confirmed `git status --short prototype/` was empty before starting.
2. Started `npm run dev` in `prototype/` (background process, port 3100); confirmed
   "Ready" in the dev server log before proceeding.
3. Wrote a Playwright script driving the prototype exclusively through its own UI and routes
   — no direct edits to `prototype/src/data/*.json`, no localStorage seeding beyond what the
   app's own sign-in/workflow-action UI produces as a side effect of clicking through it. The
   prototype's client-side data store lives in browser `localStorage`, scoped to the Playwright
   browser context; a fresh context (as used here) starts from the app's own shipped seed data
   every time, with no reset step required.
4. Executed the script end to end, following `prototype/docs/user-journeys.md` §1 exactly:
   sign in as Arjun Mehta → Risk Register → RSK-2026-0004 detail → Submit Re-assessment
   (justification dialog) → submit → persona switch to Priya Raghunathan → Approvals / Checker
   Queue → Approve (decision dialog) → confirm → risk detail Approvals tab.
5. Captured a screenshot after each of the 8 meaningful business-state transitions (see
   `asset-inventory.md` for the full list and filenames) — the same 8 states
   `deck-01-risk-assessment-approval/screenshot-inventory.md` established as this workflow's
   canonical capture set, recaptured here at 1920×1080 rather than reused at 1440×900, since
   this package's target format is a 1920×1080 video (see `CLAUDE.md`'s video-format
   requirement) rather than a slide deck.
6. Stopped the `npm run dev` background process.
7. Confirmed `git status --short prototype/` was empty again after the entire capture pass.

## Issues encountered and resolved during capture (tooling only, not the prototype)

- **First script draft** located the checker-queue card by searching for the risk's title text
  (`"Credit default of a portfolio issuer…"`); this text is not actually rendered on the
  compact queue-card view (only the humanized action type, e.g. "Risk Reassessment — awaiting
  approval," and the maker's justification are shown there — the full risk title only appears
  on the linked detail page). Fixed by locating the card via its actual on-screen text and by
  relying on the queue's own newest-first ordering (confirmed: the new submission unshifts to
  the top of Priya's Checker Queue, consistent with `deck-01`'s own recorded observation about
  queue ordering) rather than a title-text search.
- **Playwright browser binaries**: the `chromium-headless-shell` build for the installed
  Playwright version was not present in the local browser cache (only two older Playwright
  versions' Chromium builds were cached, from unrelated prior tooling on this machine);
  resolved with a standard `npx playwright install chromium-headless-shell` (~114 MB
  download). This is a one-time local machine dependency, not a repository or prototype
  change.

Neither issue was a defect in the prototype, the specification, or the workflow definition —
both were script-authoring corrections made before any screenshot was accepted into the final
set. See `observations.md` for the substantive (non-tooling) findings from this capture pass.

## Verification

- Every one of the 8 accepted screenshots was visually reviewed against its intended business
  state (see `asset-inventory.md`) before being accepted into the final set; none required a
  retake.
- `git status --short` (full repository) after the capture pass and all documentation writing
  showed only the new, untracked `demos/video-01-risk-assessment-approval/` directory and this
  session's own `docs/roadmap.md` update — no changes anywhere under `prototype/`.

## Rendering pass (Session 26, 2026-08-07)

Distinct from the capture pass above: this section logs how
`video-01-risk-assessment-approval.mp4` (Version 1, Silent Demonstration — see
`asset-inventory.md`) was actually rendered, once a rendering path became available. The
`prototype/` was **not** touched in this pass — no `npm run dev`, no capture script; only the 8
screenshots already captured in Session 23 were used.

1. **Tooling gap re-checked directly** rather than assumed from Session 23's record: confirmed
   `ffmpeg` still absent, Windows SAPI (`System.Speech`) still the only TTS available (again
   declined — see `asset-inventory.md`), and Chocolatey present but blocked by lack of admin
   rights (`lib-bad` directory access denied).
2. **Obtained a portable static `ffmpeg` build** (gyan.dev `ffmpeg-release-essentials.zip`,
   version 9.0) — downloaded and extracted to the session's scratch directory (outside this
   repository, outside `PATH`), not installed system-wide. No admin rights required.
3. **Wrote `project/render_pipeline.py`** — a Python (Pillow + numpy) frame compositor that
   reads `scene-list.md`'s 33 scenes and `chapters.md`'s 10 chapter cards + closing card
   (reconciled against `timeline.md`'s authoritative timestamps) as a data table, renders every
   frame (zoom/pan via crop+resize, a precomputed radial-gradient cursor spotlight, callout
   balloons with clean alpha-only fades, click-pulse highlights, cross-fade/hard-cut
   transitions, and burned-in subtitles from `subtitles.srt`), and pipes raw RGB24 frames into
   `ffmpeg` for H.264/AAC encoding. On-screen anchor coordinates (row positions, button boxes,
   badge locations) for every callout and spotlight target were read directly off the actual
   1920×1080 screenshots, not estimated.
4. **Validated incrementally before committing to the full ~17-minute render**: rendered short
   `--preview` slices of each chapter and visually inspected extracted frames. This caught two
   real defects before the full render: (a) an off-by-one in the concept-plate connector-arrow
   coordinates that made the arrow overshoot into the adjacent box's text; (b) three emoji
   glyphs (padlock, heavy cross, check mark) that Segoe UI does not cover, rendering as tofu
   boxes. Both were fixed by replacing the emoji-text draw calls with small vector icons drawn
   from primitives (`draw_lock_icon`, `draw_check_icon`, reusing the existing `draw_ghost_x`)
   and correcting the arrow's gap-relative coordinate — verified fixed by re-rendering the same
   preview slices before proceeding.
5. **Full render**: 30,450 frames (16:55 at 30fps) rendered and encoded in ~22.5 minutes on this
   machine. Output verified via `ffprobe`: H.264/yuv420p/1920×1080/30fps video, AAC/48kHz/stereo
   audio (silent), duration 1015.00s video / 1014.997s audio (sub-frame AAC rounding, not a
   truncation), matching `timeline.md`'s 16:55 exactly.
6. **QA pass**: sampled frames across all 10 chapters, the Ending, and the closing card (in
   addition to the preview slices in step 4) — confirmed correct screen/screenshot at every
   sampled timestamp, correctly-positioned callouts and spotlights, working cross-fades and the
   two scripted hard cuts (Scenes 17 and 26, per `scene-list.md`), no further glyph or geometry
   glitches, and subtitle text matching `subtitles.srt` at every sampled point.
7. **Two scenes required an honest adaptation, not fabrication**, both flagged in
   `observations.md`: Scene 22's persona-switcher dropdown (never actually screenshotted per
   `scene-list.md`'s own note) was synthesized as a UI overlay anchored at the real user-menu
   coordinates on the actual `04-*` screenshot, rather than invented as a full fake screen; and
   Scene 29/30's "scoring panel" reference was adapted to callout only the status badge actually
   visible in the reused `07-*` screenshot (an Approvals-tab capture), since that capture does
   not show the Overview tab's scoring panel and inventing that region would not be a real
   screenshot.

## Traceability

- **Business Requirement**: Provide an auditable record of exactly how this package's visual
  assets — and, as of Session 26, its rendered video — were produced, for anyone reproducing or
  extending this deliverable.
- **Regulatory Requirement**: None.
- **PRSMTD Capability**: None — tooling/process log, not a platform capability.
- **ERM Capability**: N/A.
- **Dependencies**: `source-workflow.md`, `asset-inventory.md`, `project/render_pipeline.py`.
- **Future Work**: Re-run `project/render_pipeline.py --narration <track>` once real narration
  is recorded (see `audio/README.md`); no further capture or rendering-pipeline work is needed
  for that step.

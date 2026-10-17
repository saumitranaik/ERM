# Recording Log — Demonstration Video 02: Risk Treatment Plan Approval

Chronological log of what was actually executed to produce this package's screenshots and
rendered video, distinct from `source-workflow.md` (what the workflow *is*) and
`asset-inventory.md` (what files exist). Dated 2026-08-07.

## Environment

- Repository: `c:\development\projects\ERM`, branch `main`.
- Application under capture: `prototype/` (Next.js 14.2.4 UX reference application), started
  via its own documented `npm run dev` script, unmodified, on port 3100.
- Capture tool: Playwright (Node.js) 1.62.1, Chromium (cached from the prior video's session),
  headless, viewport **1920×1080**, device scale factor 1 — identical to Video 01's own capture
  configuration. Installed outside the repository (this session's scratchpad, `npm install
  playwright@1.62.1 --no-save`), reusing the already-cached Chromium binaries under
  `%LOCALAPPDATA%\ms-playwright` from Video 01's own session. Nothing added to
  `prototype/package.json`, `prototype/package-lock.json`, or `prototype/node_modules`.

## Sequence

1. Confirmed `git status --short prototype/` was empty before starting.
2. Started `npm run dev` in `prototype/` (background process, port 3100); confirmed the server
   responded (HTTP 200) before proceeding.
3. Explored the treatment-plan creation flow live (sign in as Arjun Mehta → Risk Detail
   RSK-2026-0004 → Relationships tab → New Treatment Plan → fill form → create → Submit for
   Approval → justification dialog → submit → persona switch to Priya Raghunathan → Approvals
   queue → Approve → decision comment → confirm) to ground `source-workflow.md`'s field values
   and confirm the exact UI states before writing any planning document — no screenshot was
   accepted from this exploratory pass.
4. Wrote a final Playwright capture script driving the prototype exclusively through its own UI
   and routes — no direct edits to `prototype/src/data/*.json`, no localStorage seeding beyond
   what the app's own UI produces as a side effect of clicking through it (same discipline as
   Video 01's own capture, `demos/video-01-risk-assessment-approval/recording-log.md`).
5. Executed the script end to end in a single fresh browser context, capturing a screenshot
   after each of 9 new meaningful business-state transitions (`02` through `10` — see
   `asset-inventory.md`), plus reusing 2 screenshots (`00`, `01`) verbatim from Video 01's own
   package rather than recapturing an identical business state (`source-workflow.md`
   "Precedent and continuity with Video 01").
6. Stopped the `npm run dev` background process.
7. Confirmed `git status --short prototype/` was empty again after the entire capture pass.

## Issues encountered and resolved during capture (tooling only, not the prototype)

- **Table-row navigation is not an anchor tag** — the Risk Register list's rows are
  `cursor-pointer` `<tr>` elements with a client-side router push, not `<a href>` links; an
  initial `locator('a', {hasText: ...}).click()` attempt timed out. Resolved by clicking the
  actual code cell's bounding-box coordinates directly (`page.mouse.click`), which correctly
  triggered the Next.js client-side navigation. Not a prototype defect — a capture-script
  authoring correction, matching the category of issue Video 01's own recording-log logged for
  its checker-queue card locator.
- **Ambiguous button-text locator inside a modal** — `button:has-text("Submit for approval")`
  matched both the underlying page's "Submit for Approval" trigger button and the dialog's own
  "Submit for approval" confirmation button (Playwright's text match is case-insensitive),
  causing a click to fail against an intercepting overlay. Resolved by scoping the locator to
  `[role="dialog"]` before finding the button. The same pattern recurred for the Approve
  action's "Confirm approve" dialog and was resolved the same way.
- **The in-page "Approvals" tab and the header's "Approvals" nav link share the word
  "Approvals"** — a plain `text=Approvals` click after navigating to a detail page selected the
  header nav link (routing to `/protected/approvals`) rather than the entity detail's own
  Approvals tab. Resolved by scoping to `[role="tab"]`.

Neither issue was a defect in the prototype, the specification, or the workflow definition —
all three were script-authoring corrections made before any screenshot was accepted into the
final set. See `observations.md` for the substantive (non-tooling) findings from this capture
pass.

## Verification

- Every one of the 9 newly-captured screenshots was visually reviewed against its intended
  business state (see `asset-inventory.md`) before being accepted into the final set; none
  required a retake.
- `git status --short` (full repository) after the capture pass and all documentation writing
  showed only the new, untracked `demos/video-02-risk-treatment-plan-approval/` directory and
  this session's own `docs/roadmap.md` / `demos/video-production-manifest.md` updates — no
  changes anywhere under `prototype/`.

## Rendering pass (same session, 2026-08-07)

Distinct from the capture pass above: this section logs how
`video-02-risk-treatment-plan-approval.mp4` (Version 1, Silent Demonstration) was rendered.

1. **Tooling gap re-checked directly**, per framework §17's standing disclosure protocol, rather
   than assumed from Video 01's Session 26 record: the same portable `ffmpeg` build Session 26
   obtained (`ffmpeg-9.0-essentials_build`, gyan.dev) was found still present in this machine's
   temp cache and confirmed working (`ffmpeg -version`); Python 3 with Pillow 12.2.0 and numpy
   2.3.3 were both already available. No professional TTS/voice-over resource and no licensed
   background music source are available in this environment, same standing gap Video 01
   disclosed (framework §14, §15, §17) — unresolved, not re-litigated here. This session's own
   instruction was explicit: produce a silent Version 1, exactly as Video 01's own precedent.
2. **Wrote `project/render_pipeline.py`** for this package, reusing Video 01's own generic
   compositing primitives (fonts, gradients, callout balloons, cursor spotlight, zoom/pan, pulse
   rings, chapter-card and concept-plate renderers, subtitle burn-in) via a direct Python import
   of `demos/video-01-risk-assessment-approval/project/render_pipeline.py` — that file is
   read-only from this package (Video 01 is an immutable, already-complete package, framework
   §21); only its generic helper functions are imported, never its own screenshots, anchor
   coordinates, or per-scene logic, which are specific to that video's own captures. This
   video's own screenshots, on-screen anchor coordinates (read directly off this package's own
   1920×1080 screenshots, not estimated), scene functions, and timeline are defined fresh in
   this package's own `project/render_pipeline.py`.
3. **Validated incrementally before committing to the full ~7-minute render**: rendered five
   short `--preview` slices (0:00–0:10, 1:00–2:20, 3:00–4:30, 4:40–5:10, 6:00–6:47) covering
   every chapter, both hard cuts, the concept plates, and the closing card, then extracted and
   visually inspected sample frames from each. All five slices rendered without error on the
   first attempt; no defects were found requiring a fix before the full render (contrast Video
   01's own Session 26, which caught two rendering-pipeline defects at this stage — see
   `observations.md` for why none surfaced here, most plausibly because this package's scene
   functions are simpler and reuse Video 01's already-hardened primitives directly, including
   the vector-icon check-mark helper that itself fixed Video 01's emoji-glyph defect).
4. **Full render**: 12,210 frames (6:47 at 30fps) rendered and encoded. Output verified via
   `ffprobe`: H.264/yuv420p/1920×1080/30fps video, AAC/48kHz/stereo audio (silent), duration
   matching `timeline.md`'s 6:47 (within sub-frame AAC rounding).
5. **QA pass**: sampled frames across all 10 chapters, the Ending, and the closing card —
   confirmed correct screen/screenshot at every sampled timestamp, correctly-positioned callouts
   and spotlights, working cross-fades and the two scripted hard cuts (Scenes 10 and 15, per
   `scene-list.md`), and subtitle text matching `subtitles.srt` at every sampled point.
6. **One honest adaptation, not fabrication**, flagged in `observations.md`: Scene 12's
   persona-switcher dropdown was never a real screenshot in this pass either (same as Video 01
   Scene 22) — synthesized as a UI overlay anchored at the real user-menu coordinates on the
   actual `06-treatment-plan-awaiting-checker.png` capture, not invented as a fabricated screen.

## Traceability

- **Business Requirement**: Provide an auditable record of exactly how this package's visual
  assets and rendered video were produced, for anyone reproducing or extending this deliverable.
- **Regulatory Requirement**: None.
- **PRSMTD Capability**: None — tooling/process log, not a platform capability.
- **ERM Capability**: N/A.
- **Dependencies**: `source-workflow.md`, `asset-inventory.md`, `project/render_pipeline.py`,
  `demos/video-01-risk-assessment-approval/project/render_pipeline.py` (imported primitives).
- **Future Work**: Re-run `project/render_pipeline.py --narration <track>` once real narration
  is recorded (see `audio/README.md`); no further capture or rendering-pipeline work is needed
  for that step.

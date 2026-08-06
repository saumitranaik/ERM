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

## Traceability

- **Business Requirement**: Provide an auditable record of exactly how this package's visual
  assets were produced, for anyone reproducing or extending this deliverable.
- **Regulatory Requirement**: None.
- **PRSMTD Capability**: None — tooling/process log, not a platform capability.
- **ERM Capability**: N/A.
- **Dependencies**: `source-workflow.md`, `asset-inventory.md`.
- **Future Work**: None — capture pass is complete for this video's scope.

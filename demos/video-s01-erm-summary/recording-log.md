# Recording Log — ERM Summary Video (S01)

**Date**: 2026-10-17.

1. Prototype at commit `d064c00` (submit-time validation commit), `npm run dev` on `http://localhost:3100`, fresh browser context (seed data, empty `localStorage`). `git status --short prototype/` was clean of uncommitted changes before capture.
2. Captured 13 screenshots at 1920×1080 with Python Playwright 1.61 (Chromium cached under `%LOCALAPPDATA%\ms-playwright`; installed outside the repository) using [`project/capture_screenshots.py`](project/capture_screenshots.py). The script is read-only: it signs in as Arjun Mehta (Risk Manager), opens screens by route, then signs in as Priya Raghunathan (Chief Risk Officer) for the approvals queue and module dashboards. It submits, approves and edits nothing.
3. Every screenshot was inspected visually; none blank or clipped. Reuse: none from Videos 01/02 (all new, because the summary needs dashboards those packages did not capture).
4. **Tooling**: the portable `ffmpeg` used by Videos 01–02 was no longer present (its `bin/` was empty). A current release build (9.0.2, gyan.dev essentials) was downloaded to the session scratchpad and its SHA-256 (`60f46726…047ba`) verified against the publisher's `.sha256` file before use. Nothing was installed into the repository.
5. Rendered with [`project/render_pipeline.py`](project/render_pipeline.py) (reuses Video 01's compositing primitives read-only). One defect found on review of the first render — the caption bar was translucent enough for the page's own buttons to show through — fixed (bar opacity 185 → 225) and the video re-rendered.

## Traceability
- **Business Requirement**: reproducible capture of the overview.
- **Regulatory Requirement**: none.
- **PRSMTD Capability**: none.
- **ERM Capability**: ERM Summary Video (S01).
- **Dependencies**: `prototype/` at the commit above.
- **Future Work**: none.

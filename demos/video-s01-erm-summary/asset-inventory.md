# Asset Inventory — ERM Summary Video (S01)

| Asset | Path | Status |
|---|---|---|
| Source/grounding | `source-workflow.md` | Complete |
| Caption script | `narration-script.md` | Generated from `project/content.py` |
| Chapters / timeline / scene list | `chapters.md`, `timeline.md`, `scene-list.md` | Generated |
| Captions | `subtitles.srt` (29 cues) | Generated; burned into the video |
| Screenshots | `screenshots/00`–`12` (13 files, 1920×1080, all new) | Captured live from the unmodified prototype; each visually checked |
| Build scripts | `project/*.py` | Reproducible; see `project/README.md` |
| Narration / music | `audio/` | **Not available** — silent Version 1 |
| Rendered video | `video-s01-erm-summary.mp4` | Local only; **Git-ignored, not committed** |

## Render validation (2026-10-17)

- **Output**: `demos/video-s01-erm-summary/video-s01-erm-summary.mp4`, 78.1 MB.
- **`ffprobe`**: H.264 yuv420p 1920×1080 30 fps video + AAC (silent) audio; duration 281.57 s (4:42), matching `timeline.md`.
- **Decode**: `ffmpeg -f null -` decoded the whole file without error.
- **Visual review**: frames sampled across every chapter, the closing plate and the title (≈20 frames) — no blank screens, clipped content, wrong order, failed navigation or unexpected dialogs. One defect (translucent caption bar showing page controls) was fixed and re-rendered; the final file was re-sampled.
- **Not done**: review by a human viewer in a media player; approval; publication. Version 1 is silent.

## Tooling
Python 3 + Pillow 12.2 + numpy 2.3; Playwright 1.61 (Chromium, outside the repo); ffmpeg 9.0.2 (gyan.dev essentials, SHA-256 verified, kept in the session scratchpad).

## Traceability
- **Business Requirement**: inventory and validation record for S01.
- **Regulatory Requirement**: none.
- **PRSMTD Capability**: none.
- **ERM Capability**: ERM Summary Video (S01).
- **Dependencies**: all files above.
- **Future Work**: spoken narration; human playback review and approval.

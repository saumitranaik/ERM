# project/

Reproducible build for the ERM Summary Video (S01), Version 1 (silent).

| File | Role |
|---|---|
| `capture_screenshots.py` | Read-only Playwright walk of the running prototype → `../screenshots/` |
| `content.py` | Single source for chapters, scenes, captions, highlight boxes |
| `timeline_build.py` | Computes the master timeline from `content.py` |
| `generate_docs.py` | Writes `../subtitles.srt`, `narration-script.md`, `chapters.md`, `timeline.md`, `scene-list.md` |
| `render_pipeline.py` | Composites frames (reusing Video 01's primitives read-only) and pipes them to ffmpeg → `../video-s01-erm-summary.mp4` (Git-ignored) |

```
npm run dev                     # in prototype/, port 3100
python capture_screenshots.py
python generate_docs.py
python render_pipeline.py --ffmpeg <path-to-ffmpeg.exe> [--preview 0:00-0:30]
```

Requires Python 3 with Pillow, numpy and Playwright, plus an `ffmpeg` binary. Windows font paths are inherited from Video 01's pipeline.

## Traceability
- **Business Requirement**: reproducible production of S01.
- **Regulatory Requirement**: none.
- **PRSMTD Capability**: none.
- **ERM Capability**: ERM Summary Video (S01).
- **Dependencies**: `../../video-01-risk-assessment-approval/project/render_pipeline.py` (read-only import).
- **Future Work**: shared `_shared/` primitives once a third package needs them (framework §19).

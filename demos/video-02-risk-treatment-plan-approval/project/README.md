# project/

`render_pipeline.py` is this package's compositing project file — a Python/Pillow/ffmpeg
pipeline that renders `../video-02-risk-treatment-plan-approval.mp4` directly from
[`../scene-list.md`](../scene-list.md), [`../timeline.md`](../timeline.md),
[`../chapters.md`](../chapters.md), [`../subtitles.srt`](../subtitles.srt), and the real
screenshots in [`../screenshots/`](../screenshots/).

**Reuses Video 01's compositing primitives directly**, via a Python import of
`demos/video-01-risk-assessment-approval/project/render_pipeline.py` (fonts, gradients, callout
balloons, cursor spotlight, zoom/pan, pulse rings, chapter-card and concept-plate renderers,
subtitle burn-in) — that file is read-only from here (Video 01 is an immutable, already-complete
package). Only its generic helper functions are imported; this package's own screenshots, anchor
coordinates, scene functions, and timeline are all defined fresh in this file, specific to this
video's own captures.

**Narration-ready by design**: the script's runtime is fixed by `../timeline.md`, independent of
any audio track. Once a real voice-over exists (see [`../audio/README.md`](../audio/README.md)),
re-render with:

```
python render_pipeline.py --ffmpeg <path-to-ffmpeg> --narration <path-to-track.wav>
```

No change to any visual asset, timeline, subtitle, or scene definition is required. `--music
<path>` additionally mixes in a low-volume background bed (only once a real
licensed/royalty-free file is supplied). `--preview M:SS-M:SS` renders a short slice for fast
iteration instead of the full ~7 minutes.

Requires: Python 3 with `Pillow` and `numpy`, and an `ffmpeg` binary (path passed via
`--ffmpeg`; not assumed to be on `PATH`), plus a sibling, unmodified
`demos/video-01-risk-assessment-approval/project/render_pipeline.py` to import from. Windows
font paths (`C:\Windows\Fonts\segoeui*.ttf`) are hard-coded for the card/plate/callout
typography, inherited from the imported module — update `FONT_*` constants there if rendering
on a non-Windows host.

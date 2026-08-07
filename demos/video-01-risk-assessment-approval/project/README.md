# project/

`render_pipeline.py` is this package's compositing project file — a Python/Pillow/ffmpeg
pipeline that renders `../video-01-risk-assessment-approval.mp4` directly from
[`../scene-list.md`](../scene-list.md), [`../timeline.md`](../timeline.md),
[`../chapters.md`](../chapters.md), [`../subtitles.srt`](../subtitles.srt), and the real
screenshots in [`../screenshots/`](../screenshots/). No Premiere/Resolve/After Effects-class
tool was available in the environment that produced this package (see
[`../asset-inventory.md`](../asset-inventory.md) for the original tooling-gap disclosure); this
script is what filled that gap for **Version 1 (Silent Demonstration)** — every frame (zoom/pan,
cursor spotlight, callout balloons, chapter cards, concept plates, transitions, burned-in
subtitles) is composited in Python and piped as raw RGB24 frames into ffmpeg for H.264/AAC
encoding.

**Narration-ready by design**: the script's runtime is fixed by `../timeline.md`, independent of
any audio track. Once a real voice-over exists (see [`../audio/README.md`](../audio/README.md)),
re-render with:

```
python render_pipeline.py --ffmpeg <path-to-ffmpeg> --narration <path-to-track.wav>
```

No change to any visual asset, timeline, subtitle, or scene definition is required. `--music
<path>` additionally mixes in a low-volume background bed (only once a real
licensed/royalty-free file is supplied — the script does not fabricate or synthesize music).
`--preview M:SS-M:SS` renders a short slice for fast iteration instead of the full ~17 minutes.

Requires: Python 3 with `Pillow` and `numpy`, and an `ffmpeg` binary (path passed via
`--ffmpeg`; not assumed to be on `PATH`). Windows font paths (`C:\Windows\Fonts\segoeui*.ttf`)
are hard-coded for the card/plate/callout typography — update `FONT_*` constants if rendering
on a non-Windows host.

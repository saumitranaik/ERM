# audio/

Reserved for the recorded voice-over track once produced against
[`../narration-script.md`](../narration-script.md), and for any licensed background music bed —
identical placeholder role to Video 01's own `audio/README.md`.

Nothing is placed here yet — **by design**, not by tooling gap. The rendered
`../video-02-risk-treatment-plan-approval.mp4` is explicitly **Version 1 (Silent
Demonstration)**: narration was deliberately not generated (no synthetic/TTS voice was
substituted for a real narrator — see `../asset-inventory.md`), and no music bed was fabricated
or downloaded (none is available in this environment, per the standing gap
`video-production-framework.md` §15/§17 discloses). The video instead carries synchronized
burned-in subtitles (`../subtitles.srt`) as the sole narration channel.

Per `demos/video-production-manifest.md` §18 ("Future Narration Strategy"), a real voice-over
pipeline should be applied to Video 01 first — the series' only durable Version-1-silent
baseline at the time that policy was written — before being used for a new video's first
version, to preserve one consistent narrator profile across the whole series. This directory
therefore stays empty for Video 02 as well until that series-wide decision is acted on.

Expected contents once produced: one narration audio file per chapter or one continuous track
for the full runtime (either is compatible with `../timeline.md`'s per-cue timestamps), plus a
separate background-music bed for final mixing. Once available, re-render with
`project/render_pipeline.py --narration <track>` (and optionally `--music <bed>`) — see
[`../project/README.md`](../project/README.md). No other package file needs to change.

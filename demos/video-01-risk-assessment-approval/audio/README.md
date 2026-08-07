# audio/

Reserved for the recorded voice-over track once produced against
[`../narration-script.md`](../narration-script.md), and for any licensed background music bed.

Nothing is placed here yet — **by design**, not by tooling gap. The rendered
`../video-01-risk-assessment-approval.mp4` is explicitly **Version 1 (Silent Demonstration)**:
narration was deliberately not generated (no synthetic/TTS voice was substituted for a real
narrator — see `../asset-inventory.md`), and no music bed was fabricated or downloaded (none
was available locally, and the brief for this version explicitly prohibited sourcing one). The
video instead carries synchronized burned-in subtitles (`../subtitles.srt`) as the sole
narration channel.

Expected contents once produced: one narration audio file per chapter or one continuous track
for the full runtime (either is compatible with `../timeline.md`'s per-cue timestamps), plus a
separate background-music bed for final mixing. Once available, re-render with
`project/render_pipeline.py --narration <track>` (and optionally `--music <bed>`) — see
[`../project/README.md`](../project/README.md). No other package file needs to change.

"""Generate subtitles.srt, narration-script.md, chapters.md, timeline.md and scene-list.md from content.py."""
from pathlib import Path

import content as C
import timeline_build as TB

PKG = Path(__file__).resolve().parent.parent
segs, cues, total = TB.build()
mm = TB.mmss

TRACE = """
## Traceability
- **Business Requirement**: Give stakeholders a short, honest overview of what the ERM prototype is and shows, before the per-workflow videos.
- **Regulatory Requirement**: none — an overview video; no regulatory claim is made beyond the SEBI-regulated AMC target context in `CLAUDE.md`.
- **PRSMTD Capability**: none directly — the video shows the reference prototype (`../../prototype/`); platform mechanisms are referenced only as "would be enforced on a server in production".
- **ERM Capability**: ERM Summary Video (S01), see [`../ERM_Video_Catalogue_and_Descriptions.md`](../ERM_Video_Catalogue_and_Descriptions.md).
- **Dependencies**: [`source-workflow.md`](source-workflow.md), [`project/content.py`](project/content.py), the running prototype.
- **Future Work**: spoken narration and music (not available); the risk-logging video (S02) follows once this video is accepted.
"""


def srt_t(s):
    ms = int(round(s * 1000))
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


(PKG / "subtitles.srt").write_text(
    "\n".join(f"{i}\n{srt_t(s)} --> {srt_t(e)}\n{t}\n" for i, (s, e, t) in enumerate(cues, 1)), encoding="utf-8")

# narration-script.md
out = ["# Narration / Caption Script — ERM Summary Video (S01)", "",
       "Silent Version 1: captions function as the narration (no voice talent or licensed music is available — "
       "framework §17). Times are computed from `project/content.py` by `project/generate_docs.py`, never hand-typed. "
       f"Reading pace {C.READING_WPS} words/second. **Total runtime: {mm(total)} ({total:.1f}s).** "
       "Every claim is grounded in [`source-workflow.md`](source-workflow.md).", ""]
ci = 0
for s in segs:
    if s["kind"] == "title":
        out += ["## Intro", f"**[{mm(s['start'])}]** *(title card: “{s['title']}” / “{s['subtitle']}”)* — no caption.", ""]
    elif s["kind"] == "card":
        out += [f"## Chapter {s['chapter']} — {s['title']}", f"*Chapter card: “{s['title']}” / “{s['subtitle']}”*", ""]
    elif s["kind"] in ("scene", "plate"):
        for (cs, ce, t) in cues:
            if s["start"] <= cs < s["start"] + s["dur"]:
                out += [f"**[{mm(cs)}–{mm(ce)}]**", "", f"> {t}", ""]
    else:
        out += ["## Closing", f"**[{mm(s['start'])}]** *(closing card: “{s['title']}” / “{s['subtitle']}”)* — no caption.", ""]
(PKG / "narration-script.md").write_text("\n".join(out) + TRACE, encoding="utf-8")

# chapters.md
out = ["# Chapters — ERM Summary Video (S01)", "", "| # | Chapter card | Subtitle | Starts |", "|---|---|---|---|"]
for s in segs:
    if s["kind"] == "card":
        out.append(f"| {s['chapter']} | {s['title']} | {s['subtitle']} | {mm(s['start'])} |")
(PKG / "chapters.md").write_text("\n".join(out) + "\n" + TRACE, encoding="utf-8")

# timeline.md / scene-list.md
out = ["# Timeline — ERM Summary Video (S01)", "", f"Total runtime **{mm(total)}** ({total:.1f}s), 1920×1080, 30 fps, silent AAC track.", "",
       "| Start | End | Segment | Detail |", "|---|---|---|---|"]
sc = ["# Scene List — ERM Summary Video (S01)", "",
      "One row per segment. Camera values are (centre-x, centre-y, zoom). Crossfade 0.5 s between segments; "
      "a rounded accent outline marks the highlighted region where listed.", "",
      "| # | Start | Duration | Kind | Screenshot / card | Camera start → end | Highlight (px) |", "|---|---|---|---|---|---|---|"]
for n, s in enumerate(segs, 1):
    detail = s.get("shot") or s.get("title")
    out.append(f"| {mm(s['start'])} | {mm(s['start'] + s['dur'])} | {s['kind']} | {detail} |")
    cam = f"{s['cam'][0]} → {s['cam'][1]}" if s.get("cam") else "—"
    sc.append(f"| {n} | {mm(s['start'])} | {s['dur']:.1f}s | {s['kind']} | {detail} | {cam} | {s.get('highlight') or '—'} |")
(PKG / "timeline.md").write_text("\n".join(out) + "\n" + TRACE, encoding="utf-8")
(PKG / "scene-list.md").write_text("\n".join(sc) + "\n" + TRACE, encoding="utf-8")
print(f"{len(cues)} cues, {len(segs)} segments, {mm(total)}")

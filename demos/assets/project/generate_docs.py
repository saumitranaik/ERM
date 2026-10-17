"""
generate_docs.py -- Derives the script, subtitles, and scene list from content.py's single
source of truth, so no timestamp is ever hand-typed in more than one place (the same
word-count-weighted proportional method this repo's framework already established for
Video 01/02's subtitles.srt).

Usage:
    python generate_docs.py

Writes (overwrites) into demos/:
    PRSMTD_Architecture_Design_Security_Explainer_script.md
    PRSMTD_Architecture_Design_Security_Explainer.srt
    PRSMTD_Architecture_Design_Security_Explainer_scene_list.md

Also prints the total computed runtime, so the storyboard/chapter-budget claims made
elsewhere can be checked against the real, derived number rather than an estimate.
"""

import re
from pathlib import Path

import content as C

DEMOS_DIR = Path(__file__).resolve().parent.parent.parent
SCRIPT_PATH = DEMOS_DIR / "PRSMTD_Architecture_Design_Security_Explainer_script.md"
SRT_PATH = DEMOS_DIR / "PRSMTD_Architecture_Design_Security_Explainer.srt"
SCENE_LIST_PATH = DEMOS_DIR / "PRSMTD_Architecture_Design_Security_Explainer_scene_list.md"

MIN_SUBPHRASE_SECONDS = 1.2
SUBPHRASE_GAP_SECONDS = 0.15
MIN_CUE_SECONDS = 1.4
CUE_GAP_SECONDS = 0.3


def word_count(text: str) -> int:
    return len(text.split())


def mmss(t: float) -> str:
    t = int(round(t))
    return f"{t // 60}:{t % 60:02d}"


def srt_ts(t: float) -> str:
    h = int(t // 3600)
    m = int((t % 3600) // 60)
    s = int(t % 60)
    ms = int(round((t - int(t)) * 1000))
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


# ---------------------------------------------------------------------------
# Subphrase splitting -- same intent as Video 01's subtitles.srt: short,
# clause-level captions rather than full paragraphs on screen at once.
# ---------------------------------------------------------------------------

_SENTENCE_RE = re.compile(r"(?<=[.!?])\s+")
_CLAUSE_RE = re.compile(r"\s+—\s+|(?<=[:;,])\s+")


def split_subphrases(cue_text: str):
    sentences = _SENTENCE_RE.split(cue_text.strip())
    phrases = []
    for sent in sentences:
        sent = sent.strip()
        if not sent:
            continue
        if word_count(sent) <= 12:
            phrases.append(sent)
            continue
        parts = _CLAUSE_RE.split(sent)
        buf = ""
        for part in parts:
            part = part.strip()
            if not part:
                continue
            trial = (buf + " " + part).strip() if buf else part
            if word_count(trial) <= 4 and buf == "":
                buf = trial
                continue
            if buf and word_count(buf) < 5:
                buf = trial
                continue
            if buf:
                phrases.append(buf)
            buf = part
        if buf:
            phrases.append(buf)
    return phrases if phrases else [cue_text.strip()]


# ---------------------------------------------------------------------------
# Timeline computation -- fully bottom-up: every displayed duration derives
# from word count at C.WPS, so total runtime is a real number, not a target.
# ---------------------------------------------------------------------------

def build_timeline():
    """Returns dict with 'intro', 'chapters' (list), 'outro', each carrying
    absolute (start,end) seconds and, for chapters, per-cue and per-subphrase
    timing."""
    t = 0.0
    timeline = {"intro": None, "chapters": [], "outro": None}

    timeline["intro"] = {"start": t, "end": t + C.INTRO_SECONDS}
    t += C.INTRO_SECONDS

    for chapter in C.CHAPTERS:
        card_start = t
        card_end = t + C.CARD_SECONDS
        t = card_end

        cue_entries = []
        for cue_text in chapter["cues"]:
            cue_start = t
            subphrases = split_subphrases(cue_text)
            sub_entries = []
            for phrase in subphrases:
                dur = max(MIN_SUBPHRASE_SECONDS, word_count(phrase) / C.WPS) + SUBPHRASE_GAP_SECONDS
                sub_entries.append({"text": phrase, "start": t, "end": t + dur})
                t += dur
            cue_end = t
            t += (CUE_GAP_SECONDS - SUBPHRASE_GAP_SECONDS) if CUE_GAP_SECONDS > SUBPHRASE_GAP_SECONDS else 0.0
            cue_entries.append({
                "text": cue_text, "start": cue_start, "end": cue_end,
                "subphrases": sub_entries,
            })

        timeline["chapters"].append({
            "id": chapter["id"], "title": chapter["title"], "subtitle": chapter["subtitle"],
            "diagram": chapter["diagram"],
            "card": {"start": card_start, "end": card_end},
            "cues": cue_entries,
            "content_start": card_end, "content_end": t,
        })

    outro_start = t
    outro_end = t + C.OUTRO_HOLD_SECONDS
    timeline["outro"] = {"start": outro_start, "end": outro_end}
    t = outro_end

    timeline["total_seconds"] = t
    return timeline


# ---------------------------------------------------------------------------
# Emitters
# ---------------------------------------------------------------------------

def emit_script(timeline):
    lines = []
    lines.append("# Narration / Subtitle Script — PRSMTD Architecture, Design & Security Explainer")
    lines.append("")
    lines.append(
        "Master script for a **silent** documentary (Version 1, per the repository's own "
        "video-production-framework.md Sec 2 rule 3 / Sec 17 standing disclosure protocol: no "
        "professional voice-over talent, no TTS meeting the framework's quality bar, and no "
        "licensed music are available in this environment). There is no voice cast. **Subtitles "
        "function as the narration** — every cue below is burned into the video as an on-screen "
        "caption, timed to the diagram animation it accompanies."
    )
    lines.append("")
    lines.append(
        f"**Timing method**: word-count-weighted, at a fixed on-screen reading pace of "
        f"**{C.WPS} words/second** ({int(C.WPS * 60)} words/minute-equivalent) — deliberately "
        f"slower than this repository's own spoken-narration default of 150 wpm "
        f"(video-production-framework.md Sec 4), because a silent film's viewer must read the "
        f"caption *and* watch the diagram animate, not just listen. Every timestamp below is "
        f"computed by `generate_docs.py` from `content.py` — none is hand-typed, so none can "
        f"drift from `subtitles.srt` or `scene_list.md`, which are generated from the same source."
    )
    lines.append("")
    lines.append(
        "**Grounding**: every factual claim in every cue is cited in "
        "[`prsmtd-architecture-grounding.md`](prsmtd-architecture-grounding.md) and is not "
        "re-cited inline here, matching this repository's own established convention "
        "(video-production-framework.md, narration-script.md precedent: \"grounding for every "
        "factual claim is listed in `source-workflow.md` and is not repeated inline here\")."
    )
    lines.append("")
    lines.append(f"**Total computed runtime**: {mmss(timeline['total_seconds'])} "
                  f"({timeline['total_seconds']:.1f}s).")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## Intro")
    lines.append("")
    lines.append(f"**[{mmss(timeline['intro']['start'])}–{mmss(timeline['intro']['end'])}]** "
                  f"*(title card: “{C.INTRO_CARD_TITLE}” / “{C.INTRO_CARD_SUBTITLE}”)* — no cue "
                  f"text; title card only.")
    lines.append("")
    lines.append("---")
    lines.append("")

    for ch in timeline["chapters"]:
        lines.append(f"## Chapter {ch['id']} — {ch['title']}")
        lines.append("")
        lines.append(f"**[{mmss(ch['card']['start'])}–{mmss(ch['card']['end'])}]** "
                      f"*(chapter card: “{ch['title']}” / “{ch['subtitle']}”)*")
        lines.append("")
        for cue in ch["cues"]:
            lines.append(f"**[{mmss(cue['start'])}–{mmss(cue['end'])}]**")
            lines.append("")
            lines.append(f"> {cue['text']}")
            lines.append("")
        lines.append("---")
        lines.append("")

    lines.append("## Closing Card")
    lines.append("")
    lines.append(f"**[{mmss(timeline['outro']['start'])}–{mmss(timeline['outro']['end'])}]** "
                  f"*(closing card: “{C.CLOSING_CARD_TITLE}” / “{C.CLOSING_CARD_SUBTITLE}”)* — "
                  f"holds on Chapter 10's closing line; no new cue text.")
    lines.append("")
    lines.append("## Traceability")
    lines.append("")
    lines.append("- **Business Requirement**: Provide the caption/subtitle brief for the PRSMTD "
                  "Architecture, Design & Security Explainer (board/regulator/CISO/architect "
                  "audience).")
    lines.append("- **Regulatory Requirement**: None directly — content is technical-"
                  "architecture exposition, grounded in PRSMTD's own governance/security "
                  "documentation, not itself a regulatory artifact.")
    lines.append("- **PRSMTD Capability**: None modified — read-only research artifact "
                  "describing existing PRSMTD capabilities (see "
                  "`prsmtd-architecture-grounding.md` for the full capability citation list).")
    lines.append("- **ERM Capability**: N/A (demonstration collateral, not a module spec).")
    lines.append("- **Dependencies**: `prsmtd-architecture-grounding.md`, `content.py`, "
                  "`generate_docs.py`.")
    lines.append("- **Future Work**: If a professional voice-over resource becomes available, "
                  "re-time against the real recorded track rather than this word-count estimate "
                  "(same disclosed limitation as Video 01/02's own narration-script.md).")
    lines.append("")

    SCRIPT_PATH.write_text("\n".join(lines), encoding="utf-8")
    print(f"wrote {SCRIPT_PATH}")


def emit_srt(timeline):
    entries = []
    for ch in timeline["chapters"]:
        for cue in ch["cues"]:
            for sub in cue["subphrases"]:
                entries.append((sub["start"], sub["end"], sub["text"]))

    lines = []
    for i, (start, end, text) in enumerate(entries, start=1):
        lines.append(str(i))
        lines.append(f"{srt_ts(start)} --> {srt_ts(end)}")
        lines.append(text)
        lines.append("")

    SRT_PATH.write_text("\n".join(lines), encoding="utf-8")
    print(f"wrote {SRT_PATH} ({len(entries)} cues)")


def emit_scene_list(timeline):
    lines = []
    lines.append("# Scene List — PRSMTD Architecture, Design & Security Explainer")
    lines.append("")
    lines.append(
        "Shot-by-shot visual direction, one row per cue, timestamps identical to "
        "`PRSMTD_Architecture_Design_Security_Explainer_script.md` (both generated from the "
        "same `content.py`/`generate_docs.py` pass — see that script for the full cue text and "
        "grounding). Diagram construction detail (exact node/edge labels, layout, animation "
        "states) is specified per diagram in "
        "`PRSMTD_Architecture_Design_Security_Explainer_storyboard.md`; this document maps each "
        "cue to which diagram state is on screen while it reads."
    )
    lines.append("")
    lines.append(
        f"**Visual language** (fixed across the whole film, matching "
        f"`video-production-framework.md` Sec 3's precedent of one system, not a patchwork): "
        f"dark graphite background (`#0A0E1A` → `#111830` gradient), cyan/blue accent "
        f"(`#3882F6`/`#60A5FA`), Segoe UI family typography, burned-in subtitles bottom-center, "
        f"chapter cards with a left accent bar, smooth ease-in-out animation on every diagram "
        f"state change — no hard pop-ins except click/approval pulses."
    )
    lines.append("")
    lines.append(f"**[{mmss(timeline['intro']['start'])}–{mmss(timeline['intro']['end'])}] "
                  f"Intro** — Title card: “{C.INTRO_CARD_TITLE}” / “{C.INTRO_CARD_SUBTITLE}”. "
                  f"Wordmark drift-in on gradient background, accent bar draws in along the "
                  f"bottom edge. No diagram yet.")
    lines.append("")
    lines.append("---")
    lines.append("")

    for ch in timeline["chapters"]:
        lines.append(f"## Chapter {ch['id']} — {ch['title']}  ")
        lines.append(f"**Diagram**: `{ch['diagram']}` (see storyboard for full spec)")
        lines.append("")
        lines.append(f"**[{mmss(ch['card']['start'])}–{mmss(ch['card']['end'])}]** Chapter card "
                      f"— “{ch['title']}” / “{ch['subtitle']}”, cross-fade in from previous "
                      f"chapter's final diagram state, accent bar left edge.")
        lines.append("")
        n_cues = len(ch["cues"])
        for i, cue in enumerate(ch["cues"]):
            beat = "opens" if i == 0 else ("closes" if i == n_cues - 1 else "continues")
            lines.append(
                f"**[{mmss(cue['start'])}–{mmss(cue['end'])}]** `{ch['diagram']}` {beat} — "
                f"{cue['text'][:70]}{'…' if len(cue['text']) > 70 else ''}"
            )
        lines.append("")
        lines.append("---")
        lines.append("")

    lines.append(f"**[{mmss(timeline['outro']['start'])}–{mmss(timeline['outro']['end'])}] "
                  f"Closing Card** — “{C.CLOSING_CARD_TITLE}” / “{C.CLOSING_CARD_SUBTITLE}”, "
                  f"holds after Chapter 10's final cue (the fixed closing line), fade to black "
                  f"over the final 1.5s.")
    lines.append("")

    SCENE_LIST_PATH.write_text("\n".join(lines), encoding="utf-8")
    print(f"wrote {SCENE_LIST_PATH}")


def main():
    timeline = build_timeline()
    emit_script(timeline)
    emit_srt(timeline)
    emit_scene_list(timeline)
    print(f"\nTotal computed runtime: {mmss(timeline['total_seconds'])} "
          f"({timeline['total_seconds']:.1f}s)")
    if not (14 * 60 <= timeline["total_seconds"] <= 16 * 60):
        print("WARNING: outside the requested 14-16 minute band -- tune content.py WPS/cues.")


if __name__ == "__main__":
    main()

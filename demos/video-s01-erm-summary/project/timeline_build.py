"""Compute the master timeline from content.py (shared by the document generator and the renderer)."""
import content as C


def cue_len(text):
    return max(C.MIN_CUE_S, len(text.split()) / C.READING_WPS)


def _scene_len(cues):
    return C.SCENE_LEAD_S + sum(cue_len(c) + C.CUE_GAP_S for c in cues) + C.SCENE_TAIL_S - C.CUE_GAP_S


def build():
    """Return (segments, cues, total). Segment: dict(kind, start, dur, ...). Cue: (start, end, text)."""
    segs, cues = [], []
    t = 0.0

    def add(kind, dur, **kw):
        nonlocal t
        segs.append(dict(kind=kind, start=t, dur=dur, **kw))
        t += dur
        return segs[-1]

    def place(seg, texts):
        ct = seg["start"] + C.SCENE_LEAD_S
        for text in texts:
            e = ct + cue_len(text)
            cues.append((ct, e, text))
            ct = e + C.CUE_GAP_S

    add("title", C.INTRO_S, title=C.TITLE[0], subtitle=C.TITLE[1])
    for ci, ch in enumerate(C.CHAPTERS, 1):
        add("card", C.CARD_S, title=ch["title"], subtitle=ch["subtitle"], chapter=ci)
        for si, sc in enumerate(ch["scenes"], 1):
            seg = add("scene", _scene_len(sc["cues"]), chapter=ci, scene=si,
                      shot=sc["shot"], cam=sc["cam"], highlight=sc["highlight"])
            place(seg, sc["cues"])
    cp = C.CLOSING_PLATE
    add("card", C.CARD_S, title="Maturity and Limits", subtitle="What to take away", chapter=len(C.CHAPTERS) + 1)
    seg = add("plate", _scene_len(cp["cues"]), title=cp["title"], bullets=cp["bullets"])
    place(seg, cp["cues"])
    add("outro", C.OUTRO_S, title=C.OUTRO[0], subtitle=C.OUTRO[1])
    return segs, cues, t


def mmss(s):
    s = int(round(s))
    return f"{s // 60}:{s % 60:02d}"

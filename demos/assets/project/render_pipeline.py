"""
Render pipeline -- PRSMTD Architecture, Design & Security Explainer (silent documentary).

Every frame in this video is generated diagram/motion-graphics content -- there are no
screenshots. Visual language (colors, fonts, shapes, drawing primitives, the TIMELINE_SPEC /
cross-fade compositing pattern, the SRT burn-in pattern, and the ffmpeg piping pattern) is
reused directly from demos/video-01-risk-assessment-approval/project/render_pipeline.py
(read-only pattern reference; that file is never imported or modified -- the small set of
generic helpers below are this file's own copies, per that package's brief).

Cue text and timing are never hand-typed here: content.py is the sole source of truth for
cue text, and generate_docs.build_timeline() (already used to emit the checked-in .srt/
_script.md/_scene_list.md) is imported directly to compute chapter/cue start/end seconds, so
this file's timeline can never drift from the generated documents.

Ten diagram ("plate") functions -- one per `diagram` tag in content.py -- implement the
per-chapter visual spec in PRSMTD_Architecture_Design_Security_Explainer_storyboard.md.
Layout/spacing choices not fixed by the storyboard are this file's own reasonable judgment;
no node/edge/label is invented beyond what the storyboard (traceable to
prsmtd-architecture-grounding.md) specifies.

Usage:
    python render_pipeline.py --ffmpeg "C:\\path\\to\\ffmpeg.exe" [--preview 0:00-0:30]
"""

import argparse
import functools
import math
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

import content as C
import generate_docs as GD

# ---------------------------------------------------------------------------
# Paths & constants
# ---------------------------------------------------------------------------

PROJECT_DIR = Path(__file__).resolve().parent          # assets/project
DEMOS_DIR = PROJECT_DIR.parent.parent                   # demos/
SUBTITLES_PATH = DEMOS_DIR / "PRSMTD_Architecture_Design_Security_Explainer.srt"
OUTPUT_PATH = DEMOS_DIR / "PRSMTD_Architecture_Design_Security_Explainer.mp4"

W, H = 1920, 1080
FPS = 30

FONT_DIR = Path(r"C:\Windows\Fonts")
FONT_REG = FONT_DIR / "segoeui.ttf"
FONT_BOLD = FONT_DIR / "segoeuib.ttf"
FONT_SEMIBOLD = FONT_DIR / "seguisb.ttf"
FONT_LIGHT = FONT_DIR / "segoeuil.ttf"

# Visual language -- fixed across the whole film (storyboard "Visual system", identical to
# Video 01's already-validated constants).
COL_BG_DARK = (10, 14, 26)
COL_BG_DARK_2 = (17, 24, 42)
COL_ACCENT = (56, 130, 246)
COL_ACCENT_SOFT = (96, 165, 250)
COL_WHITE = (255, 255, 255)
COL_MUTED = (148, 163, 184)
COL_MUTED_DARK = (100, 116, 139)
COL_CALLOUT_BG = (15, 23, 42)
COL_WARN = (234, 179, 8)
COL_GOOD = (34, 197, 94)
COL_BAD = (239, 68, 68)

SUBTITLE_SAFE_BOTTOM = 96

_FONT_CACHE = {}


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    key = (str(path), size)
    if key not in _FONT_CACHE:
        _FONT_CACHE[key] = ImageFont.truetype(str(path), size)
    return _FONT_CACHE[key]


def mmss(t: str) -> float:
    m, s = t.split(":")
    return int(m) * 60 + int(s)


def ease_in_out(t: float) -> float:
    t = max(0.0, min(1.0, t))
    return t * t * (3 - 2 * t)


def lerp(a, b, t):
    return a + (b - a) * t


def lerp_pt(a, b, t):
    return (lerp(a[0], b[0], t), lerp(a[1], b[1], t))


# ---------------------------------------------------------------------------
# Generic drawing primitives (own copies of Video 01's pattern -- see module docstring)
# ---------------------------------------------------------------------------

def gradient_bg(w=W, h=H, top=COL_BG_DARK, bottom=COL_BG_DARK_2) -> Image.Image:
    arr = np.zeros((h, w, 3), dtype=np.uint8)
    for c in range(3):
        arr[:, :, c] = np.linspace(top[c], bottom[c], h, dtype=np.uint8)[:, None]
    return Image.fromarray(arr, "RGB")


def base_canvas() -> Image.Image:
    return gradient_bg().convert("RGBA")


def rounded_rect(draw, box, radius, outline=None, fill=None, width=2):
    draw.rounded_rectangle(box, radius=radius, outline=outline, fill=fill, width=width)


def wrap_text(text, fnt, max_width, draw):
    words = text.split()
    lines, cur = [], ""
    for w_ in words:
        trial = (cur + " " + w_).strip()
        if draw.textlength(trial, font=fnt) <= max_width:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w_
    if cur:
        lines.append(cur)
    return lines


def arrow(draw, p0, p1, color=COL_MUTED, alpha=255, width=3):
    col = (*color, alpha)
    draw.line((p0, p1), fill=col, width=width)
    ang = math.atan2(p1[1] - p0[1], p1[0] - p0[0])
    ah = 10
    l_a, r_a = ang + 2.7, ang - 2.7
    p_l = (p1[0] + ah * math.cos(l_a), p1[1] + ah * math.sin(l_a))
    p_r = (p1[0] + ah * math.cos(r_a), p1[1] + ah * math.sin(r_a))
    draw.polygon([p1, p_l, p_r], fill=col)


def dashed_line(draw, p0, p1, color=COL_BAD, alpha=255, width=3, dash=12, gap=8):
    x0, y0 = p0
    x1, y1 = p1
    dist = math.hypot(x1 - x0, y1 - y0)
    if dist < 1:
        return
    ux, uy = (x1 - x0) / dist, (y1 - y0) / dist
    d = 0.0
    on = True
    while d < dist:
        seg = dash if on else gap
        d2 = min(d + seg, dist)
        if on:
            draw.line(((x0 + ux * d, y0 + uy * d), (x0 + ux * d2, y0 + uy * d2)),
                       fill=(*color, alpha), width=width)
        d = d2
        on = not on


def draw_lock_icon(draw, center, size, color, alpha):
    cx, cy = center
    body_w, body_h = size, size * 0.8
    body = (cx - body_w / 2, cy - body_h / 4, cx + body_w / 2, cy + body_h * 0.75)
    shackle_r = size * 0.32
    draw.arc((cx - shackle_r, cy - body_h / 4 - shackle_r * 1.6, cx + shackle_r, cy - body_h / 4 + shackle_r * 0.4),
             start=200, end=340, fill=(*color, alpha), width=max(2, int(size * 0.09)))
    rounded_rect(draw, body, radius=int(size * 0.12), fill=(*color, alpha))
    kh = size * 0.16
    draw.ellipse((cx - kh / 2, cy - kh / 2, cx + kh / 2, cy + kh / 2), fill=(*COL_BG_DARK, alpha))


def draw_check_icon(draw, center, size, color, alpha, width=None):
    cx, cy = center
    w_ = width or max(2, int(size * 0.18))
    p1 = (cx - size * 0.45, cy)
    p2 = (cx - size * 0.1, cy + size * 0.35)
    p3 = (cx + size * 0.5, cy - size * 0.4)
    draw.line([p1, p2], fill=(*color, alpha), width=w_)
    draw.line([p2, p3], fill=(*color, alpha), width=w_)


def draw_cross_icon(draw, center, size, color, alpha, width=None):
    cx, cy = center
    w_ = width or max(2, int(size * 0.16))
    s = size * 0.4
    draw.line((cx - s, cy - s, cx + s, cy + s), fill=(*color, alpha), width=w_)
    draw.line((cx - s, cy + s, cx + s, cy - s), fill=(*color, alpha), width=w_)


def draw_doc_icon(draw, center, size, color, alpha):
    cx, cy = center
    w_, h_ = size * 0.72, size
    x0, y0 = cx - w_ / 2, cy - h_ / 2
    fold = w_ * 0.32
    draw.polygon([(x0, y0), (x0 + w_ - fold, y0), (x0 + w_, y0 + fold), (x0 + w_, y0 + h_),
                  (x0, y0 + h_)], outline=(*color, alpha), width=max(2, int(size * 0.06)))
    draw.line((x0 + w_ - fold, y0, x0 + w_ - fold, y0 + fold), fill=(*color, alpha), width=2)
    draw.line((x0 + w_ - fold, y0 + fold, x0 + w_, y0 + fold), fill=(*color, alpha), width=2)
    for i in range(3):
        ly = y0 + h_ * 0.48 + i * h_ * 0.14
        draw.line((x0 + w_ * 0.16, ly, x0 + w_ * 0.84, ly), fill=(*color, alpha), width=2)


def draw_key_icon(draw, center, size, color, alpha):
    cx, cy = center
    r = size * 0.22
    draw.ellipse((cx - size * 0.42, cy - r, cx - size * 0.42 + r * 2, cy + r),
                 outline=(*color, alpha), width=max(2, int(size * 0.1)))
    draw.line((cx - size * 0.42 + r * 2, cy, cx + size * 0.42, cy), fill=(*color, alpha), width=max(2, int(size * 0.1)))
    draw.line((cx + size * 0.3, cy, cx + size * 0.3, cy + size * 0.2), fill=(*color, alpha), width=max(2, int(size * 0.09)))
    draw.line((cx + size * 0.42, cy, cx + size * 0.42, cy + size * 0.28), fill=(*color, alpha), width=max(2, int(size * 0.09)))


def draw_table_icon(draw, center, size, color, alpha):
    cx, cy = center
    w_, h_ = size, size * 0.72
    box = (cx - w_ / 2, cy - h_ / 2, cx + w_ / 2, cy + h_ / 2)
    rounded_rect(draw, box, radius=4, outline=(*color, alpha), width=2)
    for i in (1, 2):
        y = box[1] + h_ * i / 3
        draw.line((box[0], y, box[2], y), fill=(*color, int(alpha * 0.6)), width=1)


def draw_pulse_ring(canvas, box, phase):
    draw = ImageDraw.Draw(canvas, "RGBA")
    x0, y0, x1, y1 = box
    grow = 6 * math.sin(phase * math.pi)
    alpha = int(220 * math.sin(phase * math.pi))
    rounded_rect(draw, (x0 - grow, y0 - grow, x1 + grow, y1 + grow), radius=8,
                 outline=(*COL_ACCENT_SOFT, max(0, alpha)), width=3)


# ---------------------------------------------------------------------------
# Composition helpers used across all ten diagrams
# ---------------------------------------------------------------------------

def fa(t, start, dur=0.5):
    """Fade-in fraction 0..1, starting at `start`, easing over `dur` seconds."""
    if t < start:
        return 0.0
    return ease_in_out(min(1.0, (t - start) / dur))


def fa255(t, start, dur=0.5):
    return int(255 * fa(t, start, dur))


def pulse_scale(t, start, dur=0.5, amount=0.05):
    """Triangular scale pulse 1.0 -> 1.0+amount -> 1.0 starting at `start`."""
    if t < start or t > start + dur:
        return 1.0
    phase = (t - start) / dur
    return 1.0 + amount * math.sin(phase * math.pi)


def box_label(draw, box, title, sub=None, color=COL_ACCENT, alpha=255, radius=12,
              title_size=22, sub_size=16, fill=COL_BG_DARK_2, title_color=None):
    x0, y0, x1, y1 = box
    if fill is not None:
        rounded_rect(draw, box, radius, outline=(*color, alpha), fill=(*fill, int(alpha * 0.88)), width=2)
    else:
        rounded_rect(draw, box, radius, outline=(*color, alpha), width=2)
    cx = (x0 + x1) / 2
    tf = font(FONT_SEMIBOLD, title_size)
    tcol = title_color or (255, 255, 255)
    if sub:
        sf = font(FONT_REG, sub_size)
        draw.text((cx, (y0 + y1) / 2 - title_size * 0.42), title, font=tf, fill=(*tcol, alpha), anchor="mm")
        draw.text((cx, (y0 + y1) / 2 + title_size * 0.5), sub, font=sf, fill=(*COL_MUTED, alpha), anchor="mm")
    else:
        draw.text((cx, (y0 + y1) / 2), title, font=tf, fill=(*tcol, alpha), anchor="mm")


def strike_through(draw, box, color=COL_BAD, alpha=255, width=4):
    x0, y0, x1, y1 = box
    draw.line((x0, y0, x1, y1), fill=(*color, alpha), width=width)


def caption(draw, cx, y, text, size=18, color=COL_MUTED, alpha=255, bold=False):
    fnt = font(FONT_SEMIBOLD if bold else FONT_REG, size)
    draw.text((cx, y), text, font=fnt, fill=(*color, alpha), anchor="mm")


def kicker(draw, text, alpha=255):
    fnt = font(FONT_SEMIBOLD, 22)
    tw = draw.textlength(text.upper(), font=fnt)
    draw.text((100, 96), text.upper(), font=fnt, fill=(*COL_ACCENT_SOFT, alpha), anchor="lm")
    draw.line((100, 116, 100 + tw, 116), fill=(*COL_ACCENT, alpha), width=2)


# --- beat dispatch + breadcrumb (used by chapters 2-8) ---------------------

def beat_index(t_local, beats):
    idx = 0
    for i, (s, _fn) in enumerate(beats):
        if t_local >= s:
            idx = i
    return idx


def dispatch_beats(t_local, dur, beats, fade=0.4):
    idx = beat_index(t_local, beats)
    start = beats[idx][0]
    end = beats[idx + 1][0] if idx + 1 < len(beats) else dur
    frame = beats[idx][1](t_local - start, max(0.01, end - start)).convert("RGB")
    if idx > 0 and (t_local - start) < fade:
        pstart = beats[idx - 1][0]
        pend = start
        pframe = beats[idx - 1][1](max(0.01, pend - pstart), max(0.01, pend - pstart)).convert("RGB")
        alpha = ease_in_out((t_local - start) / fade)
        frame = Image.blend(pframe, frame, alpha)
    return frame


def breadcrumb_strip(draw, labels, active_idx):
    n = len(labels)
    y = 168
    pill_h = 34
    gap = 14
    fnt = font(FONT_REG, 15)
    widths = [draw.textlength(l, font=fnt) + 26 for l in labels]
    total = sum(widths) + gap * (n - 1)
    x = (W - total) / 2
    for i, (lab, w_) in enumerate(zip(labels, widths)):
        if i < active_idx:
            outline, txt_col, fill = (*COL_ACCENT_SOFT, 130), (*COL_MUTED, 255), None
        elif i == active_idx:
            outline, txt_col, fill = (*COL_ACCENT, 255), (255, 255, 255, 255), (*COL_ACCENT, 55)
        else:
            outline, txt_col, fill = (*COL_MUTED, 60), (*COL_MUTED, 90), None
        rounded_rect(draw, (x, y, x + w_, y + pill_h), pill_h / 2, outline=outline, fill=fill, width=2)
        draw.text((x + w_ / 2, y + pill_h / 2), lab, font=fnt, fill=txt_col, anchor="mm")
        x += w_ + gap


def diagram_with_breadcrumb(t_local, dur, beats, labels):
    frame = dispatch_beats(t_local, dur, beats).convert("RGBA")
    draw = ImageDraw.Draw(frame, "RGBA")
    idx = beat_index(t_local, beats)
    breadcrumb_strip(draw, labels, idx)
    return frame.convert("RGB")


MAIN_TOP, MAIN_BOTTOM, MAIN_CX = 230, 880, 960

# ===========================================================================
# CHAPTER 1 -- platform_identity
# ===========================================================================

def diagram_platform_identity(t_local, dur, cues):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")

    # Beat 1 (cues 1-2): identity strip -- wordmark + tech-stack chain.
    word_a = fa255(t_local, 0.0, 0.5)
    if word_a:
        draw.text((MAIN_CX, 210), "PRSMTD", font=font(FONT_SEMIBOLD, 46), fill=(255, 255, 255, word_a), anchor="mm")

    stack = ["Spring Boot · Java 21", "Next.js · TypeScript", "PostgreSQL", "Liquibase"]
    box_w, box_h, gap = 380, 96, 40
    total_w = len(stack) * box_w + (len(stack) - 1) * gap
    x0 = MAIN_CX - total_w / 2
    y_strip = 320
    prev_x1, prev_a = None, 0
    for i, lab in enumerate(stack):
        a = fa255(t_local, 0.3 + i * 0.5, 0.5)
        x = x0 + i * (box_w + gap)
        box = (x, y_strip - box_h / 2, x + box_w, y_strip + box_h / 2)
        if a:
            box_label(draw, box, lab, color=COL_ACCENT_SOFT, alpha=a, title_size=20)
        if prev_x1 is not None and a and prev_a:
            arrow(draw, (prev_x1 + 8, y_strip), (x - 8, y_strip), color=COL_MUTED, alpha=min(a, prev_a))
        prev_x1, prev_a = x + box_w, a

    # Beat 2 (cue 3): authority badge -- large, central, dominant.
    badge_start = cues[2][0]
    ba = fa255(t_local, badge_start, 0.7)
    badge_y = 560
    if ba:
        scale = 1.0 + 0.04 * ease_in_out(min(1.0, (t_local - badge_start) / 0.7))
        icon_r = 46 * scale
        draw_doc_icon(draw, (MAIN_CX, badge_y - 70), icon_r, COL_ACCENT, ba)
        draw.text((MAIN_CX, badge_y - 6), "system.md", font=font(FONT_SEMIBOLD, 34), fill=(255, 255, 255, ba), anchor="mm")
        badge_txt = "Sole authoritative, rebuild-critical specification"
        tw = draw.textlength(badge_txt, font=font(FONT_SEMIBOLD, 22))
        rounded_rect(draw, (MAIN_CX - tw / 2 - 24, badge_y + 30, MAIN_CX + tw / 2 + 24, badge_y + 74), 22,
                     fill=(*COL_ACCENT, int(ba * 0.9)))
        draw.text((MAIN_CX, badge_y + 52), badge_txt, font=font(FONT_SEMIBOLD, 22), fill=(255, 255, 255, ba), anchor="mm")
        tag = "wins on conflict"
        tw2 = draw.textlength(tag, font=font(FONT_REG, 17))
        rounded_rect(draw, (MAIN_CX - tw2 / 2 - 14, badge_y + 84, MAIN_CX + tw2 / 2 + 14, badge_y + 114), 15,
                     outline=(*COL_WARN, ba), width=2)
        draw.text((MAIN_CX, badge_y + 99), tag, font=font(FONT_REG, 17), fill=(*COL_WARN, ba), anchor="mm")

    # Beat 3 (cues 4-5): module strip -- CONTACTS live, three retired/ghosted.
    mod_start = cues[3][0]
    ma = fa255(t_local, mod_start, 0.5)
    y_mod = 760
    chip_w, chip_h, chip_gap = 300, 78, 30
    mods = [("CONTACTS", True), ("BILLING", False), ("NOTIFICATIONS", False), ("ADMIN", False)]
    total_mw = len(mods) * chip_w + (len(mods) - 1) * chip_gap
    mx0 = MAIN_CX - total_mw / 2
    if ma:
        for i, (name, live) in enumerate(mods):
            x = mx0 + i * (chip_w + chip_gap)
            box = (x, y_mod - chip_h / 2, x + chip_w, y_mod + chip_h / 2)
            if live:
                box_label(draw, box, name, color=COL_GOOD, alpha=ma, title_size=22, fill=COL_BG_DARK_2)
                draw_check_icon(draw, (x + chip_w - 26, y_mod - chip_h / 2 + 20), 18, COL_GOOD, ma)
                caption(draw, x + chip_w / 2, y_mod + chip_h / 2 + 22, "live — reference implementation",
                        size=15, color=COL_GOOD, alpha=ma)
            else:
                box_label(draw, box, name, color=COL_MUTED, alpha=int(ma * 0.75), title_size=22, fill=None,
                          title_color=COL_MUTED)
                strike_through(draw, box, color=COL_BAD, alpha=int(ma * 0.85), width=3)
        retire_a = fa255(t_local, cues[4][0], 0.5)
        if retire_a:
            caption(draw, mx0 + chip_w + chip_gap + (3 * chip_w + 2 * chip_gap) / 2, y_mod + chip_h / 2 + 22,
                    "retired via PR-RESET-02", size=15, color=COL_BAD, alpha=retire_a)

    # Beat 4 (cue 6): closing dim -- everything but the badge + outline dims 60%.
    close_start = cues[5][0]
    ca = fa(t_local, close_start, 1.0)
    if ca > 0.001:
        dim_factor = ca * 0.6
        black = Image.new("RGBA", (W, H), (0, 0, 0, int(255 * dim_factor)))
        canvas = Image.alpha_composite(canvas, black)
        draw = ImageDraw.Draw(canvas, "RGBA")
        if ba:
            draw_doc_icon(draw, (MAIN_CX, badge_y - 70), 46, COL_ACCENT, ba)
            draw.text((MAIN_CX, badge_y - 6), "system.md", font=font(FONT_SEMIBOLD, 34), fill=(255, 255, 255, ba), anchor="mm")
            badge_txt = "Sole authoritative, rebuild-critical specification"
            tw = draw.textlength(badge_txt, font=font(FONT_SEMIBOLD, 22))
            rounded_rect(draw, (MAIN_CX - tw / 2 - 24, badge_y + 30, MAIN_CX + tw / 2 + 24, badge_y + 74), 22,
                         fill=(*COL_ACCENT, ba))
            draw.text((MAIN_CX, badge_y + 52), badge_txt, font=font(FONT_SEMIBOLD, 22), fill=(255, 255, 255, ba), anchor="mm")
        outline_a = int(180 * ca)
        rounded_rect(draw, (MAIN_CX - total_w / 2 - 40, 150, MAIN_CX + total_w / 2 + 40, y_mod + 90), 18,
                     outline=(*COL_ACCENT_SOFT, outline_a), width=2)

    return canvas.convert("RGB")


# ===========================================================================
# CHAPTER 2 -- constitution_flow
# ===========================================================================

def c2_spine(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "Authority Chain", 255)
    items = [("Constitution (system.md)", "authoritative"),
             ("Governance (Program Board)", "derived authority"),
             ("Platform", "derived authority"),
             ("Modules", "derived authority")]
    box_w, box_h, pitch, y0 = 640, 104, 150, 250
    pos = []
    for i, (title, sub) in enumerate(items):
        a = fa255(t, i * 0.5, 0.6)
        y = y0 + i * pitch
        pos.append((y, a))
        if a:
            box = (MAIN_CX - box_w / 2, y - box_h / 2, MAIN_CX + box_w / 2, y + box_h / 2)
            col = COL_ACCENT if i == 0 else COL_ACCENT_SOFT
            box_label(draw, box, title, sub, color=col, alpha=a, title_size=24)
    for i in range(1, len(pos)):
        y0_, a0 = pos[i - 1]
        y1_, a1 = pos[i]
        if a0 and a1:
            arrow(draw, (MAIN_CX, y0_ + box_h / 2), (MAIN_CX, y1_ - box_h / 2), color=COL_MUTED, alpha=min(a0, a1))
    return canvas


def c2_invariants(t, dur, appear, i6_off):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "Six Invariants — I1 through I6", 255)
    cards = [
        ("I1", "Closed-world routing"),
        ("I2", "Maker-checker"),
        ("I3", "Plane separation"),
        ("I4", "Tenant isolation (DB-enforced)"),
        ("I5", "Deterministic rebuild"),
        ("I6", "Action-type closed set"),
    ]
    offs = list(appear) + [i6_off]
    cols, rows = 3, 2
    box_w, box_h, gap_x, gap_y = 560, 190, 44, 40
    total_w = cols * box_w + (cols - 1) * gap_x
    x0 = MAIN_CX - total_w / 2
    y0 = 300
    for i, (code, label) in enumerate(cards):
        r, c = divmod(i, cols)
        start = offs[i] if i < len(offs) else 0
        a = fa255(t, start, 0.5)
        scale = pulse_scale(t, start, 0.5, amount=0.05)
        x = x0 + c * (box_w + gap_x)
        y = y0 + r * (box_h + gap_y)
        cx, cy = x + box_w / 2, y + box_h / 2
        bw, bh = box_w * scale, box_h * scale
        box = (cx - bw / 2, cy - bh / 2, cx + bw / 2, cy + bh / 2)
        if a:
            box_label(draw, box, code, label, color=COL_ACCENT, alpha=a, title_size=30, sub_size=19)
    return canvas


def c2_baseline_lock(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "Liquibase Baseline", 255)
    a = fa255(t, 0.0, 0.6)
    box_w, box_h = 620, 160
    box = (MAIN_CX - box_w / 2, 380 - box_h / 2, MAIN_CX + box_w / 2, 380 + box_h / 2)
    if a:
        box_label(draw, box, "Liquibase baseline", "release-1.0", color=COL_ACCENT, alpha=a, title_size=28)
        lock_a = fa255(t, 0.5, 0.5)
        if lock_a:
            draw.ellipse((MAIN_CX - 30, 380 - box_h / 2 - 60, MAIN_CX + 30, 380 - box_h / 2), fill=(*COL_ACCENT, lock_a))
            draw_lock_icon(draw, (MAIN_CX, 380 - box_h / 2 - 30), 34, COL_WHITE, lock_a)
        loop_a = fa255(t, 1.0, 0.6)
        if loop_a:
            lx = MAIN_CX + box_w / 2 + 90
            draw.arc((lx - 70, 380 - 70, lx + 70, 380 + 70), start=60, end=300, fill=(*COL_GOOD, loop_a), width=4)
            arrow(draw, (lx - 40, 380 + 58), (MAIN_CX + box_w / 2 + 6, 380 + 20), color=COL_GOOD, alpha=loop_a)
            caption(draw, lx, 380 - 96, "additive only", size=18, color=COL_GOOD, alpha=loop_a, bold=True)
    return canvas


def c2_stepper(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "Six Ordered Phases", 255)
    steps = ["Charter", "Schema", "Runtime", "Graph", "Validator", "Capstone"]
    box_w, box_h, gap = 270, 90, 26
    total = len(steps) * box_w + (len(steps) - 1) * gap
    x0 = MAIN_CX - total / 2
    y = 360
    for i, s in enumerate(steps):
        a = fa255(t, i * 0.45, 0.5)
        x = x0 + i * (box_w + gap)
        box = (x, y - box_h / 2, x + box_w, y + box_h / 2)
        lit = t >= i * 0.45
        col = COL_ACCENT if lit else COL_MUTED
        if a:
            box_label(draw, box, s, color=col, alpha=a, title_size=21)
        if i > 0:
            aa = min(fa255(t, (i - 1) * 0.45, 0.5), a)
            if aa:
                arrow(draw, (x - gap + 8, y), (x - 8, y), color=COL_MUTED, alpha=aa)
    # skipped-ahead flash: Schema->Runtime with Charter dimmed, then corrected.
    flash_start = 3.2
    if flash_start <= t < flash_start + 1.0:
        fa_ = ease_in_out(min(1.0, (t - flash_start) / 0.3))
        x_schema = x0 + 1 * (box_w + gap) + box_w
        x_runtime = x0 + 2 * (box_w + gap)
        mx, my = (x_schema + x_runtime) / 2, y - 70
        draw_cross_icon(draw, (mx, my), 30, COL_BAD, int(255 * fa_))
        caption(draw, mx, my - 30, "out-of-order forbidden", size=16, color=COL_BAD, alpha=int(255 * fa_))
    return canvas


def c2_trio(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "Constitutional Control Surface", 255)
    items = ["Row-Level Security", "ExecutionContext binding", "Runtime Validator Harness"]
    box_w, box_h, gap = 520, 110, 60
    total = len(items) * box_w + (len(items) - 1) * gap
    x0 = MAIN_CX - total / 2
    y = 320
    centers = []
    for i, it in enumerate(items):
        a = fa255(t, i * 0.4, 0.5)
        x = x0 + i * (box_w + gap)
        box = (x, y - box_h / 2, x + box_w, y + box_h / 2)
        if a:
            box_label(draw, box, it, color=COL_ACCENT_SOFT, alpha=a, title_size=21)
        centers.append(((x + box_w / 2, y + box_h / 2), a))
    conv_a = fa255(t, 1.3, 0.6)
    target = (MAIN_CX, 560)
    if conv_a:
        for c, a in centers:
            arrow(draw, c, (target[0], target[1] - 70), color=COL_ACCENT, alpha=min(conv_a, a or conv_a))
        box = (MAIN_CX - 300, target[1] - 60, MAIN_CX + 300, target[1] + 60)
        box_label(draw, box, "constitutional control surface", color=COL_ACCENT, alpha=conv_a, title_size=22)
    return canvas


def diagram_constitution_flow(t_local, dur, cues):
    beats = [(0.0, c2_spine)]
    s1 = cues[2][0]
    appear2 = [cues[k][0] - s1 for k in range(2, 7)]
    i6_off = appear2[-1] + (cues[6][1] - cues[6][0]) * 0.5
    beats.append((s1, functools.partial(c2_invariants, appear=appear2, i6_off=i6_off)))
    beats.append((cues[7][0], c2_baseline_lock))
    beats.append((cues[8][0], c2_stepper))
    beats.append((cues[9][0], c2_trio))
    labels = ["Constitution", "Invariants I1–I6", "Baseline Lock", "6-Phase Stepper", "Control Surface"]
    return diagram_with_breadcrumb(t_local, dur, beats, labels)


# ===========================================================================
# CHAPTER 3 -- layers_modules
# ===========================================================================

def c3_layers(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "Backend Layering", 255)
    layers = ["api", "service", "persistence"]
    box_w, box_h, pitch, y0 = 560, 96, 130, 280
    pos = []
    for i, lab in enumerate(layers):
        a = fa255(t, i * 0.4, 0.5)
        y = y0 + i * pitch
        pos.append((y, a))
        if a:
            box = (MAIN_CX - box_w / 2, y - box_h / 2, MAIN_CX + box_w / 2, y + box_h / 2)
            box_label(draw, box, lab, color=COL_ACCENT, alpha=a, title_size=24)
    for i in range(1, len(pos)):
        y0_, a0 = pos[i - 1]
        y1_, a1 = pos[i]
        if a0 and a1:
            arrow(draw, (MAIN_CX, y0_ + box_h / 2), (MAIN_CX, y1_ - box_h / 2), color=COL_MUTED, alpha=min(a0, a1))
    ctl_a = fa255(t, 1.1, 0.5)
    if ctl_a:
        box = (MAIN_CX + box_w / 2 + 90, y0 - box_h / 2, MAIN_CX + box_w / 2 + 90 + 380, y0 + box_h / 2)
        box_label(draw, box, "controller", color=COL_BAD, alpha=int(ctl_a * fa(t, 1.1, 3.5) * 0 + ctl_a), title_size=22,
                  title_color=COL_BAD, fill=None)
        fadeout = 1.0 if t < 2.6 else max(0.0, 1.0 - (t - 2.6) / 0.6)
        eff_a = int(ctl_a * fadeout)
        if eff_a:
            strike_through(draw, box, color=COL_BAD, alpha=eff_a, width=3)
            caption(draw, (box[0] + box[2]) / 2, box[3] + 24, "package must not exist", size=15, color=COL_BAD, alpha=eff_a)
    return canvas


def c3_module_flow(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "Module Canonical Flow", 255)
    steps = ["module.yaml manifest", "ModuleCatalogRegistrar", "modules catalog table",
             "pending_action ledger", "projection trigger (status=APPROVED)",
             "tenant_module (projection)", "runtime reads (read-only)"]
    box_w, box_h, pitch, y0 = 760, 74, 92, 260
    pos = []
    for i, s in enumerate(steps):
        a = fa255(t, i * 0.28, 0.45)
        y = y0 + i * pitch
        pos.append((y, a))
        if a:
            box = (MAIN_CX - box_w / 2, y - box_h / 2, MAIN_CX + box_w / 2, y + box_h / 2)
            box_label(draw, box, s, color=COL_ACCENT_SOFT, alpha=a, title_size=18)
    for i in range(1, len(pos)):
        y0_, a0 = pos[i - 1]
        y1_, a1 = pos[i]
        if a0 and a1:
            arrow(draw, (MAIN_CX, y0_ + box_h / 2), (MAIN_CX, y1_ - box_h / 2), color=COL_MUTED, alpha=min(a0, a1), width=2)
    return canvas


def c3_manifest(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "CONTACTS module.yaml", 255)
    a = fa255(t, 0.0, 0.6)
    lines = [
        "code: CONTACTS",
        "roles: [CONTACTS_MAKER, CONTACTS_CHECKER, CONTACTS_VIEWER]",
        "roleTypes: MAKER / CHECKER / VIEWER",
        "workflows.CONTACTS_SUBMIT.requiresApproval: true",
    ]
    box_w, box_h = 1200, 300
    box = (MAIN_CX - box_w / 2, 420 - box_h / 2, MAIN_CX + box_w / 2, 420 + box_h / 2)
    if a:
        rounded_rect(draw, box, 14, outline=(*COL_ACCENT, a), fill=(*COL_BG_DARK_2, int(a * 0.9)), width=2)
        rounded_rect(draw, (box[0], box[1], box[0] + 130, box[1] + 34), 8, fill=(*COL_ACCENT, a))
        draw.text((box[0] + 65, box[1] + 17), "module.yaml", font=font(FONT_SEMIBOLD, 15), fill=(255, 255, 255, a), anchor="mm")
        fnt = font(FONT_REG, 21)
        ty = box[1] + 64
        for i, l in enumerate(lines):
            la = fa255(t, 0.3 + i * 0.35, 0.5)
            draw.text((box[0] + 40, ty), l, font=fnt, fill=(*COL_ACCENT_SOFT, min(a, la)), anchor="lm")
            ty += 54
    return canvas


def c3_ownership(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "Ownership Guard", 255)
    a = fa255(t, 0.0, 0.5)
    box_w, box_h, gap = 480, 130, 240
    x0 = MAIN_CX - gap / 2 - box_w
    x1 = MAIN_CX + gap / 2
    y = 380
    if a:
        box_label(draw, (x0, y - box_h / 2, x0 + box_w, y + box_h / 2), "CONTACTS", color=COL_GOOD, alpha=a, title_size=26)
        box_label(draw, (x1, y - box_h / 2, x1 + box_w, y + box_h / 2), "Module B", color=COL_MUTED, alpha=int(a * 0.75),
                  title_size=26, title_color=COL_MUTED)
    ba = fa255(t, 0.6, 0.5)
    if ba:
        arrow(draw, (x0 + box_w + 6, y), (x1 - 10, y), color=COL_BAD, alpha=ba)
        cx = (x0 + box_w + x1) / 2
        draw_cross_icon(draw, (cx, y), 20, COL_BAD, ba)
        caption(draw, cx, y - 60, "cannot modify tables it doesn't own", size=17, color=COL_BAD, alpha=ba)
    la = fa255(t, 1.2, 0.5)
    if la:
        draw_lock_icon(draw, (MAIN_CX, y + box_h / 2 + 60), 28, COL_WARN, la)
        caption(draw, MAIN_CX, y + box_h / 2 + 104, "destructive change requires explicit approval marker",
                size=16, color=COL_WARN, alpha=la)
    return canvas


def c3_nav(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "Dynamic Navigation", 255)
    a = fa255(t, 0.0, 0.5)
    shell_box = (MAIN_CX - 60, 260, MAIN_CX + 520, 700)
    if a:
        rounded_rect(draw, shell_box, 14, outline=(*COL_MUTED, a), width=2)
        draw.text((shell_box[0] + 24, shell_box[1] + 30), "UI shell", font=font(FONT_SEMIBOLD, 18),
                  fill=(*COL_MUTED, a), anchor="lm")
    aa = fa255(t, 0.3, 0.5)
    if aa:
        src = (MAIN_CX - 520, 480)
        dst = (shell_box[0] - 10, 480)
        arrow(draw, src, dst, color=COL_ACCENT, alpha=aa, width=3)
        caption(draw, (src[0] + dst[0]) / 2, 440, "GET /api/v1/modules", size=17, color=COL_ACCENT, alpha=aa, bold=True)
    items = ["Contacts"]
    for i, it in enumerate(items):
        ia = fa255(t, 1.0 + i * 0.3, 0.5)
        if ia:
            iy = shell_box[1] + 90 + i * 60
            rounded_rect(draw, (shell_box[0] + 24, iy, shell_box[0] + 380, iy + 44), 8,
                         fill=(*COL_ACCENT, int(ia * 0.3)), outline=(*COL_ACCENT, ia), width=2)
            draw.text((shell_box[0] + 44, iy + 22), it, font=font(FONT_REG, 19), fill=(255, 255, 255, ia), anchor="lm")
    return canvas


PIPELINE_NODES = ["ObservabilityTraceMdcFilter", "JwtActorAuthenticationConverter", "ActorIdResolver",
                   "ExecutionContextEstablishmentFilter", "ObservabilityEnforcementFilter",
                   "RequestExecutionContext", "ExecutionContextInterceptor", "TenantAwareDataSource"]


def draw_pipeline_chain(draw, t, start_offset=0.0, y=440, per_node=0.35):
    n = len(PIPELINE_NODES)
    box_w, box_h, gap = 214, 100, 16
    total = n * box_w + (n - 1) * gap
    x0 = MAIN_CX - total / 2
    prev_x1, prev_a = None, 0
    fnt = font(FONT_SEMIBOLD, 12)
    for i, lab in enumerate(PIPELINE_NODES):
        a = fa255(t, start_offset + i * per_node, 0.4)
        x = x0 + i * (box_w + gap)
        box = (x, y - box_h / 2, x + box_w, y + box_h / 2)
        if a:
            rounded_rect(draw, box, 12, outline=(*COL_ACCENT_SOFT, a), fill=(*COL_BG_DARK_2, int(a * 0.88)), width=2)
            lines = wrap_text(lab, fnt, box_w - 20, draw)
            line_h = fnt.size + 6
            ty = (y - box_h / 2) + (box_h - len(lines) * line_h) / 2 + line_h / 2
            for l in lines:
                draw.text((x + box_w / 2, ty), l, font=fnt, fill=(255, 255, 255, a), anchor="mm")
                ty += line_h
        if prev_x1 is not None and a and prev_a:
            arrow(draw, (prev_x1 + 4, y), (x - 4, y), color=COL_MUTED, alpha=min(a, prev_a), width=2)
        prev_x1, prev_a = x + box_w, a
    return x0, total


def c3_pipeline(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "Runtime Request Pipeline — 8 Components", 255)
    draw_pipeline_chain(draw, t, y=460)
    return canvas


def c3_antipattern(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "Anti-Pattern", 255)
    a = fa255(t, 0.0, 0.5)
    box_w, box_h = 620, 110
    box = (MAIN_CX - box_w - 40, 400 - box_h / 2, MAIN_CX - 40, 400 + box_h / 2)
    if a:
        box_label(draw, box, "migration-driven lifecycle", color=COL_BAD, alpha=a, title_size=21, title_color=COL_BAD, fill=None)
        strike_through(draw, box, color=COL_BAD, alpha=a, width=3)
        caption(draw, (box[0] + box[2]) / 2, box[3] + 26, "forbidden", size=17, color=COL_BAD, alpha=a, bold=True)
    ga = fa255(t, 0.5, 0.5)
    if ga:
        box2 = (MAIN_CX + 40, 400 - box_h / 2, MAIN_CX + 40 + box_w, 400 + box_h / 2)
        box_label(draw, box2, "manifest → registrar → catalog → ledger", color=COL_GOOD, alpha=ga, title_size=16)
        caption(draw, (box2[0] + box2[2]) / 2, box2[3] + 26, "the canonical flow", size=17, color=COL_GOOD, alpha=ga, bold=True)
    return canvas


def diagram_layers_modules(t_local, dur, cues):
    beats = [
        (0.0, c3_layers),
        (cues[2][0], c3_module_flow),
        (cues[4][0], c3_manifest),
        (cues[5][0], c3_ownership),
        (cues[6][0], c3_nav),
        (cues[7][0], c3_pipeline),
        (cues[8][0], c3_antipattern),
    ]
    labels = ["Layers", "Module Flow", "CONTACTS", "Ownership", "Nav", "Pipeline", "Anti-Pattern"]
    return diagram_with_breadcrumb(t_local, dur, beats, labels)


# ===========================================================================
# CHAPTER 4 -- tenant_isolation
# ===========================================================================

def c4_execctx(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "ExecutionContext", 255)
    a = fa255(t, 0.0, 0.6)
    box_w, box_h = 520, 260
    box = (MAIN_CX - box_w / 2, 400 - box_h / 2, MAIN_CX + box_w / 2, 400 + box_h / 2)
    fields = ["actorId", "plane", "tenantId", "actorType"]
    if a:
        rounded_rect(draw, box, 14, outline=(*COL_ACCENT, a), fill=(*COL_BG_DARK_2, int(a * 0.9)), width=2)
        draw.text((MAIN_CX, box[1] + 30), "ExecutionContext", font=font(FONT_SEMIBOLD, 24), fill=(255, 255, 255, a), anchor="mm")
        draw.line((box[0] + 24, box[1] + 54, box[2] - 24, box[1] + 54), fill=(*COL_MUTED, a), width=1)
        fy = box[1] + 90
        for f in fields:
            draw.text((MAIN_CX, fy), f, font=font(FONT_REG, 20), fill=(*COL_ACCENT_SOFT, a), anchor="mm")
            fy += 42
    ra = fa255(t, 0.9, 0.5)
    if ra:
        ly = box[3] + 50
        lbox = (box[0] - 40, ly - 30, MAIN_CX - 10, ly + 30)
        box_label(draw, lbox, "PLATFORM → tenantId must be null", color=COL_GOOD, alpha=ra, title_size=15, fill=COL_BG_DARK_2)
        rbox = (MAIN_CX + 10, ly - 30, box[2] + 40, ly + 30)
        box_label(draw, rbox, "TENANT → tenantId required", color=COL_GOOD, alpha=ra, title_size=15, fill=COL_BG_DARK_2)
        arrow(draw, (MAIN_CX - 40, box[3]), ((lbox[0] + lbox[2]) / 2, ly - 30), color=COL_MUTED, alpha=ra, width=2)
        arrow(draw, (MAIN_CX + 40, box[3]), ((rbox[0] + rbox[2]) / 2, ly - 30), color=COL_MUTED, alpha=ra, width=2)
    return canvas


def c4_resolution(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "Tenant Resolution Chain", 255)
    steps = ["JWT.iss", "tenant_identity_provider (lookup)", "tenant_id", "ExecutionContext"]
    box_w, box_h, gap = 420, 100, 60
    total = len(steps) * box_w + (len(steps) - 1) * gap
    x0 = MAIN_CX - total / 2
    y = 420
    prev_x1, prev_a = None, 0
    for i, s in enumerate(steps):
        a = fa255(t, i * 0.5, 0.5)
        x = x0 + i * (box_w + gap)
        box = (x, y - box_h / 2, x + box_w, y + box_h / 2)
        if a:
            box_label(draw, box, s, color=COL_ACCENT_SOFT, alpha=a, title_size=18)
        if prev_x1 is not None and a and prev_a:
            arrow(draw, (prev_x1 + 6, y), (x - 6, y), color=COL_MUTED, alpha=min(a, prev_a))
        prev_x1, prev_a = x + box_w, a
    return canvas


def c4_datasource(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "TenantAwareDataSource — Connection Borrow", 255)
    steps = ["RESET app.plane / app.user_id / app.tenant_id",
             "set_config(...)  [transaction-local]",
             "handed to JPA/JDBC"]
    box_w, box_h, pitch, y0 = 780, 84, 116, 330
    pos = []
    for i, s in enumerate(steps):
        a = fa255(t, i * 0.5, 0.5)
        y = y0 + i * pitch
        pos.append((y, a))
        if a:
            box = (MAIN_CX - box_w / 2, y - box_h / 2, MAIN_CX + box_w / 2, y + box_h / 2)
            box_label(draw, box, s, color=COL_ACCENT_SOFT, alpha=a, title_size=18)
    for i in range(1, len(pos)):
        y0_, a0 = pos[i - 1]
        y1_, a1 = pos[i]
        if a0 and a1:
            arrow(draw, (MAIN_CX, y0_ + box_h / 2), (MAIN_CX, y1_ - box_h / 2), color=COL_MUTED, alpha=min(a0, a1))
    ba = fa255(t, 1.6, 0.6)
    if ba:
        db = (MAIN_CX - box_w / 2 - 50, y0 - box_h / 2 - 40, MAIN_CX + box_w / 2 + 50, y0 + 2 * pitch + box_h / 2 + 30)
        rounded_rect(draw, db, 16, outline=(*COL_WARN, ba), width=2)
        caption(draw, MAIN_CX, db[1] - 24, "transaction-local scope — this request only", size=16, color=COL_WARN, alpha=ba, bold=True)
    return canvas


def c4_forbidden(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "Forbidden Direct Access", 255)
    a = fa255(t, 0.0, 0.5)
    app_box = (MAIN_CX - 640, 340, MAIN_CX - 240, 460)
    guc_box = (MAIN_CX + 240, 340, MAIN_CX + 640, 460)
    if a:
        box_label(draw, app_box, "application code", color=COL_MUTED, alpha=a, title_size=19)
        box_label(draw, guc_box, "GUC layer", color=COL_MUTED, alpha=a, title_size=19)
        arrow(draw, (app_box[2] + 6, 400), (guc_box[0] - 6, 400), color=COL_BAD, alpha=a, width=3)
        draw_cross_icon(draw, (MAIN_CX, 400), 20, COL_BAD, a)
        caption(draw, MAIN_CX, 340 - 40, "forbidden — must go through TenantAwareDataSource", size=17, color=COL_BAD, alpha=a)
    ra = fa255(t, 0.7, 0.5)
    if ra:
        rbox = (MAIN_CX - 340, 560, MAIN_CX + 340, 660)
        box_label(draw, rbox, "TenantAwareDataSource", "redirected here instead", color=COL_GOOD, alpha=ra, title_size=20)
        arrow(draw, (MAIN_CX, guc_box[3] if a else 460), (MAIN_CX, rbox[1]), color=COL_GOOD, alpha=ra)
    return canvas


def c4_realms(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "Realm Isolation", 255)
    a = fa255(t, 0.0, 0.5)
    box_w, box_h, gap = 560, 260, 200
    x0 = MAIN_CX - gap / 2 - box_w
    x1 = MAIN_CX + gap / 2
    y = 420
    if a:
        box_label(draw, (x0, y - box_h / 2, x0 + box_w, y + box_h / 2), "Platform Realm", "admin account", color=COL_ACCENT, alpha=a, title_size=24)
        draw_lock_icon(draw, (x0 + box_w / 2, y + 60), 30, COL_ACCENT, a)
        box_label(draw, (x1, y - box_h / 2, x1 + box_w, y + box_h / 2), "Tenant Realm", "member account", color=COL_ACCENT_SOFT, alpha=a, title_size=24)
        draw_key_icon(draw, (x1 + box_w / 2, y + 60), 30, COL_ACCENT_SOFT, a)
    ba = 0.0
    blk_start, blk_end = 0.7, 1.6
    if blk_start <= t < blk_end:
        ba = int(255 * ease_in_out((t - blk_start) / 0.3))
        if t > blk_end - 0.3:
            ba = int(ba * max(0.0, (blk_end - t) / 0.3))
    if ba:
        arrow(draw, (x0 + box_w, y), (x1, y), color=COL_BAD, alpha=ba, width=3)
        draw_cross_icon(draw, (MAIN_CX, y), 20, COL_BAD, ba)
    return canvas


def c4_lifecycle(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "Tenant Lifecycle", 255)
    a = fa255(t, 0.0, 0.5)
    pend = (MAIN_CX - 640, 380)
    act = (MAIN_CX - 180, 380)
    susp = (MAIN_CX + 280, 380)
    arch = (MAIN_CX + 640, 580)
    box_w, box_h = 260, 90
    def bx(c):
        return (c[0] - box_w / 2, c[1] - box_h / 2, c[0] + box_w / 2, c[1] + box_h / 2)
    if a:
        box_label(draw, bx(pend), "PENDING", color=COL_ACCENT_SOFT, alpha=a, title_size=20)
        box_label(draw, bx(act), "ACTIVE", color=COL_GOOD, alpha=a, title_size=20)
        box_label(draw, bx(susp), "SUSPENDED", color=COL_WARN, alpha=a, title_size=20)
        arrow(draw, (pend[0] + box_w / 2, pend[1]), (act[0] - box_w / 2, act[1]), color=COL_MUTED, alpha=a)
        arrow(draw, (act[0] + box_w / 2, act[1] - 12), (susp[0] - box_w / 2, susp[1] - 12), color=COL_MUTED, alpha=a)
        arrow(draw, (susp[0] - box_w / 2, susp[1] + 12), (act[0] + box_w / 2, act[1] + 12), color=COL_MUTED, alpha=a)
    aa = fa255(t, 0.7, 0.5)
    if aa:
        box_label(draw, bx(arch), "ARCHIVED", "terminal — no path back", color=COL_MUTED, alpha=aa, title_size=20, fill=COL_BG_DARK_2)
        arrow(draw, (act[0] + 30, act[1] + box_h / 2), (arch[0] - 30, arch[1] - box_h / 2), color=COL_BAD, alpha=aa)
        arrow(draw, (susp[0], susp[1] + box_h / 2), (arch[0] - box_w / 2, arch[1]), color=COL_BAD, alpha=aa)
    return canvas


def diagram_tenant_isolation(t_local, dur, cues):
    beats = [
        (0.0, c4_execctx),
        (cues[1][0], c4_resolution),
        (cues[2][0], c4_datasource),
        (cues[3][0], c4_forbidden),
        (cues[4][0], c4_realms),
        (cues[5][0], c4_lifecycle),
    ]
    labels = ["ExecutionContext", "Tenant Resolution", "DataSource Sequence", "Forbidden Access", "Realm Isolation", "Lifecycle FSM"]
    return diagram_with_breadcrumb(t_local, dur, beats, labels)


# ===========================================================================
# CHAPTER 5 -- security_layers
# ===========================================================================

def c5_domains(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "Three RBAC Domains", 255)
    lanes = [("Platform RBAC", "platform_role_assignment · role_permission_map"),
             ("Tenant RBAC", "tenant_roles · tenant_role_permissions"),
             ("Module RBAC", "MAKER / CHECKER / VIEWER")]
    box_w, box_h, gap = 540, 420, 60
    total = len(lanes) * box_w + (len(lanes) - 1) * gap
    x0 = MAIN_CX - total / 2
    y = 460
    centers = []
    for i, (title, sub) in enumerate(lanes):
        a = fa255(t, i * 0.4, 0.5)
        x = x0 + i * (box_w + gap)
        box = (x, y - box_h / 2, x + box_w, y + box_h / 2)
        if a:
            rounded_rect(draw, box, 14, outline=(*COL_ACCENT, a), fill=(*COL_BG_DARK_2, int(a * 0.85)), width=2)
            draw_table_icon(draw, (x + box_w / 2, y - box_h / 2 + 70), 60, COL_ACCENT_SOFT, a)
            draw.text((x + box_w / 2, y - 20), title, font=font(FONT_SEMIBOLD, 24), fill=(255, 255, 255, a), anchor="mm")
            for j, line in enumerate(sub.split(" · ")):
                draw.text((x + box_w / 2, y + 24 + j * 28), line, font=font(FONT_REG, 16), fill=(*COL_MUTED, a), anchor="mm")
        centers.append(x + box_w / 2)
    ba = 0.0
    blk_start = 1.4
    if blk_start <= t < blk_start + 1.0:
        ba = int(255 * math.sin(min(1.0, (t - blk_start) / 1.0) * math.pi))
    if ba:
        arrow(draw, (centers[0] + box_w / 2 - 10, y), (centers[1] - box_w / 2 + 10, y), color=COL_BAD, alpha=ba, width=3)
        caption(draw, (centers[0] + centers[1]) / 2, y - box_h / 2 - 26, "cross-domain authorization forbidden",
                size=16, color=COL_BAD, alpha=ba)
    return canvas


def c5_makerchecker(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "DB-Enforced Maker ≠ Checker", 255)
    a = fa255(t, 0.0, 0.5)
    box_w, box_h = 1100, 90
    box = (MAIN_CX - box_w / 2, 360 - box_h / 2, MAIN_CX + box_w / 2, 360 + box_h / 2)
    if a:
        rounded_rect(draw, box, 10, outline=(*COL_ACCENT, a), fill=(*COL_BG_DARK_2, int(a * 0.9)), width=2)
        draw.text((MAIN_CX, 360), "CHECK (approved_by IS NULL OR approved_by <> created_by)",
                  font=font(FONT_REG, 20), fill=(*COL_ACCENT_SOFT, a), anchor="mm")
    ma = fa255(t, 0.6, 0.5)
    if ma:
        lx, rx, y2 = MAIN_CX - 320, MAIN_CX + 320, 540
        caption(draw, lx, y2, "maker", size=22, color=COL_WHITE, alpha=ma, bold=True)
        caption(draw, rx, y2, "checker", size=22, color=COL_WHITE, alpha=ma, bold=True)
        draw.line((lx + 70, y2, rx - 90, y2), fill=(*COL_MUTED, ma), width=2)
        draw_cross_icon(draw, ((lx + rx) / 2, y2), 20, COL_BAD, ma)
    return canvas


def c5_pending_action(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "pending_action Constraint", 255)
    a = fa255(t, 0.0, 0.5)
    box_w, box_h = 760, 240
    box = (MAIN_CX - box_w / 2, 420 - box_h / 2, MAIN_CX + box_w / 2, 420 + box_h / 2)
    if a:
        rounded_rect(draw, box, 14, outline=(*COL_ACCENT, a), fill=(*COL_BG_DARK_2, int(a * 0.9)), width=2)
        draw.text((MAIN_CX, box[1] + 40), "pending_action", font=font(FONT_SEMIBOLD, 26), fill=(255, 255, 255, a), anchor="mm")
        draw.text((MAIN_CX, box[1] + 90), "action_type", font=font(FONT_REG, 20), fill=(*COL_ACCENT_SOFT, a), anchor="mm")
    ba = fa255(t, 0.5, 0.5)
    if ba:
        tag = "19 closed values"
        tw = draw.textlength(tag, font=font(FONT_SEMIBOLD, 17))
        ty = box[1] + 130
        rounded_rect(draw, (MAIN_CX - tw / 2 - 14, ty, MAIN_CX + tw / 2 + 14, ty + 34), 17, fill=(*COL_WARN, ba))
        draw.text((MAIN_CX, ty + 17), tag, font=font(FONT_SEMIBOLD, 17), fill=(20, 20, 20, ba), anchor="mm")
    ga = fa255(t, 1.0, 0.5)
    if ga:
        tag2 = "FORCE ROW LEVEL SECURITY"
        tw2 = draw.textlength(tag2, font=font(FONT_SEMIBOLD, 17))
        ty2 = box[1] + 180
        rounded_rect(draw, (MAIN_CX - tw2 / 2 - 14, ty2, MAIN_CX + tw2 / 2 + 14, ty2 + 34), 17, fill=(*COL_GOOD, ga))
        draw.text((MAIN_CX, ty2 + 17), tag2, font=font(FONT_SEMIBOLD, 17), fill=(10, 30, 15, ga), anchor="mm")
    return canvas


def c5_threat_model(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "Threat Model Dashboard", 255)
    tiles = [("12", "trust boundaries"), ("7", "security domains"), ("17", "STRIDE threats")]
    box_w, box_h, gap = 460, 220, 60
    total = len(tiles) * box_w + (len(tiles) - 1) * gap
    x0 = MAIN_CX - total / 2
    y = 440
    for i, (num, lab) in enumerate(tiles):
        a = fa255(t, i * 0.5, 0.5)
        x = x0 + i * (box_w + gap)
        box = (x, y - box_h / 2, x + box_w, y + box_h / 2)
        if a:
            rounded_rect(draw, box, 14, outline=(*COL_ACCENT, a), fill=(*COL_BG_DARK_2, int(a * 0.9)), width=2)
            draw.text((x + box_w / 2, y - 24), num, font=font(FONT_SEMIBOLD, 56), fill=(255, 255, 255, a), anchor="mm")
            draw.text((x + box_w / 2, y + 50), lab, font=font(FONT_REG, 20), fill=(*COL_MUTED, a), anchor="mm")
    return canvas


def c5_disclosed_risk(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "Disclosed Risk", 255)
    a = fa255(t, 0.0, 0.6)
    box_w, box_h = 1100, 220
    box = (MAIN_CX - box_w / 2, 440 - box_h / 2, MAIN_CX + box_w / 2, 440 + box_h / 2)
    if a:
        rounded_rect(draw, box, 14, outline=(*COL_WARN, a), fill=(*COL_BG_DARK_2, int(a * 0.9)), width=3)
        draw.text((MAIN_CX, box[1] + 60), "2 platform tables: RLS enabled, not FORCE'd",
                  font=font(FONT_SEMIBOLD, 26), fill=(*COL_WARN, a), anchor="mm")
        draw.text((MAIN_CX, box[1] + 130), "assessed low-exploitability — logged as a hardening item",
                  font=font(FONT_REG, 20), fill=(*COL_MUTED, a), anchor="mm")
    return canvas


def c5_retired_script(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "Retired Enforcement Script", 255)
    a = fa255(t, 0.0, 0.6)
    if a:
        draw_doc_icon(draw, (MAIN_CX, 360), 60, COL_MUTED, a)
        draw.text((MAIN_CX, 440), "tenant_context_guard.py", font=font(FONT_SEMIBOLD, 22), fill=(*COL_MUTED, a), anchor="mm")
        tw = draw.textlength("retired", font=font(FONT_SEMIBOLD, 16))
        rounded_rect(draw, (MAIN_CX - tw / 2 - 14, 470, MAIN_CX + tw / 2 + 14, 502), 16, outline=(*COL_MUTED, a), width=2)
        draw.text((MAIN_CX, 486), "retired", font=font(FONT_SEMIBOLD, 16), fill=(*COL_MUTED, a), anchor="mm")
    ba = fa255(t, 0.6, 0.5)
    if ba:
        rls = (MAIN_CX - 460, 620)
        tds = (MAIN_CX + 460, 620)
        caption(draw, rls[0], rls[1], "Row-Level Security", size=18, color=COL_GOOD, alpha=ba, bold=True)
        caption(draw, tds[0], tds[1], "TenantAwareDataSource", size=18, color=COL_GOOD, alpha=ba, bold=True)
        arrow(draw, (rls[0], rls[1] - 20), (MAIN_CX - 40, 500), color=COL_GOOD, alpha=ba)
        arrow(draw, (tds[0], tds[1] - 20), (MAIN_CX + 40, 500), color=COL_GOOD, alpha=ba)
        caption(draw, MAIN_CX, 680, "already covered elsewhere", size=16, color=COL_GOOD, alpha=ba)
    return canvas


def c5_principle(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    words = ["Find it.", "Disclose it.", "Only then remove it."]
    y0 = 420
    for i, w_ in enumerate(words):
        a = fa255(t, i * 0.7, 0.6)
        if a:
            draw.text((MAIN_CX, y0 + i * 80), w_, font=font(FONT_SEMIBOLD, 48), fill=(255, 255, 255, a), anchor="mm")
    return canvas


def diagram_security_layers(t_local, dur, cues):
    beats = [
        (0.0, c5_domains),
        (cues[1][0], c5_makerchecker),
        (cues[2][0], c5_pending_action),
        (cues[3][0], c5_threat_model),
        (cues[4][0], c5_disclosed_risk),
        (cues[5][0], c5_retired_script),
        (cues[6][0], c5_principle),
    ]
    labels = ["3 RBAC Domains", "Maker ≠ Checker", "pending_action", "Threat Model", "Disclosed Risk", "Retired Script", "Principle"]
    return diagram_with_breadcrumb(t_local, dur, beats, labels)


# ===========================================================================
# CHAPTER 6 -- identity_flow
# ===========================================================================

def c6_token(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "Token Validation Sequence", 255)
    checks = ["Signature", "Issuer (exact match)", "Audience (exact match)"]
    box_w, box_h, gap = 420, 100, 60
    total = len(checks) * box_w + (len(checks) - 1) * gap
    x0 = MAIN_CX - total / 2
    y = 380
    for i, c in enumerate(checks):
        start = i * 0.55
        a = fa255(t, start, 0.5)
        passed = t >= start + 0.5
        col = COL_GOOD if passed else COL_MUTED
        x = x0 + i * (box_w + gap)
        box = (x, y - box_h / 2, x + box_w, y + box_h / 2)
        if a:
            box_label(draw, box, c, color=col, alpha=a, title_size=19)
            if passed:
                draw_check_icon(draw, (x + box_w - 26, y - box_h / 2 + 22), 18, COL_GOOD, a)
        if i > 0:
            aa = min(fa255(t, (i - 1) * 0.55, 0.5), a)
            if aa:
                arrow(draw, (x - gap + 6, y), (x - 6, y), color=COL_MUTED, alpha=aa)
    ba = fa255(t, 1.9, 0.5)
    if ba:
        tag = "no fallback issuer"
        tw = draw.textlength(tag, font=font(FONT_SEMIBOLD, 18))
        ty = y + box_h / 2 + 50
        rounded_rect(draw, (MAIN_CX - tw / 2 - 16, ty, MAIN_CX + tw / 2 + 16, ty + 40), 20, outline=(*COL_BAD, ba), width=2)
        draw.text((MAIN_CX, ty + 20), tag, font=font(FONT_SEMIBOLD, 18), fill=(*COL_BAD, ba), anchor="mm")
    return canvas


def c6_binding(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "Identity Binding Lookup", 255)
    a = fa255(t, 0.0, 0.5)
    sub_box = (MAIN_CX - 700, 320, MAIN_CX - 260, 420)
    bind_box = (MAIN_CX - 220, 500, MAIN_CX + 220, 600)
    user_box = (MAIN_CX + 260, 320, MAIN_CX + 700, 420)
    if a:
        box_label(draw, sub_box, "JWT.sub", "external id", color=COL_MUTED, alpha=a, title_size=20)
        box_label(draw, user_box, "app_user.id", "internal", color=COL_GOOD, alpha=a, title_size=20)
    ca = fa255(t, 0.5, 0.5)
    if ca:
        arrow(draw, (sub_box[2], (sub_box[1] + sub_box[3]) / 2), (user_box[0], (user_box[1] + user_box[3]) / 2),
              color=COL_BAD, alpha=int(ca * 0.5), width=2)
        draw_cross_icon(draw, (MAIN_CX, 370), 16, COL_BAD, ca)
        caption(draw, MAIN_CX, 300, "never bound directly", size=15, color=COL_BAD, alpha=ca)
    ba = fa255(t, 0.9, 0.5)
    if ba:
        box_label(draw, bind_box, "identity_binding", color=COL_ACCENT, alpha=ba, title_size=19)
        arrow(draw, ((sub_box[0] + sub_box[2]) / 2, sub_box[3]), ((sub_box[0] + sub_box[2]) / 2, bind_box[1]), color=COL_ACCENT, alpha=ba)
        arrow(draw, (bind_box[2], (bind_box[1] + bind_box[3]) / 2), (user_box[0] - 10, (user_box[1] + user_box[3]) / 2 + 60), color=COL_ACCENT, alpha=ba)
        arrow(draw, ((bind_box[0] + bind_box[2]) / 2, bind_box[1]), ((user_box[0] + user_box[2]) / 2, user_box[3]), color=COL_ACCENT, alpha=ba)
    return canvas


def c6_crossrealm(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "Cross-Realm Rejection", 255)
    a = fa255(t, 0.0, 0.5)
    tok_c = (MAIN_CX - 560, 400)
    endpoint = (MAIN_CX - 100, 300, MAIN_CX + 620, 520)
    if a:
        box_label(draw, (tok_c[0] - 140, tok_c[1] - 60, tok_c[0] + 140, tok_c[1] + 60), "Tenant A token", color=COL_WARN, alpha=a, title_size=18)
        rounded_rect(draw, endpoint, 14, outline=(*COL_MUTED, a), width=2)
        draw.text((endpoint[0] + 24, endpoint[1] + 28), "Tenant B endpoint", font=font(FONT_SEMIBOLD, 18), fill=(*COL_MUTED, a), anchor="lm")
    ga = fa255(t, 0.4, 0.5)
    gate_x = endpoint[0] + 60
    if ga:
        draw.line((gate_x, endpoint[1] + 20, gate_x, endpoint[3] - 20), fill=(*COL_BAD, ga), width=4)
        caption(draw, gate_x, endpoint[1] - 24, "isRegisteredIssuer()", size=15, color=COL_BAD, alpha=ga, bold=True)
        decode_x = endpoint[0] + 300
        draw.text((decode_x, (endpoint[1] + endpoint[3]) / 2), "decode", font=font(FONT_REG, 18), fill=(*COL_MUTED, int(ga * 0.5)), anchor="mm")
    ra = fa255(t, 0.9, 0.5)
    if ra:
        arrow(draw, (tok_c[0] + 140, tok_c[1]), (gate_x - 10, endpoint[1] + 120), color=COL_BAD, alpha=ra)
        draw_cross_icon(draw, (gate_x, endpoint[1] + 120), 20, COL_BAD, ra)
        caption(draw, gate_x, endpoint[3] + 40, "rejected before decode — structurally earlier", size=16, color=COL_BAD, alpha=ra)
    return canvas


def c6_service_principal(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "Service-Principal Path", 255)
    a = fa255(t, 0.0, 0.5)
    box_w, box_h = 520, 180
    tok_box = (MAIN_CX - 700, 340 - box_h / 2, MAIN_CX - 700 + box_w, 340 + box_h / 2)
    if a:
        rounded_rect(draw, tok_box, 14, outline=(*COL_ACCENT, a), fill=(*COL_BG_DARK_2, int(a * 0.9)), width=2)
        draw.text((tok_box[0] + box_w / 2, tok_box[1] + 30), "service-credential token", font=font(FONT_SEMIBOLD, 18), fill=(255, 255, 255, a), anchor="mm")
        claims = ["actor_type=service", "allowed_scopes", "allowed_tenants"]
        for i, cl in enumerate(claims):
            draw.text((tok_box[0] + box_w / 2, tok_box[1] + 74 + i * 32), cl, font=font(FONT_REG, 16), fill=(*COL_ACCENT_SOFT, a), anchor="mm")
    ba = fa255(t, 0.6, 0.5)
    if ba:
        auth_box = (MAIN_CX + 260, 340 - 60, MAIN_CX + 700, 340 + 60)
        box_label(draw, auth_box, "authorized", color=COL_GOOD, alpha=ba, title_size=22)
        arrow(draw, (tok_box[2], 340), (auth_box[0], 340), color=COL_GOOD, alpha=ba, width=3)
        dashdy = 340 + 120
        dashed_line(draw, (tok_box[2], dashdy), (auth_box[0], dashdy), color=COL_MUTED, alpha=ba, width=2)
        caption(draw, (tok_box[2] + auth_box[0]) / 2, dashdy + 26, "no DB read", size=15, color=COL_MUTED, alpha=ba)
    return canvas


def c6_per_tenant(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "Per-Tenant Service Accounts", 255)
    n = 4
    box_w, box_h, gap = 340, 140, 40
    total = n * box_w + (n - 1) * gap
    x0 = MAIN_CX - total / 2
    y = 380
    for i in range(n):
        a = fa255(t, i * 0.3, 0.5)
        x = x0 + i * (box_w + gap)
        box = (x, y - box_h / 2, x + box_w, y + box_h / 2)
        if a:
            box_label(draw, box, f"Tenant Realm {i + 1}", color=COL_ACCENT_SOFT, alpha=a, title_size=17)
            draw_key_icon(draw, (x + box_w / 2, y + box_h / 2 + 50), 26, COL_WARN, a)
    aa = fa255(t, 1.4, 0.5)
    if aa:
        caption(draw, MAIN_CX, y + box_h / 2 + 110, "no master-realm admin credential", size=17, color=COL_WARN, alpha=aa, bold=True)
    return canvas


def diagram_identity_flow(t_local, dur, cues):
    beats = [
        (0.0, c6_token),
        (cues[1][0], c6_binding),
        (cues[2][0], c6_crossrealm),
        (cues[3][0], c6_service_principal),
        (cues[4][0], c6_per_tenant),
    ]
    labels = ["Token Checks", "Identity Binding", "Cross-Realm Reject", "Service Principal", "Per-Tenant Accounts"]
    return diagram_with_breadcrumb(t_local, dur, beats, labels)


# ===========================================================================
# CHAPTER 7 -- data_audit
# ===========================================================================

def c7_rls_policy(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "Row-Level Security Policy", 255)
    a = fa255(t, 0.0, 0.6)
    box_w, box_h = 1300, 220
    box = (MAIN_CX - box_w / 2, 420 - box_h / 2, MAIN_CX + box_w / 2, 420 + box_h / 2)
    if a:
        rounded_rect(draw, box, 12, outline=(*COL_ACCENT, a), fill=(*COL_BG_DARK_2, int(a * 0.9)), width=2)
        draw.line((box[0] + box_w * 0.32, box[1], box[0] + box_w * 0.32, box[3]), fill=(*COL_MUTED, a), width=1)
        draw.text((box[0] + box_w * 0.16, box[1] + 32), "table", font=font(FONT_SEMIBOLD, 18), fill=(*COL_ACCENT_SOFT, a), anchor="mm")
        draw.text((box[0] + box_w * 0.66, box[1] + 32), "policy", font=font(FONT_SEMIBOLD, 18), fill=(*COL_ACCENT_SOFT, a), anchor="mm")
        draw.line((box[0] + 20, box[1] + 56, box[2] - 20, box[1] + 56), fill=(*COL_MUTED, a), width=1)
        draw.text((box[0] + box_w * 0.16, box[1] + 90), "audit_log", font=font(FONT_REG, 20), fill=(255, 255, 255, a), anchor="mm")
        draw.text((box[0] + box_w * 0.66, box[1] + 90), "rls_tenant_isolation", font=font(FONT_REG, 18), fill=(255, 255, 255, a), anchor="mm")
        pa = fa255(t, 0.6, 0.5)
        if pa:
            draw.text((MAIN_CX, box[3] - 40), "tenant_id = current_tenant_uuid() AND actor_id = current_user_uuid()",
                      font=font(FONT_REG, 17), fill=(*COL_WARN, pa), anchor="mm")
    return canvas


AUDIT_TABLES = ["audit_log", "pending_action", "platform_audit_log", "module_action_audit",
                 "module_contacts_contact_action_audit", "service_principal_audit"]


def c7_append_only(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "Append-Only, By Trigger", 255)
    n = len(AUDIT_TABLES)
    cols = 3
    box_w, box_h, gap_x, gap_y = 540, 110, 40, 30
    total_w = cols * box_w + (cols - 1) * gap_x
    x0 = MAIN_CX - total_w / 2
    y0 = 320
    for i, tbl in enumerate(AUDIT_TABLES):
        r, c = divmod(i, cols)
        a = fa255(t, i * 0.2, 0.4)
        x = x0 + c * (box_w + gap_x)
        y = y0 + r * (box_h + gap_y)
        box = (x, y, x + box_w, y + box_h)
        if a:
            box_label(draw, box, tbl, color=COL_ACCENT_SOFT, alpha=a, title_size=15)
            draw_lock_icon(draw, (x + box_w - 26, y + 24), 18, COL_MUTED, a)
    ba = fa255(t, 1.6, 0.5)
    if ba:
        caption(draw, MAIN_CX, y0 + 2 * (box_h + gap_y) + 30, "UPDATE / DELETE  →  exception, transaction stopped",
                size=18, color=COL_BAD, alpha=ba, bold=True)
    return canvas


def c7_gov07(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "GOV-07 Dedup", 255)
    a = fa255(t, 0.0, 0.5)
    box_w, box_h = 560, 110
    b1 = (MAIN_CX - box_w - 20, 380 - box_h / 2, MAIN_CX - 20, 380 + box_h / 2)
    if a:
        box_label(draw, b1, "pending_action #1", "submitted", color=COL_ACCENT, alpha=a, title_size=19)
    ba = fa255(t, 0.7, 0.5)
    if ba:
        b2 = (MAIN_CX + 20, 380 - box_h / 2, MAIN_CX + 20 + box_w, 380 + box_h / 2)
        box_label(draw, b2, "pending_action #2", "same target, same type", color=COL_WARN, alpha=ba, title_size=19)
        tag = "already pending"
        tw = draw.textlength(tag, font=font(FONT_SEMIBOLD, 17))
        ty = b2[3] + 30
        rounded_rect(draw, (MAIN_CX - tw / 2 - 14, ty, MAIN_CX + tw / 2 + 14, ty + 36), 18, fill=(*COL_WARN, ba))
        draw.text((MAIN_CX, ty + 18), tag, font=font(FONT_SEMIBOLD, 17), fill=(20, 20, 20, ba), anchor="mm")
    return canvas


def c7_bootstrap(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "Bootstrap Exception", 255)
    a = fa255(t, 0.0, 0.5)
    if a:
        dw, dh = 140, 220
        box = (MAIN_CX - dw / 2, 340, MAIN_CX + dw / 2, 340 + dh)
        rounded_rect(draw, box, 12, outline=(*COL_WARN, a), width=3)
        draw.arc((box[2] - 40, box[1] + dh / 2 - 20, box[2], box[1] + dh / 2 + 20), start=0, end=360, fill=(*COL_WARN, a), width=2)
        caption(draw, MAIN_CX, box[3] + 34, "tenant's first membership only", size=17, color=COL_WARN, alpha=a, bold=True)
    ba = fa255(t, 0.6, 0.5)
    if ba:
        abox = (MAIN_CX + 260, 380 - 45, MAIN_CX + 700, 380 + 45)
        box_label(draw, abox, "TENANT_BOOTSTRAP_MEMBERSHIP", color=COL_ACCENT, alpha=ba, title_size=15)
        arrow(draw, (MAIN_CX + dw / 2 + 10 if a else MAIN_CX + 70, 380), (abox[0] - 10, 380), color=COL_ACCENT, alpha=ba)
    return canvas


def c7_projection(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "Projection-Only Tables", 255)
    a = fa255(t, 0.0, 0.5)
    trig = (MAIN_CX, 300)
    t1 = (MAIN_CX - 340, 480)
    t2 = (MAIN_CX + 340, 480)
    box_w, box_h = 460, 110
    if a:
        box_label(draw, (trig[0] - 150, trig[1] - 40, trig[0] + 150, trig[1] + 40), "trigger", color=COL_ACCENT, alpha=a, title_size=20)
        box_label(draw, (t1[0] - box_w / 2, t1[1] - box_h / 2, t1[0] + box_w / 2, t1[1] + box_h / 2),
                  "module_role_assignment", color=COL_GOOD, alpha=a, title_size=17)
        box_label(draw, (t2[0] - box_w / 2, t2[1] - box_h / 2, t2[0] + box_w / 2, t2[1] + box_h / 2),
                  "tenant_module", color=COL_GOOD, alpha=a, title_size=17)
        arrow(draw, (trig[0] - 40, trig[1] + 40), (t1[0], t1[1] - box_h / 2), color=COL_ACCENT, alpha=a)
        arrow(draw, (trig[0] + 40, trig[1] + 40), (t2[0], t2[1] - box_h / 2), color=COL_ACCENT, alpha=a)
        caption(draw, MAIN_CX, t1[1] + box_h / 2 + 40, "trigger-populated only", size=17, color=COL_ACCENT, alpha=a)
    return canvas


def c7_trace(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "Trace Contract", 255)
    events = ["http.request.begin", "auth.jwt.validated", "tenant.selection", "db.guc.bind", "dao.*.query", "http.request.end"]
    box_w, box_h, gap = 300, 76, 16
    total = len(events) * box_w + (len(events) - 1) * gap
    x0 = MAIN_CX - total / 2
    y = 380
    prev_x1, prev_a = None, 0
    for i, e in enumerate(events):
        a = fa255(t, i * 0.28, 0.4)
        x = x0 + i * (box_w + gap)
        box = (x, y - box_h / 2, x + box_w, y + box_h / 2)
        if a:
            box_label(draw, box, e, color=COL_ACCENT_SOFT, alpha=a, title_size=13)
        if prev_x1 is not None and a and prev_a:
            arrow(draw, (prev_x1 + 4, y), (x - 4, y), color=COL_MUTED, alpha=min(a, prev_a), width=2)
        prev_x1, prev_a = x + box_w, a
    ba = fa255(t, 1.8, 0.5)
    if ba:
        tags = ["JWT", "PII", "claims"]
        tx0 = MAIN_CX - 260
        for i, tg in enumerate(tags):
            tx = tx0 + i * 260
            ty = y - box_h / 2 - 70
            tw = draw.textlength(tg, font=font(FONT_SEMIBOLD, 18))
            draw.text((tx, ty), tg, font=font(FONT_SEMIBOLD, 18), fill=(*COL_BAD, ba), anchor="mm")
            draw.line((tx - tw / 2, ty, tx + tw / 2, ty), fill=(*COL_BAD, ba), width=3)
        caption(draw, MAIN_CX, y - box_h / 2 - 110, "deliberately excluded from the trace", size=16, color=COL_BAD, alpha=ba)
    return canvas


def diagram_data_audit(t_local, dur, cues):
    beats = [
        (0.0, c7_rls_policy),
        (cues[1][0], c7_append_only),
        (cues[2][0], c7_gov07),
        (cues[3][0], c7_bootstrap),
        (cues[4][0], c7_projection),
        (cues[5][0], c7_trace),
    ]
    labels = ["RLS Policy", "Append-Only", "GOV-07 Dedup", "Bootstrap Exception", "Projection Tables", "Trace Contract"]
    return diagram_with_breadcrumb(t_local, dur, beats, labels)


# ===========================================================================
# CHAPTER 8 -- governance_pipeline
# ===========================================================================

LIFECYCLE_STAGES = ["PROPOSED", "CHARTER_REQUIRED", "CHARTERED", "SCHEDULED", "IN_PROGRESS", "LANDED", "VERIFIED", "CLOSED"]


def c8_lifecycle(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "Nine-Stage Lifecycle", 255)
    n = len(LIFECYCLE_STAGES)
    box_w, box_h, gap = 216, 84, 14
    total = n * box_w + (n - 1) * gap
    x0 = MAIN_CX - total / 2
    y = 360
    prev_x1, prev_a = None, 0
    centers = []
    for i, s in enumerate(LIFECYCLE_STAGES):
        a = fa255(t, i * 0.32, 0.4)
        x = x0 + i * (box_w + gap)
        box = (x, y - box_h / 2, x + box_w, y + box_h / 2)
        centers.append((x + box_w / 2, y))
        if a:
            box_label(draw, box, s, color=COL_ACCENT_SOFT, alpha=a, title_size=13)
            if i >= n - 2 and t >= i * 0.32 + 0.6:
                la = fa255(t, i * 0.32 + 0.4, 0.4)
                draw_lock_icon(draw, (x + box_w / 2, box[1] - 24), 16, COL_WARN, min(a, la))
        if prev_x1 is not None and a and prev_a:
            arrow(draw, (prev_x1 + 4, y), (x - 4, y), color=COL_MUTED, alpha=min(a, prev_a), width=2)
        prev_x1, prev_a = x + box_w, a
    da = fa255(t, n * 0.32 + 0.2, 0.5)
    if da:
        dc = (centers[5][0], y + 130)
        box_label(draw, (dc[0] - 110, dc[1] - 34, dc[0] + 110, dc[1] + 34), "DEFERRED", color=COL_MUTED, alpha=da, title_size=15)
        arrow(draw, (centers[4][0], y + box_h / 2), (dc[0] - 60, dc[1] - 34), color=COL_MUTED, alpha=da, width=2)
    return canvas


def c8_insertion(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "Three Insertion Paths", 255)
    stages = ["PROPOSED", "CHARTERED", "IN_PROGRESS", "VERIFIED"]
    box_w, box_h, gap = 380, 90, 40
    total = len(stages) * box_w + (len(stages) - 1) * gap
    x0 = MAIN_CX - total / 2
    y = 320
    centers = []
    a0 = fa255(t, 0.0, 0.5)
    for i, s in enumerate(stages):
        x = x0 + i * (box_w + gap)
        box = (x, y - box_h / 2, x + box_w, y + box_h / 2)
        centers.append(x + box_w / 2)
        if a0:
            box_label(draw, box, s, color=COL_ACCENT_SOFT, alpha=a0, title_size=17)
        if i > 0 and a0:
            arrow(draw, (x - gap + 6, y), (x - 6, y), color=COL_MUTED, alpha=a0)
    paths = [("CHARTER_INSERTION", 0, False), ("PROMOTION_INSERTION", 2, False), ("OPERATOR_INSERTION", 1, True)]
    for i, (lab, idx, blocked) in enumerate(paths):
        a = fa255(t, 0.5 + i * 0.5, 0.5)
        if a:
            bx = centers[idx]
            by = y + box_h / 2 + 120
            col = COL_BAD if blocked else COL_GOOD
            caption(draw, bx, by, lab, size=16, color=col, alpha=a, bold=True)
            if blocked:
                arrow(draw, (bx, by - 20), (bx, y + box_h / 2 + 10), color=COL_BAD, alpha=a)
                draw_cross_icon(draw, (bx, y + box_h / 2 + 40), 16, COL_BAD, a)
                caption(draw, bx, by + 30, "blocked — STRUCTURE lane", size=14, color=COL_BAD, alpha=a)
            else:
                arrow(draw, (bx, by - 20), (bx, y + box_h / 2 + 10), color=COL_GOOD, alpha=a)
    return canvas


LEDGER_OPS = ["INSERTED", "CHARTERED", "LANDED", "VERIFIED"]


def c8_ledger(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "Append-Only Governance Ledger", 255)
    x = MAIN_CX - 500
    y0 = 300
    for i, op in enumerate(LEDGER_OPS):
        a = fa255(t, i * 0.45, 0.4)
        if a:
            y = y0 + i * 56
            draw.text((x, y), f"{op}", font=font(FONT_SEMIBOLD, 20), fill=(*COL_ACCENT_SOFT, a), anchor="lm")
            draw.ellipse((x - 28, y - 6, x - 16, y + 6), fill=(*COL_GOOD, a))
    ba = fa255(t, 2.0, 0.5)
    if ba:
        bx0, by0 = MAIN_CX + 60, 300
        bw, bh = 620, 220
        box = (bx0, by0, bx0 + bw, by0 + bh)
        rounded_rect(draw, box, 12, outline=(*COL_WARN, ba), fill=(*COL_BG_DARK_2, int(ba * 0.9)), width=2)
        draw.text((bx0 + 24, by0 + 26), "board authority — bounded", font=font(FONT_SEMIBOLD, 19), fill=(*COL_WARN, ba), anchor="lm")
        forbidden = ["cannot weaken an invariant", "cannot bypass compliance gate"]
        for i, f_ in enumerate(forbidden):
            draw.text((bx0 + 24, by0 + 80 + i * 42), f"✗  {f_}", font=font(FONT_REG, 18), fill=(*COL_BAD, ba), anchor="lm")
    return canvas


def c8_validators(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "Constitutional Smoke Set", 255)
    a0 = fa255(t, 0.0, 0.5)
    if a0:
        tag = "tier: smoke — CI-blocking"
        tw = draw.textlength(tag, font=font(FONT_SEMIBOLD, 18))
        rounded_rect(draw, (MAIN_CX - tw / 2 - 16, 260, MAIN_CX + tw / 2 + 16, 300), 20, fill=(*COL_ACCENT, a0))
        draw.text((MAIN_CX, 280), tag, font=font(FONT_SEMIBOLD, 18), fill=(255, 255, 255, a0), anchor="mm")
    cols, box_w, box_h, gap = 3, 260, 90, 26
    total = cols * box_w + (cols - 1) * gap
    x0 = MAIN_CX - total / 2
    y0 = 350
    for i in range(6):
        r, c = divmod(i, cols)
        a = fa255(t, 0.5 + i * 0.3, 0.4)
        lit = t >= 0.5 + i * 0.3 + 0.3
        col = COL_GOOD if lit else COL_MUTED
        x = x0 + c * (box_w + gap)
        y = y0 + r * (box_h + gap)
        box = (x, y, x + box_w, y + box_h)
        if a:
            box_label(draw, box, f"V{i + 1:02d}", color=col, alpha=a, title_size=24)
    ea = fa255(t, 2.6, 0.5)
    if ea:
        caption(draw, MAIN_CX, y0 + 2 * (box_h + gap) + 20, "V07…V11 — extended, non-blocking", size=16, color=COL_MUTED, alpha=int(ea * 0.7))
    return canvas


def c8_graph(t, dur):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "Hash-Pinned Architecture Graph", 255)
    a = fa255(t, 0.0, 0.5)
    n1 = (MAIN_CX - 620, 400)
    n2 = (MAIN_CX, 400)
    n3 = (MAIN_CX + 640, 400)
    box_w, box_h = 380, 100
    if a:
        box_label(draw, (n1[0] - box_w / 2, n1[1] - box_h / 2, n1[0] + box_w / 2, n1[1] + box_h / 2), "system.md", color=COL_ACCENT, alpha=a, title_size=22)
        box_label(draw, (n2[0] - box_w / 2, n2[1] - box_h / 2, n2[0] + box_w / 2, n2[1] + box_h / 2), "source_system_sha256", color=COL_ACCENT_SOFT, alpha=a, title_size=16)
        box_label(draw, (n3[0] - box_w / 2, n3[1] - box_h / 2, n3[0] + box_w / 2, n3[1] + box_h / 2), "platform_architecture_graph.yaml", color=COL_ACCENT_SOFT, alpha=a, title_size=14)
    broken_until = 1.6
    if a:
        if t < broken_until:
            fa_ = int(a * min(1.0, t / 0.4))
            dashed_line(draw, (n1[0] + box_w / 2, n1[1]), (n2[0] - box_w / 2, n2[1]), color=COL_BAD, alpha=fa_, width=3)
            caption(draw, (n1[0] + n2[0]) / 2, n1[1] - 70, "sha256", size=15, color=COL_MUTED, alpha=fa_)
            tag = "CI FAIL"
            tw = draw.textlength(tag, font=font(FONT_SEMIBOLD, 16))
            rounded_rect(draw, ((n1[0] + n2[0]) / 2 - tw / 2 - 10, n1[1] + 40, (n1[0] + n2[0]) / 2 + tw / 2 + 10, n1[1] + 72), 14,
                         fill=(*COL_BAD, fa_))
            draw.text(((n1[0] + n2[0]) / 2, n1[1] + 56), tag, font=font(FONT_SEMIBOLD, 16), fill=(255, 255, 255, fa_), anchor="mm")
        else:
            fa_ = a
            arrow(draw, (n1[0] + box_w / 2, n1[1]), (n2[0] - box_w / 2, n2[1]), color=COL_GOOD, alpha=fa_, width=3)
            caption(draw, (n1[0] + n2[0]) / 2, n1[1] - 70, "sha256", size=15, color=COL_GOOD, alpha=fa_)
            arrow(draw, (n2[0] + box_w / 2, n2[1]), (n3[0] - box_w / 2, n3[1]), color=COL_GOOD, alpha=fa_, width=3)
    return canvas


def diagram_governance_pipeline(t_local, dur, cues):
    beats = [
        (0.0, c8_lifecycle),
        (cues[1][0], c8_insertion),
        (cues[2][0], c8_ledger),
        (cues[3][0], c8_validators),
        (cues[4][0], c8_graph),
    ]
    labels = ["9-Stage Lifecycle", "3 Insertion Paths", "Ledger Stream", "6 Validators", "Hash-Pinned Graph"]
    return diagram_with_breadcrumb(t_local, dur, beats, labels)


# ===========================================================================
# CHAPTER 9 -- request_lifecycle (centerpiece: continuous vertical spine)
# ===========================================================================

REQUEST_NODES = [
    "User / Request",
    "ObservabilityTraceMdcFilter — trace assigned",
    "Issuer pre-validation (TenantRealmRegistry) → JWT decode + validate",
    "JwtActorAuthenticationConverter → identity_binding → app_user.id",
    "ExecutionContextEstablishmentFilter — plane determined from route",
    "ExecutionContext constructed (plane/tenant validated)",
    "TenantAwareDataSource — GUCs reset + bound",
    "Module handler — RBAC + workflow check → pending_action",
    "Checker decision — approved_by ≠ created_by enforced",
    "Trigger → audit_log / platform_audit_log written → projection updated → Response",
]


def diagram_request_lifecycle(t_local, dur, cues):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "One Request, Traced End to End", 255)
    n = len(REQUEST_NODES)
    top_y, bottom_y = 230, 900
    pitch = (bottom_y - top_y) / (n - 1)
    drift = lerp(0, -40, min(1.0, t_local / max(dur, 1.0)))
    box_w, box_h = 1560, 58

    lit = 0
    for i, (cs, _ce) in enumerate(cues):
        if t_local >= cs:
            lit = i + 1

    if lit > 0:
        cs, _ce = cues[lit - 1]
        node_prog = ease_in_out(min(1.0, (t_local - cs) / 0.5))
        y_top_line = top_y + drift
        y_end = top_y + drift + (lit - 2) * pitch if lit > 1 else y_top_line
        y_end = y_end + pitch * node_prog if lit >= 1 else y_top_line
        if lit == 1:
            y_end = y_top_line + pitch * node_prog * 0.001
        draw.line((MAIN_CX, y_top_line, MAIN_CX, max(y_top_line, y_end)), fill=(*COL_ACCENT, 220), width=4)

    for i, label in enumerate(REQUEST_NODES):
        cs, _ce = cues[i]
        if t_local < cs:
            continue
        a = fa255(t_local, cs, 0.5)
        y = top_y + i * pitch + drift
        is_current = (i == lit - 1)
        alpha = a if is_current else int(a * 0.68)
        color = COL_ACCENT if is_current else COL_ACCENT_SOFT
        box = (MAIN_CX - box_w / 2, y - box_h / 2, MAIN_CX + box_w / 2, y + box_h / 2)
        rounded_rect(draw, box, 10, outline=(*color, alpha), fill=(*COL_BG_DARK_2, int(alpha * 0.85)), width=2)
        num_fnt = font(FONT_SEMIBOLD, 17)
        draw.text((box[0] + 30, y), str(i + 1), font=num_fnt, fill=(*color, alpha), anchor="mm")
        lbl_fnt = font(FONT_REG, 17 if len(label) < 55 else 15)
        draw.text((box[0] + 66, y), label, font=lbl_fnt, fill=(255, 255, 255, alpha), anchor="lm")
    return canvas.convert("RGB")


# ===========================================================================
# CHAPTER 10 -- synthesis
# ===========================================================================

def diagram_synthesis(t_local, dur, cues):
    canvas = base_canvas()
    draw = ImageDraw.Draw(canvas, "RGBA")
    kicker(draw, "Why This Architecture Matters", 255)

    cards = [
        ("Spec ↔ Graph", "hash-pinned"),
        ("Tenant Isolation ×4", "app code · connection · database · CI"),
        ("Governance Debt", "tracked, not hidden"),
        ("Prunes, Not Just Accretes", "BILLING · NOTIFICATIONS · ADMIN"),
    ]
    box_w, box_h, gap_x, gap_y = 780, 170, 60, 26
    total_w = 2 * box_w + gap_x
    x0 = MAIN_CX - total_w / 2
    y0 = 250

    close_start = cues[4][0]
    dim = fa(t_local, close_start, 1.0) * 0.75

    for i, (title, sub) in enumerate(cards):
        r, c = divmod(i, 2)
        a = fa255(t_local, i * 0.5, 0.6)
        a = int(a * (1.0 - dim))
        x = x0 + c * (box_w + gap_x)
        y = y0 + r * (box_h + gap_y)
        box = (x, y, x + box_w, y + box_h)
        if a:
            rounded_rect(draw, box, 16, outline=(*COL_ACCENT, a), fill=(*COL_BG_DARK_2, int(a * 0.9)), width=2)
            draw.text((x + box_w / 2, y + 48), title, font=font(FONT_SEMIBOLD, 26), fill=(255, 255, 255, a), anchor="mm")
            if i == 3:
                mods = ["BILLING", "NOTIFICATIONS", "ADMIN"]
                mw, mh, mgap = 220, 40, 16
                mtotal = len(mods) * mw + (len(mods) - 1) * mgap
                mx0 = x + box_w / 2 - mtotal / 2
                for j, m in enumerate(mods):
                    mx = mx0 + j * (mw + mgap)
                    mbox = (mx, y + 96, mx + mw, y + 96 + mh)
                    rounded_rect(draw, mbox, 8, outline=(*COL_MUTED, a), width=2)
                    draw.text(((mbox[0] + mbox[2]) / 2, (mbox[1] + mbox[3]) / 2), m, font=font(FONT_REG, 14),
                              fill=(*COL_MUTED, a), anchor="mm")
                    strike_through(draw, mbox, color=COL_BAD, alpha=a, width=2)
            elif i == 1:
                icons = ["app code", "connection", "database", "CI"]
                iw = box_w / len(icons)
                for j, ic in enumerate(icons):
                    draw.text((x + iw * j + iw / 2, y + 118), ic, font=font(FONT_REG, 15), fill=(*COL_GOOD, a), anchor="mm")
                    draw.ellipse((x + iw * j + iw / 2 - 6, y + 92, x + iw * j + iw / 2 + 6, y + 104), fill=(*COL_GOOD, a))
            else:
                draw.text((x + box_w / 2, y + 104), sub, font=font(FONT_REG, 18), fill=(*COL_MUTED, a), anchor="mm")

    cards_bottom = y0 + 2 * box_h + gap_y
    line_a = fa255(t_local, close_start + 0.4, 0.8)
    if line_a:
        closing_text = C.CHAPTERS[9]["cues"][4]
        fnt = font(FONT_SEMIBOLD, 30)
        lines = wrap_text(closing_text, fnt, 1560, draw)
        line_h = 46
        block_h = len(lines) * line_h
        ly = cards_bottom + (860 - cards_bottom - block_h) / 2 + line_h / 2
        for i, l in enumerate(lines):
            la = fa255(t_local, close_start + 0.6 + i * 0.4, 0.6)
            draw.text((MAIN_CX, ly + i * line_h), l, font=fnt, fill=(255, 255, 255, la), anchor="mm")
    return canvas.convert("RGB")


# ===========================================================================
# Chapter card / intro / closing card
# ===========================================================================

def render_chapter_card(title, subtitle, t_local, dur):
    canvas = gradient_bg()
    draw = ImageDraw.Draw(canvas, "RGBA")
    fade = ease_in_out(t_local / 0.4)
    draw.rectangle((0, 0, 10, H), fill=(*COL_ACCENT, 255))
    tfnt = font(FONT_SEMIBOLD, 52)
    sfnt = font(FONT_REG, 26)
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    odraw = ImageDraw.Draw(overlay)
    odraw.text((W / 2, H / 2 - 16), title, font=tfnt, fill=(255, 255, 255, int(255 * fade)), anchor="mm")
    odraw.text((W / 2, H / 2 + 42), subtitle, font=sfnt, fill=(*COL_MUTED, int(255 * fade)), anchor="mm")
    return Image.alpha_composite(canvas.convert("RGBA"), overlay).convert("RGB")


def render_intro_card(t_local, dur):
    canvas = gradient_bg()
    draw = ImageDraw.Draw(canvas, "RGBA")
    drift_px = int(lerp(0, -16, min(1.0, t_local / max(dur, 0.001))))
    cy = H / 2 + drift_px
    title_fnt = font(FONT_SEMIBOLD, 68)
    title_a = int(255 * ease_in_out(min(1.0, t_local / 1.0)))
    draw.text((W / 2, cy - 30), C.INTRO_CARD_TITLE, font=title_fnt, fill=(255, 255, 255, title_a), anchor="mm")
    sub_a = int(255 * ease_in_out(min(1.0, max(0.0, (t_local - 0.8) / 1.0))))
    sub_fnt = font(FONT_REG, 28)
    draw.text((W / 2, cy + 46), C.INTRO_CARD_SUBTITLE, font=sub_fnt, fill=(*COL_MUTED, sub_a), anchor="mm")
    bar_frac = ease_in_out(min(1.0, max(0.0, (t_local - 1.6) / 2.0)))
    bar_w = W * bar_frac
    draw.rectangle((W / 2 - bar_w / 2, H - 6, W / 2 + bar_w / 2, H), fill=(*COL_ACCENT, 255))
    return canvas.convert("RGB")


def render_closing_card(t_local, dur):
    canvas = gradient_bg()
    draw = ImageDraw.Draw(canvas, "RGBA")
    title_fnt = font(FONT_SEMIBOLD, 60)
    sub_fnt = font(FONT_REG, 28)
    a = int(255 * ease_in_out(min(1.0, t_local / 0.6)))
    draw.text((W / 2, H / 2 - 24), C.CLOSING_CARD_TITLE, font=title_fnt, fill=(255, 255, 255, a), anchor="mm")
    draw.text((W / 2, H / 2 + 40), C.CLOSING_CARD_SUBTITLE, font=sub_fnt, fill=(*COL_MUTED, a), anchor="mm")
    draw.rectangle((0, H - 6, W, H), fill=(*COL_ACCENT, a))
    frame = canvas.convert("RGB")
    if t_local > dur - 1.5:
        k = ease_in_out((t_local - (dur - 1.5)) / 1.5)
        black = Image.new("RGB", (W, H), (0, 0, 0))
        frame = Image.blend(frame, black, k)
    return frame


# ===========================================================================
# Timeline assembly -- authoritative timing from generate_docs.build_timeline(),
# which is the same function that already produced the checked-in .srt/
# _script.md/_scene_list.md. Nothing here is hand-typed.
# ===========================================================================

DIAGRAM_FUNCS = {
    "platform_identity": diagram_platform_identity,
    "constitution_flow": diagram_constitution_flow,
    "layers_modules": diagram_layers_modules,
    "tenant_isolation": diagram_tenant_isolation,
    "security_layers": diagram_security_layers,
    "identity_flow": diagram_identity_flow,
    "data_audit": diagram_data_audit,
    "governance_pipeline": diagram_governance_pipeline,
    "request_lifecycle": diagram_request_lifecycle,
    "synthesis": diagram_synthesis,
}


def _fmt_ts(seconds: float) -> str:
    """Format seconds as M:SS(.f) suitable for a TIMELINE_SPEC entry string."""
    m = int(seconds // 60)
    s = seconds - m * 60
    return f"{m}:{s:06.3f}"


def _parse_ts(s: str) -> float:
    m, sec = s.split(":")
    return int(m) * 60 + float(sec)


def build_timeline_spec():
    tl = GD.build_timeline()
    spec = []
    spec.append((_fmt_ts(tl["intro"]["start"]), _fmt_ts(tl["intro"]["end"]), render_intro_card, "cut"))

    for ch in tl["chapters"]:
        spec.append((_fmt_ts(ch["card"]["start"]), _fmt_ts(ch["card"]["end"]),
                      functools.partial(render_chapter_card, ch["title"], ch["subtitle"]), "cross"))
        content_start = ch["content_start"]
        cue_offsets = [(c["start"] - content_start, c["end"] - content_start) for c in ch["cues"]]
        diag_fn = DIAGRAM_FUNCS[ch["diagram"]]
        spec.append((_fmt_ts(content_start), _fmt_ts(ch["content_end"]),
                      functools.partial(diag_fn, cues=cue_offsets), "cross"))

    spec.append((_fmt_ts(tl["outro"]["start"]), _fmt_ts(tl["outro"]["end"]), render_closing_card, "cross"))
    return spec, tl["total_seconds"]


TIMELINE_SPEC, TOTAL_SECONDS = build_timeline_spec()
TIMELINE = [(_parse_ts(s), _parse_ts(e), fn, tr) for (s, e, fn, tr) in TIMELINE_SPEC]

for _i in range(1, len(TIMELINE)):
    assert abs(TIMELINE[_i - 1][1] - TIMELINE[_i][0]) < 1e-6, f"gap/overlap at segment {_i}"

_STARTS = [seg[0] for seg in TIMELINE]


def find_segment(t):
    import bisect
    idx = bisect.bisect_right(_STARTS, t) - 1
    idx = max(0, min(idx, len(TIMELINE) - 1))
    return idx


def render_master_frame(t):
    idx = find_segment(t)
    start, end, fn, transition = TIMELINE[idx]
    dur = end - start
    t_local = min(t - start, dur)
    frame = fn(t_local, dur).convert("RGB")

    if transition == "cross" and t_local < 0.4 and idx > 0:
        pstart, pend, pfn, _ = TIMELINE[idx - 1]
        pdur = pend - pstart
        prev_frame = pfn(pdur, pdur).convert("RGB")
        alpha = ease_in_out(t_local / 0.4)
        blended = Image.blend(prev_frame, frame, alpha)
        dip = 0.10 * 4 * alpha * (1 - alpha)
        if dip > 0.003:
            black = Image.new("RGB", (W, H), (0, 0, 0))
            blended = Image.blend(blended, black, dip)
        frame = blended

    return frame


# ---------------------------------------------------------------------------
# Burned-in subtitles
# ---------------------------------------------------------------------------

import re as _re


def parse_srt(path: Path):
    text = path.read_text(encoding="utf-8")
    blocks = _re.split(r"\r?\n\r?\n", text.strip())
    cues = []
    time_re = _re.compile(r"(\d\d):(\d\d):(\d\d),(\d\d\d)\s*-->\s*(\d\d):(\d\d):(\d\d),(\d\d\d)")

    def to_sec(h, m, s, ms):
        return int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000.0

    for block in blocks:
        lines = block.strip().splitlines()
        if len(lines) < 2:
            continue
        m = time_re.search(lines[1])
        if not m:
            continue
        start = to_sec(*m.groups()[0:4])
        end = to_sec(*m.groups()[4:8])
        content = " ".join(lines[2:]).strip()
        cues.append((start, end, content))
    return cues


_CUES = None


def get_cues():
    global _CUES
    if _CUES is None:
        _CUES = parse_srt(SUBTITLES_PATH)
    return _CUES


def active_cue(t):
    import bisect
    cues = get_cues()
    starts = [c[0] for c in cues]
    idx = bisect.bisect_right(starts, t) - 1
    if 0 <= idx < len(cues):
        s, e, text = cues[idx]
        if s <= t < e:
            return text
    return None


_SUB_FONT = None


def burn_subtitle(frame: Image.Image, t: float) -> Image.Image:
    text = active_cue(t)
    if not text:
        return frame
    global _SUB_FONT
    if _SUB_FONT is None:
        _SUB_FONT = font(FONT_SEMIBOLD, 32)
    draw = ImageDraw.Draw(frame, "RGBA")
    max_w = int(W * 0.72)
    lines = wrap_text(text, _SUB_FONT, max_w, draw)
    line_h = _SUB_FONT.size + 12
    block_h = len(lines) * line_h + 24
    y1 = H - SUBTITLE_SAFE_BOTTOM
    y0 = y1 - block_h
    block_w = max(draw.textlength(l, font=_SUB_FONT) for l in lines) + 48
    x0 = (W - block_w) / 2
    x1 = x0 + block_w
    rounded_rect(draw, (x0, y0, x1, y1), 10, fill=(0, 0, 0, 150))
    ty = y0 + 12
    for l in lines:
        draw.text((W / 2, ty + _SUB_FONT.size / 2), l, font=_SUB_FONT, fill=(255, 255, 255, 255), anchor="mm")
        ty += line_h
    return frame


# ---------------------------------------------------------------------------
# Main: frame loop -> ffmpeg
# ---------------------------------------------------------------------------

def parse_range(spec):
    a, b = spec.split("-")
    return mmss(a) if ":" in a else float(a), mmss(b) if ":" in b else float(b)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ffmpeg", default="ffmpeg", help="Path to ffmpeg executable")
    ap.add_argument("--out", default=str(OUTPUT_PATH), help="Output MP4 path")
    ap.add_argument("--preview", default=None, help="Render only a M:SS-M:SS slice, e.g. 0:00-0:30")
    ap.add_argument("--crf", type=int, default=18)
    args = ap.parse_args()

    if args.preview:
        t0, t1 = parse_range(args.preview)
    else:
        t0, t1 = 0.0, TOTAL_SECONDS

    n_frames = int(round((t1 - t0) * FPS))

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    cmd = [args.ffmpeg, "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
           "-r", str(FPS), "-i", "-"]
    cmd += ["-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=48000"]
    cmd += ["-map", "0:v", "-map", "1:a"]
    cmd += ["-shortest", "-c:v", "libx264", "-preset", "medium", "-crf", str(args.crf),
            "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart",
            str(out_path)]

    print("ffmpeg command:", " ".join(cmd), file=sys.stderr)
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)

    try:
        for i in range(n_frames):
            t = t0 + i / FPS
            frame = render_master_frame(t)
            frame = burn_subtitle(frame, t)
            proc.stdin.write(frame.tobytes())
            if i % (FPS * 5) == 0:
                print(f"progress: t={t:7.2f}s  frame={i}/{n_frames}", file=sys.stderr, flush=True)
    finally:
        proc.stdin.close()
        ret = proc.wait()
        if ret != 0:
            print(f"ffmpeg exited with code {ret}", file=sys.stderr)
            sys.exit(ret)
    print(f"Done: {out_path}", file=sys.stderr)


if __name__ == "__main__":
    main()

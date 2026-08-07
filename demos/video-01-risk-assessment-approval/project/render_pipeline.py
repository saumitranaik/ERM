"""
Render pipeline -- Demonstration Video 01: Risk Assessment Approval (Version 1, Silent).

Renders demos/video-01-risk-assessment-approval/video-01-risk-assessment-approval.mp4
directly from this package's own planning documents (scene-list.md, timeline.md,
chapters.md, subtitles.srt) and the 8 real screenshots in screenshots/. No compositing
tool was available in this environment, so this script *is* the "editor" -- it composites
every frame in Python/Pillow (zoom, pan, cursor spotlight, callouts, transitions, chapter
cards, concept plates, burned-in subtitles) and pipes raw RGB24 frames into ffmpeg for
H.264/AAC encoding.

Narration-ready by design: pass --narration path/to/track.wav (or .mp3) to mux a real
voice-over track once one exists, in place of the silent AAC track this script produces
by default. No visual asset, timeline, or subtitle changes are required to add narration --
the video's runtime is already fixed by timeline.md, independent of the audio track.
Pass --music path/to/bed.(wav|mp3) to additionally mix in a low-volume background bed
(only if a real licensed/royalty-free file is supplied -- this script does not fabricate
or synthesize music, per the brief).

Usage:
    python render_pipeline.py --ffmpeg "C:\\path\\to\\ffmpeg.exe" [--narration track.wav] [--music bed.mp3] [--preview 0:00-0:30]
"""

import argparse
import re
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# ---------------------------------------------------------------------------
# Paths & constants
# ---------------------------------------------------------------------------

PKG_DIR = Path(__file__).resolve().parent.parent
SCREENSHOTS_DIR = PKG_DIR / "screenshots"
SUBTITLES_PATH = PKG_DIR / "subtitles.srt"
OUTPUT_PATH = PKG_DIR / "video-01-risk-assessment-approval.mp4"

W, H = 1920, 1080
FPS = 30
TOTAL_SECONDS = 16 * 60 + 55  # 16:55, per timeline.md

FONT_DIR = Path(r"C:\Windows\Fonts")
FONT_REG = FONT_DIR / "segoeui.ttf"
FONT_BOLD = FONT_DIR / "segoeuib.ttf"
FONT_SEMIBOLD = FONT_DIR / "seguisb.ttf"
FONT_LIGHT = FONT_DIR / "segoeuil.ttf"

# Visual language -- held constant across the whole video (scene-list.md "Visual language").
COL_BG_DARK = (10, 14, 26)
COL_BG_DARK_2 = (17, 24, 42)
COL_ACCENT = (56, 130, 246)          # accent color for callouts / highlights
COL_ACCENT_SOFT = (96, 165, 250)
COL_WHITE = (255, 255, 255)
COL_MUTED = (148, 163, 184)
COL_MUTED_DARK = (100, 116, 139)
COL_CALLOUT_BG = (15, 23, 42)
COL_WARN = (234, 179, 8)
COL_GOOD = (34, 197, 94)
COL_BAD = (239, 68, 68)

CARD_DURATION = 3.0
CLOSING_CARD_DURATION = 5.0
SUBTITLE_SAFE_BOTTOM = 96  # px from bottom to subtitle baseline area

_FONT_CACHE = {}


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    key = (str(path), size)
    if key not in _FONT_CACHE:
        _FONT_CACHE[key] = ImageFont.truetype(str(path), size)
    return _FONT_CACHE[key]


def mmss(s: str) -> float:
    """Parse 'M:SS' or 'MM:SS' into seconds."""
    m, sec = s.split(":")
    return int(m) * 60 + int(sec)


def ease_in_out(t: float) -> float:
    """Standard smoothstep ease, t in [0,1]."""
    t = max(0.0, min(1.0, t))
    return t * t * (3 - 2 * t)


def lerp(a, b, t):
    return a + (b - a) * t


def lerp_pt(a, b, t):
    return (lerp(a[0], b[0], t), lerp(a[1], b[1], t))


# ---------------------------------------------------------------------------
# Subtitle parsing (subtitles.srt is already timed in video-timeline coordinates --
# see timeline.md / subtitles.srt cue 1 starting at 0:03, matching Scene 1's start)
# ---------------------------------------------------------------------------

def parse_srt(path: Path):
    text = path.read_text(encoding="utf-8")
    blocks = re.split(r"\r?\n\r?\n", text.strip())
    cues = []
    time_re = re.compile(r"(\d\d):(\d\d):(\d\d),(\d\d\d)\s*-->\s*(\d\d):(\d\d):(\d\d),(\d\d\d)")

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


# ---------------------------------------------------------------------------
# Screenshot cache
# ---------------------------------------------------------------------------

_IMG_CACHE = {}


def load_shot(name: str) -> Image.Image:
    if name not in _IMG_CACHE:
        _IMG_CACHE[name] = Image.open(SCREENSHOTS_DIR / name).convert("RGB")
    return _IMG_CACHE[name]


# ---------------------------------------------------------------------------
# Drawing helpers
# ---------------------------------------------------------------------------

def gradient_bg(w=W, h=H, top=COL_BG_DARK, bottom=COL_BG_DARK_2) -> Image.Image:
    arr = np.zeros((h, w, 3), dtype=np.uint8)
    for c in range(3):
        arr[:, :, c] = np.linspace(top[c], bottom[c], h, dtype=np.uint8)[:, None]
    return Image.fromarray(arr, "RGB")


def rounded_rect(draw: ImageDraw.ImageDraw, box, radius, outline=None, fill=None, width=2):
    draw.rounded_rectangle(box, radius=radius, outline=outline, fill=fill, width=width)


def draw_text_centered(draw, xy, text, fnt, fill, anchor="mm"):
    draw.text(xy, text, font=fnt, fill=fill, anchor=anchor)


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


# Precompute a large radial "spotlight" gradient once; crop-and-offset per frame
# instead of recomputing the gradient math every frame (perf).
_SPOT_BIG_SIZE = (W * 2, H * 2)
_SPOT_CENTER = (_SPOT_BIG_SIZE[0] // 2, _SPOT_BIG_SIZE[1] // 2)


def _build_spotlight_field(radius=120, feather=260):
    yy, xx = np.mgrid[0:_SPOT_BIG_SIZE[1], 0:_SPOT_BIG_SIZE[0]]
    d = np.sqrt((xx - _SPOT_CENTER[0]) ** 2 + (yy - _SPOT_CENTER[1]) ** 2)
    # 0 inside radius (fully lit), ramps to 1 by radius+feather (fully dimmed)
    field = np.clip((d - radius) / feather, 0.0, 1.0)
    return field.astype(np.float32)


_SPOTLIGHT_FIELD = _build_spotlight_field()


def apply_spotlight(base_rgb: np.ndarray, center_xy, strength=0.62) -> np.ndarray:
    """Dim everything outside a soft circle at center_xy (source-canvas coords)."""
    cx, cy = int(center_xy[0]), int(center_xy[1])
    ox = _SPOT_CENTER[0] - cx
    oy = _SPOT_CENTER[1] - cy
    crop = _SPOTLIGHT_FIELD[oy:oy + H, ox:ox + W]
    dim = (crop * strength)[:, :, None]  # 0..strength
    out = base_rgb.astype(np.float32) * (1.0 - dim)
    return out.astype(np.uint8)


def draw_callout(canvas: Image.Image, text, tip_xy, box_anchor="above", max_width=420, alpha=1.0):
    """A rounded-rect balloon with a small tail, pointing at tip_xy.
    `alpha` (0..1) scales only the balloon's own opacity -- a clean fade-in/out
    that never dims its color toward black (unlike blending a transparent layer)."""
    if alpha <= 0.0:
        return
    a = lambda v: int(round(v * alpha))
    draw = ImageDraw.Draw(canvas, "RGBA")
    fnt = font(FONT_SEMIBOLD, 22)
    pad_x, pad_y = 18, 14
    lines = wrap_text(text, fnt, max_width - 2 * pad_x, draw)
    line_h = fnt.size + 8
    box_w = max(draw.textlength(l, font=fnt) for l in lines) + 2 * pad_x
    box_h = len(lines) * line_h + 2 * pad_y

    tip_x, tip_y = tip_xy
    if box_anchor == "above":
        bx0 = tip_x - box_w / 2
        by1 = tip_y - 18
        by0 = by1 - box_h
    elif box_anchor == "below":
        bx0 = tip_x - box_w / 2
        by0 = tip_y + 18
        by1 = by0 + box_h
    elif box_anchor == "left":
        bx1 = tip_x - 18
        bx0 = bx1 - box_w
        by0 = tip_y - box_h / 2
        by1 = by0 + box_h
    else:  # right
        bx0 = tip_x + 18
        by0 = tip_y - box_h / 2
        by1 = by0 + box_h

    if box_anchor in ("above", "below"):
        bx1 = bx0 + box_w
    # keep on-canvas
    bx0 = max(24, min(bx0, W - 24 - box_w))
    bx1 = bx0 + box_w
    by0 = max(24, min(by0, H - 24 - box_h))
    by1 = by0 + box_h

    rounded_rect(draw, (bx0, by0, bx1, by1), radius=10,
                 fill=(*COL_CALLOUT_BG, a(235)), outline=(*COL_ACCENT, a(255)), width=2)

    # tail
    if box_anchor == "above":
        cx = min(max(tip_x, bx0 + 20), bx1 - 20)
        draw.polygon([(cx - 8, by1), (cx + 8, by1), (tip_x, tip_y - 4)],
                     fill=(*COL_CALLOUT_BG, a(235)), outline=(*COL_ACCENT, a(255)))
    elif box_anchor == "below":
        cx = min(max(tip_x, bx0 + 20), bx1 - 20)
        draw.polygon([(cx - 8, by0), (cx + 8, by0), (tip_x, tip_y + 4)],
                     fill=(*COL_CALLOUT_BG, a(235)), outline=(*COL_ACCENT, a(255)))

    ty = by0 + pad_y
    for l in lines:
        draw.text((bx0 + pad_x, ty), l, font=fnt, fill=(*COL_WHITE, a(255)))
        ty += line_h

    # small accent dot at the tip itself
    draw.ellipse((tip_x - 6, tip_y - 6, tip_x + 6, tip_y + 6), fill=(*COL_ACCENT, a(255)))


def callout_at(canvas, text, tip_xy, side, t_since_start, box_anchor=None,
               fade_in=0.3, visible_for=None, fade_out=0.3, max_width=420):
    """Fade a callout balloon cleanly in (and optionally back out) -- alpha-only,
    never dims toward black. `t_since_start` may be negative (not yet started)."""
    side = box_anchor or side
    if t_since_start < 0:
        return
    alpha = ease_in_out(min(1.0, t_since_start / fade_in))
    if visible_for is not None:
        if t_since_start > visible_for:
            return
        if t_since_start > visible_for - fade_out:
            alpha = min(alpha, ease_in_out(max(0.0, (visible_for - t_since_start) / fade_out)))
    if alpha > 0.003:
        draw_callout(canvas, text, tip_xy, box_anchor=side, max_width=max_width, alpha=alpha)


def draw_pulse_ring(canvas: Image.Image, box, phase):
    """phase in [0,1]: a brief scale-pulse highlight rectangle (click affordance)."""
    draw = ImageDraw.Draw(canvas, "RGBA")
    x0, y0, x1, y1 = box
    grow = 6 * np.sin(phase * np.pi)  # expands then contracts
    alpha = int(220 * np.sin(phase * np.pi))
    rounded_rect(draw, (x0 - grow, y0 - grow, x1 + grow, y1 + grow), radius=8,
                 outline=(*COL_ACCENT_SOFT, max(0, alpha)), width=3)


def draw_ghost_x(canvas: Image.Image, center_xy, alpha):
    draw = ImageDraw.Draw(canvas, "RGBA")
    x, y = center_xy
    s = 16
    a = int(alpha)
    draw.line((x - s, y - s, x + s, y + s), fill=(*COL_MUTED, a), width=4)
    draw.line((x - s, y + s, x + s, y - s), fill=(*COL_MUTED, a), width=4)


# Small vector icons drawn with primitives rather than emoji/symbol glyphs --
# Segoe UI (regular/semibold) does not reliably cover the Dingbats/Emoji
# ranges (padlock, heavy cross, check mark render as tofu boxes), so these
# guarantee a consistent look without depending on font glyph coverage.

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
    w = width or max(2, int(size * 0.18))
    p1 = (cx - size * 0.45, cy)
    p2 = (cx - size * 0.1, cy + size * 0.35)
    p3 = (cx + size * 0.5, cy - size * 0.4)
    draw.line([p1, p2], fill=(*color, alpha), width=w)
    draw.line([p2, p3], fill=(*color, alpha), width=w)


def apply_alpha_fade(canvas: Image.Image, base: Image.Image, alpha: float):
    """Fade `canvas` in from black (alpha 0..1) -- used for card fade-ins."""
    return Image.blend(base, canvas, alpha)


def fit_zoom_pan(img: Image.Image, center_norm, scale) -> Image.Image:
    """Crop `img` (already WxH) around a normalized center (0..1,0..1) at `scale`
    (>=1.0 = zoomed in) and resize back to WxH. Stays within source bounds."""
    iw, ih = img.size
    crop_w = iw / scale
    crop_h = ih / scale
    cx = center_norm[0] * iw
    cy = center_norm[1] * ih
    x0 = cx - crop_w / 2
    y0 = cy - crop_h / 2
    x0 = max(0, min(x0, iw - crop_w))
    y0 = max(0, min(y0, ih - crop_h))
    box = (x0, y0, x0 + crop_w, y0 + crop_h)
    return img.crop(box).resize((W, H), Image.LANCZOS)


def crop_px_to_norm(px_box, img_size):
    """Convenience: convert a pixel box on the 1920x1080 source shot to a
    (center_norm, scale) pair that frames that box with ~14% margin."""
    x0, y0, x1, y1 = px_box
    iw, ih = img_size
    bw, bh = (x1 - x0), (y1 - y0)
    cx, cy = (x0 + x1) / 2 / iw, (y0 + y1) / 2 / ih
    margin = 1.28
    scale = min(iw / (bw * margin), ih / (bh * margin))
    scale = max(1.0, min(scale, 1.6))
    return (cx, cy), scale


# ---------------------------------------------------------------------------
# On-screen anchor coordinates, read directly off the 1920x1080 screenshots
# (screenshots/*.png) -- used to place callouts, spotlights, zoom targets and
# click-pulses at the real on-screen locations of the UI elements scene-list.md
# names, rather than invented positions.
# ---------------------------------------------------------------------------

A = {
    "00": {  # 00-login-persona-picker.png
        "priya_row": (674, 379, 1246, 425),
        "arjun_row": (674, 449, 1246, 490),
        "card": (672, 137, 1247, 940),
    },
    "01": {  # 01-risk-register-list.png
        "header_row_y": 297,
        "header_cols": [("CODE", 293), ("TITLE", 438), ("CATEGORY", 1060),
                         ("INHERENT", 1253), ("RESIDUAL", 1349), ("OWNER", 1465),
                         ("NEXT REVIEW", 1686), ("STATUS", 1812)],
        "rsk4_row": (264, 449, 1895, 472),
    },
    "02": {  # 02-risk-detail-active.png
        "active_badge": (912, 127, 963, 142),
        "btn_submit": (1291, 122, 1461, 149),
        "btn_escalate": (1469, 122, 1538, 149),
        "btn_accept": (1547, 122, 1730, 149),
        "btn_retire": (1739, 122, 1896, 149),
        "inherent_box": (1113, 405, 1141, 421),
        "residual_box": (1502, 405, 1527, 421),
        "last_assessed": (1502, 443, 1572, 470),
        "next_review": (1113, 493, 1204, 520),
    },
    "03": {  # 03-reassessment-justification-dialog.png
        "warning_banner": (729, 462, 1191, 517),
        "justification_label": (729, 543, 900, 560),
        "justification_box": (729, 568, 1191, 648),
        "submit_btn": (1044, 668, 1191, 698),
    },
    "04": {  # 04-risk-under-review-pending.png
        "under_review_badge": (915, 127, 1000, 142),
        "awaiting_checker_badge": (1012, 127, 1120, 142),
        "yellow_banner": (264, 172, 1895, 345),
        "old_action_bar": (1291, 122, 1896, 149),
        "user_menu": (1690, 20, 1896, 46),
    },
    "05": {  # 05-checker-queue-pending-item.png
        "top_card": (264, 242, 1895, 490),
        "btn_approve": (311, 446, 395, 472),
        "btn_reject": (410, 486, 486, 472),
        "btn_return": (496, 446, 644, 472),
        "queue_count": (280, 197, 400, 215),
    },
    "06": {  # 06-approve-decision-dialog.png
        "comment_label": (729, 503, 950, 520),
        "comment_box": (729, 524, 1191, 606),
        "confirm_btn": (1044, 624, 1191, 662),
    },
    "07": {  # 07-risk-detail-approved-decision-history.png
        "active_badge": (912, 127, 963, 142),
        "maker_line": (330, 263, 900, 278),
        "checker_line": (330, 281, 900, 296),
        "record_block": (264, 224, 1895, 350),
    },
}


def box_center(box):
    x0, y0, x1, y1 = box
    return ((x0 + x1) / 2, (y0 + y1) / 2)


def project_point(center_norm, scale, pt, img_size=(W, H)):
    """Map a point in source-screenshot pixel space to on-canvas pixel space,
    given the same (center_norm, scale) transform used by fit_zoom_pan."""
    iw, ih = img_size
    crop_w = iw / scale
    crop_h = ih / scale
    cx = center_norm[0] * iw
    cy = center_norm[1] * ih
    x0 = max(0, min(cx - crop_w / 2, iw - crop_w))
    y0 = max(0, min(cy - crop_h / 2, ih - crop_h))
    return ((pt[0] - x0) / crop_w * W, (pt[1] - y0) / crop_h * H)


def shot_frame(shot_name, center_norm=(0.5, 0.5), scale=1.0):
    img = load_shot(shot_name)
    if scale <= 1.001 and center_norm == (0.5, 0.5):
        return img.copy()
    return fit_zoom_pan(img, center_norm, scale)


def kf_interp(keyframes, t_local):
    """keyframes: [(t, center_norm, scale), ...] sorted by t. Returns interpolated
    (center_norm, scale) at t_local, easing between the surrounding pair."""
    if t_local <= keyframes[0][0]:
        return keyframes[0][1], keyframes[0][2]
    if t_local >= keyframes[-1][0]:
        return keyframes[-1][1], keyframes[-1][2]
    for i in range(len(keyframes) - 1):
        t0, c0, s0 = keyframes[i]
        t1, c1, s1 = keyframes[i + 1]
        if t0 <= t_local <= t1:
            frac = ease_in_out((t_local - t0) / (t1 - t0)) if t1 > t0 else 1.0
            return lerp_pt(c0, c1, frac), lerp(s0, s1, frac)
    return keyframes[-1][1], keyframes[-1][2]


# ---------------------------------------------------------------------------
# Card / concept-plate renderers
# ---------------------------------------------------------------------------

def render_wordmark_plate(title, subtitle, t_local, dur, drift=False):
    canvas = gradient_bg()
    draw = ImageDraw.Draw(canvas, "RGBA")
    # faint accent bar
    draw.rectangle((0, H - 6, W, H), fill=(*COL_ACCENT, 255))

    drift_px = int(lerp(0, -20, min(1.0, t_local / max(dur, 0.001)))) if drift else 0
    cy = H // 2 + drift_px

    title_fnt = font(FONT_SEMIBOLD, 64)
    draw_text_centered(draw, (W / 2, cy - 20), title, title_fnt, COL_WHITE)

    sub_alpha = ease_in_out((t_local - 0.5) / 0.5) if t_local < 1.0 else 1.0
    if t_local >= 0.5:
        sub_fnt = font(FONT_REG, 30)
        overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        odraw = ImageDraw.Draw(overlay)
        odraw.text((W / 2, cy + 46), subtitle, font=sub_fnt,
                    fill=(*COL_MUTED, int(255 * sub_alpha)), anchor="mm")
        canvas = Image.alpha_composite(canvas.convert("RGBA"), overlay).convert("RGB")
    return canvas


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


def _plate_base(kicker=None):
    canvas = gradient_bg()
    if kicker:
        draw = ImageDraw.Draw(canvas)
        draw.text((100, 90), kicker.upper(), font=font(FONT_SEMIBOLD, 22), fill=COL_ACCENT_SOFT)
        draw.line((100, 128, 100 + draw.textlength(kicker.upper(), font=font(FONT_SEMIBOLD, 22)), 128),
                   fill=COL_ACCENT, width=2)
    return canvas


def _fade_alpha(t_local, dur=0.6):
    return ease_in_out(t_local / dur)


def _arrow(draw, p0, p1, color=COL_MUTED, width=3):
    draw.line((p0, p1), fill=color, width=width)
    import math
    ang = math.atan2(p1[1] - p0[1], p1[0] - p0[0])
    for da in (2.6, -2.6):
        ax = p1[0] - 14 * np.cos(ang + da / 1.0)
        ay = p1[1] - 14 * np.sin(ang + da / 1.0)
    # simple arrowhead
    ah = 10
    l = ang + 2.7
    r = ang - 2.7
    p_l = (p1[0] + ah * np.cos(l), p1[1] + ah * np.sin(l))
    p_r = (p1[0] + ah * np.cos(r), p1[1] + ah * np.sin(r))
    draw.polygon([p1, p_l, p_r], fill=color)


def plate_risk_register_row(t_local, dur, with_badge=False):
    canvas = _plate_base("Enterprise Risk Management")
    draw = ImageDraw.Draw(canvas, "RGBA")
    fade = _fade_alpha(t_local)
    labels = ["Risk", "Owner", "Category", "Score", "Review Date"]
    box_w, box_h, gap = 300, 110, 46
    total_w = len(labels) * box_w + (len(labels) - 1) * gap
    x0 = (W - total_w) / 2
    y0 = H / 2 - box_h / 2
    cx_prev = None
    for i, lab in enumerate(labels):
        x = x0 + i * (box_w + gap)
        alpha = int(255 * min(1.0, max(0.0, fade * 5 - i)))
        rounded_rect(draw, (x, y0, x + box_w, y0 + box_h), 14,
                     outline=(*COL_ACCENT, alpha), fill=(*COL_BG_DARK_2, alpha), width=2)
        draw.text((x + box_w / 2, y0 + box_h / 2), lab, font=font(FONT_SEMIBOLD, 26),
                  fill=(255, 255, 255, alpha), anchor="mm")
        cx = x + box_w
        if cx_prev is not None and alpha > 40:
            _arrow(draw, (cx_prev + 10, y0 + box_h / 2), (x - 10, y0 + box_h / 2), color=(*COL_MUTED, alpha))
        cx_prev = x + box_w
    if with_badge and t_local > 1.2:
        b_alpha = int(255 * ease_in_out((t_local - 1.2) / 0.5))
        badge_fnt = font(FONT_SEMIBOLD, 22)
        by = y0 + box_h + 70
        txt = "Single source of truth"
        tw = draw.textlength(txt, font=badge_fnt)
        rounded_rect(draw, (W / 2 - tw / 2 - 20, by, W / 2 + tw / 2 + 20, by + 46), 23,
                     fill=(*COL_ACCENT, b_alpha))
        draw.text((W / 2, by + 23), txt, font=badge_fnt, fill=(255, 255, 255, b_alpha), anchor="mm")
    return canvas


def plate_maker_checker(t_local, dur):
    canvas = _plate_base("Governance")
    draw = ImageDraw.Draw(canvas, "RGBA")
    fade = int(255 * _fade_alpha(t_local))
    box_w, box_h = 460, 200
    gap = 220
    x0 = W / 2 - gap / 2 - box_w
    x1 = W / 2 + gap / 2
    y0 = H / 2 - box_h / 2
    rounded_rect(draw, (x0, y0, x0 + box_w, y0 + box_h), 16, outline=(*COL_ACCENT, fade),
                 fill=(*COL_BG_DARK_2, fade), width=2)
    rounded_rect(draw, (x1, y0, x1 + box_w, y0 + box_h), 16, outline=(*COL_ACCENT, fade),
                 fill=(*COL_BG_DARK_2, fade), width=2)
    draw.text((x0 + box_w / 2, y0 + box_h / 2 - 14), "Maker proposes", font=font(FONT_SEMIBOLD, 30),
              fill=(255, 255, 255, fade), anchor="mm")
    draw.text((x0 + box_w / 2, y0 + box_h / 2 + 26), "submits a change", font=font(FONT_REG, 20),
              fill=(*COL_MUTED, fade), anchor="mm")
    draw.text((x1 + box_w / 2, y0 + box_h / 2 - 14), "Checker decides", font=font(FONT_SEMIBOLD, 30),
              fill=(255, 255, 255, fade), anchor="mm")
    draw.text((x1 + box_w / 2, y0 + box_h / 2 + 26), "independently reviews", font=font(FONT_REG, 20),
              fill=(*COL_MUTED, fade), anchor="mm")
    if t_local > 0.9:
        lock_alpha = int(255 * ease_in_out((t_local - 0.9) / 0.4))
        cx, cy = W / 2, H / 2
        _arrow(draw, (x0 + box_w + 6, cy), (x1 - 36, cy), color=(*COL_MUTED, lock_alpha))
        draw.ellipse((cx - 22, cy - 22, cx + 22, cy + 22), fill=(*COL_ACCENT, lock_alpha))
        draw_lock_icon(draw, (cx, cy), 22, COL_WHITE, lock_alpha)
    return canvas


def plate_layers(t_local, dur):
    canvas = _plate_base("Platform Architecture")
    draw = ImageDraw.Draw(canvas, "RGBA")
    fade = int(255 * _fade_alpha(t_local))
    box_w = 900
    x0 = W / 2 - box_w / 2
    y_base = H / 2 + 90
    base_h = 130
    rounded_rect(draw, (x0, y_base, x0 + box_w, y_base + base_h), 14,
                 outline=(*COL_MUTED, fade), fill=(*COL_BG_DARK_2, fade), width=2)
    draw.text((W / 2, y_base + base_h / 2 - 16), "PRSMTD", font=font(FONT_SEMIBOLD, 30),
              fill=(255, 255, 255, fade), anchor="mm")
    draw.text((W / 2, y_base + base_h / 2 + 22), "Governance ledger · RBAC · Multi-tenancy",
              font=font(FONT_REG, 19), fill=(*COL_MUTED, fade), anchor="mm")

    top_alpha = int(255 * ease_in_out((t_local - 0.7) / 0.5)) if t_local > 0.7 else 0
    y_top = y_base - 150
    top_h = 130
    rounded_rect(draw, (x0, y_top, x0 + box_w, y_top + top_h), 14,
                 outline=(*COL_ACCENT, top_alpha), fill=(*COL_BG_DARK_2, top_alpha), width=2)
    draw.text((W / 2, y_top + 34), "ERM", font=font(FONT_SEMIBOLD, 30),
              fill=(255, 255, 255, top_alpha), anchor="mm")
    modules = "Risk · Controls · Compliance · Audit · Policy · Incident · Third-Party Risk"
    draw.text((W / 2, y_top + 78), modules, font=font(FONT_REG, 17),
              fill=(*COL_MUTED, top_alpha), anchor="mm")
    return canvas


def plate_workflow_strip(t_local, dur, locked=False, crossed=False, branches=False):
    canvas = _plate_base("The Governed Pattern")
    draw = ImageDraw.Draw(canvas, "RGBA")
    fade = int(255 * _fade_alpha(t_local))
    labels = ["Submit", "Review", "Approve"]
    box_w, box_h, gap = 300, 120, 90
    total_w = len(labels) * box_w + (len(labels) - 1) * gap
    x0 = (W - total_w) / 2
    y0 = H / 2 - box_h / 2
    centers = []
    for i, lab in enumerate(labels):
        x = x0 + i * (box_w + gap)
        rounded_rect(draw, (x, y0, x + box_w, y0 + box_h), 16,
                     outline=(*COL_ACCENT, fade), fill=(*COL_BG_DARK_2, fade), width=2)
        draw.text((x + box_w / 2, y0 + box_h / 2), lab, font=font(FONT_SEMIBOLD, 30),
                  fill=(255, 255, 255, fade), anchor="mm")
        centers.append((x + box_w / 2, y0 + box_h / 2))
        if i > 0:
            _arrow(draw, (x - gap + 6, y0 + box_h / 2), (x - 10, y0 + box_h / 2),
                   color=(*COL_MUTED, fade))
    if locked and t_local > 0.9:
        la = int(255 * ease_in_out((t_local - 0.9) / 0.4))
        mid = ((centers[0][0] + centers[2][0]) / 2, y0 - 70)
        draw.ellipse((mid[0] - 24, mid[1] - 24, mid[0] + 24, mid[1] + 24), fill=(*COL_ACCENT, la))
        draw_lock_icon(draw, mid, 24, COL_WHITE, la)
        if crossed:
            draw_ghost_x(canvas, (mid[0] - 74, mid[1] + 42), la)
            draw.text((mid[0] + 4, mid[1] + 42), "same person, blocked", font=font(FONT_SEMIBOLD, 18),
                       fill=(*COL_BAD, la), anchor="lm")
    if branches and t_local > 0.9:
        ba = int(255 * ease_in_out((t_local - 0.9) / 0.5))
        mods = ["Controls", "Compliance", "Audit", "Policy", "Incident", "Third-Party Risk"]
        by = y0 + box_h + 90
        bw = 220
        total = len(mods) * bw + (len(mods) - 1) * 20
        bx0 = (W - total) / 2
        for i, m in enumerate(mods):
            bx = bx0 + i * (bw + 20)
            rounded_rect(draw, (bx, by, bx + bw, by + 56), 10, outline=(*COL_MUTED, ba), width=2)
            draw.text((bx + bw / 2, by + 28), m, font=font(FONT_REG, 17), fill=(*COL_MUTED, ba), anchor="mm")
            _arrow(draw, (centers[2][0], y0 + box_h), (bx + bw / 2, by), color=(*COL_MUTED, int(ba * 0.5)))
    return canvas


def plate_audience_value(t_local, dur):
    canvas = _plate_base("Who This Serves")
    draw = ImageDraw.Draw(canvas, "RGBA")
    rows = [
        ("Board", "Assurance risk data is trustworthy"),
        ("CRO", "One traceable queue and ledger"),
        ("CISO", "A control you can point to in an audit"),
        ("Compliance", "Defensible, timestamped decisions"),
        ("Implementation Team", "One governance engine, built once"),
    ]
    col1_x, col2_x = W / 2 - 380, W / 2 + 60
    y0 = H / 2 - (len(rows) * 74) / 2
    hfnt = font(FONT_SEMIBOLD, 22)
    draw.text((col1_x, y0 - 50), "AUDIENCE", font=hfnt, fill=COL_ACCENT_SOFT)
    draw.text((col2_x, y0 - 50), "VALUE", font=hfnt, fill=COL_ACCENT_SOFT)
    for i, (aud, val) in enumerate(rows):
        row_t = t_local - i * 0.35
        a = int(255 * ease_in_out(row_t / 0.5)) if row_t > 0 else 0
        y = y0 + i * 74
        draw.text((col1_x, y), aud, font=font(FONT_SEMIBOLD, 26), fill=(255, 255, 255, a))
        draw.text((col2_x, y), val, font=font(FONT_REG, 22), fill=(*COL_MUTED, a))
    return canvas


def lower_third(canvas, text, alpha):
    draw = ImageDraw.Draw(canvas, "RGBA")
    fnt = font(FONT_SEMIBOLD, 24)
    tw = draw.textlength(text, font=fnt)
    x0, y0 = 60, H - 150
    box_w = tw + 48
    rounded_rect(draw, (x0, y0, x0 + box_w, y0 + 56), 8,
                 fill=(*COL_CALLOUT_BG, int(220 * alpha)), outline=(*COL_ACCENT, int(255 * alpha)), width=2)
    draw.text((x0 + 24, y0 + 28), text, font=fnt, fill=(255, 255, 255, int(255 * alpha)), anchor="lm")
    return canvas


# --- Chapter 3: Meet the Personas -------------------------------------------------

def scene_07(t_local, dur):
    img = shot_frame("00-login-persona-picker.png")
    canvas = img.convert("RGBA")
    alpha = ease_in_out((t_local - 0.6) / 0.5) if t_local > 0.6 else 0.0
    canvas = lower_third(canvas, "Meridian Asset Management Ltd. — SEBI-regulated Mutual Fund AMC (illustrative)", alpha)
    return canvas.convert("RGB")


def scene_08(t_local, dur):
    c0, s0 = (0.5, 0.5), 1.0
    c1 = (box_center(A["00"]["arjun_row"])[0] / W, box_center(A["00"]["arjun_row"])[1] / H)
    s1 = 1.15
    frac = ease_in_out(t_local / dur)
    center = lerp_pt(c0, c1, frac)
    scale = lerp(s0, s1, frac)
    frame = shot_frame("00-login-persona-picker.png", center, scale)
    arr = np.array(frame)
    if t_local > 0:
        target = project_point(center, scale, box_center(A["00"]["arjun_row"]))
        spot_a = ease_in_out(t_local / 1.0)
        if spot_a > 0:
            arr = apply_spotlight(arr, target, strength=0.55 * spot_a)
    canvas = Image.fromarray(arr).convert("RGBA")
    target = project_point(center, scale, box_center(A["00"]["arjun_row"]))
    callout_at(canvas, "Arjun Mehta · Risk Manager · Maker", target, "right", t_local - 2.0)
    return canvas.convert("RGB")


def scene_09(t_local, dur):
    c_arjun = (box_center(A["00"]["arjun_row"])[0] / W, box_center(A["00"]["arjun_row"])[1] / H)
    c_priya = (box_center(A["00"]["priya_row"])[0] / W, box_center(A["00"]["priya_row"])[1] / H)
    frac = ease_in_out(t_local / dur)
    center = lerp_pt(c_arjun, c_priya, frac)
    scale = 1.15
    frame = shot_frame("00-login-persona-picker.png", center, scale)
    arr = np.array(frame)
    target = project_point(center, scale, box_center(A["00"]["priya_row"]))
    arr = apply_spotlight(arr, target, strength=0.55)
    canvas = Image.fromarray(arr).convert("RGBA")
    callout_at(canvas, "Priya Raghunathan · Chief Risk Officer · Checker", target, "right", t_local - 2.0)
    return canvas.convert("RGB")


def scene_10(t_local, dur):
    c_priya = (box_center(A["00"]["priya_row"])[0] / W, box_center(A["00"]["priya_row"])[1] / H)
    frac = ease_in_out(min(1.0, t_local / 1.2))
    center = lerp_pt(c_priya, (0.5, 0.5), frac)
    scale = lerp(1.15, 1.0, frac)
    frame = shot_frame("00-login-persona-picker.png", center, scale)
    canvas = frame.convert("RGBA")
    if t_local > 1.3:
        chip_a = int(255 * ease_in_out((t_local - 1.3) / 0.5))
        draw = ImageDraw.Draw(canvas, "RGBA")
        for row_box in (A["00"]["arjun_row"], A["00"]["priya_row"]):
            cx0, cy0 = project_point((0.5, 0.5), 1.0, (row_box[2] - 6, row_box[1] + 8))
            txt = "Risk Management dept."
            fnt = font(FONT_REG, 16)
            tw = canvas.width  # placeholder, recompute below
            tw = draw.textlength(txt, font=fnt)
            rounded_rect(draw, (cx0 - tw - 22, cy0 - 4, cx0 - 2, cy0 + 24), 11,
                         fill=(*COL_ACCENT, chip_a))
            draw.text((cx0 - tw / 2 - 12, cy0 + 10), txt, font=fnt, fill=(255, 255, 255, chip_a), anchor="mm")
    # fade to black over the final 0.4s (explicit "fade to black transition out")
    if t_local > dur - 0.4:
        k = ease_in_out((t_local - (dur - 0.4)) / 0.4)
        black = Image.new("RGBA", (W, H), (0, 0, 0, 255))
        canvas = Image.blend(canvas, black, k)
    return canvas.convert("RGB")


# --- Chapter 4: Reviewing Existing Risks ------------------------------------------

def scene_11(t_local, dur):
    frac = min(1.0, t_local / dur)
    center = (0.5, 0.5)
    scale = 1.0
    canvas = shot_frame("01-risk-register-list.png").convert("RGBA")
    draw = ImageDraw.Draw(canvas, "RGBA")
    cols = A["01"]["header_cols"]
    n_active = int(frac * (len(cols) + 1))
    for i, (label, x) in enumerate(cols):
        if i < n_active:
            y = A["01"]["header_row_y"] + 14
            w_ = 90
            draw.rectangle((x - 4, y, x - 4 + w_, y + 3), fill=COL_ACCENT)
    return canvas.convert("RGB")


def scene_12(t_local, dur):
    cut_offset = 1.5
    if t_local < cut_offset:
        frac = ease_in_out(t_local / cut_offset)
        center = lerp_pt((0.5, 0.5), (box_center(A["01"]["rsk4_row"])[0] / W, box_center(A["01"]["rsk4_row"])[1] / H), frac)
        scale = lerp(1.0, 1.3, frac)
        return shot_frame("01-risk-register-list.png", center, scale).convert("RGB")
    else:
        canvas = shot_frame("02-risk-detail-active.png").convert("RGBA")
        t2 = t_local - cut_offset
        # sequential, non-overlapping callouts (never more than one on screen at once)
        callout_at(canvas, "Status: Active", box_center(A["02"]["active_badge"]), "below",
                   t2 - 0.4, visible_for=1.6)
        callout_at(canvas, "Inherent Score: 10", box_center(A["02"]["inherent_box"]), "below",
                   t2 - 2.2, visible_for=1.6)
        callout_at(canvas, "Residual Score: 8", box_center(A["02"]["residual_box"]), "below",
                   t2 - 4.0, visible_for=999)
        return canvas.convert("RGB")


def scene_13(t_local, dur):
    canvas = shot_frame("02-risk-detail-active.png").convert("RGBA")
    buttons = [A["02"]["btn_submit"], A["02"]["btn_escalate"], A["02"]["btn_accept"], A["02"]["btn_retire"]]
    seg = dur / len(buttons)
    idx = min(len(buttons) - 1, int(t_local / seg))
    target = box_center(buttons[idx])
    arr = np.array(canvas.convert("RGB"))
    arr = apply_spotlight(arr, target, strength=0.4)
    return Image.fromarray(arr)


# --- Chapter 5: Updating the Risk Assessment --------------------------------------

def scene_14(t_local, dur):
    canvas = shot_frame("02-risk-detail-active.png").convert("RGBA")
    callout_at(canvas, "Last Assessed: 18 Jun 2026", box_center(A["02"]["last_assessed"]), "above",
               t_local - 1.0, visible_for=2.0)
    callout_at(canvas, "Next Review Due: 18 Sept 2026", box_center(A["02"]["next_review"]), "above",
               t_local - 3.2)
    return canvas.convert("RGB")


def scene_15(t_local, dur):
    click_t = 1.5
    if t_local < click_t:
        canvas = shot_frame("02-risk-detail-active.png").convert("RGBA")
        if t_local > 0.5:
            phase = min(1.0, (t_local - 0.5) / 0.3)
            draw_pulse_ring(canvas, A["02"]["btn_submit"], phase)
        return canvas.convert("RGB")
    else:
        alpha = ease_in_out((t_local - click_t) / 0.4)
        prev = shot_frame("02-risk-detail-active.png").convert("RGB")
        nxt = shot_frame("03-reassessment-justification-dialog.png").convert("RGB")
        canvas = Image.blend(prev, nxt, min(1.0, alpha)).convert("RGBA")
        callout_at(canvas, "Governed action — no further changes until a checker decides.",
                   box_center(A["03"]["warning_banner"]), "below", t_local - click_t - 0.6)
        return canvas.convert("RGB")


def scene_16(t_local, dur):
    frac = ease_in_out(min(1.0, t_local / 1.0))
    center = lerp_pt((0.5, 0.5), (box_center(A["03"]["justification_box"])[0] / W,
                                   box_center(A["03"]["justification_box"])[1] / H), frac)
    scale = lerp(1.0, 1.25, frac)
    canvas = shot_frame("03-reassessment-justification-dialog.png", center, scale).convert("RGBA")
    tgt = project_point(center, scale, box_center(A["03"]["justification_label"]))
    callout_at(canvas, "Mandatory — this is the record an auditor will read.", tgt, "above", t_local - 1.3)
    return canvas.convert("RGB")


# --- Chapter 6: Submitting for Approval -------------------------------------------

def scene_17(t_local, dur):
    cut_offset = 2.0
    if t_local < cut_offset:
        canvas = shot_frame("03-reassessment-justification-dialog.png").convert("RGBA")
        if t_local > 1.0:
            phase = min(1.0, (t_local - 1.0) / 0.3)
            draw_pulse_ring(canvas, A["03"]["submit_btn"], phase)
        return canvas.convert("RGB")
    else:
        canvas = shot_frame("04-risk-under-review-pending.png").convert("RGBA")
        t2 = t_local - cut_offset
        if t2 < 0.6:
            phase = t2 / 0.6
            draw_pulse_ring(canvas, A["04"]["under_review_badge"], phase)
        return canvas.convert("RGB")


def scene_18(t_local, dur):
    canvas = shot_frame("04-risk-under-review-pending.png").convert("RGBA")
    callout_at(canvas, "GOV-07 — one pending action per record.",
               box_center(A["04"]["awaiting_checker_badge"]), "below", t_local - 0.6, visible_for=2.2)
    if t_local > 3.0:
        blink = (int((t_local - 3.0) * 2) % 2 == 0)
        if blink:
            draw_ghost_x(canvas, box_center(A["04"]["old_action_bar"]), 220)
    return canvas.convert("RGB")


def scene_19(t_local, dur):
    return shot_frame("04-risk-under-review-pending.png")


# --- Chapter 7: Governance Review --------------------------------------------------

def scene_20(t_local, dur):
    return shot_frame("04-risk-under-review-pending.png")


def scene_21(t_local, dur):
    return plate_workflow_strip(t_local, dur, locked=True, crossed=True)


def scene_22(t_local, dur):
    """Persona-switcher dropdown -- not separately captured; synthesized as a UI
    detail overlaid on the real 04-* app chrome, anchored at the actual user-menu
    position (see A["04"]["user_menu"])."""
    canvas = shot_frame("04-risk-under-review-pending.png").convert("RGBA")
    draw = ImageDraw.Draw(canvas, "RGBA")
    fade = ease_in_out(min(1.0, t_local / 0.4))
    ux0, uy0, ux1, uy1 = A["04"]["user_menu"]
    dx0, dy0 = ux0 - 140, uy1 + 8
    dx1, dy1 = ux1, uy1 + 130
    rounded_rect(draw, (dx0, dy0, dx1, dy1), 10, fill=(*COL_CALLOUT_BG, int(245 * fade)),
                 outline=(*COL_ACCENT, int(255 * fade)), width=2)
    draw.text((dx0 + 16, dy0 + 14), "Switch persona (demo)", font=font(FONT_REG, 15),
              fill=(*COL_MUTED, int(255 * fade)), anchor="lm")
    click_phase = min(1.0, max(0.0, (t_local - 1.0) / 0.6))
    row_fill = COL_ACCENT if click_phase > 0.3 else COL_BG_DARK_2
    draw.rounded_rectangle((dx0 + 8, dy0 + 36, dx1 - 8, dy0 + 76), 6, fill=(*row_fill, int(255 * fade)))
    if click_phase > 0.3:
        draw_check_icon(draw, (dx0 + 22, dy0 + 56), 16, COL_WHITE, int(255 * fade))
    draw.text((dx0 + 36, dy0 + 56), "Priya Raghunathan", font=font(FONT_SEMIBOLD, 16),
              fill=(255, 255, 255, int(255 * fade)), anchor="lm")
    callout_at(canvas, "Arjun Mehta · Risk Manager  →  Priya Raghunathan · Chief Risk Officer",
               box_center(A["04"]["user_menu"]), "below", t_local - 1.8)
    return canvas.convert("RGB")


def scene_23(t_local, dur):
    frac = ease_in_out(min(1.0, t_local / dur))
    center = lerp_pt((0.5, 0.5), (box_center(A["05"]["top_card"])[0] / W, box_center(A["05"]["top_card"])[1] / H - 0.03), frac)
    scale = lerp(1.0, 1.2, frac)
    canvas = shot_frame("05-checker-queue-pending-item.png", center, scale).convert("RGBA")
    tgt = project_point(center, scale, (A["05"]["top_card"][0] + 40, A["05"]["top_card"][1] + 20))
    callout_at(canvas, "New submission — arrived at top of queue.", tgt, "right",
               t_local - 1.5, visible_for=2.2)
    tgt2 = project_point(center, scale, box_center(A["05"]["queue_count"]))
    callout_at(canvas, "6 other items already pending — this queue is never emptied for a demo.",
               tgt2, "left", t_local - 4.0)
    return canvas.convert("RGB")


# --- Chapter 8: Checker Approval ----------------------------------------------------

def scene_24(t_local, dur):
    canvas = shot_frame("05-checker-queue-pending-item.png").convert("RGB")
    buttons = [A["05"]["btn_approve"], A["05"]["btn_reject"], A["05"]["btn_return"]]
    seg = dur / len(buttons)
    idx = min(len(buttons) - 1, int(t_local / seg))
    target = box_center(buttons[idx])
    arr = apply_spotlight(np.array(canvas), target, strength=0.4)
    return Image.fromarray(arr)


def scene_25(t_local, dur):
    click_t = 3.0
    if t_local < click_t:
        canvas = shot_frame("05-checker-queue-pending-item.png").convert("RGBA")
        if t_local > click_t - 0.5:
            phase = min(1.0, (t_local - (click_t - 0.5)) / 0.3)
            draw_pulse_ring(canvas, A["05"]["btn_approve"], phase)
        return canvas.convert("RGB")
    else:
        alpha = ease_in_out(min(1.0, (t_local - click_t) / 0.4))
        prev = shot_frame("05-checker-queue-pending-item.png").convert("RGB")
        nxt_frac = ease_in_out(min(1.0, (t_local - click_t) / (dur - click_t)))
        center = lerp_pt((0.5, 0.5), (box_center(A["06"]["comment_box"])[0] / W,
                                       box_center(A["06"]["comment_box"])[1] / H), nxt_frac)
        scale = lerp(1.0, 1.2, nxt_frac)
        nxt = shot_frame("06-approve-decision-dialog.png", center, scale).convert("RGB")
        canvas = Image.blend(prev, nxt, min(1.0, alpha)).convert("RGBA")
        tgt = project_point(center, scale, box_center(A["06"]["comment_label"]))
        callout_at(canvas, "Comment (optional) — unlike the maker's mandatory justification.",
                   tgt, "above", t_local - click_t - 0.8)
        return canvas.convert("RGB")


def scene_26(t_local, dur):
    canvas = shot_frame("06-approve-decision-dialog.png").convert("RGBA")
    if t_local > 1.0:
        phase = min(1.0, (t_local - 1.0) / 0.3)
        draw_pulse_ring(canvas, A["06"]["confirm_btn"], phase)
    if t_local > dur - 0.3:
        k = ease_in_out((t_local - (dur - 0.3)) / 0.3)
        black = Image.new("RGBA", (W, H), (0, 0, 0, 255))
        canvas = Image.blend(canvas, black, k)
    return canvas.convert("RGB")


# --- Chapter 9: Audit Trail ----------------------------------------------------------

def scene_27(t_local, dur):
    frac = ease_in_out(min(1.0, t_local / 1.2))
    scale = lerp(1.0, 1.15, frac)
    canvas = shot_frame("07-risk-detail-approved-decision-history.png", (0.5, 0.5), scale).convert("RGBA")
    tgt1 = project_point((0.5, 0.5), scale, box_center(A["07"]["maker_line"]))
    callout_at(canvas, "Maker: Arjun Mehta", tgt1, "above", t_local - 1.4, visible_for=1.5)
    tgt2 = project_point((0.5, 0.5), scale, box_center(A["07"]["checker_line"]))
    callout_at(canvas, "Checker: Priya Raghunathan", tgt2, "below", t_local - 2.9)
    return canvas.convert("RGB")


def scene_28(t_local, dur):
    frac = ease_in_out(min(1.0, t_local / dur))
    scale = lerp(1.15, 1.35, frac)
    return shot_frame("07-risk-detail-approved-decision-history.png", (0.5, 0.5), scale).convert("RGB")


# --- Chapter 10: Final Business Outcome ----------------------------------------------

def scene_29(t_local, dur):
    canvas = shot_frame("07-risk-detail-approved-decision-history.png").convert("RGBA")
    callout_at(canvas, "Active — Inherent 10, Residual 8 (reconfirmed, unchanged).",
               box_center(A["07"]["active_badge"]), "below", t_local - 1.0)
    return canvas.convert("RGB")


def scene_30(t_local, dur):
    return shot_frame("07-risk-detail-approved-decision-history.png")


def plate_series_preview(t_local, dur):
    canvas = _plate_base("ERM Demonstration Series")
    draw = ImageDraw.Draw(canvas, "RGBA")
    fade = int(255 * _fade_alpha(t_local))
    draw.text((W / 2, H / 2 - 180), "ERM Demonstration Series", font=font(FONT_SEMIBOLD, 44),
              fill=(255, 255, 255, fade), anchor="mm")
    draw.rounded_rectangle((W / 2 - 260, H / 2 - 120, W / 2 + 260, H / 2 - 66), 12,
                            fill=(*COL_GOOD, min(fade, 60)), outline=(*COL_GOOD, fade), width=2)
    draw.text((W / 2 - 10, H / 2 - 93), "Video 01 — Risk Assessment Approval",
              font=font(FONT_SEMIBOLD, 22), fill=(*COL_GOOD, fade), anchor="mm")
    draw_check_icon(draw, (W / 2 + 218, H / 2 - 93), 20, COL_GOOD, fade)
    upcoming = ["Control Exception Handling", "Compliance Assessment Approval", "Audit Finding Closure"]
    for i, u in enumerate(upcoming):
        row_t = t_local - 0.6 - i * 0.3
        a = int(140 * ease_in_out(row_t / 0.5)) if row_t > 0 else 0
        y = H / 2 - 10 + i * 50
        draw.rounded_rectangle((W / 2 - 260, y, W / 2 + 260, y + 40), 10,
                                outline=(*COL_MUTED_DARK, a), width=2)
        draw.text((W / 2, y + 20), u, font=font(FONT_REG, 20), fill=(*COL_MUTED, a), anchor="mm")
    return canvas


# ---------------------------------------------------------------------------
# Master timeline -- authoritative segment table, merged from chapters.md
# (chapter-card slots) and scene-list.md (33 scenes + Ending), in video-timeline
# coordinates per timeline.md. Every second from 0:00 to 16:55 is covered exactly
# once, contiguously.
# ---------------------------------------------------------------------------

import functools

def card(title, subtitle):
    return functools.partial(render_chapter_card, title, subtitle)


TIMELINE_SPEC = [
    # (start, end, render_fn, transition)  transition: "cross" or "cut" (cut == no blending)
    ("0:00", "0:03", card("ERM — Enterprise Risk Management / GRC Platform",
                           "Demonstration 01 · Risk Assessment Approval"), "cut"),
    ("0:03", "0:23", functools.partial(render_wordmark_plate,
                                        "ERM — Enterprise Risk Management / GRC Platform",
                                        "Demonstration 01: Risk Assessment Approval", drift=True), "cross"),
    ("0:23", "0:26", card("Why Governance Matters", "Risk registers, maker-checker, and auditability"), "cross"),
    ("0:26", "0:52", plate_risk_register_row, "cross"),
    ("0:52", "1:11", functools.partial(plate_risk_register_row, with_badge=True), "cut"),
    ("1:11", "1:40", plate_maker_checker, "cross"),
    ("1:40", "2:10", plate_layers, "cross"),
    ("2:10", "2:44", plate_workflow_strip, "cross"),
    ("2:44", "2:47", card("Meet the Personas", "Meridian Asset Management Ltd."), "cross"),
    ("2:47", "3:17", scene_07, "cross"),
    ("3:17", "3:47", scene_08, "cut"),
    ("3:47", "4:17", scene_09, "cut"),
    ("4:17", "4:35", scene_10, "cut"),
    ("4:35", "4:38", card("Reviewing Existing Risks", "The Risk Register"), "cross"),
    ("4:38", "5:08", scene_11, "cross"),
    ("5:08", "5:48", scene_12, "cut"),
    ("5:48", "6:18", scene_13, "cut"),
    ("6:18", "6:21", card("Updating the Risk Assessment", "Submitting a Periodic Re-assessment"), "cross"),
    ("6:21", "6:51", scene_14, "cross"),
    ("6:51", "7:21", scene_15, "cut"),
    ("7:21", "7:51", scene_16, "cut"),
    ("7:51", "7:54", card("Submitting for Approval", "Active → Under Review"), "cross"),
    ("7:54", "8:12", scene_17, "cross"),
    ("8:12", "8:52", scene_18, "cut"),
    ("8:52", "9:06", scene_19, "cut"),
    ("9:06", "9:09", card("Governance Review", "Why Maker-Checker Exists"), "cross"),
    ("9:09", "9:21", scene_20, "cross"),
    ("9:21", "10:09", scene_21, "cut"),
    ("10:09", "10:39", scene_22, "cut"),
    ("10:39", "11:21", scene_23, "cross"),
    ("11:21", "11:24", card("Checker Approval", "The Chief Risk Officer Decides"), "cross"),
    ("11:24", "12:00", scene_24, "cross"),
    ("12:00", "12:36", scene_25, "cut"),
    ("12:36", "13:10", scene_26, "cut"),
    ("13:10", "13:13", card("Audit Trail", "A Permanent, Defensible Record"), "cut"),
    ("13:13", "13:45", scene_27, "cross"),
    ("13:45", "14:21", scene_28, "cut"),
    ("14:21", "14:24", card("Final Business Outcome", "From Proposal to Governed Fact"), "cross"),
    ("14:24", "14:56", scene_29, "cross"),
    ("14:56", "15:20", scene_30, "cut"),
    ("15:20", "15:54", functools.partial(plate_workflow_strip, branches=True), "cross"),
    ("15:54", "16:26", plate_audience_value, "cross"),
    ("16:26", "16:50", plate_series_preview, "cross"),
    ("16:50", "16:55", card("Thank You", "ERM Demonstration Series — Video 01 of N"), "cross"),
]

TIMELINE = [(mmss(s), mmss(e), fn, tr) for (s, e, fn, tr) in TIMELINE_SPEC]
assert TIMELINE[0][0] == 0
assert TIMELINE[-1][1] == TOTAL_SECONDS, f"timeline ends at {TIMELINE[-1][1]}, expected {TOTAL_SECONDS}"
for i in range(1, len(TIMELINE)):
    assert TIMELINE[i - 1][1] == TIMELINE[i][0], f"gap/overlap between segment {i - 1} and {i}"

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
        dip = 0.10 * 4 * alpha * (1 - alpha)  # "cross-fade through 10% black"
        if dip > 0.003:
            black = Image.new("RGB", (W, H), (0, 0, 0))
            blended = Image.blend(blended, black, dip)
        frame = blended

    return frame


# ---------------------------------------------------------------------------
# Burned-in subtitles (subtitles.srt is already timed in video-timeline coords)
# ---------------------------------------------------------------------------

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
        draw.text((W / 2, ty + _SUB_FONT.size / 2), l, font=_SUB_FONT, fill=(255, 255, 255, 255),
                  anchor="mm", stroke_width=0)
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
    ap.add_argument("--narration", default=None, help="Optional narration track (wav/mp3) -- future use")
    ap.add_argument("--music", default=None, help="Optional low-volume background music bed (wav/mp3)")
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

    audio_inputs = 0
    if args.narration and args.music:
        cmd += ["-i", args.narration, "-i", args.music]
        audio_inputs = 2
        filter_complex = "[2:a]volume=0.12[m];[1:a][m]amix=inputs=2:duration=first:dropout_transition=0[a]"
        cmd += ["-filter_complex", filter_complex, "-map", "0:v", "-map", "[a]"]
    elif args.narration:
        cmd += ["-i", args.narration]
        cmd += ["-map", "0:v", "-map", "1:a"]
        audio_inputs = 1
    elif args.music:
        cmd += ["-i", args.music]
        cmd += ["-filter_complex", "[1:a]volume=0.12[a]", "-map", "0:v", "-map", "[a]"]
        audio_inputs = 1
    else:
        cmd += ["-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=48000"]
        cmd += ["-map", "0:v", "-map", "1:a"]
        audio_inputs = 1

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

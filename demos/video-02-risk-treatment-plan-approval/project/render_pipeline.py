"""
Render pipeline -- Demonstration Video 02: Risk Treatment Plan Approval (Version 1, Silent).

Renders demos/video-02-risk-treatment-plan-approval/video-02-risk-treatment-plan-approval.mp4
directly from this package's own planning documents (scene-list.md, timeline.md, chapters.md,
subtitles.srt) and the 11 real screenshots in screenshots/ (2 reused from Video 01, 9 new).

This script reuses Video 01's compositing primitives (fonts, gradients, callout balloons,
cursor spotlight, zoom/pan, pulse rings, chapter cards, concept-plate helpers) directly from
`demos/video-01-risk-assessment-approval/project/render_pipeline.py` via import, rather than
re-implementing them -- that module is read-only from here (Video 01's package is immutable
once complete, framework Sec 21); only generic drawing/timing primitives are imported, never
Video 01's own screenshots, anchor coordinates, or scene functions, which are specific to that
video's own captures. This video's own screenshots, anchors, scenes, and timeline are defined
fresh below.

Usage:
    python render_pipeline.py --ffmpeg "C:\\path\\to\\ffmpeg.exe" [--narration track.wav] [--music bed.mp3] [--preview 0:00-0:30]
"""

import argparse
import functools
import importlib.util
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

# ---------------------------------------------------------------------------
# Import Video 01's generic compositing primitives (read-only reuse)
# ---------------------------------------------------------------------------

PKG_DIR = Path(__file__).resolve().parent.parent
SCREENSHOTS_DIR = PKG_DIR / "screenshots"
SUBTITLES_PATH = PKG_DIR / "subtitles.srt"
OUTPUT_PATH = PKG_DIR / "video-02-risk-treatment-plan-approval.mp4"

V1_PIPELINE_PATH = (
    PKG_DIR.parent / "video-01-risk-assessment-approval" / "project" / "render_pipeline.py"
)
_spec = importlib.util.spec_from_file_location("v1_render_pipeline", V1_PIPELINE_PATH)
v1 = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(v1)

# Reused primitives (Video 01's own generic helpers -- not video-specific data)
font = v1.font
mmss = v1.mmss
ease_in_out = v1.ease_in_out
lerp = v1.lerp
lerp_pt = v1.lerp_pt
parse_srt = v1.parse_srt
gradient_bg = v1.gradient_bg
rounded_rect = v1.rounded_rect
draw_text_centered = v1.draw_text_centered
wrap_text = v1.wrap_text
apply_spotlight = v1.apply_spotlight
draw_callout = v1.draw_callout
callout_at = v1.callout_at
draw_pulse_ring = v1.draw_pulse_ring
draw_ghost_x = v1.draw_ghost_x
draw_check_icon = v1.draw_check_icon
fit_zoom_pan = v1.fit_zoom_pan
crop_px_to_norm = v1.crop_px_to_norm
project_point = v1.project_point
kf_interp = v1.kf_interp
render_wordmark_plate = v1.render_wordmark_plate
render_chapter_card = v1.render_chapter_card
lower_third = v1.lower_third
_plate_base = v1._plate_base
_fade_alpha = v1._fade_alpha
_arrow = v1._arrow
plate_workflow_strip = v1.plate_workflow_strip

FONT_REG = v1.FONT_REG
FONT_BOLD = v1.FONT_BOLD
FONT_SEMIBOLD = v1.FONT_SEMIBOLD
FONT_LIGHT = v1.FONT_LIGHT
COL_BG_DARK = v1.COL_BG_DARK
COL_BG_DARK_2 = v1.COL_BG_DARK_2
COL_ACCENT = v1.COL_ACCENT
COL_ACCENT_SOFT = v1.COL_ACCENT_SOFT
COL_WHITE = v1.COL_WHITE
COL_MUTED = v1.COL_MUTED
COL_MUTED_DARK = v1.COL_MUTED_DARK
COL_CALLOUT_BG = v1.COL_CALLOUT_BG
COL_WARN = v1.COL_WARN
COL_GOOD = v1.COL_GOOD
COL_BAD = v1.COL_BAD

W, H = 1920, 1080
FPS = 30
TOTAL_SECONDS = 6 * 60 + 47  # 6:47, per timeline.md

# ---------------------------------------------------------------------------
# Screenshot cache -- points at THIS package's own screenshots/ directory
# (Video 01's load_shot/shot_frame are not reused, since they're hard-wired
# to Video 01's own SCREENSHOTS_DIR).
# ---------------------------------------------------------------------------

_IMG_CACHE = {}


def load_shot(name: str) -> Image.Image:
    if name not in _IMG_CACHE:
        _IMG_CACHE[name] = Image.open(SCREENSHOTS_DIR / name).convert("RGB")
    return _IMG_CACHE[name]


def shot_frame(shot_name, center_norm=(0.5, 0.5), scale=1.0):
    img = load_shot(shot_name)
    if scale <= 1.001 and center_norm == (0.5, 0.5):
        return img.copy()
    return fit_zoom_pan(img, center_norm, scale)


def box_center(box):
    x0, y0, x1, y1 = box
    return ((x0 + x1) / 2, (y0 + y1) / 2)


# ---------------------------------------------------------------------------
# On-screen anchor coordinates, read directly off this package's own
# 1920x1080 screenshots (screenshots/*.png). "01" and "00" are the two files
# reused verbatim from Video 01 -- their coordinates are identical to that
# package's own A["02"] / A["00"] tables (same underlying screen).
# ---------------------------------------------------------------------------

A = {
    "00": {  # 00-login-persona-picker.png (reused from Video 01)
        "priya_row": (674, 379, 1246, 425),
        "arjun_row": (674, 449, 1246, 490),
    },
    "01": {  # 01-risk-detail-active.png (reused from Video 01's 02-*)
        "active_badge": (912, 127, 963, 142),
        "btn_submit": (1291, 122, 1461, 149),
        "inherent_box": (1113, 405, 1141, 421),
        "residual_box": (1502, 405, 1527, 421),
    },
    "02": {  # 02-risk-relationships-no-treatment-plan.png
        "treatment_plans_header": (264, 336, 405, 352),
        "treatment_plans_empty_row": (264, 366, 1896, 400),
        "linked_controls_row": (264, 787, 1896, 812),
    },
    "03": {  # 03-new-treatment-plan-form.png
        "title_field": (288, 250, 1135, 285),
        "strategy_field": (724, 330, 1135, 368),
        "owner_field": (288, 415, 700, 452),
        "target_field": (724, 415, 1135, 452),
        "due_date_field": (288, 495, 700, 533),
        "create_btn": (963, 700, 1135, 736),
    },
    "04": {  # 04-treatment-plan-proposed.png
        "proposed_badge": (908, 124, 985, 143),
        "action_bar": (1590, 118, 1896, 152),
        "submit_btn": (1669, 122, 1828, 149),
    },
    "05": {  # 05-submit-justification-dialog.png
        "warning_banner": (729, 461, 1191, 522),
        "justification_label": (729, 543, 900, 562),
        "justification_box": (729, 568, 1191, 648),
        "submit_btn": (1044, 662, 1191, 702),
    },
    "06": {  # 06-treatment-plan-awaiting-checker.png
        "proposed_badge": (908, 124, 985, 143),
        "awaiting_checker_badge": (997, 124, 1105, 143),
        "old_action_bar": (1590, 118, 1896, 152),
    },
    "07": {  # 07-checker-queue-pending-item.png
        "top_card": (264, 273, 1868, 490),
        "btn_approve": (311, 446, 395, 472),
        "btn_reject": (410, 446, 486, 472),
        "btn_return": (496, 446, 644, 472),
        "queue_tab": (267, 192, 410, 218),
    },
    "08": {  # 08-approve-decision-dialog.png
        "comment_label": (729, 503, 950, 520),
        "comment_box": (729, 524, 1191, 606),
        "confirm_btn": (1044, 624, 1191, 662),
    },
    "09": {  # 09-treatment-plan-approved-decision-history.png
        "title_line": (330, 245, 900, 262),
        "maker_line": (330, 265, 900, 280),
        "checker_line": (330, 283, 900, 298),
        "record_block": (264, 224, 1896, 350),
    },
    "10": {  # 10-risk-relationships-treatment-plan-linked.png
        "treatment_plans_header": (264, 331, 405, 350),
        "treatment_plan_row": (264, 465, 1896, 495),
        "status_badge": (1715, 470, 1780, 490),
    },
}


# ---------------------------------------------------------------------------
# Chapter 1 -- Introduction
# ---------------------------------------------------------------------------

def scene_01(t_local, dur):
    return render_wordmark_plate(
        "ERM — Enterprise Risk Management / GRC Platform",
        "Demonstration 02: Risk Treatment Plan Approval", t_local, dur, drift=True,
    )


# ---------------------------------------------------------------------------
# Chapter 2 -- RISK Module Overview (shortened, second module appearance)
# ---------------------------------------------------------------------------

def plate_quick_reminder(t_local, dur):
    canvas = _plate_base("Risk Management — Quick Reminder")
    draw = ImageDraw.Draw(canvas, "RGBA")
    fade = int(255 * _fade_alpha(t_local))
    seen_alpha = int(255 * _fade_alpha(max(0.0, t_local - 0.2)))
    rounded_rect(draw, (W / 2 - 170, H / 2 - 220, W / 2 + 170, H / 2 - 172), 18,
                 fill=(*COL_GOOD, min(seen_alpha, 55)), outline=(*COL_GOOD, seen_alpha), width=2)
    draw_check_icon(draw, (W / 2 - 140, H / 2 - 196), 18, COL_GOOD, seen_alpha)
    draw.text((W / 2 - 110, H / 2 - 196), "Seen in Demonstration 01", font=font(FONT_SEMIBOLD, 18),
              fill=(*COL_GOOD, seen_alpha), anchor="lm")

    box_w, box_h, gap = 320, 110, 40
    labels = ["Risk Register", "Maker proposes", "Checker decides"]
    total_w = len(labels) * box_w + (len(labels) - 1) * gap
    x0 = (W - total_w) / 2
    y0 = H / 2 - box_h / 2 + 20
    for i, lab in enumerate(labels):
        x = x0 + i * (box_w + gap)
        a = int(255 * min(1.0, max(0.0, _fade_alpha(t_local) * 4 - i)))
        rounded_rect(draw, (x, y0, x + box_w, y0 + box_h), 14,
                     outline=(*COL_ACCENT, a), fill=(*COL_BG_DARK_2, a), width=2)
        draw.text((x + box_w / 2, y0 + box_h / 2), lab, font=font(FONT_SEMIBOLD, 24),
                  fill=(255, 255, 255, a), anchor="mm")
        if i > 0:
            _arrow(draw, (x - gap + 10, y0 + box_h / 2), (x - 10, y0 + box_h / 2), color=(*COL_MUTED, a))
    if t_local > 1.4:
        na = int(255 * ease_in_out((t_local - 1.4) / 0.5))
        draw.text((W / 2, y0 + box_h + 70), "New today: Risk Treatment",
                  font=font(FONT_SEMIBOLD, 26), fill=(*COL_ACCENT_SOFT, na), anchor="mm")
    return canvas


def scene_02(t_local, dur):
    return plate_quick_reminder(t_local, dur)


# ---------------------------------------------------------------------------
# Chapter 3 -- Meet the Personas (shortened reminder)
# ---------------------------------------------------------------------------

def scene_03(t_local, dur):
    canvas = shot_frame("00-login-persona-picker.png").convert("RGBA")
    target = box_center(A["00"]["arjun_row"])
    arr = apply_spotlight(np.array(canvas.convert("RGB")), target, strength=0.5)
    canvas = Image.fromarray(arr).convert("RGBA")
    callout_at(canvas, "Arjun Mehta · Risk Manager · Maker, again", target, "right", t_local - 0.4)
    return canvas.convert("RGB")


def scene_04(t_local, dur):
    canvas = shot_frame("00-login-persona-picker.png").convert("RGBA")
    target = box_center(A["00"]["priya_row"])
    arr = apply_spotlight(np.array(canvas.convert("RGB")), target, strength=0.5)
    canvas = Image.fromarray(arr).convert("RGBA")
    callout_at(canvas, "Priya Raghunathan · Chief Risk Officer · Checker, again", target, "right", t_local - 0.3)
    if t_local > dur - 0.4:
        k = ease_in_out((t_local - (dur - 0.4)) / 0.4)
        black = Image.new("RGBA", (W, H), (0, 0, 0, 255))
        canvas = Image.blend(canvas, black, k)
    return canvas.convert("RGB")


# ---------------------------------------------------------------------------
# Chapter 4 -- Reviewing the Risk
# ---------------------------------------------------------------------------

def scene_05(t_local, dur):
    canvas = shot_frame("01-risk-detail-active.png").convert("RGBA")
    callout_at(canvas, "Status: Active · Inherent 10 · Residual 8", box_center(A["01"]["active_badge"]),
               "below", t_local - 0.5, visible_for=999)
    return canvas.convert("RGB")


def scene_06(t_local, dur):
    frac = ease_in_out(min(1.0, t_local / 1.0))
    center = lerp_pt((0.5, 0.5), (box_center(A["02"]["treatment_plans_empty_row"])[0] / W,
                                   box_center(A["02"]["treatment_plans_empty_row"])[1] / H), frac)
    scale = lerp(1.0, 1.2, frac)
    canvas = shot_frame("02-risk-relationships-no-treatment-plan.png", center, scale).convert("RGBA")
    tgt = project_point(center, scale, box_center(A["02"]["treatment_plans_empty_row"]))
    callout_at(canvas, "Zero treatment plans — nothing is being done about this risk yet.",
               tgt, "above", t_local - 1.2, visible_for=2.4)
    tgt2 = project_point(center, scale, box_center(A["02"]["linked_controls_row"]))
    callout_at(canvas, "One control watches it today — CTL-2026-0007.", tgt2, "above", t_local - 4.2)
    return canvas.convert("RGB")


# ---------------------------------------------------------------------------
# Chapter 5 -- Proposing a Treatment Plan
# ---------------------------------------------------------------------------

def scene_07(t_local, dur):
    canvas = shot_frame("03-new-treatment-plan-form.png").convert("RGB")
    fields = [A["03"]["title_field"], A["03"]["strategy_field"], A["03"]["owner_field"],
              A["03"]["target_field"], A["03"]["due_date_field"]]
    seg = dur / len(fields)
    idx = min(len(fields) - 1, int(t_local / seg))
    target = box_center(fields[idx])
    arr = apply_spotlight(np.array(canvas), target, strength=0.4)
    return Image.fromarray(arr)


def scene_08(t_local, dur):
    click_t = 1.2
    if t_local < click_t:
        canvas = shot_frame("03-new-treatment-plan-form.png").convert("RGBA")
        phase = min(1.0, t_local / click_t)
        draw_pulse_ring(canvas, A["03"]["create_btn"], phase)
        return canvas.convert("RGB")
    alpha = ease_in_out(min(1.0, (t_local - click_t) / 0.4))
    prev = shot_frame("03-new-treatment-plan-form.png").convert("RGB")
    nxt = shot_frame("04-treatment-plan-proposed.png").convert("RGB")
    canvas = Image.blend(prev, nxt, min(1.0, alpha)).convert("RGBA")
    callout_at(canvas, "Proposed — Edit, Submit for Approval, Cancel.",
               box_center(A["04"]["proposed_badge"]), "below", t_local - click_t - 0.5)
    return canvas.convert("RGB")


# ---------------------------------------------------------------------------
# Chapter 6 -- Submitting for Approval
# ---------------------------------------------------------------------------

def scene_09(t_local, dur):
    click_t = 1.5
    if t_local < click_t:
        canvas = shot_frame("04-treatment-plan-proposed.png").convert("RGBA")
        phase = min(1.0, t_local / click_t)
        draw_pulse_ring(canvas, A["04"]["submit_btn"], phase)
        return canvas.convert("RGB")
    alpha = ease_in_out(min(1.0, (t_local - click_t) / 0.4))
    prev = shot_frame("04-treatment-plan-proposed.png").convert("RGB")
    frac = ease_in_out(min(1.0, (t_local - click_t) / max(dur - click_t, 0.001)))
    center = lerp_pt((0.5, 0.5), (box_center(A["05"]["justification_box"])[0] / W,
                                   box_center(A["05"]["justification_box"])[1] / H), frac)
    scale = lerp(1.0, 1.2, frac)
    nxt = shot_frame("05-submit-justification-dialog.png", center, scale).convert("RGB")
    canvas = Image.blend(prev, nxt, min(1.0, alpha)).convert("RGBA")
    tgt = project_point(center, scale, box_center(A["05"]["justification_label"]))
    callout_at(canvas, "Justification * — mandatory, exactly like a re-assessment.", tgt, "above",
               t_local - click_t - 0.7)
    return canvas.convert("RGB")


def scene_10(t_local, dur):
    """Hard cut #1 -- the video's first instantaneous governed-state change."""
    click_t = 1.0
    if t_local < click_t:
        canvas = shot_frame("05-submit-justification-dialog.png").convert("RGBA")
        phase = min(1.0, t_local / click_t)
        draw_pulse_ring(canvas, A["05"]["submit_btn"], phase)
        return canvas.convert("RGB")
    canvas = shot_frame("06-treatment-plan-awaiting-checker.png").convert("RGBA")
    t2 = t_local - click_t
    if t2 < 0.6:
        phase = t2 / 0.6
        draw_pulse_ring(canvas, A["06"]["awaiting_checker_badge"], phase)
    callout_at(canvas, "GOV-07 — one pending action per record.",
               box_center(A["06"]["awaiting_checker_badge"]), "below", t2 - 0.7, visible_for=1.6)
    if t2 > 2.6:
        blink = (int((t2 - 2.6) * 2) % 2 == 0)
        if blink:
            draw_ghost_x(canvas, box_center(A["06"]["old_action_bar"]), 220)
    return canvas.convert("RGB")


# ---------------------------------------------------------------------------
# Chapter 7 -- Governance Review
# ---------------------------------------------------------------------------

def scene_11(t_local, dur):
    return shot_frame("06-treatment-plan-awaiting-checker.png")


def scene_12(t_local, dur):
    """Persona switch (UI-detail synthesis, same honest-adaptation treatment as
    Video 01 Scene 22 -- anchored on real chrome, never a fabricated screen)
    then cross-fade into the checker queue."""
    switch_dur = min(2.5, dur * 0.4)
    if t_local < switch_dur:
        canvas = shot_frame("06-treatment-plan-awaiting-checker.png").convert("RGBA")
        draw = ImageDraw.Draw(canvas, "RGBA")
        fade = ease_in_out(min(1.0, t_local / 0.4))
        dx0, dy0, dx1, dy1 = 1690, 60, 1896, 190
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
        return canvas.convert("RGB")
    t2 = t_local - switch_dur
    fade_dur = 0.4
    canvas = shot_frame("07-checker-queue-pending-item.png").convert("RGBA")
    if t2 < fade_dur:
        prev = shot_frame("06-treatment-plan-awaiting-checker.png").convert("RGB")
        alpha = ease_in_out(t2 / fade_dur)
        canvas = Image.blend(prev, canvas.convert("RGB"), alpha).convert("RGBA")
    callout_at(canvas, "New submission — arrived at top of queue. 6 other items already pending.",
               box_center(A["07"]["top_card"]) if False else (A["07"]["top_card"][0] + 60, A["07"]["top_card"][1] + 30),
               "right", t2 - fade_dur - 0.4)
    return canvas.convert("RGB")


# ---------------------------------------------------------------------------
# Chapter 8 -- Checker Approval
# ---------------------------------------------------------------------------

def scene_13(t_local, dur):
    canvas = shot_frame("07-checker-queue-pending-item.png").convert("RGB")
    buttons = [A["07"]["btn_approve"], A["07"]["btn_reject"], A["07"]["btn_return"]]
    seg = dur / len(buttons)
    idx = min(len(buttons) - 1, int(t_local / seg))
    target = box_center(buttons[idx])
    arr = apply_spotlight(np.array(canvas), target, strength=0.4)
    return Image.fromarray(arr)


def scene_14(t_local, dur):
    click_t = min(2.0, dur * 0.3)
    if t_local < click_t:
        canvas = shot_frame("07-checker-queue-pending-item.png").convert("RGBA")
        phase = min(1.0, t_local / click_t)
        draw_pulse_ring(canvas, A["07"]["btn_approve"], phase)
        return canvas.convert("RGB")
    alpha = ease_in_out(min(1.0, (t_local - click_t) / 0.4))
    prev = shot_frame("07-checker-queue-pending-item.png").convert("RGB")
    frac = ease_in_out(min(1.0, (t_local - click_t) / max(dur - click_t, 0.001)))
    center = lerp_pt((0.5, 0.5), (box_center(A["08"]["comment_box"])[0] / W,
                                   box_center(A["08"]["comment_box"])[1] / H), frac)
    scale = lerp(1.0, 1.2, frac)
    nxt = shot_frame("08-approve-decision-dialog.png", center, scale).convert("RGB")
    canvas = Image.blend(prev, nxt, min(1.0, alpha)).convert("RGBA")
    tgt = project_point(center, scale, box_center(A["08"]["comment_label"]))
    callout_at(canvas, "Comment (optional) — unlike the maker's mandatory justification.",
               tgt, "above", t_local - click_t - 0.7)
    return canvas.convert("RGB")


def scene_15(t_local, dur):
    """Hard cut #2 -- the video's second and final instantaneous governed-state change."""
    canvas = shot_frame("08-approve-decision-dialog.png").convert("RGBA")
    if t_local > 1.0:
        phase = min(1.0, (t_local - 1.0) / 0.3)
        draw_pulse_ring(canvas, A["08"]["confirm_btn"], phase)
    if t_local > dur - 0.3:
        k = ease_in_out((t_local - (dur - 0.3)) / 0.3)
        black = Image.new("RGBA", (W, H), (0, 0, 0, 255))
        canvas = Image.blend(canvas, black, k)
    return canvas.convert("RGB")


# ---------------------------------------------------------------------------
# Chapter 9 -- Audit Trail
# ---------------------------------------------------------------------------

def scene_16(t_local, dur):
    frac = ease_in_out(min(1.0, t_local / 1.2))
    scale = lerp(1.0, 1.15, frac)
    canvas = shot_frame("09-treatment-plan-approved-decision-history.png", (0.5, 0.5), scale).convert("RGBA")
    tgt1 = project_point((0.5, 0.5), scale, box_center(A["09"]["maker_line"]))
    callout_at(canvas, "Maker: Arjun Mehta", tgt1, "above", t_local - 1.4, visible_for=1.6)
    tgt2 = project_point((0.5, 0.5), scale, box_center(A["09"]["checker_line"]))
    callout_at(canvas, "Checker: Priya Raghunathan", tgt2, "below", t_local - 3.1)
    return canvas.convert("RGB")


# ---------------------------------------------------------------------------
# Chapter 10 -- Final Business Outcome
# ---------------------------------------------------------------------------

def scene_17(t_local, dur):
    frac = ease_in_out(min(1.0, t_local / dur))
    center = lerp_pt((0.5, 0.5), (box_center(A["10"]["treatment_plan_row"])[0] / W,
                                   box_center(A["10"]["treatment_plan_row"])[1] / H), frac)
    scale = lerp(1.0, 1.3, frac)
    canvas = shot_frame("10-risk-relationships-treatment-plan-linked.png", center, scale).convert("RGBA")
    tgt = project_point(center, scale, box_center(A["10"]["treatment_plans_header"]))
    callout_at(canvas, "From zero to one — governed, approved, on the record.", tgt, "below",
               t_local - 1.2)
    return canvas.convert("RGB")


def scene_18(t_local, dur):
    frac = ease_in_out(min(1.0, t_local / 1.2))
    center = lerp_pt((box_center(A["10"]["treatment_plan_row"])[0] / W,
                       box_center(A["10"]["treatment_plan_row"])[1] / H), (0.5, 0.5), frac)
    scale = lerp(1.3, 1.0, frac)
    return shot_frame("10-risk-relationships-treatment-plan-linked.png", center, scale).convert("RGB")


# ---------------------------------------------------------------------------
# Ending
# ---------------------------------------------------------------------------

def plate_dual_pattern(t_local, dur):
    canvas = _plate_base("One Ledger, Two Decisions")
    draw = ImageDraw.Draw(canvas, "RGBA")
    fade = int(255 * _fade_alpha(t_local))
    box_w, box_h, gap = 380, 130, 120
    x0 = W / 2 - gap / 2 - box_w
    x1 = W / 2 + gap / 2
    y0 = H / 2 - box_h / 2 - 60
    rounded_rect(draw, (x0, y0, x0 + box_w, y0 + box_h), 16, outline=(*COL_ACCENT, fade),
                 fill=(*COL_BG_DARK_2, fade), width=2)
    rounded_rect(draw, (x1, y0, x1 + box_w, y0 + box_h), 16, outline=(*COL_ACCENT, fade),
                 fill=(*COL_BG_DARK_2, fade), width=2)
    draw.text((x0 + box_w / 2, y0 + box_h / 2 - 12), "Risk Assessment", font=font(FONT_SEMIBOLD, 26),
              fill=(255, 255, 255, fade), anchor="mm")
    draw.text((x0 + box_w / 2, y0 + box_h / 2 + 22), "Demonstration 01", font=font(FONT_REG, 18),
              fill=(*COL_MUTED, fade), anchor="mm")
    draw.text((x1 + box_w / 2, y0 + box_h / 2 - 12), "Risk Treatment", font=font(FONT_SEMIBOLD, 26),
              fill=(255, 255, 255, fade), anchor="mm")
    draw.text((x1 + box_w / 2, y0 + box_h / 2 + 22), "Demonstration 02", font=font(FONT_REG, 18),
              fill=(*COL_MUTED, fade), anchor="mm")
    if t_local > 0.9:
        la = int(255 * ease_in_out((t_local - 0.9) / 0.4))
        strip_y = y0 + box_h + 90
        labels = ["Submit", "Review", "Approve"]
        sbw, sbh, sgap = 220, 80, 60
        total = len(labels) * sbw + (len(labels) - 1) * sgap
        sx0 = (W - total) / 2
        for i, lab in enumerate(labels):
            sx = sx0 + i * (sbw + sgap)
            rounded_rect(draw, (sx, strip_y, sx + sbw, strip_y + sbh), 12,
                         outline=(*COL_ACCENT, la), fill=(*COL_BG_DARK_2, la), width=2)
            draw.text((sx + sbw / 2, strip_y + sbh / 2), lab, font=font(FONT_SEMIBOLD, 22),
                      fill=(255, 255, 255, la), anchor="mm")
            if i > 0:
                _arrow(draw, (sx - sgap + 8, strip_y + sbh / 2), (sx - 8, strip_y + sbh / 2), color=(*COL_MUTED, la))
        _arrow(draw, (x0 + box_w / 2, y0 + box_h), (sx0 + sbw / 2, strip_y), color=(*COL_MUTED, int(la * 0.6)))
        _arrow(draw, (x1 + box_w / 2, y0 + box_h), (sx0 + total - sbw / 2, strip_y), color=(*COL_MUTED, int(la * 0.6)))
    return canvas


def scene_19(t_local, dur):
    return plate_dual_pattern(t_local, dur)


def plate_series_preview_v2(t_local, dur):
    canvas = _plate_base("ERM Demonstration Series")
    draw = ImageDraw.Draw(canvas, "RGBA")
    fade = int(255 * _fade_alpha(t_local))
    draw.text((W / 2, H / 2 - 200), "ERM Demonstration Series", font=font(FONT_SEMIBOLD, 44),
              fill=(255, 255, 255, fade), anchor="mm")
    done = ["Video 01 — Risk Assessment Approval", "Video 02 — Risk Treatment Plan Approval"]
    for i, d in enumerate(done):
        y = H / 2 - 130 + i * 46
        draw.rounded_rectangle((W / 2 - 280, y, W / 2 + 280, y + 36), 10,
                                fill=(*COL_GOOD, min(fade, 55)), outline=(*COL_GOOD, fade), width=2)
        draw.text((W / 2 - 240, y + 18), d, font=font(FONT_SEMIBOLD, 18), fill=(*COL_GOOD, fade), anchor="lm")
        draw_check_icon(draw, (W / 2 + 250, y + 18), 16, COL_GOOD, fade)
    upcoming = ["Risk Acceptance", "KRI Breach → Escalation Acknowledgement",
                "Control Test Execution & Result Capture"]
    for i, u in enumerate(upcoming):
        row_t = t_local - 0.7 - i * 0.3
        a = int(140 * ease_in_out(row_t / 0.5)) if row_t > 0 else 0
        y = H / 2 - 10 + i * 46
        draw.rounded_rectangle((W / 2 - 280, y, W / 2 + 280, y + 36), 10,
                                outline=(*COL_MUTED_DARK, a), width=2)
        draw.text((W / 2, y + 18), u, font=font(FONT_REG, 18), fill=(*COL_MUTED, a), anchor="mm")
    return canvas


def scene_20(t_local, dur):
    return plate_series_preview_v2(t_local, dur)


def card(title, subtitle):
    return functools.partial(render_chapter_card, title, subtitle)


# ---------------------------------------------------------------------------
# Master timeline -- reconciled against timeline.md / chapters.md exactly.
# ---------------------------------------------------------------------------

TIMELINE_SPEC = [
    ("0:00", "0:03", card("ERM — Enterprise Risk Management / GRC Platform",
                           "Demonstration 02 · Risk Treatment Plan Approval"), "cut"),
    ("0:03", "0:29", scene_01, "cross"),
    ("0:29", "0:32", card("Quick Reminder", "The Risk Register, Revisited"), "cross"),
    ("0:32", "1:05", scene_02, "cross"),
    ("1:05", "1:08", card("Meet the Personas, Again", "Meridian Asset Management Ltd."), "cross"),
    ("1:08", "1:20", scene_03, "cross"),
    ("1:20", "1:30", scene_04, "cut"),
    ("1:30", "1:33", card("Reviewing the Risk", "RSK-2026-0004, Revisited"), "cross"),
    ("1:33", "1:57", scene_05, "cross"),
    ("1:57", "2:15", scene_06, "cut"),
    ("2:15", "2:18", card("Proposing a Treatment Plan", "Accept · Mitigate · Transfer · Avoid"), "cross"),
    ("2:18", "2:40", scene_07, "cross"),
    ("2:40", "3:00", scene_08, "cut"),
    ("3:00", "3:03", card("Submitting for Approval", "Proposed → Awaiting Checker"), "cross"),
    ("3:03", "3:23", scene_09, "cross"),
    ("3:23", "3:41", scene_10, "cut"),
    ("3:41", "3:44", card("Governance Review", "One Ledger, Every Decision"), "cross"),
    ("3:44", "4:09", scene_11, "cross"),
    ("4:09", "4:24", scene_12, "cut"),
    ("4:24", "4:27", card("Checker Approval", "The Chief Risk Officer Decides, Again"), "cross"),
    ("4:27", "4:37", scene_13, "cross"),
    ("4:37", "4:50", scene_14, "cut"),
    ("4:50", "5:03", scene_15, "cut"),
    ("5:03", "5:06", card("Audit Trail", "A Second Permanent Record"), "cut"),
    ("5:06", "5:29", scene_16, "cross"),
    ("5:29", "5:32", card("Final Business Outcome", "From Zero Plans to One, Governed"), "cross"),
    ("5:32", "5:46", scene_17, "cross"),
    ("5:46", "6:05", scene_18, "cut"),
    ("6:05", "6:27", scene_19, "cross"),
    ("6:27", "6:42", scene_20, "cross"),
    ("6:42", "6:47", card("Thank You", "ERM Demonstration Series — Video 02 of 46"), "cross"),
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
        dip = 0.10 * 4 * alpha * (1 - alpha)
        if dip > 0.003:
            black = Image.new("RGB", (W, H), (0, 0, 0))
            blended = Image.blend(blended, black, dip)
        frame = blended

    return frame


# ---------------------------------------------------------------------------
# Burned-in subtitles
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
SUBTITLE_SAFE_BOTTOM = 96


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

    if args.narration and args.music:
        cmd += ["-i", args.narration, "-i", args.music]
        filter_complex = "[2:a]volume=0.12[m];[1:a][m]amix=inputs=2:duration=first:dropout_transition=0[a]"
        cmd += ["-filter_complex", filter_complex, "-map", "0:v", "-map", "[a]"]
    elif args.narration:
        cmd += ["-i", args.narration]
        cmd += ["-map", "0:v", "-map", "1:a"]
    elif args.music:
        cmd += ["-i", args.music]
        cmd += ["-filter_complex", "[1:a]volume=0.12[a]", "-map", "0:v", "-map", "[a]"]
    else:
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

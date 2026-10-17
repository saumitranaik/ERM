"""
Render pipeline -- ERM Summary Video (S01), Version 1 (Silent Demonstration).

Renders ../video-s01-erm-summary.mp4 from content.py (via timeline_build.py) and the real
screenshots in ../screenshots/. Generic compositing primitives (fonts, gradients, chapter cards,
zoom/pan, rounded rects) are imported read-only from Video 01's render_pipeline.py, as Video 02 does.
Captions are burned in; the audio track is silent (no narration or music is available).

Usage:
    python render_pipeline.py --ffmpeg "C:\\path\\to\\ffmpeg.exe" [--preview 0:00-0:30]
"""
import argparse
import bisect
import importlib.util
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw

import timeline_build as TB

PKG_DIR = Path(__file__).resolve().parent.parent
SHOTS = PKG_DIR / "screenshots"
OUTPUT_PATH = PKG_DIR / "video-s01-erm-summary.mp4"
V1 = PKG_DIR.parent / "video-01-risk-assessment-approval" / "project" / "render_pipeline.py"
_spec = importlib.util.spec_from_file_location("v1_render_pipeline", V1)
v1 = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(v1)

W, H, FPS = 1920, 1080, 30
font, ease, gradient_bg = v1.font, v1.ease_in_out, v1.gradient_bg
SEGS, CUES, TOTAL = TB.build()
_IMG = {}


def shot(name):
    if name not in _IMG:
        _IMG[name] = Image.open(SHOTS / name).convert("RGB")
    return _IMG[name]


def cam_frame(seg, t_local):
    (cx0, cy0, s0), (cx1, cy1, s1) = seg["cam"]
    k = ease(min(1.0, t_local / seg["dur"]))
    cx, cy, s = cx0 + (cx1 - cx0) * k, cy0 + (cy1 - cy0) * k, s0 + (s1 - s0) * k
    img = shot(seg["shot"])
    frame = img.copy() if s <= 1.001 else v1.fit_zoom_pan(img, (cx, cy), s)
    hl = seg.get("highlight")
    if hl and t_local > 0.8:
        # Project the highlight box through the current crop.
        iw, ih = img.size
        cw, ch = iw / s, ih / s
        x0 = max(0, min(cx * iw - cw / 2, iw - cw))
        y0 = max(0, min(cy * ih - ch / 2, ih - ch))
        sx, sy = W / cw, H / ch
        box = ((hl[0] - x0) * sx, (hl[1] - y0) * sy, (hl[2] - x0) * sx, (hl[3] - y0) * sy)
        a = int(255 * ease(min(1.0, (t_local - 0.8) / 0.5)))
        d = ImageDraw.Draw(frame, "RGBA")
        d.rounded_rectangle(box, radius=10, outline=(*v1.COL_ACCENT, a), width=5)
    return frame


def plate_frame(seg, t_local):
    canvas = gradient_bg()
    d = ImageDraw.Draw(canvas, "RGBA")
    d.rectangle((0, 0, 10, H), fill=(*v1.COL_ACCENT, 255))
    d.text((W / 2, 200), seg["title"], font=font(v1.FONT_SEMIBOLD, 56), fill=(255, 255, 255, 255), anchor="mm")
    y = 340
    for i, b in enumerate(seg["bullets"]):
        a = int(255 * ease(min(1.0, max(0.0, (t_local - 0.6 - i * 0.5) / 0.5))))
        d.ellipse((470, y - 8, 486, y + 8), fill=(*v1.COL_ACCENT, a))
        d.text((510, y), b, font=font(v1.FONT_REG, 38), fill=(255, 255, 255, a), anchor="lm")
        y += 90
    return canvas


def segment_frame(seg, t_local):
    k = seg["kind"]
    if k == "title":
        return v1.render_wordmark_plate(seg["title"], seg["subtitle"], t_local, seg["dur"])
    if k == "outro":
        return v1.render_wordmark_plate(seg["title"], seg["subtitle"], t_local, seg["dur"])
    if k == "card":
        return v1.render_chapter_card(seg["title"], seg["subtitle"], t_local, seg["dur"])
    if k == "plate":
        return plate_frame(seg, t_local)
    return cam_frame(seg, t_local)


_STARTS = [s["start"] for s in SEGS]


def master_frame(t):
    i = max(0, bisect.bisect_right(_STARTS, t) - 1)
    seg = SEGS[i]
    frame = segment_frame(seg, t - seg["start"])
    # 0.5 s cross-fade from the previous segment's last frame
    if i > 0 and t - seg["start"] < 0.5:
        prev = SEGS[i - 1]
        a = ease((t - seg["start"]) / 0.5)
        frame = Image.blend(segment_frame(prev, prev["dur"]), frame, a)
    return frame


_CS = [c[0] for c in CUES]
_SUB = None


def burn(frame, t):
    global _SUB
    i = bisect.bisect_right(_CS, t) - 1
    if i < 0 or not (CUES[i][0] <= t < CUES[i][1]):
        return frame
    _SUB = _SUB or font(v1.FONT_SEMIBOLD, 34)
    d = ImageDraw.Draw(frame, "RGBA")
    lines = v1.wrap_text(CUES[i][2], _SUB, int(W * 0.72), d)
    lh = _SUB.size + 12
    bh = len(lines) * lh + 24
    y1 = H - 60
    y0 = y1 - bh
    bw = max(d.textlength(l, font=_SUB) for l in lines) + 56
    x0 = (W - bw) / 2
    v1.rounded_rect(d, (x0, y0, x0 + bw, y1), 10, fill=(0, 0, 0, 225))
    ty = y0 + 12
    for l in lines:
        d.text((W / 2, ty + _SUB.size / 2), l, font=_SUB, fill=(255, 255, 255, 255), anchor="mm")
        ty += lh
    return frame


def rng(spec):
    a, b = spec.split("-")
    f = lambda x: v1.mmss(x) if ":" in x else float(x)
    return f(a), f(b)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ffmpeg", default="ffmpeg")
    ap.add_argument("--out", default=str(OUTPUT_PATH))
    ap.add_argument("--preview", default=None)
    ap.add_argument("--crf", type=int, default=18)
    a = ap.parse_args()
    t0, t1 = rng(a.preview) if a.preview else (0.0, TOTAL)
    n = int(round((t1 - t0) * FPS))
    cmd = [a.ffmpeg, "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
           "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=48000", "-map", "0:v", "-map", "1:a",
           "-shortest", "-c:v", "libx264", "-preset", "medium", "-crf", str(a.crf), "-pix_fmt", "yuv420p",
           "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", a.out]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    try:
        for i in range(n):
            t = t0 + i / FPS
            proc.stdin.write(burn(master_frame(t), t).tobytes())
            if i % (FPS * 10) == 0:
                print(f"t={t:6.1f}s {i}/{n}", file=sys.stderr, flush=True)
    finally:
        proc.stdin.close()
        ret = proc.wait()
    if ret:
        sys.exit(ret)
    print("Done:", a.out, file=sys.stderr)


if __name__ == "__main__":
    main()

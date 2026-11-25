#!/usr/bin/env python3
"""Native-fullscreen MP4 for any cinematic Lesen story (iPhone AVKit, Android, desktop).

Same rules as the approved first pilot renderer: camera locked (no zoom, pan or shake),
only faint transparent ambient layers move, 24 fps, 1.25 s dissolves centred on the
real narration boundaries, original audio uncut, subtitles burned in plus an SRT.

Usage: python scripts/build_lesen_story_video.py public/lesen-pilot/stories/<id>
"""
import json, math, pathlib, subprocess, sys, tempfile, textwrap
from PIL import Image, ImageDraw, ImageFilter, ImageFont

STORY = pathlib.Path(sys.argv[1]).resolve()
DATA = json.loads((STORY / "story-data.json").read_text(encoding="utf-8"))["story"]
TIMES = json.loads((STORY / "timings.json").read_text(encoding="utf-8"))
OUT = STORY / "video"; OUT.mkdir(exist_ok=True)
FPS, FADE_FRAMES = 24, 30
FADE = FADE_FRAMES / FPS
W, H = 1280, 720
OV_FPS, OV_FRAMES = 12, 72

def ffmpeg(*args):
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *map(str, args)], check=True, timeout=1500)

def stamp(ms):
    ms = int(round(ms)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

def ambient(fx, folder):
    """Faint looping light/particle layer per scene effect; never moves the painting."""
    folder.mkdir(parents=True, exist_ok=True)
    w, h = 320, 180
    for f in range(OV_FRAMES):
        p = f / OV_FRAMES; t = 2 * math.pi * p
        img = Image.new("RGBA", (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(img, "RGBA")
        if fx in ("warm", "dusk", "home"):
            warm = {"warm": (255, 232, 160), "dusk": (255, 205, 140), "home": (255, 214, 160)}[fx]
            for j in range(18):
                x = (j * 47.7 + 9 * math.sin(t + j)) % w; y = (j * 37.1 + 6 * math.cos(t + j * .7)) % h
                r = 1 + (j % 3 == 0)
                d.ellipse((x - r, y - r, x + r, y + r), fill=warm + (14 + (j % 4) * 5,))
            gl = int(5 + 6 * (1 + math.sin(t - .4)) / 2)
            d.polygon([(0, 0), (95, 0), (190, 180), (120, 180)], fill=warm + (gl,))
        elif fx == "night":
            for j in range(14):  # fireflies drifting and blinking
                x = (j * 61 + 14 * math.sin(t + j * 1.3)) % w; y = 70 + (j * 29 + 10 * math.cos(t * 1.2 + j)) % 100
                a = int(40 + 60 * max(0, math.sin(t * 2 + j)))
                d.ellipse((x - 1.5, y - 1.5, x + 1.5, y + 1.5), fill=(255, 240, 150, a))
            g = int(10 + 12 * (1 + math.sin(t * 2)) / 2)
            d.ellipse((262 - 26, 60 - 16, 262 + 26, 60 + 16), fill=(255, 205, 120, g))
        elif fx == "loud":
            cx, cy = 150, 58  # sound rings from the singing animals
            for k in range(3):
                q = (p * 2 + k / 3) % 1
                r = 12 + q * 60; a = int(30 * (1 - q))
                d.arc((cx - r, cy - r * .7, cx + r, cy + r * .7), 200, 340, fill=(255, 220, 140, a), width=2)
            g = int(6 + 8 * (1 + math.sin(t * 3)) / 2)
            d.rectangle((200, 30, 300, 110), fill=(255, 200, 110, g))
        img.save(folder / f"fx_{f:03d}.png")
    out = folder.parent / f"{fx}-ambient.mov"
    ffmpeg("-framerate", OV_FPS, "-i", folder / "fx_%03d.png", "-c:v", "qtrle", "-pix_fmt", "argb", out)
    return out


NOTE_FONT = None
def note_font(size):
    global NOTE_FONT
    try:
        return ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", size)
    except Exception:
        return ImageFont.load_default()

def draw_motion(specs, p, w, h):
    """Same effect vocabulary as the player (normalised coordinates), drawn as a seamless loop."""
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(img, "RGBA")
    blur = Image.new("RGBA", (w, h), (0, 0, 0, 0)); db = ImageDraw.Draw(blur, "RGBA")
    t = 2 * math.pi * p
    hexrgb = lambda c: tuple(int(c[i:i + 2], 16) for i in (1, 3, 5))
    for k, m in enumerate(specs):
        ty = m["type"]; x = m.get("x", 0) * w; y = m.get("y", 0) * h
        ax0, ay0, ax1, ay1 = [v * (w if i % 2 == 0 else h) for i, v in enumerate(m.get("area", [0, 0, 1, 1]))]
        aw, ah = ax1 - ax0, ay1 - ay0
        if ty in ("glow", "flicker"):
            r = m.get("r", .05) * w; c = hexrgb(m.get("color", "#ffb04a" if ty == "flicker" else "#ffc46a"))
            pulse = (1 + math.sin(t * (3 if ty == "flicker" else 1))) / 2
            if ty == "flicker": pulse = .55 + .45 * abs(math.sin(t * 7) * math.cos(t * 3))
            for i in range(10, 0, -1):
                rr = r * i / 10; a = int((14 + 40 * pulse) * (1 - i / 11))
                db.ellipse((x - rr, y - rr, x + rr, y + rr), fill=c + (a,))
        elif ty == "rays":
            for i in range(10):
                ang = t / 6 + i * math.pi / 5; L = w * .55
                p1 = (x + math.cos(ang - .05) * L, y + math.sin(ang - .05) * L); p2 = (x + math.cos(ang + .05) * L, y + math.sin(ang + .05) * L)
                db.polygon([(x, y), p1, p2], fill=(255, 244, 210, 16))
        elif ty == "sparkle":
            q = (math.sin(t * 2 + k) + 1) / 2; s_ = 4 + 7 * q; a = int(230 * q)
            d.polygon([(x, y - s_), (x + s_ * .3, y - s_ * .3), (x + s_, y), (x + s_ * .3, y + s_ * .3), (x, y + s_), (x - s_ * .3, y + s_ * .3), (x - s_, y), (x - s_ * .3, y - s_ * .3)], fill=(255, 248, 214, a))
        elif ty == "rings":
            for i in range(3):
                q = (p * 3 + i / 3) % 1; rr = 6 + q * w * .07
                d.ellipse((x - rr * 1.4, y - rr, x + rr * 1.4, y + rr), outline=(255, 226, 163, int(170 * (1 - q))), width=2)
        elif ty == "notes":
            for i, n in enumerate("♪♫♪♬"):
                q = (p * 1.6 + i / 4) % 1
                d.text((x + (1 if i % 2 else -1) * (8 + i * 5) * q * 2, y - q * h * .18), n, fill=(255, 243, 212, int(240 * (1 - q) * min(1, q * 6))), font=note_font(int(h * .045)))
        elif ty == "steam":
            for i in range(3):
                q = (p * 1.8 + i / 3) % 1; rr = 4 + q * 10
                db.ellipse((x + (i - 1) * 6 * q - rr * .6, y - q * h * .16 - rr, x + (i - 1) * 6 * q + rr * .6, y - q * h * .16 + rr), fill=(255, 255, 255, int(120 * (1 - q))))
        elif ty == "leaves":
            for i in range(5):
                q = (p + i / 5) % 1; lx = ax0 + aw * (.1 + .18 * i) + 16 * math.sin(t * 2 + i); ly = ay0 + q * ah * 1.2
                col = (217, 139, 43) if i % 2 else (184, 97, 31); a = int(220 * min(1, (1 - q) * 4, q * 8))
                ang = q * 6; dx, dy = 5 * math.cos(ang), 3 * math.sin(ang)
                d.ellipse((lx - 5 - dx * .2, ly - 3 - dy * .2, lx + 5 + dx * .2, ly + 3 + dy * .2), fill=col + (a,))
        elif ty == "fireflies":
            for i in range(12):
                fx = ax0 + aw * ((i * 37 % 100) / 100) + 6 * math.sin(t + i); fy = ay0 + ah * ((i * 53 % 100) / 100) + 5 * math.cos(t * 1.3 + i)
                a = int(220 * max(0, math.sin(t * 2 + i * 1.7)))
                db.ellipse((fx - 5, fy - 5, fx + 5, fy + 5), fill=(255, 240, 160, a // 3)); d.ellipse((fx - 1.6, fy - 1.6, fx + 1.6, fy + 1.6), fill=(255, 243, 170, a))
        elif ty == "pollen":
            for i in range(10):
                fx = w * ((i * 41 % 100) / 100) + 12 * math.sin(t + i); fy = h * ((15 + i * 29 % 70) / 100) - 8 * math.sin(t * .5 + i)
                d.ellipse((fx - 1.4, fy - 1.4, fx + 1.4, fy + 1.4), fill=(255, 246, 208, int(150 * (1 + math.sin(t + i * 2)) / 2)))
        elif ty == "streaks":
            for i in range(6):
                q = (p * 4 + i / 6) % 1; sx = ax1 - q * aw * 1.6; sy = ay0 + ah * (.12 + i * .14)
                d.line([(max(ax0, sx), sy), (min(ax1, sx + aw * .4), sy)], fill=(255, 255, 255, 110), width=2)
        elif ty == "shimmer":
            for i in range(9):
                sx = ax0 + aw * ((i * 23 % 90) / 100) + 6 * math.sin(t * 2 + i); sy = ay0 + ah * (.15 + (i * 31 % 70) / 100)
                d.line([(sx, sy), (sx + aw * .09, sy)], fill=(255, 255, 255, int(170 * max(0, math.sin(t * 2 + i)))), width=2)
        elif ty == "twinkle":
            for i in range(10):
                sx = ax0 + aw * i / 9; sy = ay0 + ah * ((i % 3) * .3); a = int(60 + 180 * (1 + math.sin(t * 3 + i)) / 2)
                db.ellipse((sx - 6, sy - 6, sx + 6, sy + 6), fill=(255, 214, 122, a // 3)); d.ellipse((sx - 2.5, sy - 2.5, sx + 2.5, sy + 2.5), fill=(255, 233, 168, a))
    blur = blur.filter(ImageFilter.GaussianBlur(3))
    return Image.alpha_composite(blur, img)

def motion_overlay(scene, folder):
    """Per-scene loop: the generic ambient light plus the scene's element animation."""
    folder.mkdir(parents=True, exist_ok=True)
    w, h = 640, 360
    base_dir = folder.parent / ("base-" + scene.get("fx", "warm"))
    if not base_dir.exists(): ambient(scene.get("fx", "warm"), base_dir)
    for f in range(OV_FRAMES):
        base = Image.open(base_dir / f"fx_{f:03d}.png").convert("RGBA").resize((w, h), Image.BICUBIC)
        frame = Image.alpha_composite(base, draw_motion(scene.get("motion", []), f / OV_FRAMES, w, h))
        frame.save(folder / f"fx_{f:03d}.png")
    out = folder.parent / f"{scene['id']}-motion.mov"
    ffmpeg("-framerate", OV_FPS, "-i", folder / "fx_%03d.png", "-c:v", "qtrle", "-pix_fmt", "argb", out)
    return out

def clip(art, dur, amb, out):
    d = round(dur * FPS) / FPS
    graph = (f"[0:v]scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos,crop={W}:{H},setsar=1,"
             f"fps={FPS},trim=duration={d:.6f},setpts=PTS-STARTPTS,format=rgba[base];"
             f"[1:v]scale={W}:{H}:flags=bicubic,fps={FPS},trim=duration={d:.6f},setpts=PTS-STARTPTS,format=rgba[fx];"
             f"[base][fx]overlay=0:0:shortest=1:format=auto,format=yuv420p,fps={FPS},setsar=1[v]")
    ffmpeg("-loop", 1, "-framerate", FPS, "-i", art, "-stream_loop", -1, "-i", amb, "-filter_complex", graph,
           "-map", "[v]", "-an", "-frames:v", round(d * FPS), "-r", FPS, "-c:v", "libx264", "-preset", "veryfast",
           "-crf", 21, "-pix_fmt", "yuv420p", out)

def srt(level, voice, track):
    items = []
    for i, sc in enumerate(track["scenes"]):
        end = track["scenes"][i + 1]["startMs"] if i + 1 < len(track["scenes"]) else track["durationMs"]
        items += [str(i + 1), f"{stamp(sc['startMs'])} --> {stamp(end)}",
                  "\n".join(textwrap.wrap(DATA["scenes"][i][level], width=46, break_long_words=False)), ""]
    p = OUT / f"{level}_{voice}.srt"; p.write_text("\n".join(items), encoding="utf-8"); return p

def compose(level, voice, amb, tmp):
    track = TIMES[level][voice]; scenes = track["scenes"]; n = len(scenes)
    starts = [round(s["startMs"] / 1000 * FPS) / FPS for s in scenes]
    total = round(track["durationMs"] / 1000 * FPS) / FPS
    files = []
    for i, sc in enumerate(DATA["scenes"]):
        beg = 0 if i == 0 else starts[i] - FADE / 2
        end = total if i == n - 1 else starts[i + 1] + FADE / 2
        f = tmp / f"{level}_{voice}_{i}.mp4"
        clip(STORY / "media" / sc["art"], end - beg, amb[sc["id"]], f); files.append(f)
    args, flt = [], []
    for i, f in enumerate(files):
        args += ["-i", str(f)]; flt.append(f"[{i}:v]fps={FPS},format=yuv420p[v{i}]")
    prev = "v0"
    for i in range(1, n):
        flt.append(f"[{prev}][v{i}]xfade=transition=fade:duration={FADE:.6f}:offset={starts[i] - FADE / 2:.6f}[x{i}]"); prev = f"x{i}"
    sub = srt(level, voice, track)
    flt.append(f"[{prev}]subtitles={sub.as_posix()}:force_style='FontName=DejaVu Sans,FontSize=22,PrimaryColour=&H00FFFFFF,"
               f"OutlineColour=&H99000000,Outline=2,Shadow=1,Alignment=2,MarginV=38,WrapStyle=2',trim=duration={total:.6f},fps={FPS},format=yuv420p[v]")
    final = OUT / f"{level}_{voice}.mp4"
    ffmpeg(*args, "-i", STORY / "audio" / f"{level}_{voice}.mp3", "-filter_complex", ";".join(flt),
           "-map", "[v]", "-map", f"{n}:a:0", "-c:v", "libx264", "-preset", "veryfast", "-crf", "23",
           "-profile:v", "main", "-level:v", "3.1", "-r", FPS, "-pix_fmt", "yuv420p",
           "-c:a", "aac", "-b:a", "112k", "-ar", "44100", "-movflags", "+faststart", "-t", f"{total:.6f}", final)
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(final)]))
    assert abs(dur - track["durationMs"] / 1000) < 0.25, (level, voice, dur)
    print(f"{STORY.name} {level}/{voice}: {dur:.2f}s, {final.stat().st_size} bytes, dissolves={n - 1}", flush=True)

with tempfile.TemporaryDirectory(prefix="lesen-video-") as t:
    tmp = pathlib.Path(t)
    amb = {s["id"]: motion_overlay(s, tmp / ("m-" + s["id"])) for s in DATA["scenes"]}
    for level in TIMES:
        for voice in TIMES[level]:
            compose(level, voice, amb, tmp)

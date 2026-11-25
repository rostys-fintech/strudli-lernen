#!/usr/bin/env python3
"""Strudli Lernen — Devpost demo video renderer (1920x1080, 30 fps, H.264/AAC).

Story intro (day one in Germany, the numbers, Strudli says hello, the mission) → real-app walkthrough
(phone on the right, Strudli-style slide cards on the left, karaoke subtitles of the narrator) →
roadmap and final card. Every frame is drawn here at output size, so motion is smooth and steady.
Usage: python scripts/demo/compose.py demo-build reports/demo/strudli-demo.mp4 [dist]
Preview stills: DEMO_STILLS="day1:3,numbers:9" python scripts/demo/compose.py demo-build out.mp4
"""
import bisect, json, math, os, pathlib, subprocess, sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

B = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "demo-build")
OUT = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else "reports/demo/strudli-demo.mp4"); OUT.parent.mkdir(parents=True, exist_ok=True)
DIST = pathlib.Path(sys.argv[3] if len(sys.argv) > 3 else "dist")
CFG = json.loads((pathlib.Path(__file__).parent / "segments.json").read_text(encoding="utf-8"))
TL = json.loads((B / "timeline.json").read_text()) if (B / "timeline.json").exists() else None
DUR = json.loads((B / "voice" / "durations.json").read_text())
W, H, FPS = 1920, 1080, 30
AI_LIVE = bool(TL and TL.get("aiLive"))

# ---- Strudli design tokens (from the app's CSS) ----
CREAM, PAPER, WHITE = (255, 247, 237), (255, 250, 242), (255, 255, 255)
LINE, DEPTH = (228, 201, 173), (217, 178, 139)
RED, RED_DARK, GOLD = (153, 35, 61), (118, 32, 54), (232, 170, 61)
INK, MUTED, SOFT = (49, 37, 34), (118, 95, 85), (196, 176, 162)
DAS = (14, 173, 148)

def font_path(bold):
    names = (["liberation2/LiberationSans-Bold.ttf", "liberation/LiberationSans-Bold.ttf", "dejavu/DejaVuSans-Bold.ttf"] if bold else
             ["liberation2/LiberationSans-Regular.ttf", "liberation/LiberationSans-Regular.ttf", "dejavu/DejaVuSans.ttf"])
    for n in names:
        p = "/usr/share/fonts/truetype/" + n
        if os.path.exists(p): return p
    raise SystemExit("no font found")
_fonts = {}
def F(size, bold=True):
    k = (size, bold)
    if k not in _fonts: _fonts[k] = ImageFont.truetype(font_path(bold), size)
    return _fonts[k]

clamp = lambda x, a=0.0, b=1.0: max(a, min(b, x))
def ease(x): x = clamp(x); return 1 - (1 - x) ** 3
def back(x): x = clamp(x); c = 1.7; return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2

def asset(*names):
    for n in names:
        for root in (DIST, pathlib.Path("public")):
            p = root / n
            if p.exists(): return p
    return None

def cover(img, w, h):
    s = max(w / img.width, h / img.height); img = img.resize((round(img.width * s), round(img.height * s)), Image.LANCZOS)
    x, y = (img.width - w) // 2, (img.height - h) // 2
    return img.crop((x, y, x + w, y + h))

def card3d(w, h, fill=PAPER, radius=30, depth=9, line=LINE, under=DEPTH, shadow=True):
    """App-style card: soft shadow, a darker 'depth' edge underneath and a thin outline."""
    pad = 40
    img = Image.new("RGBA", (w + pad * 2, h + pad * 2 + depth), (0, 0, 0, 0))
    if shadow:
        sh = Image.new("L", img.size, 0)
        ImageDraw.Draw(sh).rounded_rectangle([pad + 6, pad + 18, pad + w - 6, pad + h + depth + 10], radius, fill=70)
        img.paste((110, 70, 45, 255), (0, 0), sh.filter(ImageFilter.GaussianBlur(18)))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([pad, pad + depth, pad + w, pad + h + depth], radius, fill=under)
    d.rounded_rectangle([pad, pad, pad + w, pad + h], radius, fill=fill, outline=line, width=2)
    return img, pad

def chip(text, fill=RED, color=WHITE, size=26):
    f = F(size); w = int(f.getlength(text)) + 44; h = size + 24
    img = Image.new("RGBA", (w, h + 4), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 4, w, h + 4], h // 2, fill=RED_DARK if fill == RED else DEPTH)
    d.rounded_rectangle([0, 0, w, h], h // 2, fill=fill)
    d.text((22, (h - size) // 2 - 2), text, font=f, fill=color)
    return img

def text_img(text, size, color, bold=True):
    f = F(size, bold); bb = f.getbbox(text)
    img = Image.new("RGBA", (int(f.getlength(text)) + 8, bb[3] + 12), (0, 0, 0, 0))
    ImageDraw.Draw(img).text((0, 0), text, font=f, fill=color); return img

def wrap(text, f, width):
    out, line = [], ""
    for w_ in text.split():
        t = (line + " " + w_).strip()
        if f.getlength(t) <= width: line = t
        else: out.append(line); line = w_
    if line: out.append(line)
    return out

def paste_alpha(base, img, xy, alpha=1.0):
    if alpha <= 0.003: return
    if alpha >= 0.997: base.alpha_composite(img, (int(xy[0]), int(xy[1]))); return
    a = img.getchannel("A").point(lambda v: int(v * alpha)); im = img.copy(); im.putalpha(a)
    base.alpha_composite(im, (int(xy[0]), int(xy[1])))

def scaled(img, s):
    return img.resize((max(1, int(img.width * s)), max(1, int(img.height * s))), Image.BILINEAR)

def load_rgba(p, max_side=None):
    if not p: return None
    im = Image.open(p).convert("RGBA")
    if max_side: im.thumbnail((max_side, max_side), Image.LANCZOS)
    return im

WORDMARK = load_rgba(asset("strudli/strudli-wordmark-transparent.webp"), 420)
HERO = load_rgba(asset("strudli/strudli-storybook-hero.webp", "strudli/strudli-storybook-hero.png"), 700)
POSES = load_rgba(asset("strudli/strudli-poses-approved-20261123.png"))
def pose(i, size):
    if not POSES: return None
    w = POSES.width // 4; p = POSES.crop((i * w, 0, (i + 1) * w, POSES.height)); p.thumbnail((size, size), Image.LANCZOS); return p

def berlin_photo():
    p = asset("strudli/berlin-gate-photo.jpg")
    if p: return Image.open(p).convert("RGB")
    svg = asset("strudli/berlin-hero.svg")  # local preview fallback
    if svg:
        png = B / "berlin-hero.png"
        if subprocess.run(["rsvg-convert", "-w", "2200", str(svg), "-o", str(png)]).returncode == 0: return Image.open(png).convert("RGB")
    return None

def script_text(key):
    sid, alt = (key[:-4], True) if key.endswith("_alt") else (key, False)
    s = next((x for x in CFG["scenes"] if x["id"] == sid), {})
    return s.get("altText" if alt else "text", "")

def _norm(w): return "".join(ch for ch in w.lower() if ch.isalnum())

def words_of(key):
    """Word timings from the voice service, re-attached to the script's own words (keeps punctuation)."""
    p = B / "voice" / f"{key}.words.json"
    words = json.loads(p.read_text()) if p.exists() else []
    tokens = script_text(key).split(); j = 0
    for w_ in words:
        n = _norm(w_["t"])
        for k in range(j, min(j + 4, len(tokens))):
            if n and _norm(tokens[k]).startswith(n[:3]):
                # one boundary can cover a token split by the TTS (e.g. "1.42") — keep the script spelling
                w_["t"] = tokens[k]; j = k + 1; break
    return words

# ---- karaoke subtitles from the voice service's word timings ----
class Subs:
    def __init__(self, key, start, width, size=34, lines=2):
        self.start, self.width, self.size = start, width, size
        words = words_of(key); f = F(size)
        self.chunks, cur = [], []
        for w_ in words:
            trial = " ".join(x["t"] for x in cur + [w_])
            if cur and len(wrap(trial, f, width - 56)) > lines: self.chunks.append(cur); cur = []
            cur.append(w_)
            if w_["t"].endswith((".", "?", "!")) and len(cur) > 3: self.chunks.append(cur); cur = []
        if cur: self.chunks.append(cur)
        if len(self.chunks) > 1 and len(self.chunks[-1]) <= 2:  # no lonely last word
            last = self.chunks.pop(); self.chunks[-1] = self.chunks[-1] + last
        self.cache = {}
    def frame(self, t):
        t -= self.start
        if not self.chunks or t < -0.1: return None, 0
        idx = 0
        for i, c in enumerate(self.chunks):
            if c[0]["a"] - 0.12 <= t: idx = i
        c = self.chunks[idx]
        if t > c[-1]["b"] + 0.9 and idx == len(self.chunks) - 1: return None, 0
        spoken = sum(1 for w_ in c if w_["a"] <= t)
        cur_on = spoken > 0 and t < c[spoken - 1]["b"] + 0.15
        key = (idx, spoken, cur_on)
        if key not in self.cache:
            f = F(self.size); lines, line = [], []
            for w_ in c:
                if line and f.getlength(" ".join(x["t"] for x in line + [w_])) > self.width - 56: lines.append(line); line = []
                line.append(w_)
            lines.append(line)
            h = len(lines) * (self.size + 14) + 34
            bw = int(max(f.getlength(" ".join(x["t"] for x in ln)) for ln in lines)) + 60
            img, pad = card3d(bw, h, fill=WHITE, radius=22, depth=6, shadow=False)
            d = ImageDraw.Draw(img); y = pad + 17; n = 0
            for ln in lines:
                x = pad + 28
                for w_ in ln:
                    n += 1
                    col = RED if (n == spoken and cur_on) else (INK if n <= spoken else SOFT)
                    d.text((x, y), w_["t"], font=f, fill=col); x += f.getlength(w_["t"] + " ")
                y += self.size + 14
            self.cache[key] = (img, pad)
        return self.cache[key], ease((t - (c[0]["a"] - 0.12)) / 0.22)

def draw_subs(img, subs, t, y, x=None):
    sub, ap = subs.frame(t)
    if sub: paste_alpha(img, sub[0], ((W - sub[0].width) / 2 if x is None else x - sub[1], y - sub[1] + 12 * (1 - ap)), ap)

# ---- scene writer ----
def render(name, dur, draw):
    tmp = B / f"{name}.part.mp4"; final = B / f"{name}.mp4"
    p = subprocess.Popen(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                          "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", "-r", str(FPS), "-g", "60", str(tmp)], stdin=subprocess.PIPE)
    for i in range(round(dur * FPS)):
        p.stdin.write(draw(i / FPS, dur).convert("RGB").tobytes())
    p.stdin.close(); p.wait()
    if p.returncode: raise SystemExit(f"ffmpeg failed for {name}")
    tmp.rename(final); return final

def fade_in(img, t, d=0.35, color=CREAM):
    a = clamp(t / d)
    return img if a >= 1 else Image.blend(Image.new("RGBA", img.size, color + (255,)), img, a)

def fade_out(img, t, dur, d=0.6, color=CREAM):
    a = clamp((dur - t) / d)
    return img if a >= 1 else Image.blend(Image.new("RGBA", img.size, color + (255,)), img, a)

def cream_bg():
    img = Image.new("RGBA", (W, H), CREAM + (255,)); d = ImageDraw.Draw(img)
    for y in range(H):
        k = y / H; d.line([(0, y), (W, y)], fill=(255, round(248 - 12 * k), round(238 - 26 * k), 255))
    return img
CREAM_BG = cream_bg()

def word_time(key, target, frac):
    for w_ in words_of(key):
        if w_["t"].strip(".,!?").lower().startswith(target.lower()): return w_["a"]
    return DUR[key] * frac

LEAD = 0.5  # voice starts 0.5 s into each title scene

def heading(img, t, chip_text, title, y=110):
    a = ease((t - 0.1) / 0.5)
    paste_alpha(img, chip(chip_text), (120, y + 20 * (1 - a)), a)
    paste_alpha(img, text_img(title, 76, INK), (120, y + 80 + 20 * (1 - a)), a)

# ---- title scenes ----
def scene_day1(key):
    photo = berlin_photo()
    big = cover(photo, int(W * 1.08), int(H * 1.08)) if photo else None
    shade = Image.new("RGBA", (W, H)); sd = ImageDraw.Draw(shade)
    for x in range(W): sd.line([(x, 0), (x, H)], fill=(25, 15, 15, int(200 - 95 * x / W)))
    bubbles = [("Haben Sie einen Termin?", 980, 150, 0.12), ("Bitte füllen Sie das Formular aus.", 1040, 300, 0.26),
               ("Nächster Halt: Hauptbahnhof.", 900, 450, 0.40), ("Wie bitte?", 1450, 600, 0.55), ("Integrationskurs: Warteliste", 1000, 740, 0.78)]
    imgs = []
    for i, (txt, x, y, fr) in enumerate(bubbles):
        f = F(38); w = int(f.getlength(txt)) + 60; h = 86; last = i == len(bubbles) - 1
        im, pad = card3d(w, h, fill=RED if last else WHITE, line=RED_DARK if last else LINE, under=RED_DARK if last else DEPTH, radius=26, depth=7)
        d = ImageDraw.Draw(im); d.text((pad + 30, pad + 22), txt, font=f, fill=WHITE if last else INK)
        d.polygon([(pad + 40, pad + h - 2), (pad + 72, pad + h - 2), (pad + 34, pad + h + 26)], fill=RED if last else WHITE)
        imgs.append((im, pad, x, y, LEAD + DUR[key] * fr))
    title1, title2 = text_img("Day 1", 150, WHITE), text_img("in Germany.", 72, (255, 225, 200))
    subs = Subs(key, LEAD, 1300, 36, 1)
    def draw(t, dur):
        if big:  # slow Ken Burns push, sub-pixel smooth via affine transform
            z = 1.0 + 0.06 * (t / dur); cw, ch = big.width / z, big.height / z
            img = big.transform((W, H), Image.AFFINE, (cw / W, 0, (big.width - cw) / 2, 0, ch / H, (big.height - ch) / 3), Image.BILINEAR).convert("RGBA")
        else: img = Image.new("RGBA", (W, H), (60, 40, 40, 255))
        img.alpha_composite(shade)
        a = ease((t - 0.2) / 0.6)
        paste_alpha(img, title1, (120, 190 + 30 * (1 - a)), a); paste_alpha(img, title2, (126, 370 + 30 * (1 - a)), a)
        for im, pad, x, y, ta in imgs:
            s = back((t - ta) / 0.4)
            if s <= 0.02: continue
            sc = scaled(im, s)
            paste_alpha(img, sc, (x - pad + (im.width - sc.width) / 2, y - pad + (im.height - sc.height) / 2), clamp(s))
        draw_subs(img, subs, t, 935)
        return fade_out(fade_in(img, t, color=(0, 0, 0)), t, dur, 0.4, color=(0, 0, 0))
    return draw

def scene_stats(key):
    data = [("1.42", " M", "Ukrainians live in Germany", "AZR · May 2026", 0.04, 2),
            ("1.2", " M", "people from Syria and Iraq", "AZR · 2025", 0.30, 1),
            ("129500", "", "people with no new integration-course place in 2026", "BAMF · Bundestag 2026", 0.62, 0)]
    cards = []
    for val, unit, label, src, fr, dec in data:
        im, pad = card3d(500, 400, radius=32); d = ImageDraw.Draw(im)
        for i, ln in enumerate(wrap(label, F(34, False), 430)): d.text((pad + 36, pad + 190 + i * 44), ln, font=F(34, False), fill=INK)
        d.text((pad + 36, pad + 340), src, font=F(22, False), fill=MUTED)
        cards.append((im, pad, float(val), unit, dec, LEAD + DUR[key] * fr))
    subs = Subs(key, LEAD, 1500, 34, 1)
    foot = text_img("+ 1.48 M arrivals in 2025 (Destatis). Most of them start with zero German.", 28, MUTED, False)
    def draw(t, dur):
        img = CREAM_BG.copy(); heading(img, t, "WHY IT MATTERS", "Millions start from zero.")
        for k, (im, pad, v, unit, dec, ta) in enumerate(cards):
            ap = ease((t - ta) / 0.55)
            if ap <= 0: continue
            frame = im.copy(); cur = v * ease((t - ta) / 1.2)
            txt = (f"{cur:.{dec}f}" if dec else f"{int(round(cur)):,}") + unit
            ImageDraw.Draw(frame).text((pad + 36, pad + 52), txt, font=F(104), fill=RED)
            paste_alpha(img, frame, (120 + k * 590 - pad, 340 - pad + 40 * (1 - ap)), ap)
        paste_alpha(img, foot, (120, 810), ease((t - LEAD - DUR[key] * 0.8) / 0.5))
        draw_subs(img, subs, t, 900)
        return fade_out(fade_in(img, t), t, dur, 0.35)
    return draw

def scene_mascot(key):
    words = words_of(key); f = F(54)
    FULL_LINES = max(1, len(wrap(" ".join(w_["t"] for w_ in words), f, 660)))
    glow = Image.new("L", (W, H), 0); ImageDraw.Draw(glow).ellipse([300, 120, 1100, 940], fill=130); glow = glow.filter(ImageFilter.GaussianBlur(90))
    bg = CREAM_BG.copy(); bg.paste((255, 214, 160), (0, 0), glow)
    if WORDMARK: bg.alpha_composite(WORDMARK, (120, 70))
    cache = {}
    def bubble(n):
        if n not in cache:
            shown = [w_["t"] for w_ in words[:n]]
            lines = wrap(" ".join(shown), f, 660) or [""]
            im, pad = card3d(740, 80 + 72 * FULL_LINES, fill=WHITE, radius=34); bd = ImageDraw.Draw(im)
            for i, ln in enumerate(lines): bd.text((pad + 40, pad + 40 + i * 72), ln, font=f, fill=INK)
            bd.polygon([(pad + 2, pad + 110), (pad - 38, pad + 160), (pad + 2, pad + 165)], fill=WHITE)
            cache[n] = (im, pad)
        return cache[n]
    def draw(t, dur):
        img = bg.copy()
        if HERO:
            s = back((t - 0.1) / 0.7); bob = math.sin((t - 0.8) * 2.6) * 8 * clamp(t - 0.8)
            img.alpha_composite(HERO, (360, int(250 + (1 - s) * 700 + bob)))
        tt = t - LEAD
        n = sum(1 for w_ in words if w_["a"] - 0.05 <= tt)
        if n:
            im, pad = bubble(n); a = ease(tt / 0.25); s = 0.9 + 0.1 * back(tt / 0.35)
            sc = scaled(im, s); paste_alpha(img, sc, (1080 - pad, 300 - pad + (im.height - sc.height) / 2), a)
        return fade_out(fade_in(img, t), t, dur, 0.35, color=RED)
    return draw

def scene_mission(key):
    chips = [("Free", word_time(key, "free", 0.45)), ("Any phone", word_time(key, "phone", 0.65)), ("Your language", word_time(key, "language", 0.9))]
    chip_imgs = [chip(c, fill=CREAM, color=RED, size=44) for c, _ in chips]
    thumbs = pose(3, 360)
    bg = Image.new("RGBA", (W, H), RED + (255,)); d = ImageDraw.Draw(bg)
    for i in range(7): d.line([(-300 + i * 420, H), (320 + i * 420, 0)], fill=(162, 42, 70, 255), width=110)
    if WORDMARK:
        wm = WORDMARK.copy(); wm.thumbnail((300, 110)); bg.alpha_composite(wm, (140, 90))
    lines = [text_img("Made by immigrants,", 118, WHITE), text_img("for immigrants.", 118, (255, 222, 170))]
    subs = Subs(key, LEAD, 1400, 34, 1)
    def draw(t, dur):
        img = bg.copy()
        for i, ln in enumerate(lines):
            a = ease((t - 0.25 - i * 0.35) / 0.55); paste_alpha(img, ln, (140 - 40 * (1 - a), 230 + i * 140), a)
        for i, ((c, ta), im) in enumerate(zip(chips, chip_imgs)):
            s = back((t - LEAD - ta) / 0.4)
            if s <= 0.02: continue
            sc = scaled(im, s); paste_alpha(img, sc, (140 + sum(c.width + 36 for c in chip_imgs[:i]), 600 + (im.height - sc.height) / 2), clamp(s))
        if thumbs:
            a = ease((t - 0.6) / 0.6); paste_alpha(img, thumbs, (1440, 470 + 30 * (1 - a)), a)
        draw_subs(img, subs, t, 900)
        return fade_out(fade_in(img, t, color=RED), t, dur, 0.35)
    return draw

def scene_roadmap(key):
    now_ = ["Українська", "English"]
    soon = [("Arabic", word_time(key, "arabic", 0.45)), ("Turkish", word_time(key, "turkish", 0.55)), ("Farsi", word_time(key, "farsi", 0.62))]
    extras = [("More levels: A2 → B1", word_time(key, "levels", 0.8)), ("More animated stories", word_time(key, "stories", 0.9))]
    subs = Subs(key, LEAD, 1400, 34, 1)
    def lang_card(name, done):
        im, pad = card3d(330, 120, fill=WHITE if done else PAPER, radius=26); d = ImageDraw.Draw(im)
        d.text((pad + 30, pad + 36), name, font=F(40), fill=INK if done else MUTED)
        if done:
            cx, cy = pad + 290, pad + 60; d.ellipse([cx - 22, cy - 22, cx + 22, cy + 22], fill=DAS)
            d.line([(cx - 11, cy), (cx - 3, cy + 9), (cx + 12, cy - 9)], fill=WHITE, width=6)
        else: d.text((pad + 232, pad + 46), "soon", font=F(26), fill=GOLD)
        return im, pad
    now_cards = [lang_card(n, True) for n in now_]; soon_cards = [lang_card(n, False) for n, _ in soon]
    extra_chips = [chip(n, size=34) for n, _ in extras]
    lbl_now, lbl_soon = text_img("Available now", 30, MUTED), text_img("Coming soon", 30, MUTED)
    small = None
    if HERO: small = HERO.copy(); small.thumbnail((360, 360))
    def draw(t, dur):
        img = CREAM_BG.copy(); heading(img, t, "WHAT'S NEXT", "More languages, more stories")
        a0 = ease((t - 0.3) / 0.4); paste_alpha(img, lbl_now, (120, 340), a0); paste_alpha(img, lbl_soon, (120, 570), a0)
        for i, (im, pad) in enumerate(now_cards):
            ap = ease((t - 0.4 - 0.15 * i) / 0.4); paste_alpha(img, im, (120 + i * 390 - pad, 390 - pad + 30 * (1 - ap)), ap)
        for i, ((im, pad), (_, ta)) in enumerate(zip(soon_cards, soon)):
            ap = ease((t - LEAD - ta + 0.1) / 0.4); paste_alpha(img, im, (120 + i * 390 - pad, 620 - pad + 30 * (1 - ap)), ap)
        for i, (im, (_, ta)) in enumerate(zip(extra_chips, extras)):
            ap = ease((t - LEAD - ta + 0.1) / 0.4); paste_alpha(img, im, (1320, 390 + i * 110 + 20 * (1 - ap)), ap)
        if small: paste_alpha(img, small, (1440, 600), ease((t - 0.5) / 0.6))
        draw_subs(img, subs, t, 900)
        return fade_out(fade_in(img, t), t, dur, 0.35)
    return draw

def scene_final(key):
    subs = Subs(key, LEAD, 1300, 34, 1)
    lines = [text_img("From immigrants,", 86, INK), text_img("for immigrants.", 86, INK), text_img("Willkommen in Deutschland.", 54, RED)]
    tag = chip("Free · Ukrainian & English today · more languages soon", fill=PAPER, color=RED_DARK, size=30)
    def draw(t, dur):
        img = CREAM_BG.copy()
        if HERO:
            s = back((t - 0.1) / 0.7); img.alpha_composite(HERO, (1120, int(190 + (1 - s) * 600 + math.sin(t * 2.4) * 6 * clamp(t - 0.8))))
        a = ease((t - 0.2) / 0.6)
        if WORDMARK: paste_alpha(img, WORDMARK, (140, 150 + 20 * (1 - a)), a)
        for i, (ln, y) in enumerate(zip(lines, (350, 450, 580))):
            ai = ease((t - 0.3 - 0.2 * i) / 0.6); paste_alpha(img, ln, (140, y + 30 * (1 - ai)), ai)
        paste_alpha(img, tag, (140, 700), ease((t - 1.0) / 0.6))
        return fade_out(fade_in(img, t), t, dur, 1.0)
    return draw

# ---- the real-app walkthrough ----
PH = 960; PW = round(PH * 780 / 1688); PX, PY = W - PW - 210, (H - PH) // 2
CARD_X, CARD_Y, CARD_W, CARD_H = 110, 150, 880, 560

def demo_bg():
    img = CREAM_BG.copy()
    sh = Image.new("L", (W, H), 0); ImageDraw.Draw(sh).rounded_rectangle([PX - 4, PY + 20, PX + PW + 4, PY + PH + 34], 60, fill=120)
    img.paste((110, 65, 45), (0, 0), sh.filter(ImageFilter.GaussianBlur(28)))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([PX - 16, PY - 16, PX + PW + 16, PY + PH + 16], 62, fill=(38, 28, 28), outline=(90, 70, 66), width=2)
    if WORDMARK:
        wm = WORDMARK.copy(); wm.thumbnail((260, 90)); img.alpha_composite(wm, (CARD_X, 44))
    d.text((CARD_X, H - 58), "Real app · real time · no speed-up", font=F(22, False), fill=MUTED)
    return img

def slide(seg, num, total):
    bullets = seg["altBullets"] if (seg["id"] == "ai" and not AI_LIVE and seg.get("altBullets")) else seg["bullets"]
    base, pad = card3d(CARD_W, CARD_H, radius=34); d = ImageDraw.Draw(base)
    base.alpha_composite(chip(f"{num:02d} / {total:02d} · {seg['chip']}", size=24), (pad + 44, pad + 44))
    y = pad + 120
    for ln in wrap(seg["title"], F(62), CARD_W - 96): d.text((pad + 44, y), ln, font=F(62), fill=INK); y += 74
    items = []; y += 26
    for b in bullets:
        im = Image.new("RGBA", (CARD_W - 80, 64), (0, 0, 0, 0)); bd = ImageDraw.Draw(im)
        bd.rounded_rectangle([0, 16, 22, 38], 6, fill=RED); bd.text((44, 8), b, font=F(36, False), fill=INK)
        items.append((im, 44, y - pad)); y += 66
    return base, pad, items

def scene_demo():
    fr = TL["frames"]; t0 = TL["start"]
    delays = sorted(r - s for _, s, r in fr) if fr and len(fr[0]) > 2 else [0]
    off = delays[len(delays) // 2] if abs(delays[len(delays) // 2]) < 30 else 0  # Chrome swap time → our clock
    times = [s + off - t0 for _, s, *_ in fr]; names = [n for n, *_ in fr]
    dur = TL["end"] - t0
    mask = Image.new("L", (PW, PH), 0); ImageDraw.Draw(mask).rounded_rectangle([0, 0, PW - 1, PH - 1], 48, fill=255)
    bg = demo_bg()
    demo = [s for s in CFG["scenes"] if s["kind"] == "demo"]
    segs = {s["id"]: s for s in TL["segments"]}
    slides = {s["id"]: slide(s, i + 1, len(demo)) for i, s in enumerate(demo)}
    subs = {s["id"]: Subs(s["id"] + ("_alt" if s["id"] == "ai" and not AI_LIVE and s.get("altText") else ""), segs[s["id"]]["start"] - t0 + 0.25, CARD_W, 32, 2)
            for s in demo if s["id"] in segs}
    cache = {"i": -1, "img": None}
    def phone(t):
        i = max(0, bisect.bisect_right(times, t) - 1)
        if i != cache["i"]:
            im = Image.open(B / "frames" / names[i]).convert("RGB")
            if im.size != (780, 1688): im = cover(im, 780, 1688)
            cache["img"] = im.resize((PW, PH), Image.LANCZOS); cache["i"] = i
        return cache["img"]
    order = [s["id"] for s in demo if s["id"] in segs]
    def draw(t, dur_):
        img = bg.copy(); img.paste(phone(t), (PX, PY), mask)
        for k, sid in enumerate(order):
            s0 = segs[sid]["start"] - t0
            s1 = (segs[order[k + 1]]["start"] - t0) if k + 1 < len(order) else dur + 1
            if not (s0 - 0.05 <= t < s1 + 0.3): continue
            base, pad, items = slides[sid]
            a_in = ease((t - s0) / 0.45); a_out = 1 - ease((t - s1) / 0.25) if t >= s1 else 1.0
            lift = 34 * (1 - a_in) - 20 * (1 - a_out)
            paste_alpha(img, base, (CARD_X - pad, CARD_Y - pad + lift), a_in * a_out)
            for j, (im, x, y) in enumerate(items):
                ab = ease((t - s0 - 0.35 - 0.2 * j) / 0.35) * a_out
                paste_alpha(img, im, (CARD_X + x - 14 * (1 - ab), CARD_Y + y + lift), ab)
            if t < s1: draw_subs(img, subs[sid], t, 790, CARD_X)
        return fade_in(img, t, 0.35)
    return dur, draw

# ---- build ----
TEMPLATES = {"day1": scene_day1, "stats": scene_stats, "mascot": scene_mascot, "mission": scene_mission, "roadmap": scene_roadmap, "final": scene_final}
TAIL = {"final": 2.2, "hello": 0.6}
def card_dur(s): return LEAD + DUR[s["id"]] + TAIL.get(s["id"], 0.9)

stills = os.environ.get("DEMO_STILLS")
if stills:
    for item in stills.split(","):
        sid, t = item.split(":"); t = float(t)
        if sid == "demo": dur, draw = scene_demo()
        else:
            s = next(x for x in CFG["scenes"] if x["id"] == sid); dur = card_dur(s); draw = TEMPLATES[s["template"]](sid)
        p = B / f"still_{sid}_{t:g}.jpg"; draw(t, dur).convert("RGB").save(p, quality=90); print(p)
    sys.exit(0)

files, cues, clock, demo_done = [], [], 0.0, False
for s in CFG["scenes"]:
    if s["kind"] == "card":
        dur = card_dur(s)
        files.append(render(s["id"], dur, TEMPLATES[s["template"]](s["id"])))
        cues.append((B / "voice" / f"{s['id']}.mp3", clock + LEAD, 1.0, None)); clock += dur
    elif not demo_done and TL:
        demo_done = True
        dur, draw = scene_demo(); files.append(render("demo", dur, draw)); t0 = TL["start"]
        segs = {x["id"]: x for x in TL["segments"]}
        for d in [x for x in CFG["scenes"] if x["kind"] == "demo" and x["id"] in segs]:
            key = d["id"] + ("_alt" if d["id"] == "ai" and not AI_LIVE and d.get("altText") else "")
            cues.append((B / "voice" / f"{key}.mp3", clock + segs[d["id"]]["start"] - t0 + 0.25, 1.0, None))
        for x in TL.get("sfx", []):
            seg = next((g for g in TL["segments"] if g["start"] - 0.5 <= x["at"] <= g.get("end", 1e12)), None)
            voice_end = (seg["start"] + 0.25 + DUR[seg["id"]] + 0.3) if seg else x["at"]
            duck = max(0.0, voice_end - x["at"])
            length = max(0.5, (x.get("until") or (seg["end"] if seg else x["at"] + 4)) - max(x["at"], t0))
            cues.append((pathlib.Path(x["file"]), clock + max(0.0, x["at"] - t0), x["volume"], (duck, length, max(0.0, t0 - x["at"]))))
        clock += dur
total = clock
(B / "list.txt").write_text("".join(f"file '{p.resolve()}'\n" for p in files))
subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(B / "list.txt"), "-c", "copy", str(B / "video.mp4")], check=True)

ain, af = [], []
for i, (path, at, vol, extra) in enumerate(cues):
    ain += ["-i", str(path)]
    ch = f"[{i + 1}:a]aresample=44100,aformat=channel_layouts=stereo"
    if extra:  # app sound: quiet under the narrator, then full, with soft edges
        duck, length, skip = extra
        ch += (f",atrim={skip:.3f}:{skip + length:.3f},asetpts=PTS-STARTPTS,"
               f"volume='if(lt(t,{duck:.2f}),{vol * 0.45:.3f},{min(1.0, vol * 2.6):.3f})':eval=frame,"
               f"afade=t=in:d=0.25,afade=t=out:st={max(0, length - 0.6):.2f}:d=0.6")
    ch += f",adelay={int(at * 1000)}|{int(at * 1000)}[a{i}]"; af.append(ch)
af.append("".join(f"[a{i}]" for i in range(len(cues))) + f"amix=inputs={len(cues)}:normalize=0:dropout_transition=0,alimiter=limit=0.95,apad,atrim=0:{total:.3f}[a]")
subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(B / "video.mp4"), *ain, "-filter_complex", ";".join(af),
                "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-t", f"{total:.3f}", str(OUT)], check=True)
d = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(OUT)]))
print(f"demo video: {OUT} {d:.1f}s, AI live in recording: {AI_LIVE}, {OUT.stat().st_size // 1024} KB")
if not 120 <= d <= 240: print(f"WARNING: Devpost needs 2–4 minutes, got {d:.1f}s")

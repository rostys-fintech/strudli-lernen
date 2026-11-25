#!/usr/bin/env python3
"""Find high-resolution, openly licensed replacement candidates for weak card photos (read-only).

Sources: Wikimedia Commons and Openverse (CC0 / CC BY / CC BY-SA / public domain only).
For every target card it downloads candidates at 1600 px, drops small, blurry or odd-shaped ones,
ranks the rest by sharpness and size, and writes one contact sheet per card plus candidates.json with
licence, author and source page for the credits. A person then picks one; nothing in the app changes.
Usage: python scripts/audit/find-photos.py reports/photo-candidates
"""
import io, json, math, pathlib, sys, time, urllib.parse, urllib.request
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageOps

OUT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "reports/photo-candidates"); OUT.mkdir(parents=True, exist_ok=True)
UA = {"User-Agent": "StrudliLernen-photo-audit/1.0 (https://github.com/rostys-fintech; educational app)"}
TARGETS = [
    ("verbs-805", "leben", "жити", ["family living at home living room", "people at home everyday life"]),
    ("verbs-820", "mögen", "подобатися", ["woman enjoying food smiling", "happy person eating"]),
    ("adjs-940", "fertig", "готовий", ["freshly baked cake ready", "finished cake on table"]),
    ("ww-new-183", "kurz", "короткий", ["short pencil", "pencil stub"]),
    ("ww-new-113", "Schwein", "свиня", ["domestic pig", "pig farm animal"]),
    ("travel-426", "Pass", "паспорт", ["German passport", "Reisepass Deutschland"]),
    ("verbs-852", "schließen", "закривати", ["hand closing door", "closing a door"]),
    ("home-384", "Pfanne", "сковорода", ["frying pan", "skillet pan kitchen"]),
    ("adverbs-176", "wirklich", "справді", ["surprised woman", "surprised face"]),
]
OK_LIC = ("cc0", "pdm", "by", "by-sa", "cc-by", "cc-by-sa", "public domain", "cc by", "cc by-sa", "cc-zero")

def get(url, timeout=30):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r: return r.read()

def commons(q):
    p = {"action": "query", "format": "json", "generator": "search", "gsrnamespace": "6", "gsrsearch": q + " filetype:bitmap",
         "gsrlimit": "25", "prop": "imageinfo", "iiprop": "url|size|extmetadata", "iiurlwidth": "1600"}
    data = json.loads(get("https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(p)))
    out = []
    for pg in (data.get("query", {}).get("pages", {}) or {}).values():
        ii = (pg.get("imageinfo") or [{}])[0]; md = ii.get("extmetadata", {})
        lic = (md.get("LicenseShortName", {}).get("value") or "").strip()
        artist = md.get("Artist", {}).get("value") or ""
        import re; artist = re.sub(r"<[^>]+>", "", artist).strip()[:80]
        out.append({"source": "Wikimedia Commons", "title": pg.get("title", ""), "img": ii.get("thumburl") or ii.get("url"),
                    "w": ii.get("width", 0), "h": ii.get("height", 0), "license": lic, "author": artist, "page": ii.get("descriptionurl", "")})
    return out

def openverse(q):
    p = {"q": q, "license_type": "commercial", "size": "large", "page_size": "20", "mature": "false"}
    data = json.loads(get("https://api.openverse.org/v1/images/?" + urllib.parse.urlencode(p)))
    return [{"source": "Openverse/" + (r.get("source") or ""), "title": r.get("title", ""), "img": r.get("url"), "w": r.get("width") or 0, "h": r.get("height") or 0,
             "license": ("CC " + (r.get("license") or "").upper() + " " + (r.get("license_version") or "")).strip(), "author": (r.get("creator") or "")[:80],
             "page": r.get("foreign_landing_url") or ""} for r in data.get("results", [])]

def sharp(im):
    g = np.asarray(ImageOps.fit(im.convert("L"), (512, 512), Image.LANCZOS), dtype=np.float32)
    lap = g[:-2, 1:-1] + g[2:, 1:-1] + g[1:-1, :-2] + g[1:-1, 2:] - 4 * g[1:-1, 1:-1]
    return float(lap.var())

def font(s, b=False):
    try: return ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans" + ("-Bold" if b else "") + ".ttf", s)
    except OSError: return ImageFont.load_default()

summary = {}
for cid, de, uk, queries in TARGETS:
    seen, cands = set(), []
    for q in queries:
        for fn in (commons, openverse):
            try: found = fn(q)
            except Exception as e: print("search failed", fn.__name__, q, e); found = []
            for c in found:
                if not c["img"] or c["img"] in seen: continue
                seen.add(c["img"])
                lic = c["license"].lower()
                if not any(k in lic for k in OK_LIC) or "nc" in lic or "nd" in lic: continue
                if min(c["w"], c["h"]) < 1000 or not (1.15 <= c["w"] / max(1, c["h"]) <= 1.9): continue
                cands.append(c)
            time.sleep(0.4)
    scored = []
    for c in cands[:28]:
        try:
            im = Image.open(io.BytesIO(get(c["img"], 40))); im = ImageOps.exif_transpose(im).convert("RGB")
        except Exception as e: continue
        if im.width > 1600: im = im.resize((1600, round(im.height * 1600 / im.width)), Image.LANCZOS)
        c["sharp"] = round(sharp(im), 1); c["got"] = list(im.size)
        f = OUT / "img" / f"{cid}-{len(scored) + 1:02d}.jpg"; f.parent.mkdir(exist_ok=True); im.save(f, quality=90); c["file"] = str(f)
        scored.append(c)
    scored.sort(key=lambda c: -c["sharp"])
    top = scored[:8]
    summary[cid] = {"de": de, "uk": uk, "candidates": top}
    if not top: continue
    tw, th, cols = 560, 380, 4; rows = math.ceil(len(top) / cols)
    sheet = Image.new("RGB", (cols * tw, 70 + rows * (th + 70)), (255, 247, 237)); d = ImageDraw.Draw(sheet)
    d.text((14, 18), f"{de} — {uk}  ({cid}): candidates", font=font(30, True), fill=(49, 37, 34))
    for i, c in enumerate(top):
        x, y = (i % cols) * tw, 70 + (i // cols) * (th + 70)
        sheet.paste(ImageOps.fit(Image.open(c["file"]), (tw - 10, th - 10), Image.LANCZOS), (x + 5, y + 5))
        d.text((x + 8, y + th + 2), f"{i + 1}. {c['w']}×{c['h']} · sharp {int(c['sharp'])}", font=font(18, True), fill=(153, 35, 61))
        d.text((x + 8, y + th + 26), f"{c['license'][:22]} · {c['author'][:34]}", font=font(15), fill=(118, 95, 85))
    sheet.save(OUT / f"{cid}.jpg", quality=86)
    print(cid, de, len(cands), "found,", len(top), "kept")
json.dump(summary, open(OUT / "candidates.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)

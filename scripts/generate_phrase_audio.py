#!/usr/bin/env python3
"""One natural recording per everyday phrase (Audio screen + phrase practice).

Browser speech synthesis on phones reads long phrases word by word; these clips are
whole utterances from a neural German voice (Microsoft Edge Read Aloud via edge-tts).
File name = FNV-1a 32-bit hash of the exact German text, so the app can find the clip
without a lookup table; src/phraseAudioManifest.json lists which hashes exist.
Provider terms must be reviewed before any public release.

Usage: python scripts/generate_phrase_audio.py
"""
import asyncio, json, pathlib, re, unicodedata
import edge_tts

ROOT = pathlib.Path(__file__).resolve().parents[1]
SRC = (ROOT / "src" / "everydayPhrases.ts").read_text(encoding="utf-8")
OUT = ROOT / "public" / "audio" / "phrases"; OUT.mkdir(parents=True, exist_ok=True)
MANIFEST = ROOT / "src" / "phraseAudioManifest.json"
VOICE, RATE, PITCH = "de-DE-KatjaNeural", "-6%", "+0Hz"

def key(text):
    h = 0x811C9DC5
    for b in unicodedata.normalize("NFC", text.strip()).encode("utf-8"):
        h = ((h ^ b) * 0x01000193) & 0xFFFFFFFF
    return f"{h:08x}"

rows = json.loads(re.search(r"const rows[^=]*=(\[[\s\S]*?\n\]);", SRC).group(1))
texts = sorted({r[1] for r in rows})

async def synth(text, path):
    for attempt in range(4):
        try:
            await edge_tts.Communicate(text, VOICE, rate=RATE, pitch=PITCH).save(str(path))
            if path.stat().st_size > 2000: return
        except Exception as e:
            print("retry", text, e)
        await asyncio.sleep(2 + attempt * 3)
    raise SystemExit(f"could not synthesise: {text}")

async def main():
    done = {}
    for t in texts:
        k = key(t); p = OUT / f"{k}.mp3"
        if not p.exists(): await synth(t, p)
        done[k] = t
    for stale in OUT.glob("*.mp3"):
        if stale.stem not in done: stale.unlink()
    MANIFEST.write_text(json.dumps({"voice": VOICE, "rate": RATE, "clips": dict(sorted(done.items()))},
                                   ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"{len(done)} phrase clips ready ({VOICE} {RATE})")

asyncio.run(main())

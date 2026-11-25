#!/usr/bin/env python3
"""Narration for the demo video: one MP3 per scene, its real word timings and durations.json.

Narrator: a multilingual neural voice (more natural intonation); the mascot has its own voice.
Word timings come from the voice service (WordBoundary), used for karaoke subtitles.
"""
import asyncio, json, pathlib, subprocess, sys
import edge_tts

ROOT = pathlib.Path(__file__).resolve().parent
OUT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "demo-build/voice"); OUT.mkdir(parents=True, exist_ok=True)
cfg = json.loads((ROOT / "segments.json").read_text(encoding="utf-8"))

async def speak(key, text, voice, rate):
    path = OUT / f"{key}.mp3"
    words = []
    for attempt in range(4):
        try:
            words, audio = [], bytearray()
            tts = edge_tts.Communicate(text, voice=voice, rate=rate, boundary="WordBoundary")
            async for item in tts.stream():
                if item["type"] == "audio": audio.extend(item["data"])
                elif item["type"] == "WordBoundary":
                    words.append({"t": item["text"], "a": round(item["offset"] / 1e7, 3), "b": round((item["offset"] + item["duration"]) / 1e7, 3)})
            path.write_bytes(bytes(audio)); break
        except Exception as e:
            print("retry", key, e); await asyncio.sleep(3 + attempt * 3)
    d = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)]))
    (OUT / f"{key}.words.json").write_text(json.dumps(words, ensure_ascii=False))
    return round(d, 3)

async def main():
    durations = {}
    for s in cfg["scenes"]:
        mascot = s.get("voice") == "mascot"
        v, r = (cfg["mascotVoice"], cfg["mascotRate"]) if mascot else (cfg["voice"], cfg["rate"])
        durations[s["id"]] = await speak(s["id"], s["text"], v, r)
        if s.get("altText"): durations[s["id"] + "_alt"] = await speak(s["id"] + "_alt", s["altText"], v, r)
    (OUT / "durations.json").write_text(json.dumps(durations, indent=1))
    print("voice:", durations, "total", round(sum(v for k, v in durations.items() if not k.endswith("_alt")), 1), "s")

asyncio.run(main())

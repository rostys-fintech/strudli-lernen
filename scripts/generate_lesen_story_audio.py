#!/usr/bin/env python3
"""Narration + real word timings for any cinematic Lesen story in the catalog.

Same approved Conrad settings as the first pilot (de-DE-ConradNeural, rate -13 %,
pitch -6 Hz, 570 ms between scenes). Uses Microsoft Edge Read Aloud voices through
edge-tts and the service's WordBoundary events, never guessed offsets.
Provider terms must be reviewed before any public release.

Usage: python scripts/generate_lesen_story_audio.py public/lesen-pilot/stories/<id>
Writes <story>/audio/{level}_{voice}.mp3 and <story>/timings.json.
"""
import asyncio, json, pathlib, re, sys, unicodedata
from pydub import AudioSegment
import edge_tts

STORY = pathlib.Path(sys.argv[1]).resolve()
DATA = json.loads((STORY / "story-data.json").read_text(encoding="utf-8"))
REQ = json.loads((STORY / "narrate.json").read_text(encoding="utf-8"))
AUDIO = STORY / "audio"; AUDIO.mkdir(exist_ok=True)
VOICES = {"conrad": ("de-DE-ConradNeural", "-13%", "-6Hz"),
          "killian": ("de-DE-KillianNeural", "-18%", "-3Hz")}
GAP_MS = int(REQ.get("scenePauseMs", 570))
SENTENCE_PAUSE = REQ.get("sentencePauseMs", {})  # e.g. {"a1": 450, "a2": 380}: storyteller pauses between sentences
SENT_RX = re.compile(r"(?<=[.!?])\s+")
WORD_RX = re.compile(r"[^\W_]+(?:['’\-][^\W_]+)*", re.UNICODE)

def clean(s):
    return re.sub(r"[^\w]", "", unicodedata.normalize("NFC", s).casefold())

def align(events, line, frame_ms):
    tokens = WORD_RX.findall(line)
    timed = [{"t": e.get("text", ""), "a": max(0, round(e["offset"] / 10000)),
              "b": max(0, round(e["offset"] / 10000)) + max(45, round(e.get("duration", 0) / 10000))}
             for e in events if e.get("type") == "WordBoundary" and clean(e.get("text", ""))]
    out, idx, exact = [], 0, 0
    for tok in tokens:
        target, j = clean(tok), idx
        while j < len(timed) and clean(timed[j]["t"]) != target and j < idx + 3:
            j += 1
        if j < len(timed) and clean(timed[j]["t"]) == target:
            item = dict(timed[j]); item["t"] = tok; out.append(item); idx = j + 1; exact += 1
        else:  # interpolate between neighbours; flagged so QA can see it
            a = out[-1]["b"] + 20 if out else 0
            out.append({"t": tok, "a": a, "b": min(frame_ms, a + 300), "estimated": True})
    return out, exact, len(tokens)

async def synth(text, voice, rate, pitch):
    tts = edge_tts.Communicate(text, voice=voice, rate=rate, pitch=pitch, boundary="WordBoundary")
    chunks, events = [], []
    async for item in tts.stream():
        if item["type"] == "audio": chunks.append(item["data"])
        elif item["type"] == "WordBoundary": events.append(item)
    if not chunks: raise RuntimeError("No audio for: " + text[:50])
    return b"".join(chunks), events

async def render(level, key):
    voice, rate, pitch = VOICES[key]
    scenes = DATA["story"]["scenes"]
    track = {"level": level.upper(), "voice": voice, "format": "mp3", "approximate": False, "scenes": []}
    audio, hits, total = AudioSegment.empty(), 0, 0
    pause = int(SENTENCE_PAUSE.get(level, 0))
    for i, scene in enumerate(scenes):
        start = len(audio); seg_all = AudioSegment.empty(); cues = []
        sentences = [x for x in SENT_RX.split(scene[level].strip()) if x] if pause else [scene[level]]
        for j, sentence in enumerate(sentences):
            mp3, events = await synth(sentence, voice, rate, pitch)
            tmp = AUDIO / f"_tmp_{level}_{key}_{i}_{j}.mp3"; tmp.write_bytes(mp3)
            seg = AudioSegment.from_file(tmp, format="mp3"); tmp.unlink()
            offset = len(seg_all)
            part, exact, n = align(events, sentence, len(seg))
            hits += exact; total += n
            for w in part:
                w["a"] = int(start + offset + w["a"]); w["b"] = int(start + offset + min(len(seg), max(w["b"], w["a"] - start - offset + 40)))
            cues += part
            seg_all += seg
            if j < len(sentences) - 1: seg_all += AudioSegment.silent(duration=pause, frame_rate=seg.frame_rate)
        frame = len(seg_all)
        track["scenes"].append({"id": scene["id"], "index": i, "startMs": start, "endMs": start + frame,
                                "text": scene[level], "words": cues})
        audio += seg_all
        if i < len(scenes) - 1: audio += AudioSegment.silent(duration=GAP_MS, frame_rate=seg_all.frame_rate)
    track["durationMs"] = len(audio); track["wordsCount"] = total
    track["matchRate"] = round(hits / max(1, total), 3); track["approximate"] = hits != total
    if track["matchRate"] < 0.9: raise RuntimeError(f"Word boundaries {hits}/{total} for {level} {key}")
    audio.export(AUDIO / f"{level}_{key}.mp3", format="mp3", bitrate="128k", parameters=["-ar", "44100"])
    print(f"{STORY.name} {level} {key}: {len(audio)} ms, boundaries {hits}/{total}", flush=True)
    return track

async def main():
    timings = {}
    for level in REQ.get("levels", ["a1", "a2"]):
        timings[level] = {}
        for key in REQ.get("voices", ["conrad"]):
            timings[level][key] = await render(level, key)
    (STORY / "timings.json").write_text(json.dumps(timings, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

if __name__ == "__main__":
    asyncio.run(main())

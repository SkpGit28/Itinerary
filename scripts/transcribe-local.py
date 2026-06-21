#!/usr/bin/env python3
"""
Fallback transcription using ffmpeg silence detection.
Produces the same JSON shape as the OpenAI Whisper API.
Real speech timing comes from silencedetect; words are AI-News topic words
so the downstream intent classifier picks appropriate motion templates.
"""
import subprocess, sys, json, re

wav_path = sys.argv[1]
topic    = sys.argv[2] if len(sys.argv) > 2 else "AI News"

# ── Get total duration ────────────────────────────────────────────────────────
probe = subprocess.run(
    ["ffprobe", "-v", "quiet", "-print_format", "json",
     "-show_streams", wav_path],
    capture_output=True, text=True, check=True
)
streams = json.loads(probe.stdout).get("streams", [{}])
total_duration = float(streams[0].get("duration", 10.0))

# ── Detect silence ────────────────────────────────────────────────────────────
detect = subprocess.run(
    ["ffmpeg", "-y", "-i", wav_path,
     "-af", "silencedetect=noise=-38dB:d=0.3",
     "-f", "null", "-"],
    capture_output=True, text=True
)
stderr = detect.stderr

silence_starts = [float(m) for m in re.findall(r"silence_start: (\S+)", stderr)]
silence_ends   = [float(m) for m in re.findall(r"silence_end: (\S+)",   stderr)]

# ── Build speech segments ─────────────────────────────────────────────────────
segments = []
prev_end = 0.0
for ss, se in zip(silence_starts, silence_ends):
    if ss - prev_end > 0.2:
        segments.append((prev_end, ss))
    prev_end = se
if total_duration - prev_end > 0.2:
    segments.append((prev_end, total_duration))

if not segments:
    segments = [(0.0, total_duration)]

# ── Topic-aware word bank (drives intent classification downstream) ────────────
WORD_BANK = {
    "AI News": [
        "artificial", "intelligence", "model", "released", "tool",
        "benchmark", "researchers", "code", "api", "platform",
        "50%", "trillion", "$10B", "step", "first",
    ],
    "default": [
        "update", "breaking", "news", "today", "latest",
        "feature", "launch", "app", "progress", "complete",
    ],
}
bank = WORD_BANK.get(topic, WORD_BANK["default"])

# ── Synthesise word-level timestamps ─────────────────────────────────────────
WORDS_PER_SECOND = 2.5
words = []
bank_idx = 0
for (start, end) in segments:
    dur = end - start
    n   = max(1, round(dur * WORDS_PER_SECOND))
    step = dur / n
    for i in range(n):
        w_start = round(start + i * step, 3)
        w_end   = round(w_start + step * 0.85, 3)
        words.append({"word": bank[bank_idx % len(bank)], "start": w_start, "end": w_end})
        bank_idx += 1

text = " ".join(w["word"] for w in words)
out  = {"text": text, "duration": total_duration, "words": words}
print(json.dumps(out))

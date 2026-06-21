---
name: video
description: >
  Use when the user wants to create a motion-graphic video, Instagram Reel,
  TikTok, or YouTube video from a voiceover or video file. Runs the full
  8-step pipeline: audio extraction → Whisper transcription → silence removal
  → scene planning → template selection → render → audio mux → concat → final.mp4.
  User must supply: an audio/video file, a topic/description, and a target
  platform (reel, tiktok, or youtube). Do not use for pure code tasks unrelated
  to video creation.
metadata:
  { "tags": "video, motion-graphics, reel, tiktok, youtube, whisper, ffmpeg, hyperframes, pipeline" }
---

# /video — Motion-Graphic Video Pipeline

You are running the full motion-graphic video pipeline for this project.
All tools (ffmpeg, Node.js, Puppeteer, OpenAI) are pre-installed.
All scripts live in `scripts/`. The template library is in `motion-pack/`.

---

## Before you start — collect inputs

If the user hasn't provided all three, ask once:

1. **File** — an audio (MP3/WAV/M4A) or video (MP4/MOV) file path or upload
2. **Topic** — what the video is about (drives template selection and any generated scenes)
3. **Platform** — `reel` (1080×1920) · `tiktok` (1080×1920) · `youtube` (1920×1080)

Once you have all three, proceed without asking further questions.

---

## Pipeline — run end to end

Execute all 8 steps. Do not pause between steps unless a step fails.

### Step 1 — Prepare audio

If the input is a video file, extract mono 16kHz WAV:
```bash
ffmpeg -y -i "<input>" -vn -ac 1 -ar 16000 output/audio.wav
```
If it's already an audio file, convert to WAV:
```bash
ffmpeg -y -i "<input>" -ac 1 -ar 16000 output/audio.wav
```

### Step 2 — Transcribe with Whisper

```bash
node -e "
require('dotenv').config();
const { transcribeAudio } = require('./scripts/transcribe');
const fs = require('fs');
transcribeAudio('output/audio.wav').then(t => {
  fs.mkdirSync('output', { recursive: true });
  fs.writeFileSync('output/transcript.json', JSON.stringify(t, null, 2));
  console.log('Words:', t.words.length);
  console.log('Text:', t.text.slice(0, 200));
});
"
```

### Step 3 — Strip dead air

```bash
ffmpeg -y -i output/audio.wav \
  -af "silenceremove=start_periods=1:start_silence=0.3:start_threshold=-38dB:stop_periods=-1:stop_duration=0.6:stop_threshold=-38dB" \
  output/audio-trim.wav
```

Then re-transcribe the trimmed file:
```bash
node -e "
require('dotenv').config();
const { transcribeAudio } = require('./scripts/transcribe');
const fs = require('fs');
transcribeAudio('output/audio-trim.wav').then(t => {
  fs.writeFileSync('output/transcript-trimmed.json', JSON.stringify(t, null, 2));
  console.log('Trimmed words:', t.words.length);
});
"
```

### Step 4 — Plan scenes

```bash
node -e "
const { planScenes } = require('./scripts/plan-scenes');
const fs = require('fs');
const t = JSON.parse(fs.readFileSync('output/transcript-trimmed.json'));
const scenes = planScenes(t, '<TOPIC>');
fs.writeFileSync('output/scenes.json', JSON.stringify(scenes, null, 2));
scenes.forEach((s,i) => console.log(i+1 + '. [' + s.intent + '] ' + s.phrase + ' (' + s.duration + 's)'));
"
```

Read `output/scenes.json`. Review the scenes — if any phrase is poorly split or the intent is wrong, edit the JSON directly before proceeding.

### Step 5-7 — Render each scene and mux audio

Run the full pipeline script which handles steps 5-7 automatically:
```bash
node scripts/pipeline.js --input "<original-input-file>" --topic "<TOPIC>" --platform <PLATFORM>
```

This renders each scene to MP4, muxes the audio segment, and saves to `output/scene-XX.mp4`.

**If the pipeline runs the full 8 steps automatically**, it will output `output/final.mp4` — skip to the "Done" section below.

**If you need to render scenes individually** (e.g. one failed), use:
```bash
# Render a single scene HTML to silent MP4
node motion-pack/render-scene.js <template.html> <output.mp4> <duration> <width> <height>

# Mux audio onto it
ffmpeg -y -i <silent.mp4> -i <scene.wav> \
  -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 192k -shortest <final-scene.mp4>
```

### Step 8 — Concatenate

```bash
# Build concat list
ls output/scene-*.mp4 | sort | awk '{print "file '"'"'" $0 "'"'"'"}' > output/concat.txt

ffmpeg -y -f concat -safe 0 -i output/concat.txt \
  -vf "fps=30,scale=<WIDTH>:<HEIGHT>:flags=lanczos" \
  -c:v libx264 -pix_fmt yuv420p -crf 17 -preset slow \
  -c:a aac -b:a 192k -movflags +faststart output/final.mp4
```

---

## Template selection guide

When `scripts/select-template.js` picks a template, it maps `scene.intent` to:

| Intent | Template |
|---|---|
| `waveform` | `motion-pack/templates/01-audio-waveform/scene.html` |
| `message` | `motion-pack/templates/02-imessage-notification/scene.html` |
| `map` | `motion-pack/templates/03-apple-maps-route/scene.html` |
| `trash` | `motion-pack/templates/04-wastebasket-trash/scene.html` |
| `app-icons` | `motion-pack/templates/06-app-icon-launcher/scene.html` |
| `terminal` | `motion-pack/templates/07-typewriter-terminal/scene.html` |
| `toggle` | `motion-pack/templates/08-toggle-flip/scene.html` |
| `stat` | `motion-pack/templates/09-stat-counter/scene.html` |
| `progress` | `motion-pack/templates/10-progress-bar/scene.html` |

If no template fits, `scripts/generate-template.js` calls GPT-4o to write a fresh GSAP HTML scene and saves it to `output/templates/<slug>.html`.

**You can also override a template for any scene** — open the HTML file, edit the content (text, numbers, colors), and re-render that scene only.

---

## Brand tokens (always apply to generated templates)

```
background:   #0A0808  (ink)
body text:    #EDD9BC  (cream)
accent:       #D97757  (coral)
success green:#4CD964
success blue: #4080F0
font:         -apple-system, "Inter", sans-serif
monospace:    "JetBrains Mono", ui-monospace
bg pattern:   topographic SVG lines (stroke #362A22, opacity 0.35)
```

---

## Face-cam composite (optional)

If the user provides face-cam footage and wants graphics overlaid:
```bash
node scripts/overlay.js --face <face-cam.mp4> --graphics output/final.mp4 \
  --output output/composite.mp4 --platform <PLATFORM>
```

IG safe zones: keep graphics out of top 220px and bottom 420px.
Never place graphics over the user's face — lower half only (y > 1100 in 1080×1920).

---

## IG safe zones (vertical platforms)

```
Top    0–220px   → reserved: handle + follow button
Bottom 1500–1920px → reserved: captions, likes, comments
Safe zone: 220px–1500px
```

---

## Common pitfalls — never repeat these

1. `ffmpeg` overlay without `-map 0:v:0 -map 1:a:0` → wrong stream selected
2. `silenceremove` on audio with no silence → shifts timing, breaks lip-sync. Only apply to body audio, not intros/outros
3. GSAP `tl.from()` on `opacity:0` elements → reverts to 0 after animation. Always use `fromTo()`
4. Infinite `yoyo` tweens on the main timeline → drifts the playhead. Put them on `gsap.to()` directly
5. Placing key content in IG safe zones → covered by UI chrome

---

## Done

When `output/final.mp4` exists:
1. Tell the user the video is ready with scene count and duration
2. Send the file: `output/final.mp4`
3. Offer to: adjust any scene, change a template, re-render at a different platform size, or add face-cam composite

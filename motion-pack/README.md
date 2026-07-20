# IBRAVIZ Motion Pack

**10 IBRA-original templates + access to ~115 total** across the HyperFrames ecosystem. All HTML/CSS/GSAP, all free, all renderable from Claude Code.

Stop paying for CapCut / Premiere / After Effects. Drop these into your Claude Code session, paste the prompt, ship the video.

📋 **See `CATALOG.md`** for the full 115-template inventory (HyperFrames built-in catalog + community kits + this pack).

---

## What's inside

| # | Template | Best for | Aspect |
|---|---|---|---|
| 01 | Audio waveform reactive | Voiceover hooks, podcasts, music | 9:16 |
| 02 | iMessage notification stack | Social proof, "DM moments" | 9:16 |
| 03 | Apple Maps route reveal | Location reveals, "here's where" | 9:16 |
| 04 | Wastebasket trash logos | "You don't need X" hooks | 9:16 |
| 05 | Claude bloom + step chips | Solution reveals, CTAs | 9:16 |
| 06 | App icon launcher grid | Stack/tool intro | 9:16 |
| 07 | Typewriter terminal | Code reveals, dev content | 9:16 |
| 08 | iOS toggle flip | "Turn this on" moments | 9:16 |
| 09 | Big stat counter | Numbers that hit, social proof | 9:16 |
| 10 | Progress bar + steps | Process walkthroughs | 9:16 |

All templates: **1080×1920 vertical**, **30fps**, brand palette **ink #0A0808 / cream #EDD9BC / coral #D97757**.

To render landscape (1920×1080) for YouTube: change `width: 1080px; height: 1920px;` to `width: 1920px; height: 1080px;` in the HTML and rerun.

---

## Requirements

- **Node.js** 18+
- **ffmpeg** (`brew install ffmpeg`)
- **Puppeteer** (`npm install puppeteer`) — or use HyperFrames CLI

That's it.

---

## Quick start

```bash
# 1. Render one template to MP4
node render-scene.js templates/01-audio-waveform/scene.html output/01.mp4 3.0

# Args: <html> <output.mp4> <duration-seconds>
```

The script:
1. Loads the HTML in headless Chrome (Puppeteer)
2. Pauses the GSAP timeline
3. Steps frame-by-frame and screenshots each at 30fps
4. Encodes the PNG sequence to H.264 MP4 via ffmpeg

For an audio-driven video, see `prompt.md` — that's the paste-into-Claude-Code workflow that handles transcription + scene picking + rendering + stitching end-to-end.

---

## The prompt

Open `prompt.md` and paste it into Claude Code with your voiceover MP3. Claude picks scenes, renders them, muxes audio, and ships the final MP4.

---

## How HyperFrames + Remotion fit in

- **HyperFrames** ([github.com/heygen-com/hyperframes](https://github.com/heygen-com/hyperframes)) — the official HeyGen tool that does what `render-scene.js` does, but better (frame streaming, AI-agent flags). Drop-in replacement. Recommended for production.
- **Remotion** ([remotion.dev](https://www.remotion.dev/)) — React-based video composition. Ships as a Claude Code skill — Claude knows how to use it. Best for stitching multiple scenes + audio into a final film.

Both are free, both open source.

---

## License & attribution

- All 10 templates in this pack: **MIT** — use commercially, modify, redistribute. No attribution required but appreciated (tag [@ibraviz.ai](https://instagram.com/ibraviz.ai)).
- App icons (CapCut, Premiere Pro, After Effects, Claude) used in template 04/05 are real brand assets used under nominative fair use for tutorial purposes. Don't reuse the assets outside this educational context.
- For 12 more templates from a different creator: [nateherkai/hyperframes-student-kit](https://github.com/nateherkai/hyperframes-student-kit) (MIT licensed).

---

## Made by

[@ibraviz.ai](https://instagram.com/ibraviz.ai) — daily Claude Code + AI design content.

# The Prompt — paste this into Claude Code

> Open Claude Code → paste the block below → tell Claude what video you want and where the voiceover is. Claude does the rest.

---

```
You're going to build me a motion-graphic video using only free tools — no Premiere, no After Effects, no CapCut.

STACK
- HyperFrames (github.com/heygen-com/hyperframes) — renders HTML to MP4
- Remotion skill (you already have this loaded) — for stitching
- OpenAI Whisper API for transcription
- ffmpeg for muxing

REPO LAYOUT
The "ibraviz-motion-pack" folder has:
- templates/ — 10 IBRA-original HTML scenes ready to render
- CATALOG.md — index of ~115 total templates across the HyperFrames ecosystem
- README.md — usage docs
- render-scene.js — universal renderer

If a built-in HyperFrames component fits the spoken phrase better than my 10 templates, install it:
  npx hyperframes add <component-name>

Examples of HyperFrames built-in components you can pull on demand:
- spotify-now-playing, x-post-card, reddit-post-card, instagram-follow, tiktok-follow
- ios-26-liquid-glass-home-screen, macos-tahoe-liquid-glass-desktop
- nyc-paris-flight, us-map, world-map (with rotating globe)
- caption-pill-karaoke, caption-kinetic-slam, caption-glitch-rgb (TikTok-style captions)
- flash-through-white, glitch, whip-pan (shader transitions)
- vfx-text-cursor, liquid-background, 3d-ui-reveal (heavy visual moments)
- logo-outro (cinematic logo reveal)
- apple-money-count ($0→$X counter)
- data-chart, flowchart (data viz)

Browse the full catalog: https://hyperframes.heygen.com/catalog

WORKFLOW

1. I'll provide:
   - An MP3 voiceover
   - A topic / description of the video
   - Target platform (IG Reel 1080x1920 / YouTube 1920x1080 / TikTok)

2. Transcribe the MP3 with Whisper. Get word-level timestamps.

3. Break the transcript into logical scenes (one scene per spoken idea, usually 3–8 seconds each).

4. For each scene, either:
   a) Pick a template from templates/ that fits the spoken phrase, OR
   b) Write a fresh HTML/CSS/GSAP scene that matches the phrase exactly

5. Render each scene to its own MP4:
   - Use HyperFrames CLI if available, otherwise use templates/render-scene.js
   - Match scene duration to the spoken phrase duration
   - Mux the corresponding audio segment

6. Stitch all scenes together with Remotion (or ffmpeg concat as fallback).

7. Output: final.mp4 — ready to post.

BRAND
- Background: ink #0A0808 with subtle topographic line pattern
- Body text: cream #EDD9BC
- Accent: coral #D97757
- Highlight green: #4CD964
- Success blue: #4080F0
- Font: -apple-system, Inter, JetBrains Mono for monospace

PLACEMENT RULES (CRITICAL for face-on-camera videos)
- IG Reel top 220px: reserved for handle/follow button — keep graphics out
- IG Reel bottom 420px: reserved for caption/like/comment — keep graphics out
- If my face is in the video: place graphics in the lower-half ONLY, below my chin (typically y > 1100 in 1080×1920 frame)
- Logos that "fly in" should arc through open space, never cross my face

CONSTRAINTS
- All output: H.264, yuv420p, 30fps
- Audio: AAC 192k 48kHz
- Vertical: 1080×1920 — Landscape: 1920×1080
- Render at full quality (CRF 17–18, preset slow)
- No paid tools, no APIs that need a credit card beyond OpenAI Whisper

—————————————————————
NOW BUILD ME THIS VIDEO:

Topic: [WHAT THE VIDEO IS ABOUT]
Voiceover: [PATH TO MP3]
Platform: [IG Reel / YouTube / TikTok]
Notes: [ANY SPECIFIC SCENES / VISUAL CALLOUTS]
```

---

## Tips

- For voiceovers under 30s, use 5–8 scenes
- Cut scenes hard, don't crossfade (TikTok/IG algorithm rewards fast cuts)
- Match the visual to the spoken phrase EXACTLY — every word should have a visual moment
- Test the first scene before rendering the whole thing
- If a logo or app icon is in your video, get it from the iOS App Store iTunes API or Wikimedia Commons — don't draw from memory

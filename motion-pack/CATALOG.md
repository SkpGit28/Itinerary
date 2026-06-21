# Full Motion Graphics Catalog

This pack ships with 10 IBRA-original templates. But you have access to **~115 motion graphic templates total** through the HyperFrames ecosystem. Here's the full map.

---

## 1. This pack (10 templates) — already in `templates/`

| # | Template | Use case |
|---|---|---|
| 01 | Audio waveform reactive | Voiceover hooks, podcasts |
| 02 | iMessage notification stack | Social proof, DM moments |
| 03 | Apple Maps route reveal | Location reveals |
| 04 | Wastebasket trash logos | "You don't need X" hooks |
| 05 | Claude bloom + step chips | Solution reveals, CTAs |
| 06 | App icon launcher grid | Tool stack intro |
| 07 | Typewriter terminal | Code/dev reveals |
| 08 | iOS toggle flip | "Turn this on" moments |
| 09 | Big stat counter | Numbers that hit |
| 10 | Progress bar + steps | Process walkthroughs |

---

## 2. HyperFrames official catalog (~80 components)

Install any with `npx hyperframes add <component-name>`.

### Blocks (24) — full app UIs and brand moments

| Component | What it is |
|---|---|
| `app-showcase` | Fitness app showcase with 3 floating smartphone screens |
| `apple-money-count` | $0→$10,000 counter, flashes green, bursts money icons |
| `data-chart` | Animated bar + line chart, NYT-style typography |
| `flowchart` | Decision tree with SVG connectors, sticky-note nodes |
| `instagram-follow` | Animated IG follow overlay with profile card |
| `ios-26-liquid-glass-home-screen` | 3D iPhone with iOS 26 home screen + liquid glass icons |
| `liquid-glass-context-menu` | Frosted glass context menu over aurora shader |
| `liquid-glass-media-controls` | Frosted glass media controls over aurora shader |
| `liquid-glass-notification` | Frosted glass notification cards over aurora shader |
| `liquid-glass-widgets` | Frosted glass stat cards / showcase panels |
| `logo-outro` | Cinematic logo reveal, piece-by-piece assembly + glow |
| `macos-notification` | macOS notification banner with app icon |
| `macos-tahoe-liquid-glass-desktop` | 3D MacBook with macOS Tahoe desktop, glass menu bar |
| `north-korea-locked-down` | Map zoom into NK with red scribble + pop-up |
| `nyc-paris-flight` | Apple-style map with plane flying NYC→Paris |
| `reddit-post-card` | Animated Reddit post with upvotes + comments |
| `spotify-now-playing` | Animated Spotify now-playing card with progress bar |
| `tiktok-follow` | Animated TikTok follow overlay with profile card |
| `x-post-card` | X/Twitter post card with engagement metrics |
| `youtube-lower-third` | YouTube subscribe lower third with avatar |
| `iphone-macbook-3d-showcase` | GLTF iPhone 15 Pro + MacBook with live HTML screens |
| `vpn-youtube-spot` | Snappy Apple-style YouTube ad insert |
| `blue-sweater-intro-video` | AI creator intro that resolves into X follow card |

### Shader transitions (14) — between-scene effects

```
chromatic-radial-split  cinematic-zoom    cross-warp-morph
domain-warp-dissolve    flash-through-white  glitch
gravitational-lens      light-leak        ridged-burn
ripple-waves            sdf-iris          swirl-vortex
thermal-distortion      whip-pan
```

### Caption / text components (16) — animated captions per word

```
caption-blend-difference     caption-clip-wipe       caption-editorial-emphasis
caption-emoji-pop            caption-glitch-rgb      caption-gradient-fill
caption-highlight            caption-kinetic-slam    caption-matrix-decode
caption-neon-accent          caption-neon-glow       caption-parallax-layers
caption-particle-burst       caption-pill-karaoke    caption-texture
caption-weight-shift
```

### Effect overlays (7)

```
grain-overlay      grid-pixelate-wipe     parallax-unzoom
parallax-zoom      shimmer-sweep          texture-mask-text     vignette
```

### VFX composition blocks (6)

```
liquid-background      magnetic       portal
shatter                vfx-text-cursor      3d-ui-reveal
```

### Map visualizations (6)

```
spain-map     us-map        us-bubble-map
us-flow-map   us-hex-grid-map     world-map
```

### Transition collection showcases (13) — full demos of category styles

```
3d-transitions   blur-transitions   cover-transitions   destruction-transitions
dissolve-transitions   distortion-transitions   grid-transitions
light-transitions   mechanical-transitions   push-transitions
radial-transitions   scale-transitions   other-transitions
```

How to use any of these in a Claude Code session:
```bash
cd your-project
npx hyperframes add spotify-now-playing
# Component lands in ./compositions/ — edit, render, ship
```

Full catalog: https://hyperframes.heygen.com/catalog

---

## 3. Community kits

### `nateherkai/hyperframes-student-kit` (12 templates, MIT)

12 finished motion graphics videos with full source. Clone:
```bash
git clone https://github.com/nateherkai/hyperframes-student-kit
```
Includes:
- `clickup-demo` — 60s SaaS product demo
- `linear-promo-30s` — 30s promo in Infinite Payments aesthetic
- `hyperframes-sizzle` — HyperFrames × Claude Code reel
- `first-agent-promo` — 32s AI agent launch film
- `aisoc-lesson-5-1` — Lesson with face-cam + motion graphics
- `aisoc-hype` — 30s brand hype film
- `aisoc-app-release` — 30s mobile app release
- `golden-ratio-demo` — Proportion + layout instruction
- `claude-edit-intro` — Editing workflow promo
- `may-shorts-6`, `may-shorts-18`, `may-shorts-19` — Shorts variants

### `robonuggets/hyperframes-helper` (10 recipes + scripts, CC BY 4.0)

Production patterns + Python helper scripts. Clone:
```bash
git clone https://github.com/robonuggets/hyperframes-helper
```
Includes:
- 10 copy-paste motion graphics recipes
- `silence-cut.sh` — ffmpeg silence trimming
- `transcribe-whisper.py` — word-level Whisper transcription
- `cut-retakes.py` — retake removal automation
- SKILL.md with workflow + 16 lint fixes

### `heygen-com/hyperframes-cloudflare-template`

Official server-side render template for Cloudflare Workers + Containers. Lets you preview HTML compositions in the browser and render MP4s on a serverless backend. Use if you want a deployed render API.

---

## Total inventory

**~115 ready-to-use templates** across the ecosystem:
- 10 in this pack
- ~80 in HyperFrames built-in catalog
- 12 in nateherkai's student-kit
- 10 in robonuggets' helper recipes
- +3 official template starter repos

Pick what you need, swap brand tokens, render. Done.

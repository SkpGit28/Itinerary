// Universal render script for any template in this pack.
// Usage: node render-scene.js <html-path> <output.mp4> <duration-seconds>
//
// Example: node render-scene.js templates/01-audio-waveform/scene.html output/01.mp4 3.0

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Optional args: node render-scene.js <html> <output.mp4> <durationSec> [width] [height]
const [,, htmlArg, outArg, durArg, wArg, hArg] = process.argv;
if (!htmlArg || !outArg || !durArg) {
  console.error("usage: node render-scene.js <html> <output.mp4> <durationSec> [width] [height]");
  process.exit(1);
}

const HTML_PATH = path.resolve(htmlArg);
const OUT_PATH = path.resolve(outArg);
const DURATION = parseFloat(durArg);
const FPS = 30;
const WIDTH  = wArg ? parseInt(wArg, 10) : 1080;
const HEIGHT = hArg ? parseInt(hArg, 10) : 1920;
const TOTAL_FRAMES = Math.round(DURATION * FPS);
const FRAMES_DIR = path.join(path.dirname(OUT_PATH), ".frames-" + path.basename(OUT_PATH, ".mp4"));

// Read GSAP, D3, topojson from local node_modules — no CDN needed
const GSAP_PATH     = path.resolve(__dirname, "../node_modules/gsap/dist/gsap.min.js");
const D3_PATH       = path.resolve(__dirname, "../node_modules/d3/dist/d3.min.js");
const TOPOJSON_PATH = path.resolve(__dirname, "../node_modules/topojson-client/dist/topojson-client.min.js");
const GSAP_SRC      = fs.existsSync(GSAP_PATH)     ? fs.readFileSync(GSAP_PATH, "utf8")     : null;
const D3_SRC        = fs.existsSync(D3_PATH)        ? fs.readFileSync(D3_PATH, "utf8")        : null;
const TOPOJSON_SRC  = fs.existsSync(TOPOJSON_PATH)  ? fs.readFileSync(TOPOJSON_PATH, "utf8")  : null;

(async () => {
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  if (fs.existsSync(FRAMES_DIR)) fs.rmSync(FRAMES_DIR, { recursive: true });
  fs.mkdirSync(FRAMES_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 },
  });
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });

  // Block CDN requests and inject libraries locally instead
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    const u = req.url();
    if ((u.includes("gsap") && GSAP_SRC) ||
        (u.includes("/d3") && D3_SRC) ||
        (u.includes("topojson") && TOPOJSON_SRC)) {
      req.abort();
    } else {
      req.continue();
    }
  });

  await page.goto("file://" + HTML_PATH, { waitUntil: "networkidle0" });

  // Inject local libraries in dependency order
  if (D3_SRC)       await page.evaluate(D3_SRC);
  if (TOPOJSON_SRC) await page.evaluate(TOPOJSON_SRC);
  if (GSAP_SRC)     await page.evaluate(GSAP_SRC);

  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => { if (window.gsap) gsap.globalTimeline.pause(); });

  // Re-run the scene's inline <script> so GSAP timelines register after gsap is available
  await page.evaluate(() => {
    const scripts = document.querySelectorAll("script:not([src])");
    scripts.forEach(s => {
      try { (new Function(s.textContent))(); } catch(e) { /* ignore */ }
    });
    if (window.gsap) gsap.globalTimeline.pause();
  });

  console.log(`Rendering ${TOTAL_FRAMES} frames @ ${FPS}fps for ${DURATION}s`);
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const t = i / FPS;
    await page.evaluate((time) => { if (window.gsap) gsap.globalTimeline.time(time); }, t);
    await page.screenshot({
      path: path.join(FRAMES_DIR, `frame-${String(i).padStart(5, "0")}.png`),
      type: "png",
      clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
    });
    if (i % 30 === 0) process.stdout.write(`  ${i}/${TOTAL_FRAMES}\r`);
  }
  console.log(`  ${TOTAL_FRAMES}/${TOTAL_FRAMES} done`);
  await browser.close();

  console.log("Encoding MP4...");
  execSync(
    `ffmpeg -y -framerate ${FPS} -i "${FRAMES_DIR}/frame-%05d.png" -c:v libx264 -pix_fmt yuv420p -crf 18 -preset slow -movflags +faststart "${OUT_PATH}"`,
    { stdio: "pipe" }
  );
  fs.rmSync(FRAMES_DIR, { recursive: true });
  console.log(`→ ${OUT_PATH}`);
})().catch(e => { console.error(e); process.exit(1); });

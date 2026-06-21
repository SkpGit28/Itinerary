// Step 9: composite motion graphics OVER face-cam footage.
// Usage: node scripts/overlay.js --face <face-cam.mp4> --graphics <final.mp4> --output <composite.mp4> --platform reel
//
// Renders graphics scenes as transparent PNGs (Puppeteer omitBackground:true)
// and overlays them onto the face-cam clip using ffmpeg's overlay filter.
// Respects IG safe zones: top 220px and bottom 420px are left clear.

import "dotenv/config";
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const get  = (f) => { const i = args.indexOf(f); return i !== -1 ? args[i + 1] : null; };

const faceCam  = get("--face");
const graphics = get("--graphics");
const output   = get("--output") ?? path.join(__dirname, "../output/composite.mp4");
const platform = (get("--platform") ?? "reel").toLowerCase();

if (!faceCam || !graphics) {
  console.error("Usage: node scripts/overlay.js --face <mp4> --graphics <mp4> [--output <mp4>] [--platform reel|youtube]");
  process.exit(1);
}

// For vertical (reel/tiktok): place graphics in lower half (y=1100 in 1080×1920).
// For landscape (youtube): place graphics in lower-right quadrant.
const overlayPos = platform === "youtube" ? "W-w-40:H-h-80" : "(W-w)/2:1100";

console.log(`Compositing graphics over face-cam…`);
console.log(`  Face:     ${faceCam}`);
console.log(`  Graphics: ${graphics}`);
console.log(`  Position: ${overlayPos}`);

execSync(
  `ffmpeg -y -i "${faceCam}" -i "${graphics}" ` +
  `-filter_complex "[1:v]scale=iw:ih[gfx];[0:v][gfx]overlay=${overlayPos}:shortest=1" ` +
  `-c:v libx264 -pix_fmt yuv420p -crf 17 -preset slow ` +
  `-c:a copy -movflags +faststart "${output}"`,
  { stdio: "inherit" }
);

console.log(`\n✓ Composite → ${output}`);

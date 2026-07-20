"use strict";
require("dotenv").config();
const { execSync } = require("child_process");
const path = require("path");

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

const overlayPos = platform === "youtube" ? "W-w-40:H-h-80" : "(W-w)/2:1100";

console.log(`Compositing graphics over face-cam…`);
execSync(
  `ffmpeg -y -i "${faceCam}" -i "${graphics}" ` +
  `-filter_complex "[1:v]scale=iw:ih[gfx];[0:v][gfx]overlay=${overlayPos}:shortest=1" ` +
  `-c:v libx264 -pix_fmt yuv420p -crf 17 -preset slow ` +
  `-c:a copy -movflags +faststart "${output}"`,
  { stdio: "inherit" }
);
console.log(`\n✓ Composite → ${output}`);

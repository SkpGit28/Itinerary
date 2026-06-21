#!/usr/bin/env node
"use strict";

// Usage: node render-scene.js <template.html> <output.mp4> <duration> <width> <height>
const puppeteer = require("puppeteer");
const { spawn }  = require("child_process");
const path       = require("path");

const [,, templateHtml, outputMp4, durationStr, widthStr, heightStr] = process.argv;

if (!templateHtml || !outputMp4 || !durationStr) {
  console.error("Usage: node render-scene.js <template.html> <output.mp4> <duration> <width> <height>");
  process.exit(1);
}

const duration    = parseFloat(durationStr);
const width       = parseInt(widthStr  ?? "1080", 10);
const height      = parseInt(heightStr ?? "1920", 10);
const FPS         = 30;
const totalFrames = Math.ceil(duration * FPS);

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      `--window-size=${width},${height}`,
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });

  const fileUrl = `file://${path.resolve(templateHtml)}`;
  await page.goto(fileUrl, { waitUntil: "networkidle0", timeout: 30000 });

  // Wait for GSAP to be ready
  await page.evaluate(() => new Promise(res => {
    if (document.readyState === "complete") return res();
    window.addEventListener("load", res);
  }));

  // Pause all GSAP timelines so we can seek frame-by-frame
  await page.evaluate(() => {
    if (window.gsap) {
      window.gsap.globalTimeline.pause(0);
    }
  });

  const ffmpeg = spawn("ffmpeg", [
    "-y",
    "-f", "image2pipe",
    "-framerate", String(FPS),
    "-i", "pipe:0",
    "-vf", `scale=${width}:${height}:flags=lanczos`,
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-crf", "18",
    "-preset", "fast",
    outputMp4,
  ], { stdio: ["pipe", "inherit", "pipe"] });

  ffmpeg.stderr.on("data", () => {});

  process.stdout.write(`    rendering ${totalFrames} frames`);
  for (let i = 0; i < totalFrames; i++) {
    const t = i / FPS;
    await page.evaluate((t) => {
      if (window.gsap) window.gsap.globalTimeline.seek(t, false);
    }, t);
    const frame = await page.screenshot({ type: "png" });
    ffmpeg.stdin.write(frame);
    if (i % 30 === 0) process.stdout.write(".");
  }
  process.stdout.write("\n");
  ffmpeg.stdin.end();

  await new Promise((resolve, reject) => {
    ffmpeg.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });

  await browser.close();
  console.log(`    ✓ ${totalFrames} frames → ${outputMp4}`);
})().catch(e => { console.error(e); process.exit(1); });

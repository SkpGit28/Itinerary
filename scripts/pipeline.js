#!/usr/bin/env node
// Motion-graphic video pipeline
// Usage: node scripts/pipeline.js --input <audio.mp3|video.mp4> --topic "..." --platform reel|youtube|tiktok
//
// Requires: ffmpeg on PATH, OPENAI_API_KEY in .env

import "dotenv/config";
import { execSync, spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { transcribeAudio } from "./transcribe.js";
import { planScenes } from "./plan-scenes.js";
import { selectTemplate } from "./select-template.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MOTION_PACK = path.join(ROOT, "motion-pack");
const OUTPUT_DIR = path.join(ROOT, "output");

// ── CLI args ──────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const get = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; };

const inputFile  = get("--input");
const topic      = get("--topic")    ?? "Motion graphic video";
const platform   = (get("--platform") ?? "reel").toLowerCase(); // reel | youtube | tiktok

if (!inputFile) {
  console.error("Usage: node scripts/pipeline.js --input <file> --topic \"...\" --platform reel|youtube|tiktok");
  process.exit(1);
}

const DIMENSIONS = {
  reel:    { w: 1080, h: 1920 },
  tiktok:  { w: 1080, h: 1920 },
  youtube: { w: 1920, h: 1080 },
};
const { w: WIDTH, h: HEIGHT } = DIMENSIONS[platform] ?? DIMENSIONS.reel;

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function run(cmd, opts = {}) {
  console.log(`  $ ${cmd}`);
  execSync(cmd, { stdio: "inherit", ...opts });
}

// ── Step 1: extract audio if input is video ───────────────────────────────────
console.log("\n[1/10] Preparing audio…");
const ext = path.extname(inputFile).toLowerCase();
let wavFile = path.join(OUTPUT_DIR, "audio.wav");

if ([".mp4", ".mov", ".mkv", ".webm"].includes(ext)) {
  run(`ffmpeg -y -i "${inputFile}" -vn -ac 1 -ar 16000 "${wavFile}"`);
} else if ([".mp3", ".m4a", ".aac", ".ogg"].includes(ext)) {
  run(`ffmpeg -y -i "${inputFile}" -ac 1 -ar 16000 "${wavFile}"`);
} else {
  // assume it's already a wav
  wavFile = inputFile;
}

// ── Step 2: transcribe with Whisper ──────────────────────────────────────────
console.log("\n[2/10] Transcribing with Whisper…");
const transcript = await transcribeAudio(wavFile);
const transcriptPath = path.join(OUTPUT_DIR, "transcript.json");
fs.writeFileSync(transcriptPath, JSON.stringify(transcript, null, 2));
console.log(`  → ${transcript.words.length} words transcribed`);

// ── Step 3: strip dead air ────────────────────────────────────────────────────
console.log("\n[3/10] Removing dead air…");
const trimmedWav = path.join(OUTPUT_DIR, "audio-trim.wav");
run(
  `ffmpeg -y -i "${wavFile}" -af ` +
  `"silenceremove=start_periods=1:start_silence=0.3:start_threshold=-38dB:` +
  `stop_periods=-1:stop_duration=0.6:stop_threshold=-38dB" "${trimmedWav}"`
);

console.log("  Re-transcribing trimmed audio for accurate timing…");
const trimmedTranscript = await transcribeAudio(trimmedWav);
fs.writeFileSync(path.join(OUTPUT_DIR, "transcript-trimmed.json"), JSON.stringify(trimmedTranscript, null, 2));

// ── Step 4: plan scenes ───────────────────────────────────────────────────────
console.log("\n[4/10] Planning scenes…");
const scenes = planScenes(trimmedTranscript, topic);
console.log(`  → ${scenes.length} scenes planned`);
fs.writeFileSync(path.join(OUTPUT_DIR, "scenes.json"), JSON.stringify(scenes, null, 2));

// ── Steps 5-7: render each scene ─────────────────────────────────────────────
const sceneVideos = [];
for (let i = 0; i < scenes.length; i++) {
  const scene = scenes[i];
  const pad = String(i).padStart(2, "0");
  console.log(`\n[5-7/${scenes.length}] Scene ${pad}: "${scene.phrase.slice(0, 60)}"`);

  // Step 5: pick template
  const templateHtml = selectTemplate(scene, MOTION_PACK, { platform, width: WIDTH, height: HEIGHT });
  console.log(`  template → ${templateHtml}`);

  // Step 6: render silent MP4
  const silentMp4 = path.join(OUTPUT_DIR, `scene-${pad}-silent.mp4`);
  run(`node "${MOTION_PACK}/render-scene.js" "${templateHtml}" "${silentMp4}" ${scene.duration.toFixed(3)} ${WIDTH} ${HEIGHT}`);

  // Step 7: mux scene audio
  const sceneWav = path.join(OUTPUT_DIR, `scene-${pad}.wav`);
  const sceneMp4 = path.join(OUTPUT_DIR, `scene-${pad}.mp4`);
  const startSec = scene.start.toFixed(3);
  const durSec   = scene.duration.toFixed(3);
  run(
    `ffmpeg -y -i "${trimmedWav}" -ss ${startSec} -t ${durSec} -ac 2 -ar 48000 "${sceneWav}"`
  );
  run(
    `ffmpeg -y -i "${silentMp4}" -i "${sceneWav}" ` +
    `-map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 192k -shortest "${sceneMp4}"`
  );
  sceneVideos.push(sceneMp4);
}

// ── Step 8: concatenate scenes ────────────────────────────────────────────────
console.log("\n[8/10] Concatenating scenes…");
const listFile = path.join(OUTPUT_DIR, "concat.txt");
fs.writeFileSync(listFile, sceneVideos.map(f => `file '${f}'`).join("\n"));
const preFinal = path.join(OUTPUT_DIR, "pre-final.mp4");
run(
  `ffmpeg -y -f concat -safe 0 -i "${listFile}" ` +
  `-vf "fps=30,scale=${WIDTH}:${HEIGHT}:flags=lanczos" ` +
  `-c:v libx264 -pix_fmt yuv420p -crf 17 -preset slow ` +
  `-c:a aac -b:a 192k -movflags +faststart "${preFinal}"`
);

// ── Step 9: (face-cam composite skipped unless --overlay flag provided) ───────
// Pass --overlay <face-cam.mp4> to composite graphics over your footage.
// That path is handled separately by scripts/overlay.js

// ── Step 10: finalize ─────────────────────────────────────────────────────────
console.log("\n[10/10] Finalizing…");
const finalMp4 = path.join(OUTPUT_DIR, "final.mp4");
fs.copyFileSync(preFinal, finalMp4);
console.log(`\n✓ Done → ${finalMp4}`);
console.log(`  Platform: ${platform} (${WIDTH}×${HEIGHT})`);
console.log(`  Scenes:   ${sceneVideos.length}`);

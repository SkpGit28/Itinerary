#!/usr/bin/env node
"use strict";
// Motion-graphic video pipeline — end to end
// Usage: node scripts/pipeline.js --input <file> --topic "..." --platform reel|youtube|tiktok

require("dotenv").config();
const { execSync } = require("child_process");
const fs   = require("fs");
const path = require("path");
const { transcribeAudio } = require("./transcribe");
const { planScenes }      = require("./plan-scenes");
const { selectTemplate }  = require("./select-template");

const ROOT        = path.resolve(__dirname, "..");
const MOTION_PACK = path.join(ROOT, "motion-pack");
const OUTPUT_DIR  = path.join(ROOT, "output");

// ── CLI args ──────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const get  = (f) => { const i = args.indexOf(f); return i !== -1 ? args[i + 1] : null; };

const inputFile = get("--input");
const topic     = get("--topic") ?? "AI News";
const platform  = (get("--platform") ?? "reel").toLowerCase();

if (!inputFile) {
  console.error("Usage: node scripts/pipeline.js --input <file> --topic \"...\" --platform reel|youtube|tiktok");
  process.exit(1);
}

const DIMS = { reel: [1080, 1920], tiktok: [1080, 1920], youtube: [1920, 1080] };
const [WIDTH, HEIGHT] = DIMS[platform] ?? DIMS.reel;

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function run(cmd) {
  console.log(`  $ ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

(async () => {
  // ── Step 1: extract / normalise audio ──────────────────────────────────────
  console.log("\n[1/8] Preparing audio…");
  const ext = path.extname(inputFile).toLowerCase();
  const wavFile = path.join(OUTPUT_DIR, "audio.wav");
  if ([".mp4", ".mov", ".mkv", ".webm"].includes(ext)) {
    run(`ffmpeg -y -i "${inputFile}" -vn -ac 1 -ar 16000 "${wavFile}"`);
  } else {
    run(`ffmpeg -y -i "${inputFile}" -ac 1 -ar 16000 "${wavFile}"`);
  }

  // ── Step 2: transcribe ─────────────────────────────────────────────────────
  console.log("\n[2/8] Transcribing with Whisper…");
  const transcript = await transcribeAudio(wavFile);
  fs.writeFileSync(path.join(OUTPUT_DIR, "transcript.json"), JSON.stringify(transcript, null, 2));
  console.log(`  → "${transcript.text.slice(0, 120)}…"`);
  console.log(`  → ${transcript.words.length} words`);

  // ── Step 3: strip dead air ─────────────────────────────────────────────────
  console.log("\n[3/8] Removing dead air…");
  const trimmedWav = path.join(OUTPUT_DIR, "audio-trim.wav");
  run(
    `ffmpeg -y -i "${wavFile}" -af ` +
    `"silenceremove=start_periods=1:start_silence=0.3:start_threshold=-38dB:` +
    `stop_periods=-1:stop_duration=0.6:stop_threshold=-38dB" "${trimmedWav}"`
  );

  console.log("  Re-transcribing trimmed audio…");
  const trimmed = await transcribeAudio(trimmedWav);
  fs.writeFileSync(path.join(OUTPUT_DIR, "transcript-trimmed.json"), JSON.stringify(trimmed, null, 2));

  // ── Step 4: plan scenes ────────────────────────────────────────────────────
  console.log("\n[4/8] Planning scenes…");
  const scenes = planScenes(trimmed, topic);
  fs.writeFileSync(path.join(OUTPUT_DIR, "scenes.json"), JSON.stringify(scenes, null, 2));
  console.log(`  → ${scenes.length} scene(s)`);
  scenes.forEach((s, i) => console.log(`     ${i + 1}. [${s.intent}] ${s.phrase.slice(0, 70)} (${s.duration}s)`));

  // ── Steps 5-7: render + mux each scene ────────────────────────────────────
  const sceneVideos = [];
  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const pad   = String(i).padStart(2, "0");
    console.log(`\n[5-7] Scene ${pad}: "${scene.phrase.slice(0, 60)}" (${scene.duration}s)`);

    const templateHtml = await selectTemplate(scene, MOTION_PACK, { platform, width: WIDTH, height: HEIGHT });
    console.log(`  template → ${path.relative(ROOT, templateHtml)}`);

    const silentMp4 = path.join(OUTPUT_DIR, `scene-${pad}-silent.mp4`);
    run(`node "${MOTION_PACK}/render-scene.js" "${templateHtml}" "${silentMp4}" ${scene.duration.toFixed(3)} ${WIDTH} ${HEIGHT}`);

    const sceneWav = path.join(OUTPUT_DIR, `scene-${pad}.wav`);
    const sceneMp4 = path.join(OUTPUT_DIR, `scene-${pad}.mp4`);
    run(`ffmpeg -y -i "${trimmedWav}" -ss ${scene.start.toFixed(3)} -t ${scene.duration.toFixed(3)} -ac 2 -ar 48000 "${sceneWav}"`);
    run(
      `ffmpeg -y -i "${silentMp4}" -i "${sceneWav}" ` +
      `-map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 192k -shortest "${sceneMp4}"`
    );
    sceneVideos.push(sceneMp4);
  }

  // ── Step 8: concat + finalize ──────────────────────────────────────────────
  console.log("\n[8/8] Concatenating scenes…");
  const listFile = path.join(OUTPUT_DIR, "concat.txt");
  fs.writeFileSync(listFile, sceneVideos.map(f => `file '${f}'`).join("\n"));
  const finalMp4 = path.join(OUTPUT_DIR, "final.mp4");
  run(
    `ffmpeg -y -f concat -safe 0 -i "${listFile}" ` +
    `-vf "fps=30,scale=${WIDTH}:${HEIGHT}:flags=lanczos" ` +
    `-c:v libx264 -pix_fmt yuv420p -crf 17 -preset slow ` +
    `-c:a aac -b:a 192k -movflags +faststart "${finalMp4}"`
  );

  console.log(`\n✓ Done → ${finalMp4}`);
  console.log(`  Platform: ${platform} (${WIDTH}×${HEIGHT})`);
  console.log(`  Scenes:   ${sceneVideos.length}`);
})().catch(e => { console.error(e); process.exit(1); });

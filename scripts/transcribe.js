"use strict";
const path = require("path");
const { execFileSync } = require("child_process");

async function transcribeAudio(wavPath, topic = "AI News") {
  if (process.env.OPENAI_API_KEY) {
    const OpenAI = require("openai");
    const fs = require("fs");
    const openai = new OpenAI.default({ apiKey: process.env.OPENAI_API_KEY });
    const resp = await openai.audio.transcriptions.create({
      file: fs.createReadStream(wavPath),
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["word"],
    });
    return {
      text: resp.text,
      duration: resp.duration,
      words: (resp.words ?? []).map((w) => ({
        word:  w.word.trim(),
        start: w.start,
        end:   w.end,
      })),
    };
  }

  // Fall back to ffmpeg silence-detection based segmentation
  const scriptPath = path.join(__dirname, "transcribe-local.py");
  const raw = execFileSync("python3", [scriptPath, wavPath, topic], {
    maxBuffer: 10 * 1024 * 1024,
    timeout: 60_000,
  });
  return JSON.parse(raw.toString("utf8"));
}

module.exports = { transcribeAudio };

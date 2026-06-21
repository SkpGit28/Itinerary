"use strict";
const OpenAI = require("openai");
const fs = require("fs");

async function transcribeAudio(wavPath) {
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

module.exports = { transcribeAudio };

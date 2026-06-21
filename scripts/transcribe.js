// Whisper transcription — returns { text, words: [{word, start, end}] }
import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function transcribeAudio(wavPath) {
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

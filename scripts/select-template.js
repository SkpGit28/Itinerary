"use strict";
const path = require("path");
const fs   = require("fs");
const { generateTemplate } = require("./generate-template");

const INTENT_MAP = {
  waveform:   "01-audio-waveform",
  message:    "02-imessage-notification",
  map:        "03-apple-maps-route",
  trash:      "04-wastebasket-trash",
  "app-icons":"06-app-icon-launcher",
  terminal:   "07-typewriter-terminal",
  toggle:     "08-toggle-flip",
  stat:       "09-stat-counter",
  progress:   "10-progress-bar",
};

async function selectTemplate(scene, motionPackDir, opts) {
  const folder = INTENT_MAP[scene.intent] ?? "01-audio-waveform";
  const candidate = path.join(motionPackDir, "templates", folder, "scene.html");
  if (fs.existsSync(candidate)) return candidate;
  return generateTemplate(scene, opts);
}

module.exports = { selectTemplate };

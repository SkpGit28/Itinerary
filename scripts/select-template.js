// Map a scene's intent to the best motion-pack template.
// Falls back to generating a fresh HTML scene if nothing fits.
import path from "path";
import fs from "fs";
import { generateTemplate } from "./generate-template.js";

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

export function selectTemplate(scene, motionPackDir, { platform, width, height }) {
  const folder = INTENT_MAP[scene.intent] ?? "01-audio-waveform";
  const candidate = path.join(motionPackDir, "templates", folder, "scene.html");

  if (fs.existsSync(candidate)) return candidate;

  // fall back: generate a bespoke HTML template for this phrase
  return generateTemplate(scene, { platform, width, height });
}

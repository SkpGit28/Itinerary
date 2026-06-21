// Generate a brand-new HyperFrames HTML scene from scratch for a given phrase.
// Writes the file to output/templates/ and returns the path.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const BRAND = `
BRAND TOKENS (always apply):
- background: #0A0808 (ink)
- body text: #EDD9BC (cream)
- accent: #D97757 (coral)
- success green: #4CD964
- success blue: #4080F0
- topographic SVG line pattern as body::after (stroke #362A22, opacity 0.35)
- font: -apple-system, "Inter", sans-serif — monospace: "JetBrains Mono", ui-monospace
`.trim();

const RULES = `
RULES (never break):
1. One self-contained HTML file — inline <style> + single GSAP timeline in <script>.
2. Stage size: {WIDTH}px × {HEIGHT}px. html,body { width:{WIDTH}px; height:{HEIGHT}px; margin:0; padding:0; overflow:hidden }
3. Use GSAP only. Load from: <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
4. Use fromTo() with explicit end states — NEVER from() on opacity:0 elements.
5. Infinite yoyo/pulse tweens go on gsap.to() directly, not on the main timeline.
6. Scene must be seek-safe: correct at any time t for frame-by-frame rendering.
7. No external images (use CSS gradients / SVG inline only).
8. IG safe zones (vertical): top 220px and bottom 420px must have no critical content.
`.trim();

export async function generateTemplate(scene, { width, height }) {
  const templateDir = path.join(ROOT, "output", "templates");
  fs.mkdirSync(templateDir, { recursive: true });
  const slug = scene.phrase.slice(0, 30).replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const outPath = path.join(templateDir, `${slug}.html`);

  const systemPrompt = [
    "You are an expert motion graphic designer. Output ONLY raw HTML — no markdown, no explanation, no code fences.",
    BRAND,
    RULES.replace(/{WIDTH}/g, width).replace(/{HEIGHT}/g, height),
  ].join("\n\n");

  const userPrompt =
    `Create a HyperFrames HTML scene for this spoken phrase:\n"${scene.phrase}"\n\n` +
    `Intent: ${scene.intent}\n` +
    `Duration: ${scene.duration}s\n` +
    `Platform: ${width}×${height}\n` +
    `The animation should visualize the phrase literally and end cleanly by ${scene.duration}s.`;

  console.log(`  Generating custom template for: "${scene.phrase.slice(0, 50)}"`);
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 4096,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user",   content: userPrompt },
    ],
  });

  fs.writeFileSync(outPath, completion.choices[0].message.content ?? "");
  return outPath;
}

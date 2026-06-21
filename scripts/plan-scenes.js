// Break a Whisper transcript into logical scenes.
// Each scene = one spoken idea, 3-8 seconds.
// Returns: [{ phrase, start, end, duration, intent }]

const PAUSE_THRESHOLD = 0.5; // seconds of silence → scene break
const MIN_SCENE_DUR   = 2.5;
const MAX_SCENE_DUR   = 8.0;

export function planScenes(transcript, _topic) {
  const { words } = transcript;
  if (!words.length) return [];

  const scenes = [];
  let batch = [words[0]];

  for (let i = 1; i < words.length; i++) {
    const prev = words[i - 1];
    const cur  = words[i];
    const gap  = cur.start - prev.end;
    const batchDur = prev.end - batch[0].start;

    const forceBreak = gap >= PAUSE_THRESHOLD || batchDur >= MAX_SCENE_DUR;
    const naturalEnd = forceBreak && batchDur >= MIN_SCENE_DUR;

    if (naturalEnd) {
      scenes.push(makeScene(batch));
      batch = [cur];
    } else if (forceBreak && batchDur < MIN_SCENE_DUR) {
      // scene too short — keep accumulating
      batch.push(cur);
    } else {
      batch.push(cur);
    }
  }
  if (batch.length) scenes.push(makeScene(batch));

  return scenes;
}

function makeScene(words) {
  const phrase = words.map(w => w.word).join(" ");
  const start  = words[0].start;
  const end    = words[words.length - 1].end;
  return {
    phrase,
    start,
    end,
    duration: parseFloat((end - start).toFixed(3)),
    intent: classifyIntent(phrase),
  };
}

// Rough intent classifier — drives template selection
function classifyIntent(phrase) {
  const p = phrase.toLowerCase();
  if (/\d[\d,]+/.test(p) || /\d+%/.test(p) || /\$[\d]/.test(p))     return "stat";
  if (/step|first|second|third|next|then|finally/.test(p))            return "process";
  if (/turn on|enable|toggle|switch|tap/.test(p))                     return "toggle";
  if (/code|terminal|function|class|api|github/.test(p))              return "terminal";
  if (/message|dm|text|sent|reply/.test(p))                           return "message";
  if (/map|location|route|travel|city|flight/.test(p))                return "map";
  if (/app|tool|stack|platform|software|free/.test(p))                return "app-icons";
  if (/delete|trash|remove|replace|cancel/.test(p))                   return "trash";
  if (/progress|loading|percent|done|complete/.test(p))               return "progress";
  return "waveform"; // default
}

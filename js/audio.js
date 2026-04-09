// Audio module - handles sound effects
let audioCtx = null;
const audioFiles = {
  punch: "audio/punch.mp3",
  slap: "audio/slap.mp3",
  hammer: "audio/hammer.mp3",
  whip: "audio/whip.mp3",
  rose: "audio/flower.mp3",
};
const audioPlayers = {};

function initAudioPlayers() {
  if (Object.keys(audioPlayers).length > 0) return;

  Object.entries(audioFiles).forEach(([toolName, src]) => {
    const audio = new Audio(src);
    audio.preload = "auto";
    audioPlayers[toolName] = audio;
  });
}

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function ensureAudioReady() {
  const ctx = getAudioContext();

  if (ctx.state === "suspended") {
    // Intentionally fire-and-forget to keep this call synchronous in gesture handlers.
    ctx.resume().catch(() => {});
  }

  return ctx;
}

function unlockAudio() {
  initAudioPlayers();

  const ctx = ensureAudioReady();

  // Prime the context with a near-silent click so future playback is unlocked on mobile.
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  osc.start();
  osc.stop(ctx.currentTime + 0.01);

  // Warm up HTMLAudio playback path for mobile browsers.
  Object.values(audioPlayers).forEach((player) => {
    player
      .play()
      .then(() => {
        player.pause();
        player.currentTime = 0;
      })
      .catch(() => {
        // Ignore here, this is just a best-effort unlock attempt.
      });
  });
}

function playBeep(ctx) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.1);
  gain.gain.setValueAtTime(0.5, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
  osc.start();
  osc.stop(ctx.currentTime + 0.15);
}

function normalizeToolName(toolName) {
  const name = String(toolName || "punch").toLowerCase();

  if (name === "hammer") return "hammer";
  if (name === "slap" || name === "glove") return "slap";
  if (name === "punch" || name === "fist") return "punch";
  if (name === "whip") return "whip";
  if (name === "rose" || name === "flower") return "rose";
  return "punch";
}

function playToolSound(toolName = "punch") {
  const mappedTool = normalizeToolName(toolName);
  initAudioPlayers();
  ensureAudioReady(); // Start/resume context synchronously

  const player = audioPlayers[mappedTool];
  if (player) {
    player.pause();
    player.currentTime = 0;
    player.volume = mappedTool === "hammer" ? 0.95 : 0.85;
    player.play().catch(() => {
      playFallbackTone(mappedTool);
    });
    return;
  }

  playFallbackTone(mappedTool);
}

function playFallbackTone(mappedTool) {
  const ctx = ensureAudioReady();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  if (mappedTool === "hammer") {
    osc.type = "square";
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.24);
    gain.gain.setValueAtTime(0.75, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    osc.start(now);
    osc.stop(now + 0.25);
    return;
  }

  if (mappedTool === "slap") {
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.06);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.07);
    osc.start(now);
    osc.stop(now + 0.07);
    return;
  }

  // Default punch sound.
  osc.type = "square";
  osc.frequency.setValueAtTime(200, now);
  osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);
  gain.gain.setValueAtTime(0.5, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
  osc.start(now);
  osc.stop(now + 0.15);
}

function playHitSound() {
  playToolSound("punch");
}

export { getAudioContext, unlockAudio, playHitSound, playToolSound };

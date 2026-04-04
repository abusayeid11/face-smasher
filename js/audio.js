// Audio module - handles sound effects
let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

function ensureAudioReady() {
    const ctx = getAudioContext();

    if (ctx.state === 'suspended') {
        // Intentionally fire-and-forget to keep this call synchronous in gesture handlers.
        ctx.resume().catch(() => {});
    }

    return ctx;
}

function unlockAudio() {
    const ctx = ensureAudioReady();

    // Prime the context with a near-silent click so future playback is unlocked on mobile.
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    osc.start();
    osc.stop(ctx.currentTime + 0.01);
}

function playBeep(ctx) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
}

function playHitSound() {
    const ctx = ensureAudioReady();
    playBeep(ctx);
}

export { getAudioContext, unlockAudio, playHitSound };
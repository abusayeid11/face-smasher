import { unlockAudio, playHitSound, playToolSound } from '../audio.js';
import { face, resetFacePosition, updateFaceScale } from '../face.js';
import { tool, loadTools, initToolSelector, updateToolScale, getCurrentToolName } from '../tool.js';
import { createMark, drawMark } from '../marks.js';
import { setupMouseInput, setupTouchInput, getMousePosition } from '../input.js';
import { initGame } from '../game.js';

export function setupGameEngine(canvas, scoreEl, options = {}) {
    const ctx = canvas.getContext('2d');

    function updateAllScales() { updateFaceScale(); updateToolScale(); }
    window.addEventListener('resize', updateAllScales);
    updateAllScales();

    document.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
    document.addEventListener('mousedown',  unlockAudio, { once: true });

    loadTools();
    initToolSelector();

    setupMouseInput(canvas);
    const touchStartHandler = setupTouchInput(canvas);

    let gameTimer = null;

    const game = initGame(canvas, ctx, scoreEl, {
        face,
        tool,
        playToolSound,
        getToolName:      getCurrentToolName,
        playHitSound,
        createMark,
        drawMark,
        resetFacePos:     () => resetFacePosition(canvas),
        startTimer:       () => startGameTimer(),
        getMousePos:      getMousePosition,
        triggerSmashAnim: () => { tool.smashAnim = 1; },
        onSuccessfulSmash: options.onSuccessfulSmash,
        onMissSmash:      options.onMissSmash
    });

    function startGameTimer() {
        clearInterval(gameTimer);
        if (face.loaded) {
            gameTimer = setInterval(() => resetFacePosition(canvas), game.getSpeed());
        }
    }

    canvas.addEventListener('mousedown', () => {
        if (face.loaded) game.handleSmash();
    });

    canvas.addEventListener('touchstart', (e) => {
        touchStartHandler(e);
        if (face.loaded) game.handleSmash();
    }, { passive: false });

    return { game, touchStartHandler, startGameTimer };
}

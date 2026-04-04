// Main entry point - Face Smasher

// Import modules
import { playHitSound } from './js/audio.js';
import { face, initFace, resetFacePosition, updateFaceScale, clearMarks } from './js/face.js';
import { tool, loadTools, initToolSelector, updateToolScale } from './js/tool.js';
import { createMark, drawMark } from './js/marks.js';
import { setupMouseInput, setupTouchInput, getMousePosition } from './js/input.js';
import { initGame } from './js/game.js';

// Get DOM elements
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreLabel = document.getElementById("scoreLabel");
const imageUpload = document.getElementById("imageUpload");
const fileName = document.getElementById("fileName");
const instructions = document.getElementById("instructions");

// Initialize scale updates
function updateAllScales() {
    updateFaceScale();
    updateToolScale();
}

window.addEventListener('resize', updateAllScales);
updateAllScales();

// Initialize modules
loadTools();
initToolSelector();

initFace(
    imageUpload, 
    fileName, 
    instructions,
    () => resetFacePosition(canvas),
    () => startGameTimer()
);

setupMouseInput(canvas);
const touchStartHandler = setupTouchInput(canvas);

// Initialize game logic
const game = initGame(canvas, ctx, scoreLabel, {
    face,
    tool,
    playHitSound,
    createMark,
    drawMark,
    resetFacePos: () => resetFacePosition(canvas),
    startTimer: () => startGameTimer(),
    getMousePos: getMousePosition,
    triggerSmashAnim: () => { tool.smashAnim = 1; }
});

// Set up click handler
canvas.addEventListener("mousedown", () => {
    game.handleSmash();
});

// Set up touch handler
canvas.addEventListener("touchstart", (e) => {
    touchStartHandler(e);
    game.handleSmash();
});

// Button handlers
document.getElementById("resetScoreBtn").onclick = () => {
    game.resetScore(scoreLabel);
    clearMarks();
};

document.getElementById("resetSpeedBtn").onclick = () => {
    game.resetSpeed();
};

let gameTimer = null;

function startGameTimer() {
    clearInterval(gameTimer);
    if (face.loaded) {
        gameTimer = setInterval(
            () => resetFacePosition(canvas),
            game.getSpeed()
        );
    }
}
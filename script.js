// Main entry point - Face Smasher

// Import modules
import { unlockAudio, playHitSound, playToolSound } from './js/audio.js';
import { face, loadFaceFromFile, loadDefaultFace, resetFacePosition, updateFaceScale, clearMarks } from './js/face.js';
import { tool, loadTools, initToolSelector, updateToolScale, getCurrentToolName } from './js/tool.js';
import { createMark, drawMark } from './js/marks.js';
import { setupMouseInput, setupTouchInput, getMousePosition } from './js/input.js';
import { initGame } from './js/game.js';

// Get DOM elements
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreLabel = document.getElementById("scoreLabel");
const instructions = document.getElementById("instructions");
const setupOverlay = document.getElementById("setupOverlay");
const gameplayArea = document.getElementById("gameplayArea");
const setupImageUpload = document.getElementById("setupImageUpload");
const setupFileName = document.getElementById("setupFileName");
const startGameBtn = document.getElementById("startGameBtn");
const toggleComedyBtn = document.getElementById("toggleComedyBtn");
const toggleComedyText = document.getElementById("toggleComedyText");

let gameStarted = false;
let comedyModeEnabled = false;

const funnyHitLines = [
    "Face met destiny.",
    "Direct hit. Ego has left the chat.",
    "That looked personal.",
    "Certified bonk moment.",
    "Audience score: 10/10 chaos."
];

const funnyMissLines = [
    "Missed. The face is laughing at you.",
    "Air attack unlocked.",
    "Close... like pineapple on pizza close.",
    "You hit pure confidence.",
    "Swing and emotional damage."
];

function randomLine(lines) {
    return lines[Math.floor(Math.random() * lines.length)];
}

function getComboText(combo) {
    if (combo >= 8) return ` ${combo}x combo. Absolute menace.`;
    if (combo >= 5) return ` ${combo}x combo. Hands are on fire.`;
    if (combo >= 3) return ` ${combo}x combo. Things are escalating.`;
    return "";
}

function normalizeToolLabel(toolName) {
    return toolName ? `${toolName[0].toUpperCase()}${toolName.slice(1)}` : "Tool";
}

function setComedyButtonState() {
    if (toggleComedyText) {
        toggleComedyText.textContent = comedyModeEnabled
            ? "Commentary is on"
            : "Commentary is off";
    }
    toggleComedyBtn.classList.toggle("off", !comedyModeEnabled);
    toggleComedyBtn.setAttribute("aria-checked", comedyModeEnabled ? "true" : "false");
}

setComedyButtonState();

toggleComedyBtn.addEventListener("click", () => {
    comedyModeEnabled = !comedyModeEnabled;
    setComedyButtonState();

    if (gameStarted) {
        instructions.textContent = comedyModeEnabled
            ? "Commentary enabled. Funny updates are back."
            : "Commentary disabled. Clean mode activated.";
    }
});

// Initialize scale updates
function updateAllScales() {
    updateFaceScale();
    updateToolScale();
}

window.addEventListener('resize', updateAllScales);
updateAllScales();

document.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
document.addEventListener('mousedown', unlockAudio, { once: true });

// Initialize modules
loadTools();
initToolSelector();

setupMouseInput(canvas);
const touchStartHandler = setupTouchInput(canvas);

// Initialize game logic
const game = initGame(canvas, ctx, scoreLabel, {
    face,
    tool,
    playToolSound,
    playHitSound,
    getToolName: getCurrentToolName,
    createMark,
    drawMark,
    resetFacePos: () => resetFacePosition(canvas),
    startTimer: () => startGameTimer(),
    getMousePos: getMousePosition,
    triggerSmashAnim: () => { tool.smashAnim = 1; },
    onSuccessfulSmash: ({ score, toolName, combo }) => {
        if (!comedyModeEnabled) {
            instructions.textContent = `${normalizeToolLabel(toolName)} connected. Total smashed: ${score}.`;
            return;
        }

        const comboText = getComboText(combo);
        instructions.textContent = `${randomLine(funnyHitLines)} ${normalizeToolLabel(toolName)} used.${comboText}`;
    },
    onMissSmash: () => {
        if (comedyModeEnabled) {
            instructions.textContent = randomLine(funnyMissLines);
        }
    }
});

// Set up click handler
canvas.addEventListener("mousedown", () => {
    if (gameStarted) {
        game.handleSmash();
    }
});

// Set up touch handler
canvas.addEventListener("touchstart", (e) => {
    touchStartHandler(e);
    if (gameStarted) {
        game.handleSmash();
    }
}, { passive: false });

setupImageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    setupFileName.textContent = file
        ? file.name
        : "No file selected (default face will be used)";
});

startGameBtn.addEventListener('click', () => {
    unlockAudio();
    const selectedFile = setupImageUpload.files[0];

    const onFaceReady = () => {
        gameStarted = true;
        setupOverlay.classList.add('hidden');
        gameplayArea.classList.remove('hidden');
    };

    if (selectedFile) {
        loadFaceFromFile(
            selectedFile,
            setupFileName,
            instructions,
            () => resetFacePosition(canvas),
            () => {
                startGameTimer();
                onFaceReady();
            }
        );
    } else {
        loadDefaultFace(
            instructions,
            () => resetFacePosition(canvas),
            () => {
                startGameTimer();
                onFaceReady();
            }
        );
    }
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
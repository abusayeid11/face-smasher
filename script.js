// Main entry point - Face Smasher

// Import modules
import { unlockAudio, playHitSound, playToolSound } from './js/audio.js';
import { face, loadFaceFromFile, loadDefaultFace, resetFacePosition, updateFaceScale, clearMarks } from './js/face.js';
import { tool, loadTools, initToolSelector, updateToolScale, getCurrentToolName } from './js/tool.js';
import { createMark, drawMark } from './js/marks.js';
import { setupMouseInput, setupTouchInput, getMousePosition } from './js/input.js';
import { initGame } from './js/game.js';
import { createCommentaryAnimator } from './js/commentary.js';
import { getIntroMessage, getHitMessage, getMissMessage } from './js/commentaryText.js';

// Get DOM elements
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreLabel = document.getElementById("scoreLabel");
const setupOverlay = document.getElementById("setupOverlay");
const gameplayArea = document.getElementById("gameplayArea");
const setupImageUpload = document.getElementById("setupImageUpload");
const setupFileName = document.getElementById("setupFileName");
const startGameBtn = document.getElementById("startGameBtn");
const toggleComedyBtn = document.getElementById("toggleComedyBtn");
const toggleComedyText = document.getElementById("toggleComedyText");
const commentaryStage = document.getElementById("commentaryStage");
const commentaryBubble = document.getElementById("commentaryBubble");
const commentaryMessage = document.getElementById("commentaryMessage");
const commentaryIcons = document.getElementById("commentaryIcons");
const plainInstructionMessage = "Smash the face to score.";

function setStatusMessage(text) {
    if (commentaryMessage) {
        commentaryMessage.textContent = text;
    }
}

let gameStarted = false;
let comedyModeEnabled = true;

const commentaryAnimator = createCommentaryAnimator({
    stage: commentaryStage,
    bubble: commentaryBubble,
    message: commentaryMessage,
    icons: commentaryIcons
});

function setComedyButtonState() {
    if (toggleComedyText) {
        toggleComedyText.textContent = comedyModeEnabled
            ? "Commentary is on"
            : "Commentary is off";
    }
    toggleComedyBtn.classList.toggle("off", !comedyModeEnabled);
    toggleComedyBtn.setAttribute("aria-checked", comedyModeEnabled ? "true" : "false");

    if (!comedyModeEnabled) {
        commentaryAnimator.clear();
        setStatusMessage(plainInstructionMessage);
    }
}

setComedyButtonState();

toggleComedyBtn.addEventListener("click", () => {
    comedyModeEnabled = !comedyModeEnabled;
    setComedyButtonState();

    if (gameStarted) {
        setStatusMessage(comedyModeEnabled
            ? "Commentary enabled. Funny updates are back."
            : "Commentary disabled. Clean mode activated.");

        if (comedyModeEnabled) {
            const currentTool = getCurrentToolName();
            commentaryAnimator.showHit(getIntroMessage(currentTool), currentTool);
        }
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
            commentaryAnimator.clear();
            setStatusMessage(plainInstructionMessage);
            return;
        }

        const message = getHitMessage(toolName, combo);
        setStatusMessage(message);
        if (combo >= 3) {
            commentaryAnimator.showCombo(message, toolName);
        } else {
            commentaryAnimator.showHit(message, toolName);
        }
    },
    onMissSmash: ({ toolName }) => {
        if (comedyModeEnabled) {
            const message = getMissMessage(toolName);
            setStatusMessage(message);
            commentaryAnimator.showMiss(message, toolName);
            return;
        }

        commentaryAnimator.clear();
        setStatusMessage(plainInstructionMessage);
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

    // If game has already started, replace the face immediately
    if (file && gameStarted) {
        unlockAudio();
        loadFaceFromFile(
            file,
            setupFileName,
            commentaryMessage,
            () => resetFacePosition(canvas),
            () => {
                game.resetScore(scoreLabel);
                clearMarks();
            }
        );
    }
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
            commentaryMessage,
            () => resetFacePosition(canvas),
            () => {
                startGameTimer();
                onFaceReady();
            }
        );
    } else {
        loadDefaultFace(
            commentaryMessage,
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
// Main entry point - Face Smasher

// Import modules
import { unlockAudio, playHitSound, playToolSound } from './js/audio.js';
import { face, loadFaceFromFile, loadDefaultFace, resetFacePosition, updateFaceScale, clearMarks } from './js/face.js';
import { tool, loadTools, initToolSelector, updateToolScale, getCurrentToolName } from './js/tool.js';
import { createMark, drawMark } from './js/marks.js';
import { setupMouseInput, setupTouchInput, getMousePosition } from './js/input.js';
import { initGame } from './js/game.js';
import { createCommentaryAnimator } from './js/commentary/commentary.js';
import { getIntroMessage, getHitMessage, getMissMessage } from './js/commentary/commentaryText.js';
import { initArenaManager } from './js/managers/arenaManager.js';
import { createCommentaryManager } from './js/managers/commentaryManager.js';
import { createGameSessionManager } from './js/managers/gameSessionManager.js';
import { initInputManager } from './js/managers/inputManager.js';
import { initControlManager } from './js/managers/controlManager.js';
import { initRuntimeManager } from './js/managers/runtimeManager.js';
import gameplayAreas from './gamePlayArea/areas.js';

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
const arenaSection = document.getElementById("arenaSection");
const arenaButtons = document.getElementById("arenaButtons");
const arenaPhotoUpload = document.getElementById("arenaPhotoUpload");
const arenaPhotoName = document.getElementById("arenaPhotoName");
const arenaNameModal = document.getElementById("arenaNameModal");
const arenaNameInput = document.getElementById("arenaNameInput");
const arenaNameError = document.getElementById("arenaNameError");
const arenaNameCancel = document.getElementById("arenaNameCancel");
const arenaNameSave = document.getElementById("arenaNameSave");
const resetScoreBtn = document.getElementById("resetScoreBtn");
const resetSpeedBtn = document.getElementById("resetSpeedBtn");
const plainInstructionMessage = "Smash the face to score.";

function setStatusMessage(text) {
    if (commentaryMessage) {
        commentaryMessage.textContent = text;
    }
}

const commentaryAnimator = createCommentaryAnimator({
    stage: commentaryStage,
    bubble: commentaryBubble,
    message: commentaryMessage,
    icons: commentaryIcons
});

const gameSessionManager = createGameSessionManager({
    setupImageUpload,
    setupFileName,
    startGameBtn,
    setupOverlay,
    gameplayArea,
    arenaSection,
    commentaryMessage,
    canvas,
    scoreLabel,
    face,
    unlockAudio,
    loadFaceFromFile,
    loadDefaultFace,
    resetFacePosition,
    clearMarks
});

const commentaryManager = createCommentaryManager({
    commentaryAnimator,
    toggleComedyBtn,
    toggleComedyText,
    setStatusMessage,
    plainInstructionMessage,
    getCurrentToolName,
    getIntroMessage,
    getHitMessage,
    getMissMessage,
    isGameStarted: gameSessionManager.isGameStarted
});

initRuntimeManager({
    updateFaceScale,
    updateToolScale,
    unlockAudio
});

// Initialize modules
loadTools();
initToolSelector();
gameSessionManager.init();
commentaryManager.init();
initArenaManager({
    canvas,
    gameplayAreas,
    arenaButtons,
    arenaPhotoUpload,
    arenaPhotoName,
    arenaNameModal,
    arenaNameInput,
    arenaNameError,
    arenaNameCancel,
    arenaNameSave
});

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
    startTimer: gameSessionManager.startGameTimer,
    getMousePos: getMousePosition,
    triggerSmashAnim: () => { tool.smashAnim = 1; },
    onSuccessfulSmash: commentaryManager.onSuccessfulSmash,
    onMissSmash: commentaryManager.onMissSmash
});

gameSessionManager.setGame(game);

initInputManager({
    canvas,
    setupMouseInput,
    setupTouchInput,
    isGameStarted: gameSessionManager.isGameStarted,
    onSmash: () => game.handleSmash()
});

initControlManager({
    resetScoreBtn,
    resetSpeedBtn,
    game,
    scoreLabel,
    clearMarks
});
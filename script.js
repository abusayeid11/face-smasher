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
import { createComicPopupAnimator } from './js/comicEffects/comicPopups.js';
import { getComicHitText, getComicMissText } from './js/comicEffects/comicText.js';
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
const comicPopStage = document.getElementById("comicPopStage");
const arenaSection = document.getElementById("arenaSection");
const arenaButtons = document.getElementById("arenaButtons");
const arenaPhotoUpload = document.getElementById("arenaPhotoUpload");
const arenaPhotoName = document.getElementById("arenaPhotoName");
const arenaNameModal = document.getElementById("arenaNameModal");
const arenaNameInput = document.getElementById("arenaNameInput");
const arenaNameError = document.getElementById("arenaNameError");
const arenaNameCancel = document.getElementById("arenaNameCancel");
const arenaNameSave = document.getElementById("arenaNameSave");
const plainInstructionMessage = "Smash the face to score.";

function setStatusMessage(text) {
    if (commentaryMessage) {
        commentaryMessage.textContent = text;
    }
}

let gameStarted = false;
let comedyModeEnabled = true;
let currentArenaClass = "";
let currentPhotoUrl = "";
let pendingArenaDataUrl = "";
let pendingArenaCanPersist = true;
const arenaStorageKey = "faceSmasherArenaPhotos";

const commentaryAnimator = createCommentaryAnimator({
    stage: commentaryStage,
    bubble: commentaryBubble,
    message: commentaryMessage,
    icons: commentaryIcons
});

const comicPopAnimator = createComicPopupAnimator({
    stage: comicPopStage,
    canvas
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
        comicPopAnimator.clear();
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

function applyArenaClass(className) {
    if (currentArenaClass) {
        canvas.classList.remove(currentArenaClass);
    }
    currentArenaClass = className;
    if (currentArenaClass) {
        canvas.classList.add(currentArenaClass);
    }
}

function applyArenaTheme(arena) {
    applyArenaClass(arena.className);
    if (arena.photoUrl) {
        canvas.style.setProperty("--arena-photo", `url("${arena.photoUrl}")`);
    } else {
        canvas.style.removeProperty("--arena-photo");
    }
}

function selectArenaButton(arenaId) {
    if (!arenaButtons) return;
    const selected = arenaButtons.querySelector(".arena-btn.selected");
    if (selected) selected.classList.remove("selected");
    const next = arenaButtons.querySelector(`[data-arena-id="${arenaId}"]`);
    if (next) next.classList.add("selected");
}

function getSavedArenas() {
    try {
        const raw = localStorage.getItem(arenaStorageKey);
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        return [];
    }
}

function saveArenas(arenas) {
    localStorage.setItem(arenaStorageKey, JSON.stringify(arenas));
}

function getArenaList() {
    return [...gameplayAreas, ...getSavedArenas()];
}

function readImageToDataUrl(file) {
    return new Promise((resolve, reject) => {
        if (!file.type || !file.type.startsWith("image/")) {
            reject(new Error("Unsupported file type"));
            return;
        }

        const reader = new FileReader();
        reader.onload = () => resolve({ dataUrl: reader.result, canPersist: true });
        reader.onerror = () => {
            try {
                const tempUrl = URL.createObjectURL(file);
                resolve({ dataUrl: tempUrl, canPersist: false });
            } catch (error) {
                reject(new Error("Image read failed"));
            }
        };
        reader.readAsDataURL(file);
    });
}

function resetArenaUpload() {
    if (arenaPhotoUpload) {
        arenaPhotoUpload.value = "";
    }
}

function openArenaNameModal(defaultName) {
    if (!arenaNameModal || !arenaNameInput || !arenaNameError) return;
    arenaNameInput.value = defaultName || "";
    arenaNameError.classList.add("hidden");
    arenaNameModal.classList.remove("hidden");
    arenaNameInput.focus();
}

function closeArenaNameModal() {
    if (!arenaNameModal) return;
    arenaNameModal.classList.add("hidden");
}

function clearPendingArenaData() {
    if (!pendingArenaCanPersist && pendingArenaDataUrl) {
        URL.revokeObjectURL(pendingArenaDataUrl);
    }
    pendingArenaDataUrl = "";
    pendingArenaCanPersist = true;
}

function savePendingArena() {
    if (!arenaNameInput || !arenaNameError) return;
    const arenaLabel = arenaNameInput.value.trim();
    if (!arenaLabel) {
        arenaNameError.classList.remove("hidden");
        arenaNameInput.focus();
        return;
    }

    if (!pendingArenaDataUrl) {
        closeArenaNameModal();
        return;
    }

    const saved = getSavedArenas();
    const newArena = {
        id: `photo-${Date.now()}`,
        label: arenaLabel,
        className: "arena-photo",
        photoUrl: pendingArenaDataUrl
    };

    if (pendingArenaCanPersist) {
        saved.push(newArena);
        try {
            saveArenas(saved);
            arenaPhotoName.textContent = `${arenaLabel} saved`;
        } catch (error) {
            arenaPhotoName.textContent = `${arenaLabel} loaded (not saved)`;
        }
    } else {
        currentPhotoUrl = pendingArenaDataUrl;
        arenaPhotoName.textContent = `${arenaLabel} loaded (not saved)`;
    }

    buildArenaButtons(newArena.id);
    selectArenaButton(newArena.id);
    applyArenaTheme(newArena);
    pendingArenaDataUrl = "";
    pendingArenaCanPersist = true;
    closeArenaNameModal();
    resetArenaUpload();
}

function buildArenaButtons(selectedId) {
    if (!arenaButtons) return;
    arenaButtons.innerHTML = "";
    const arenas = getArenaList();
    arenas.forEach((arena, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "arena-btn";
        button.textContent = arena.label;
        button.dataset.arenaId = arena.id;

        if ((selectedId && selectedId === arena.id) || (index === 0 && !currentArenaClass)) {
            button.classList.add("selected");
            applyArenaTheme(arena);
        }

        button.addEventListener("click", () => {
            selectArenaButton(arena.id);
            applyArenaTheme(arena);
        });

        arenaButtons.appendChild(button);
    });
}

buildArenaButtons();

if (arenaPhotoUpload) {
    arenaPhotoUpload.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        arenaPhotoName.textContent = file ? file.name : "No arena photo selected";

        if (!file) return;

        if (currentPhotoUrl) {
            URL.revokeObjectURL(currentPhotoUrl);
            currentPhotoUrl = "";
        }

        clearPendingArenaData();

        try {
            const fileLabel = file.name.replace(/\.[^/.]+$/, "").trim();
            const arenaLabel = fileLabel || "Photo Arena";
            const result = await readImageToDataUrl(file);
            pendingArenaDataUrl = result.dataUrl;
            pendingArenaCanPersist = result.canPersist;
            openArenaNameModal(arenaLabel);
        } catch (error) {
            arenaPhotoName.textContent = "Image failed to load";
        }
    });
}

if (arenaNameCancel) {
    arenaNameCancel.addEventListener("click", () => {
        clearPendingArenaData();
        closeArenaNameModal();
        resetArenaUpload();
        arenaPhotoName.textContent = "No arena photo selected";
    });
}

if (arenaNameSave) {
    arenaNameSave.addEventListener("click", savePendingArena);
}

if (arenaNameInput) {
    arenaNameInput.addEventListener("input", () => {
        if (arenaNameError) {
            arenaNameError.classList.add("hidden");
        }
    });

    arenaNameInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            savePendingArena();
        }
    });
}

if (arenaNameModal) {
    arenaNameModal.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            event.preventDefault();
            if (arenaNameCancel) {
                arenaNameCancel.click();
            }
        }
    });
}

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
    onSuccessfulSmash: ({ score, toolName, combo, hitPos }) => {
        if (!comedyModeEnabled) {
            commentaryAnimator.clear();
            comicPopAnimator.clear();
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

        const comicText = getComicHitText(toolName, combo);
        comicPopAnimator.show(comicText, hitPos, toolName, combo, "hit");
    },
    onMissSmash: ({ toolName }) => {
        if (comedyModeEnabled) {
            const message = getMissMessage(toolName);
            setStatusMessage(message);
            commentaryAnimator.showMiss(message, toolName);
            const comicText = getComicMissText(toolName);
            comicPopAnimator.show(comicText, getMousePosition(), toolName, 0, "miss");
            return;
        }

        commentaryAnimator.clear();
        comicPopAnimator.clear();
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
        if (arenaSection) {
            arenaSection.classList.remove('hidden');
        }
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
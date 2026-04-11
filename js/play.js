import {
  face,
  loadFaceFromUrl,
  resetFacePosition,
  clearMarks,
} from "./face.js";
import { getGame } from "./firebase.js";
import { setupGameEngine } from "./components/game-engine.js";
import { createPlayState } from "./components/play-state.js";
import { setupPlayShareModal } from "./components/play-share-modal.js";

const canvas = document.getElementById("gameCanvas");
const canvasWrapper = document.getElementById("canvasWrapper");
const scoreLabel = document.getElementById("scoreLabel");
const instructions = document.getElementById("instructions");
const loadingScreen = document.getElementById("loadingScreen");
const errorScreen = document.getElementById("errorScreen");
const brandEl = document.getElementById("playBrand");

canvas.width = 1200;
canvas.height = 850;

const { game, touchStartHandler, startGameTimer } = setupGameEngine(
  canvas,
  scoreLabel,
);

const playState = createPlayState({
  canvasEl: canvas,
  loadingEl: loadingScreen,
  errorEl: errorScreen,
  instructionsEl: instructions,
  brandEl,
  onStartGame: startGameTimer,
});

canvas.addEventListener("mousedown", () => {
  if (face.loaded) game.handleSmash();
});

canvas.addEventListener(
  "touchstart",
  (e) => {
    touchStartHandler(e);
    if (face.loaded) game.handleSmash();
  },
  { passive: false },
);

document.getElementById("resetScoreBtn").onclick = () => {
  game.resetScore(scoreLabel);
  clearMarks();
};

document.getElementById("resetSpeedBtn").onclick = () => game.resetSpeed();

setupPlayShareModal({
  modalEl: document.getElementById("shareModal"),
  backdropEl: document.getElementById("shareBackdrop"),
  openBtnEl: document.getElementById("shareBtn"),
  closeBtnEl: document.getElementById("shareClose"),
  copyBtnEl: document.getElementById("shareCopyBtn"),
  inputEl: document.getElementById("shareInput"),
  waEl: document.getElementById("shareWa"),
  twEl: document.getElementById("shareTw"),
  fbEl: document.getElementById("shareFb"),
  getShareUrl: () => window.location.href,
});

const gameId = new URLSearchParams(location.search).get("g");

if (!gameId) {
  playState.showError("No game ID");
  throw new Error("No game ID provided");
}

async function loadGame() {
  playState.showLoading();

  try {
    const gameData = await getGame(gameId);

    if (!gameData) {
      playState.showError("Game Not Found");
      return;
    }

    if (gameData.name) {
      playState.setBrand(`👊 ${gameData.name.toUpperCase()} SMASHER`);
    }

    const arenaClass = gameData.arenaClass || "arena-candy";

    if (arenaClass === "arena-photo") {
      canvasWrapper.classList.add("arena-photo");
      const photoUrl = gameData.bgUrl || "linear-gradient(135deg, #444, #111)";
      canvasWrapper.style.setProperty("--arena-photo", `url("${photoUrl}")`);
    } else {
      canvas.classList.add(arenaClass);
    }

    clearMarks();

    loadFaceFromUrl(
      gameData.faceUrl,
      instructions,
      () => resetFacePosition(canvas),
      () => {
        playState.startGame();
      },
    );
  } catch (err) {
    console.error("Failed to load game:", err);
    playState.showError("Failed to load game");
  }
}

loadGame();

// About modal
document.getElementById("aboutBtn")?.addEventListener("click", () => {
  document.getElementById("aboutModal").classList.remove("hidden");
});
document.getElementById("aboutClose")?.addEventListener("click", () => {
  document.getElementById("aboutModal").classList.add("hidden");
});
document.getElementById("aboutBackdrop")?.addEventListener("click", () => {
  document.getElementById("aboutModal").classList.add("hidden");
});
document.getElementById("aboutModal")?.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.getElementById("aboutModal").classList.add("hidden");
  }
});

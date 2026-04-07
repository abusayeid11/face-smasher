import {
  face,
  loadFaceFromUrl,
  loadDefaultFace,
  resetFacePosition,
  clearMarks,
} from "./face.js";
import { setupGameEngine } from "./components/game-engine.js";
import {
  setupFileInput,
  processAndUploadImages,
  convertToWebPOnly,
} from "./components/image-processor.js";
import { saveGame } from "./firebase.js";
import { buildShareLinks } from "./components/share-links.js";
import { addToHistory, renderHistory } from "./components/game-history.js";

const canvas = document.getElementById("gameCanvas");
canvas.width = 1200;
canvas.height = 850;

const scoreEl = document.getElementById("creatorScore");
const instructions = document.getElementById("instructions");
const emptyState = document.getElementById("canvasEmptyState");
const smashNameEl = document.getElementById("smashName");

let faceUrl = null;
let bgUrl = null;

function setArena(arenaClass, photoUrl = null) {
  canvas.className = "";
  canvas.classList.add(arenaClass);
  if (photoUrl) {
    canvas.style.setProperty("--arena-photo", `url("${photoUrl}")`);
  } else {
    canvas.style.removeProperty("--arena-photo");
  }
}

function setCustomBackground(url) {
  bgUrl = url;
  canvas.className = "arena-photo";
  canvas.style.setProperty("--arena-photo", `url("${url}")`);
  document.getElementById("bgHint").textContent = "✓ Custom background set";
  document.getElementById("uploadBgBtn").textContent = "Change Photo";

  document
    .querySelectorAll(".arena-btn")
    .forEach((btn) => btn.classList.remove("selected"));
}

function initArenaButtons() {
  const arenaBtns = document.querySelectorAll(".arena-btn");

  arenaBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      arenaBtns.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");

      const arena = btn.dataset.arena;

      if (arena === "arena-sust") {
        setArena("arena-photo", "arenas/SUST%20Gate.png");
      } else if (arena === "arena-vikings") {
        setArena("arena-photo", "arenas/Vikings.png");
      } else {
        setArena(arena);
      }

      bgUrl = null;
      document.getElementById("bgHint").textContent = "No custom background";
      document.getElementById("uploadBgBtn").textContent = "Upload Photo";
    });
  });

  setArena("arena-candy");
}

const { game, startGameTimer } = setupGameEngine(canvas, scoreEl);

document.getElementById("creatorReset").onclick = () => {
  game.resetScore(scoreEl);
  clearMarks();
};

document.getElementById("creatorResetSpeed").onclick = () => game.resetSpeed();

async function handleFaceLoaded(dataUrl) {
  const webpUrl = await convertToWebPOnly(dataUrl);
  faceUrl = webpUrl;
  document.getElementById("faceHint").textContent = "✓ Face loaded (WebP)";
  const uploadFaceBtn = document.getElementById("uploadFaceBtn");
  if (uploadFaceBtn) uploadFaceBtn.textContent = "Change Photo";
  emptyState.classList.add("hidden");
  clearMarks();
  game.resetScore(scoreEl);
  loadFaceFromUrl(
    webpUrl,
    instructions,
    () => resetFacePosition(canvas),
    () => {
      startGameTimer();
      instructions.textContent = "Click the canvas to try smashing!";
    },
  );
}

async function handleBgLoaded(dataUrl) {
  const webpUrl = await convertToWebPOnly(dataUrl);
  setCustomBackground(webpUrl);
}

setupFileInput("faceFileInput", "uploadFaceBtn", handleFaceLoaded);
setupFileInput("bgFileInput", "uploadBgBtn", handleBgLoaded);

initArenaButtons();

loadDefaultFace(
  instructions,
  () => resetFacePosition(canvas),
  () => {
    emptyState.classList.add("hidden");
    startGameTimer();
    instructions.textContent = "Click to smash the face!";
  },
);

// History panel
document
  .getElementById("historyToggleBtn")
  ?.addEventListener("click", () =>
    document.getElementById("historyPanel").classList.toggle("open"),
  );
document
  .getElementById("historyCloseBtn")
  ?.addEventListener("click", () =>
    document.getElementById("historyPanel").classList.remove("open"),
  );

// Generate link
document.getElementById("generateBtn").addEventListener("click", async () => {
  const btn = document.getElementById("generateBtn");

  if (!faceUrl) {
    alert("Please upload a face photo first.");
    return;
  }

  btn.disabled = true;
  btn.textContent = "Processing…";
  instructions.textContent = "Detecting face and uploading...";

  try {
    const { faceUrl: cloudFaceUrl, bgUrl: cloudBgUrl } =
      await processAndUploadImages(faceUrl, bgUrl);

    btn.textContent = "Saving...";

    const name = smashNameEl?.value.trim() || "";
    const id = await saveGame(cloudFaceUrl, cloudBgUrl || "", name);
    const url = `${window.location.href.replace(/\/[^/]*$/, "/")}play.html?g=${id}`;

    document.getElementById("gameLink").value = url;
    document.getElementById("playLink").href = url;

    buildShareLinks({
      url,
      waEl: document.getElementById("shareWa"),
      twEl: document.getElementById("shareTw"),
      fbEl: document.getElementById("shareFb"),
    });

    document.getElementById("linkBox").classList.remove("hidden");
    btn.textContent = "🔗 Regenerate Link";

    addToHistory(id, url, faceUrl, bgUrl, name);
    renderHistory();
    instructions.textContent = "Click the canvas to try smashing!";
  } catch (err) {
    console.error(err);
    btn.textContent = "Error – try again";
    btn.disabled = false;
    instructions.textContent = "Upload a face to get started";
  }
});

document.getElementById("copyBtn")?.addEventListener("click", () => {
  const linkInput = document.getElementById("gameLink");
  navigator.clipboard.writeText(linkInput.value).then(() => {
    const btn = document.getElementById("copyBtn");
    btn.textContent = "Copied!";
    setTimeout(() => {
      btn.textContent = "Copy";
    }, 2000);
  });
});

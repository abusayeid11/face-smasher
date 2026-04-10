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
  uploadLocalImage,
} from "./components/image-processor.js";
import { saveGame } from "./firebase.js";
import { buildShareLinks } from "./components/share-links.js";
import { addToHistory, renderHistory } from "./components/game-history.js";

const canvas = document.getElementById("gameCanvas");
const canvasWrapper = document.getElementById("canvasWrapper");
canvas.width = 1200;
canvas.height = 850;

const scoreEl = document.getElementById("creatorScore");
const instructions = document.getElementById("instructions");
const emptyState = document.getElementById("canvasEmptyState");
const smashNameEl = document.getElementById("smashName");

let faceUrl = null;
let bgUrl = null;
let currentArenaClass = "arena-candy";
let inbuiltBgPath = null;

function setArena(arenaClass, photoUrl = null) {
  canvas.className = "";
  canvasWrapper.className = "canvas-wrapper";
  canvasWrapper.style.removeProperty("--arena-photo");

  if (photoUrl) {
    currentArenaClass = "arena-photo";
    inbuiltBgPath = photoUrl;
    canvasWrapper.className = "canvas-wrapper arena-photo";
    canvasWrapper.style.setProperty("--arena-photo", `url("${photoUrl}")`);
  } else {
    currentArenaClass = arenaClass;
    inbuiltBgPath = null;
    canvas.classList.add(arenaClass);
  }
}

function setCustomBackground(url) {
  bgUrl = url;
  currentArenaClass = "arena-photo";
  canvasWrapper.className = "canvas-wrapper arena-photo";
  canvasWrapper.style.setProperty("--arena-photo", `url("${url}")`);
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
        inbuiltBgPath = null;
      }

      bgUrl = null;
      document.getElementById("bgHint").textContent = "No custom background";
      document.getElementById("uploadBgBtn").textContent = "Upload Photo";

      const generateBtn = document.getElementById("generateBtn");
      generateBtn.textContent = "🔗 Generate Smash Link";
      generateBtn.disabled = false;
      document.getElementById("linkBox").classList.add("hidden");
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
  game.resetSpeed();

  const generateBtn = document.getElementById("generateBtn");
  generateBtn.textContent = "🔗 Generate Smash Link";
  generateBtn.disabled = false;
  document.getElementById("linkBox").classList.add("hidden");

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

  const generateBtn = document.getElementById("generateBtn");
  generateBtn.textContent = "🔗 Generate Smash Link";
  generateBtn.disabled = false;
  document.getElementById("linkBox").classList.add("hidden");
}

setupFileInput("faceFileInput", "uploadFaceBtn", handleFaceLoaded);
setupFileInput("bgFileInput", "uploadBgBtn", () => {});

document.getElementById("bgFileInput").addEventListener("change", function () {
  const file = this.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = async (event) => {
      await handleBgLoaded(event.target.result);
      this.value = "";
    };
    reader.readAsDataURL(file);
  }
});

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
async function processAndGenerateLink() {
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

    let finalBgUrl = cloudBgUrl;

    if (currentArenaClass === "arena-photo" && inbuiltBgPath && !bgUrl) {
      instructions.textContent = "Uploading background...";
      finalBgUrl = await uploadLocalImage(inbuiltBgPath);
    }

    btn.textContent = "Saving...";

    const name = smashNameEl?.value.trim() || "";
    const id = await saveGame(
      cloudFaceUrl,
      finalBgUrl || "",
      name,
      currentArenaClass,
    );
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
}

document.getElementById("generateBtn").addEventListener("click", async () => {
  const warningShown = sessionStorage.getItem("shareWarningShown");

  if (!warningShown) {
    const modal = document.getElementById("shareWarningModal");
    const cancelBtn = document.getElementById("shareWarningCancel");
    const confirmBtn = document.getElementById("shareWarningConfirm");

    modal.classList.remove("hidden");

    cancelBtn.onclick = () => {
      modal.classList.add("hidden");
    };

    confirmBtn.onclick = () => {
      modal.classList.add("hidden");
      sessionStorage.setItem("shareWarningShown", "true");
      processAndGenerateLink();
    };

    return;
  }

  processAndGenerateLink();
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

renderHistory();

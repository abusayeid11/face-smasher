// Face module - handles uploaded image
const face = {
  x: 0,
  y: 0,
  baseSize: 200,
  size: 200,
  ready: false,
  image: new Image(),
  marks: [],
  loaded: false,
};

const DEFAULT_FACE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
    <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ffd9a8"/>
            <stop offset="100%" stop-color="#f6b779"/>
        </linearGradient>
    </defs>
    <circle cx="120" cy="120" r="108" fill="url(#bg)" stroke="#7a3e1d" stroke-width="8"/>
    <circle cx="84" cy="98" r="12" fill="#1d1d1d"/>
    <circle cx="156" cy="98" r="12" fill="#1d1d1d"/>
    <path d="M75 155 Q120 195 165 155" fill="none" stroke="#6c2d15" stroke-width="10" stroke-linecap="round"/>
    <circle cx="58" cy="130" r="10" fill="#ef8a7a" opacity="0.7"/>
    <circle cx="182" cy="130" r="10" fill="#ef8a7a" opacity="0.7"/>
</svg>
`;

const DEFAULT_FACE_URL = `data:image/svg+xml;utf8,${encodeURIComponent(DEFAULT_FACE_SVG.trim())}`;

function applyFaceSource(
  src,
  instructions,
  resetCallback,
  startTimerCallback,
  readyText,
) {
  face.image.onload = () => {
    face.ready = true;
    face.loaded = true;
    updateFaceScale();
    instructions.textContent = readyText;
    resetCallback();
    startTimerCallback();
  };
  face.image.src = src;
}

function loadFaceFromFile(
  file,
  fileName,
  instructions,
  resetCallback,
  startTimerCallback,
) {
  if (!file) return;

  if (fileName) {
    fileName.textContent = file.name;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    applyFaceSource(
      event.target.result,
      instructions,
      resetCallback,
      startTimerCallback,
      "Ready to smash! Tap to smash the face.",
    );
  };
  reader.readAsDataURL(file);
}

function loadFaceFromUrl(url, instructions, resetCallback, startTimerCallback) {
  applyFaceSource(
    url,
    instructions,
    resetCallback,
    startTimerCallback,
    "Ready to smash! Tap to smash the face.",
  );
}

function loadDefaultFace(instructions, resetCallback, startTimerCallback) {
  const src = DEFAULT_FACE_URL;
  applyFaceSource(
    src,
    instructions,
    resetCallback,
    startTimerCallback,
    "Using default face. Tap to smash!",
  );
}

function resetFacePosition(canvas) {
  if (face.loaded) {
    face.x = Math.random() * (canvas.width - face.size);
    face.y = Math.random() * (canvas.height - face.size);
  }
}

function updateFaceScale() {
  const viewportWidth = window.innerWidth;
  const baseWidth = 800;

  let scale = 1;
  if (viewportWidth < 600) {
    scale = 1.2;
  } else if (viewportWidth < baseWidth) {
    scale = viewportWidth / baseWidth;
  }

  face.size = face.baseSize * scale;
}

function clearMarks() {
  face.marks = [];
}

export {
  face,
  DEFAULT_FACE_URL,
  loadFaceFromFile,
  loadFaceFromUrl,
  loadDefaultFace,
  resetFacePosition,
  updateFaceScale,
  clearMarks,
};

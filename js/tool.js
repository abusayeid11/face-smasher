let currentToolName = "punch";

const tool = {
  size: 120,
  baseSize: 120,
  image: null,
  smashAnim: 0,
};

const toolImages = {
  punch: { image: new Image(), ready: false },
  slap: { image: new Image(), ready: false },
  hammer: { image: new Image(), ready: false },
  whip: { image: new Image(), ready: false },
  rose: { image: new Image(), ready: false },
};

function loadTools() {
  toolImages.punch.image.onload = () => {
    toolImages.punch.ready = true;
    tool.image = toolImages.punch.image;
  };
  toolImages.punch.image.src = "tools/fist.webp";

  toolImages.slap.image.onload = () => {
    toolImages.slap.ready = true;
  };
  toolImages.slap.image.src = "tools/slap.webp";

  toolImages.hammer.image.onload = () => {
    toolImages.hammer.ready = true;
  };
  toolImages.hammer.image.src = "tools/hammer.webp";

  toolImages.whip.image.onload = () => {
    toolImages.whip.ready = true;
  };
  toolImages.whip.image.src = "tools/whip.webp";

  toolImages.rose.image.onload = () => {
    toolImages.rose.ready = true;
  };
  toolImages.rose.image.src = "tools/flower.webp";
}

function initToolSelector() {
  document.querySelectorAll(".tool-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".tool-btn")
        .forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      currentToolName = btn.dataset.tool;
      tool.image = toolImages[currentToolName].image;
    });
  });
}

function updateToolScale() {
  const viewportWidth = window.innerWidth;
  const baseWidth = 800;

  let scale = 1;
  if (viewportWidth < 600) {
    scale = 1.2;
  } else if (viewportWidth < baseWidth) {
    scale = viewportWidth / baseWidth;
  }

  tool.size = tool.baseSize * scale;
}

function getCurrentToolName() {
  const selectedButton = document.querySelector(".tool-btn.selected");
  if (selectedButton && selectedButton.dataset.tool) {
    currentToolName = selectedButton.dataset.tool;
  }
  return currentToolName;
}

export {
  tool,
  loadTools,
  initToolSelector,
  updateToolScale,
  getCurrentToolName,
};

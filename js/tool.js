// Tool module - handles tool loading and switching

let currentToolName = 'fist';

const tool = {
    size: 70,
    baseSize: 70,
    image: null,
    smashAnim: 0
};

// Tool images storage
const toolImages = {
    fist: { image: new Image(), ready: false },
    hammer: { image: new Image(), ready: false },
    glove: { image: new Image(), ready: false }
};

// Load all tools
function loadTools() {
    // Load fist (primary)
    toolImages.fist.image.onload = () => {
        toolImages.fist.ready = true;
        tool.image = toolImages.fist.image;
    };
    toolImages.fist.image.src = "tools/fist.webp";
    
    // Load hammer (placeholder - use fist for now)
    toolImages.hammer.image.onload = () => {
        toolImages.hammer.ready = true;
    };
    toolImages.hammer.image.src = "tools/fist.webp";
    
    // Load glove (placeholder - use fist for now)
    toolImages.glove.image.onload = () => {
        toolImages.glove.ready = true;
    };
    toolImages.glove.image.src = "tools/fist.webp";
}

function initToolSelector() {
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
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

export { tool, currentToolName, loadTools, initToolSelector, updateToolScale };
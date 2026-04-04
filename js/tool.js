// Tool module - handles tool loading and switching

let currentToolName = 'punch';

const tool = {
    size: 70,
    baseSize: 70,
    image: null,
    smashAnim: 0
};

// Tool images storage
const toolImages = {
    punch: { image: new Image(), ready: false },
    slap: { image: new Image(), ready: false },
    hammer: { image: new Image(), ready: false }
};

// Load all tools
function loadTools() {
    // Load punch
    toolImages.punch.image.onload = () => {
        toolImages.punch.ready = true;
        tool.image = toolImages.punch.image;
    };
    toolImages.punch.image.src = "tools/fist.webp";
    
    // Load slap
    toolImages.slap.image.onload = () => {
        toolImages.slap.ready = true;
    };
    toolImages.slap.image.src = "tools/slap.webp";
    
    // Load hammer
    toolImages.hammer.image.onload = () => {
        toolImages.hammer.ready = true;
    };
    toolImages.hammer.image.src = "tools/hammer.webp";
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

function getCurrentToolName() {
    const selectedButton = document.querySelector('.tool-btn.selected');
    if (selectedButton && selectedButton.dataset.tool) {
        currentToolName = selectedButton.dataset.tool;
    }
    return currentToolName;
}

export { tool, loadTools, initToolSelector, updateToolScale, getCurrentToolName };
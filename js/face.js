// Face module - handles uploaded image
const face = {
    x: 0,
    y: 0,
    baseSize: 140,
    size: 140,
    ready: false,
    image: new Image(),
    marks: [],
    loaded: false
};

function initFace(imageUpload, fileName, instructions, resetCallback, startTimerCallback) {
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            fileName.textContent = file.name;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                face.image.onload = () => {
                    face.ready = true;
                    face.loaded = true;
                    updateFaceScale();
                    instructions.textContent = "Ready to smash! Tap to smash the face.";
                    resetCallback();
                    startTimerCallback();
                };
                face.image.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
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

export { face, initFace, resetFacePosition, updateFaceScale, clearMarks };
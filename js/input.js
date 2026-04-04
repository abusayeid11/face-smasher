// Input module - handles mouse and touch input

let mouseX = 0;
let mouseY = 0;

function setupMouseInput(canvas) {
    canvas.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        mouseX = (e.clientX - rect.left) * scaleX;
        mouseY = (e.clientY - rect.top) * scaleY;
    });
}

function setupTouchInput(canvas) {
    canvas.addEventListener("touchmove", (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const touch = e.touches[0];
        mouseX = (touch.clientX - rect.left) * scaleX;
        mouseY = (touch.clientY - rect.top) * scaleY;
    }, { passive: false });
    
    return canvas.addEventListener("touchstart", (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const touch = e.touches[0];
        mouseX = (touch.clientX - rect.left) * scaleX;
        mouseY = (touch.clientY - rect.top) * scaleY;
    }, { passive: false });
}

function getMousePosition() {
    return { x: mouseX, y: mouseY };
}

export { setupMouseInput, setupTouchInput, getMousePosition };
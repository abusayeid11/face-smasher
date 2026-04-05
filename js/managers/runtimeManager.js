function initRuntimeManager(options) {
    const {
        updateFaceScale,
        updateToolScale,
        unlockAudio
    } = options || {};

    function updateAllScales() {
        updateFaceScale();
        updateToolScale();
    }

    window.addEventListener("resize", updateAllScales);
    updateAllScales();

    document.addEventListener("touchstart", unlockAudio, { once: true, passive: true });
    document.addEventListener("mousedown", unlockAudio, { once: true });
}

export { initRuntimeManager };

function initInputManager(options) {
    const {
        canvas,
        setupMouseInput,
        setupTouchInput,
        isGameStarted,
        onSmash
    } = options || {};

    setupMouseInput(canvas);
    const touchStartHandler = setupTouchInput(canvas);

    canvas.addEventListener("mousedown", () => {
        if (isGameStarted()) {
            onSmash();
        }
    });

    canvas.addEventListener("touchstart", (e) => {
        touchStartHandler(e);
        if (isGameStarted()) {
            onSmash();
        }
    }, { passive: false });
}

export { initInputManager };

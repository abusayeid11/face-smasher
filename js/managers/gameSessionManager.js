function createGameSessionManager(options) {
    const {
        setupImageUpload,
        setupFileName,
        startGameBtn,
        setupOverlay,
        gameplayArea,
        arenaSection,
        commentaryMessage,
        canvas,
        scoreLabel,
        face,
        unlockAudio,
        loadFaceFromFile,
        loadDefaultFace,
        resetFacePosition,
        clearMarks
    } = options || {};

    let gameStarted = false;
    let gameTimer = null;
    let game = null;

    function setGame(gameInstance) {
        game = gameInstance;
    }

    function isGameStarted() {
        return gameStarted;
    }

    function startGameTimer() {
        clearInterval(gameTimer);
        if (face.loaded && game) {
            gameTimer = setInterval(
                () => resetFacePosition(canvas),
                game.getSpeed()
            );
        }
    }

    function onFaceReady() {
        gameStarted = true;
        setupOverlay.classList.add("hidden");
        gameplayArea.classList.remove("hidden");
        if (arenaSection) {
            arenaSection.classList.remove("hidden");
        }
    }

    function bindSetupImageUpload() {
        if (!setupImageUpload) return;

        setupImageUpload.addEventListener("change", (e) => {
            const file = e.target.files[0];
            setupFileName.textContent = file
                ? file.name
                : "No file selected (default face will be used)";

            // If game has already started, replace the face immediately.
            if (file && gameStarted && game) {
                unlockAudio();
                loadFaceFromFile(
                    file,
                    setupFileName,
                    commentaryMessage,
                    () => resetFacePosition(canvas),
                    () => {
                        game.resetScore(scoreLabel);
                        clearMarks();
                    }
                );
            }
        });
    }

    function bindStartButton() {
        if (!startGameBtn) return;

        startGameBtn.addEventListener("click", () => {
            unlockAudio();
            const selectedFile = setupImageUpload.files[0];

            if (selectedFile) {
                loadFaceFromFile(
                    selectedFile,
                    setupFileName,
                    commentaryMessage,
                    () => resetFacePosition(canvas),
                    () => {
                        startGameTimer();
                        onFaceReady();
                    }
                );
            } else {
                loadDefaultFace(
                    commentaryMessage,
                    () => resetFacePosition(canvas),
                    () => {
                        startGameTimer();
                        onFaceReady();
                    }
                );
            }
        });
    }

    function init() {
        bindSetupImageUpload();
        bindStartButton();
    }

    return {
        init,
        setGame,
        isGameStarted,
        startGameTimer
    };
}

export { createGameSessionManager };

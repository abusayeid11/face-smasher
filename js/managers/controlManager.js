function initControlManager(options) {
    const {
        resetScoreBtn,
        resetSpeedBtn,
        game,
        scoreLabel,
        clearMarks
    } = options || {};

    if (resetScoreBtn) {
        resetScoreBtn.onclick = () => {
            game.resetScore(scoreLabel);
            clearMarks();
        };
    }

    if (resetSpeedBtn) {
        resetSpeedBtn.onclick = () => {
            game.resetSpeed();
        };
    }
}

export { initControlManager };

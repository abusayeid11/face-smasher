/**
 * Encapsulates play page loading/error/branding/background state updates.
 * This prevents scattered UI updates and keeps flow handling easy to follow.
 *
 * @param {{
 *   canvasEl: HTMLCanvasElement,
 *   loadingEl: HTMLElement,
 *   errorEl: HTMLElement,
 *   instructionsEl: HTMLElement,
 *   brandEl: HTMLElement,
 *   onStartGame: () => void
 * }} refs
 */
export function createPlayState(refs) {
    const {
        canvasEl,
        loadingEl,
        errorEl,
        instructionsEl,
        brandEl,
        onStartGame,
    } = refs;

    function showError() {
        loadingEl.classList.add('hidden');
        errorEl.classList.remove('hidden');
    }

    function hideLoading() {
        loadingEl.classList.add('hidden');
    }

    function applyGameMeta(gameData) {
        if (gameData.name) {
            const title = `${gameData.name.toUpperCase()} SMASHER`;
            brandEl.textContent = `👊 ${title}`;
            document.title = title;
        }

        if (gameData.bgUrl) {
            canvasEl.classList.add('arena-photo');
            canvasEl.style.setProperty('--arena-photo', `url("${gameData.bgUrl}")`);
        }
    }

    function onFaceLoaded() {
        onStartGame();
        hideLoading();
        instructionsEl.textContent = 'Tap to smash!';
    }

    return {
        showError,
        hideLoading,
        applyGameMeta,
        onFaceLoaded,
    };
}

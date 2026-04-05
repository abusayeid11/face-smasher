export function createPlayState({ canvasEl, loadingEl, errorEl, instructionsEl, brandEl, onStartGame }) {
    function showLoading() {
        loadingEl?.classList.remove('hidden');
        errorEl?.classList.add('hidden');
        canvasEl.style.display = 'none';
    }
    
    function hideLoading() {
        loadingEl?.classList.add('hidden');
        canvasEl.style.display = 'block';
    }
    
    function showError(msg = 'Game Not Found') {
        loadingEl?.classList.add('hidden');
        errorEl?.classList.remove('hidden');
        canvasEl.style.display = 'none';
        if (errorEl) {
            const title = errorEl.querySelector('h2');
            if (title) title.textContent = msg;
        }
    }
    
    function setInstructions(text) {
        if (instructionsEl) instructionsEl.textContent = text;
    }
    
    function setBrand(text) {
        if (brandEl) brandEl.textContent = text;
    }
    
    function startGame() {
        hideLoading();
        setInstructions('Tap to smash!');
        if (typeof onStartGame === 'function') onStartGame();
    }
    
    return {
        showLoading,
        hideLoading,
        showError,
        setInstructions,
        setBrand,
        startGame
    };
}
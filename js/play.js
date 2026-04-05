import { face, loadFaceFromUrl, resetFacePosition, clearMarks } from './face.js';
import { getGame } from './firebase.js';
import { showCommentaryAt } from './commentary.js';
import { setupGameEngine } from './components/game-engine.js';
import { setupPlayShareModal } from './components/play-share-modal.js';
import { createPlayState } from './components/play-state.js';

// Core gameplay DOM references.
const canvas = document.getElementById('gameCanvas');
const scoreLabel = document.getElementById('scoreLabel');
const instructions = document.getElementById('instructions');
const loadingScreen = document.getElementById('loadingScreen');
const errorScreen = document.getElementById('errorScreen');
const brandEl = document.getElementById('playBrand');

const { game, touchStartHandler, startGameTimer } = setupGameEngine(canvas, scoreLabel);
const playState = createPlayState({
    canvasEl: canvas,
    loadingEl: loadingScreen,
    errorEl: errorScreen,
    instructionsEl: instructions,
    brandEl,
    onStartGame: startGameTimer,
});

// Shared smash behavior for mouse/touch to avoid repeated logic.
function handleSmashWithCommentary() {
    const result = game.handleSmash();
    showCommentaryAt(canvas, result.hit, result.x, result.y);
}

canvas.addEventListener('mousedown', handleSmashWithCommentary);
canvas.addEventListener('touchstart', (e) => {
    touchStartHandler(e);
    handleSmashWithCommentary();
}, { passive: false });

document.getElementById('resetScoreBtn').onclick = () => { game.resetScore(scoreLabel); clearMarks(); };
document.getElementById('resetSpeedBtn').onclick = () => game.resetSpeed();

// Componentized share modal wiring.
setupPlayShareModal({
    modalEl: document.getElementById('shareModal'),
    backdropEl: document.getElementById('shareBackdrop'),
    openBtnEl: document.getElementById('shareBtn'),
    closeBtnEl: document.getElementById('shareClose'),
    copyBtnEl: document.getElementById('shareCopyBtn'),
    inputEl: document.getElementById('shareInput'),
    waEl: document.getElementById('shareWa'),
    twEl: document.getElementById('shareTw'),
    fbEl: document.getElementById('shareFb'),
    getShareUrl: () => window.location.href,
});

// Load shared game configuration from URL query.
const gameId = new URLSearchParams(location.search).get('g');

if (!gameId) {
    playState.showError();
} else {
    getGame(gameId)
        .then((data) => {
            if (!data || !data.faceUrl) {
                playState.showError();
                return;
            }

            playState.applyGameMeta(data);

            loadFaceFromUrl(
                data.faceUrl,
                instructions,
                () => resetFacePosition(canvas),
                () => playState.onFaceLoaded()
            );
        })
        .catch(() => {
            playState.showError();
        });
}

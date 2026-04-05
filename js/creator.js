import { face, loadFaceFromUrl, loadDefaultFace, resetFacePosition, clearMarks } from './face.js';
import { saveGame } from './firebase.js';
import { showCommentaryAt } from './commentary.js';
import { setupGameEngine } from './components/game-engine.js';
import { createUploadWidget } from './components/cloudinary-uploader.js';
import { buildShareLinks } from './components/share-links.js';
import { addToHistory, renderHistory } from './components/game-history.js';

// ── Canvas & game ─────────────────────────────────────────────
const canvas       = document.getElementById('gameCanvas');
const scoreEl      = document.getElementById('creatorScore');
const instructions = document.getElementById('instructions');
const emptyState   = document.getElementById('canvasEmptyState');
const smashNameEl  = document.getElementById('smashName');
const titleEl      = document.getElementById('pageTitle');

function buildTitle(name) {
    return name.trim() ? `${name.trim().toUpperCase()} SMASHER` : 'FACE SMASHER';
}

smashNameEl?.addEventListener('input', () => {
    if (titleEl) titleEl.textContent = buildTitle(smashNameEl.value);
});

const { game, touchStartHandler, startGameTimer } = setupGameEngine(canvas, scoreEl);

function useDefaultBlackBackground() {
    canvas.classList.remove('arena-photo');
    canvas.style.removeProperty('--arena-photo');
}

// ── Commentary ────────────────────────────────────────────────
const commentaryToggle = document.getElementById('commentaryToggle');
const commentaryStatus = document.getElementById('commentaryStatus');
let commentaryEnabled = true;

commentaryToggle?.addEventListener('change', () => {
    commentaryEnabled = commentaryToggle.checked;
    if (commentaryStatus) commentaryStatus.textContent = commentaryEnabled ? 'On' : 'Off';
});

canvas.addEventListener('mousedown', () => {
    if (face.loaded) {
        const result = game.handleSmash();
        if (commentaryEnabled) {
            const toolName = document.querySelector('.tool-btn.selected')?.dataset.tool || 'punch';
            showCommentaryAt(canvas, result.hit, result.x, result.y, toolName);
        }
    }
});
canvas.addEventListener('touchstart', (e) => {
    touchStartHandler(e);
    if (face.loaded) {
        const result = game.handleSmash();
        if (commentaryEnabled) {
            const toolName = document.querySelector('.tool-btn.selected')?.dataset.tool || 'punch';
            showCommentaryAt(canvas, result.hit, result.x, result.y, toolName);
        }
    }
}, { passive: false });

// Auto-load default face
loadDefaultFace(
    instructions,
    () => resetFacePosition(canvas),
    () => { startGameTimer(); instructions.textContent = 'Upload a face or smash the default one!'; }
);
emptyState.classList.add('hidden');

// ── History panel (mobile toggle) ────────────────────────────
document.getElementById('historyToggleBtn')?.addEventListener('click', () =>
    document.getElementById('historyPanel').classList.toggle('open'));
document.getElementById('historyCloseBtn')?.addEventListener('click', () =>
    document.getElementById('historyPanel').classList.remove('open'));

document.getElementById('creatorReset').onclick      = () => { game.resetScore(scoreEl); clearMarks(); };
document.getElementById('creatorResetSpeed').onclick = () => game.resetSpeed();

// ── Upload widgets ────────────────────────────────────────────
let faceUrl = null;
let bgUrl   = null;

const checkReady = () => {
    document.getElementById('generateBtn').disabled = !faceUrl;
};

useDefaultBlackBackground();
checkReady();

const uploadFaceBtn = document.getElementById('uploadFaceBtn');

const faceWidget = createUploadWidget((url) => {
    faceUrl = url;
    document.getElementById('faceHint').textContent = '✓ Face uploaded';
    if (uploadFaceBtn) uploadFaceBtn.textContent = 'Change Photo';
    emptyState.classList.add('hidden');
    clearMarks();
    game.resetScore(scoreEl);
    loadFaceFromUrl(url, instructions,
        () => resetFacePosition(canvas),
        () => { startGameTimer(); instructions.textContent = 'Click the canvas to try smashing!'; }
    );
    checkReady();
}, {
    cropping:          true,
    croppingAspectRatio: 1,
    showSkipCropButton:  false,
});

const bgWidget = createUploadWidget((url) => {
    bgUrl = url;
    document.getElementById('bgHint').textContent = '✓ Background uploaded';
    canvas.classList.add('arena-photo');
    canvas.style.setProperty('--arena-photo', `url("${url}")`);
    checkReady();
});

uploadFaceBtn?.addEventListener('click', () => faceWidget.open());
document.getElementById('uploadBgBtn').addEventListener('click',   () => bgWidget.open());

// ── Generate link ─────────────────────────────────────────────
document.getElementById('generateBtn').addEventListener('click', async () => {
    const btn = document.getElementById('generateBtn');

    if (!faceUrl) {
        alert('Please upload a face photo first.');
        return;
    }

    btn.disabled = true;
    btn.textContent = 'Generating…';

    try {
        const name = smashNameEl?.value.trim() || '';
        const id  = await saveGame(faceUrl, bgUrl || '', name);
        const url = `${window.location.href.replace(/\/[^/]*$/, '/')}play.html?g=${id}`;

        document.getElementById('gameLink').value = url;
        document.getElementById('playLink').href  = url;
        buildShareLinks({
            url,
            waEl: document.getElementById('shareWa'),
            twEl: document.getElementById('shareTw'),
            fbEl: document.getElementById('shareFb'),
        });
        document.getElementById('linkBox').classList.remove('hidden');
        btn.textContent = '🔗 Regenerate Link';
        addToHistory(id, url, faceUrl, bgUrl, name);
    } catch (err) {
        console.error(err);
        btn.textContent = 'Error – try again';
    }

    btn.disabled = false;
});

document.getElementById('copyBtn').addEventListener('click', () => {
    navigator.clipboard.writeText(document.getElementById('gameLink').value).then(() => {
        const btn = document.getElementById('copyBtn');
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
    });
});

renderHistory();

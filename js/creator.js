import { face, loadFaceFromUrl, loadDefaultFace, resetFacePosition, clearMarks } from './face.js';
import { setupGameEngine } from './components/game-engine.js';
import { createUploadWidget } from './components/cloudinary-uploader.js';

const canvas       = document.getElementById('gameCanvas');
const scoreEl      = document.getElementById('creatorScore');
const instructions = document.getElementById('instructions');
const emptyState   = document.getElementById('canvasEmptyState');

let faceUrl = null;
let bgUrl   = null;

function setArena(arenaClass, photoUrl = null) {
    canvas.className = '';
    canvas.classList.add(arenaClass);
    if (photoUrl) {
        canvas.style.setProperty('--arena-photo', `url("${photoUrl}")`);
    } else {
        canvas.style.removeProperty('--arena-photo');
    }
}

function setCustomBackground(url) {
    bgUrl = url;
    canvas.className = 'arena-photo';
    canvas.style.setProperty('--arena-photo', `url("${url}")`);
    document.getElementById('bgHint').textContent = '✓ Custom background set';
    document.getElementById('uploadBgBtn').textContent = 'Change Photo';
    
    document.querySelectorAll('.arena-btn').forEach(btn => btn.classList.remove('selected'));
}

function initArenaButtons() {
    const arenaBtns = document.querySelectorAll('.arena-btn');
    
    arenaBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            arenaBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            
            const arena = btn.dataset.arena;
            
            if (arena === 'arena-sust') {
                setArena('arena-photo', 'arenas/SUST%20Gate.png');
            } else if (arena === 'arena-vikings') {
                setArena('arena-photo', 'arenas/Vikings.png');
            } else {
                setArena(arena);
            }
            
            bgUrl = null;
            document.getElementById('bgHint').textContent = 'No custom background';
            document.getElementById('uploadBgBtn').textContent = 'Upload Photo';
        });
    });
    
    setArena('arena-candy');
}

const checkReady = () => {
    const btn = document.getElementById('generateBtn');
    if (btn) btn.disabled = !faceUrl;
};

const { game, startGameTimer } = setupGameEngine(canvas, scoreEl);

document.getElementById('creatorReset').onclick = () => {
    game.resetScore(scoreEl);
    clearMarks();
};

document.getElementById('creatorResetSpeed').onclick = () => game.resetSpeed();

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
        () => { 
            startGameTimer(); 
            instructions.textContent = 'Click the canvas to try smashing!'; 
        }
    );
    checkReady();
}, {
    cropping:          true,
    croppingAspectRatio: 1,
    showSkipCropButton:  false,
});

const bgWidget = createUploadWidget((url) => {
    setCustomBackground(url);
    checkReady();
});

uploadFaceBtn?.addEventListener('click', () => faceWidget.open());
document.getElementById('uploadBgBtn')?.addEventListener('click', () => bgWidget.open());

initArenaButtons();

loadDefaultFace(
    instructions,
    () => resetFacePosition(canvas),
    () => { 
        emptyState.classList.add('hidden');
        startGameTimer(); 
        instructions.textContent = 'Click to smash the face!'; 
    }
);
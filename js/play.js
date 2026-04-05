import { getGame } from './firebase.js';
import { face, loadFaceFromUrl, resetFacePosition, clearMarks } from './face.js';
import { setupGameEngine } from './components/game-engine.js';
import { buildShareLinks } from './components/share-links.js';
import { initShareModal } from './components/play-share-modal.js';

const canvas = document.getElementById('gameCanvas');
const scoreEl = document.getElementById('scoreLabel');
const instructions = document.getElementById('instructions');
const loadingScreen = document.getElementById('loadingScreen');
const errorScreen = document.getElementById('errorScreen');
const playBrand = document.getElementById('playBrand');

const gameId = new URLSearchParams(window.location.search).get('g');

if (!gameId) {
    loadingScreen.classList.add('hidden');
    errorScreen.classList.remove('hidden');
    throw new Error('No game ID provided');
}

async function loadGame() {
    try {
        const game = await getGame(gameId);
        
        if (!game) {
            loadingScreen.classList.add('hidden');
            errorScreen.classList.remove('hidden');
            return;
        }
        
        loadingScreen.classList.add('hidden');
        
        if (game.name) {
            playBrand.textContent = `👊 ${game.name.toUpperCase()} SMASHER`;
        }
        
        if (game.bgUrl) {
            canvas.classList.add('arena-photo');
            canvas.style.setProperty('--arena-photo', `url("${game.bgUrl}")`);
        } else {
            canvas.classList.add('arena-candy');
        }
        
        clearMarks();
        
        const { game: gameObj, startGameTimer } = setupGameEngine(canvas, scoreEl);
        
        loadFaceFromUrl(game.faceUrl, instructions,
            () => resetFacePosition(canvas),
            () => {
                startGameTimer();
                instructions.textContent = 'Tap to smash!';
            }
        );
        
        document.getElementById('resetScoreBtn').onclick = () => {
            gameObj.resetScore(scoreEl);
            clearMarks();
        };
        
        document.getElementById('resetSpeedBtn').onclick = () => gameObj.resetSpeed();
        
        const shareUrl = window.location.href;
        
        initShareModal(
            document.getElementById('shareBtn'),
            document.getElementById('shareModal'),
            document.getElementById('shareBackdrop'),
            document.getElementById('shareInput'),
            document.getElementById('shareCopyBtn')
        );
        
        document.getElementById('shareInput').value = shareUrl;
        document.getElementById('shareClose').onclick = () => {
            document.getElementById('shareModal').classList.add('hidden');
        };
        
        buildShareLinks({
            url: shareUrl,
            waEl: document.getElementById('shareWa'),
            twEl: document.getElementById('shareTw'),
            fbEl: document.getElementById('shareFb'),
        });
        
    } catch (err) {
        console.error('Failed to load game:', err);
        loadingScreen.classList.add('hidden');
        errorScreen.classList.remove('hidden');
    }
}

loadGame();
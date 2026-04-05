import { deleteGame } from '../firebase.js';

const HISTORY_KEY = 'faceSmasherGameHistory';

function escapeHtml(text = '') {
    return text
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function loadHistory() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
    catch { return []; }
}

function saveHistory(list) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
}

export function addToHistory(id, playUrl, faceUrl, bgUrl, name = '') {
    const list = loadHistory();
    list.unshift({ id, playUrl, faceUrl, bgUrl, name, createdAt: Date.now() });
    saveHistory(list);
    renderHistory();
}

export function renderHistory() {
    const container = document.getElementById('historyList');
    if (!container) return;

    const list = loadHistory();
    if (list.length === 0) {
        container.innerHTML = '<p class="history-empty">No games yet. Create one above!</p>';
        return;
    }

    container.innerHTML = list.map((item) => {
        const gameName = (item.name.toUpperCase() || '').trim()+' smasher';
        const safeName = escapeHtml(gameName);
        const date = new Date(item.createdAt).toLocaleDateString(undefined, {
            month: 'short', day: 'numeric', year: 'numeric'
        });
        const time = new Date(item.createdAt).toLocaleTimeString(undefined, {
            hour: '2-digit', minute: '2-digit'
        });
        return `
        <div class="history-item" data-id="${item.id}">
            <div class="history-thumbs">
                <img class="history-thumb history-thumb-face" src="${item.faceUrl}" alt="face">
                <img class="history-thumb history-thumb-bg"   src="${item.bgUrl}"   alt="bg">
            </div>
            <div class="history-info">
                ${safeName ? `<span class="history-name">${safeName}</span>` : ''}
                <a class="history-play-link" href="${item.playUrl}" target="_blank" rel="noopener">▶ Play</a>
                <span class="history-date">${date} ${time}</span>
            </div>
            <button class="history-delete-btn" data-id="${item.id}" title="Delete">×</button>
        </div>`;
    }).join('');

    container.querySelectorAll('.history-delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            btn.disabled = true;
            btn.textContent = '...';
            try {
                await deleteGame(id);
            } catch (err) {
                console.warn('Firebase delete failed (game may already be gone):', err);
            }
            saveHistory(loadHistory().filter(g => g.id !== id));
            renderHistory();
        });
    });
}

const HISTORY_KEY = 'faceSmasherGameHistory';

export function addToHistory(id, url, faceUrl, bgUrl, name = '') {
    const history = getHistory();
    history.unshift({
        id,
        url,
        faceUrl,
        bgUrl,
        name,
        createdAt: Date.now()
    });
    
    if (history.length > 20) {
        history.pop();
    }
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function getHistory() {
    try {
        const data = localStorage.getItem(HISTORY_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

export function renderHistory() {
    const listEl = document.getElementById('historyList');
    if (!listEl) return;
    
    const history = getHistory();
    
    if (history.length === 0) {
        listEl.innerHTML = '<p class="history-empty">No games yet</p>';
        return;
    }
    
    listEl.innerHTML = history.map(item => `
        <div class="history-item" data-id="${item.id}">
            <div class="history-thumbs">
                <img class="history-thumb history-thumb-face" src="${item.faceUrl}" alt="Face" loading="lazy">
            </div>
            <div class="history-info">
                <a href="${item.url}" class="history-link">${item.name || 'Game ' + item.id}</a>
            </div>
        </div>
    `).join('');
}

export function clearHistory() {
    localStorage.removeItem(HISTORY_KEY);
    renderHistory();
}
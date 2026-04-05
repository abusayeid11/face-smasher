import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getDatabase, ref, set, get, remove } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";
import { FIREBASE_CONFIG } from './config.js';

const app = initializeApp(FIREBASE_CONFIG);
const db  = getDatabase(app);

function generateShortId() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: 7 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

async function saveGame(faceUrl, bgUrl, name = '') {
    const id = generateShortId();
    await set(ref(db, `games/${id}`), { faceUrl, bgUrl, name, createdAt: Date.now() });
    return id;
}

async function getGame(id) {
    const snap = await get(ref(db, `games/${id}`));
    return snap.exists() ? snap.val() : null;
}

async function deleteGame(id) {
    await remove(ref(db, `games/${id}`));
}

export { saveGame, getGame, deleteGame };

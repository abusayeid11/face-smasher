// Comic text module - tool-wise pop-up text selection

import { normalizeToolName } from '../commentary/commentaryText.js';

function makeMessage(text, color, accent, textAnim, toolAnim) {
    return {
        text,
        color,
        accent,
        textAnim,
        toolAnim
    };
}

const COMIC_TEXT_PROFILES = {
    punch: {
        hit: [
            makeMessage("JAB SNAP!", "#e5392d", "#fff6b0", "text-anim-burst", "pop-anim-punch"),
            makeMessage("CROSS CONNECT!", "#ff7a00", "#ffe1a6", "text-anim-spiral", "pop-anim-punch"),
            makeMessage("HOOK HAMMER!", "#c81e1e", "#ffd6a5", "text-anim-burst", "pop-anim-punch"),
            makeMessage("UPPERCUT LIFT!", "#8b1a1a", "#f6c9b0", "text-anim-shock", "pop-anim-punch"),
            makeMessage("KNUCKLE DROP!", "#ff3b6f", "#ffd6e5", "text-anim-spiral", "pop-anim-punch")
        ],
        miss: [
            makeMessage("JAB WHIFF!", "#6b7280", "#e5e7eb", "text-anim-drift", "pop-anim-miss"),
            makeMessage("CROSS MISS!", "#4b5563", "#e5e7eb", "text-anim-drift", "pop-anim-miss"),
            makeMessage("HOOK AIR!", "#7c6f64", "#efe4d6", "text-anim-drift", "pop-anim-miss"),
            makeMessage("UPPERCUT GHOST!", "#6b7280", "#e5e7eb", "text-anim-drift", "pop-anim-miss"),
            makeMessage("FIST LOST!", "#5f5b5b", "#e9e5e3", "text-anim-drift", "pop-anim-miss")
        ],
        combo: [
            makeMessage("COMBO JAB!", "#ff2f2f", "#ffe084", "text-anim-burst", "pop-anim-punch"),
            makeMessage("RAPID CROSS!", "#ff8800", "#ffe1a6", "text-anim-spiral", "pop-anim-punch"),
            makeMessage("DOUBLE HOOK!", "#d72638", "#ffd1b3", "text-anim-burst", "pop-anim-punch"),
            makeMessage("UPPERCUT CHAIN!", "#ff1f4b", "#ffe084", "text-anim-shock", "pop-anim-punch")
        ]
    },
    slap: {
        hit: [
            makeMessage("PALM CRACK!", "#2a7de1", "#c6e3ff", "text-anim-snap", "pop-anim-slap"),
            makeMessage("CHEEK CHECK!", "#1f8fbf", "#c7f0ff", "text-anim-snap", "pop-anim-slap"),
            makeMessage("FIVE-FINGER!", "#19a974", "#c8f4e3", "text-anim-spiral", "pop-anim-slap"),
            makeMessage("HANDPRINT!", "#25b6a9", "#c8f7f2", "text-anim-spiral", "pop-anim-slap"),
            makeMessage("PALM POP!", "#2f6ee8", "#d3e5ff", "text-anim-burst", "pop-anim-slap")
        ],
        miss: [
            makeMessage("PALM WHIFF!", "#7c8cf3", "#dfe3ff", "text-anim-drift", "pop-anim-miss"),
            makeMessage("SLAP SLIP!", "#6a7bd1", "#dfe3ff", "text-anim-drift", "pop-anim-miss"),
            makeMessage("AIR PALM!", "#7c8cf3", "#dfe3ff", "text-anim-drift", "pop-anim-miss"),
            makeMessage("HAND MISSED!", "#5d6bb8", "#dfe3ff", "text-anim-drift", "pop-anim-miss"),
            makeMessage("WRIST WHIFF!", "#7c8cf3", "#dfe3ff", "text-anim-drift", "pop-anim-miss")
        ],
        combo: [
            makeMessage("TRIPLE PALM!", "#1f6ee6", "#c6e3ff", "text-anim-snap", "pop-anim-slap"),
            makeMessage("HAND STORM!", "#2bb7b1", "#c8f7f2", "text-anim-spiral", "pop-anim-slap"),
            makeMessage("PALM BARRAGE!", "#1f8fbf", "#c7f0ff", "text-anim-snap", "pop-anim-slap"),
            makeMessage("FIVE-FINGER FLURRY!", "#1a9cff", "#c6e3ff", "text-anim-burst", "pop-anim-slap")
        ]
    },
    hammer: {
        hit: [
            makeMessage("ANVIL SMASH!", "#d37a1f", "#ffe0b3", "text-anim-shock", "pop-anim-hammer"),
            makeMessage("RIVET RIP!", "#c2410c", "#ffd7b0", "text-anim-burst", "pop-anim-hammer"),
            makeMessage("FORGE STRIKE!", "#b45309", "#ffe0b3", "text-anim-shock", "pop-anim-hammer"),
            makeMessage("FOUNDARY HIT!", "#d9480f", "#ffd7b0", "text-anim-spiral", "pop-anim-hammer"),
            makeMessage("STEEL SLAM!", "#d37a1f", "#ffe0b3", "text-anim-shock", "pop-anim-hammer")
        ],
        miss: [
            makeMessage("HAMMER WHIFF!", "#6b4f2d", "#e8d8c0", "text-anim-drift", "pop-anim-miss"),
            makeMessage("COLD FORGE!", "#6b4f2d", "#e8d8c0", "text-anim-drift", "pop-anim-miss"),
            makeMessage("MIS-SWING!", "#5a4630", "#e8d8c0", "text-anim-drift", "pop-anim-miss"),
            makeMessage("STEEL AIR!", "#6b4f2d", "#e8d8c0", "text-anim-drift", "pop-anim-miss"),
            makeMessage("ANVIL DODGED!", "#6b4f2d", "#e8d8c0", "text-anim-drift", "pop-anim-miss")
        ],
        combo: [
            makeMessage("FORGE RAMPAGE!", "#c2410c", "#ffe0b3", "text-anim-shock", "pop-anim-hammer"),
            makeMessage("ANVIL COMBO!", "#b45309", "#ffe0b3", "text-anim-burst", "pop-anim-hammer"),
            makeMessage("STEEL STORM!", "#d37a1f", "#ffe0b3", "text-anim-shock", "pop-anim-hammer"),
            makeMessage("IRON FURY!", "#c2410c", "#ffe0b3", "text-anim-burst", "pop-anim-hammer")
        ]
    }
};

function randomFrom(list) {
    if (!Array.isArray(list) || list.length === 0) return "";
    return list[Math.floor(Math.random() * list.length)];
}

function getComicHitText(toolName, combo = 0) {
    const profile = COMIC_TEXT_PROFILES[normalizeToolName(toolName)] || COMIC_TEXT_PROFILES.punch;
    const pool = combo >= 3 && profile.combo ? profile.combo : profile.hit;
    return randomFrom(pool);
}

function getComicMissText(toolName) {
    const profile = COMIC_TEXT_PROFILES[normalizeToolName(toolName)] || COMIC_TEXT_PROFILES.punch;
    return randomFrom(profile.miss || []);
}

export {
    COMIC_TEXT_PROFILES,
    getComicHitText,
    getComicMissText
};

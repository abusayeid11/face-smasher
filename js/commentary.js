// Tool-specific hit commentary
const PUNCH_HIT = [
    { word: "Pow",       hue: 2,   sat: 96, light: 48 },
    { word: "Jab",       hue: 10,  sat: 96, light: 50 },
    { word: "Pummel",    hue: 18,  sat: 94, light: 49 },
    { word: "Knuckle",   hue: 6,   sat: 98, light: 50 },
    { word: "Direct",    hue: 22,  sat: 92, light: 50 },
    { word: "Clean Hit", hue: 0,   sat: 90, light: 46 },
    { word: "Wham",      hue: 14,  sat: 92, light: 49 },
    { word: "Knockout",  hue: 355, sat: 90, light: 47 }
];

const SLAP_HIT = [
    { word: "Slap",      hue: 220, sat: 88, light: 50 },
    { word: "Whack",     hue: 232, sat: 85, light: 52 },
    { word: "Stung",     hue: 46,  sat: 92, light: 54 },
    { word: "Smite",     hue: 206, sat: 86, light: 51 },
    { word: "Snap",      hue: 188, sat: 88, light: 53 },
    { word: "Crisp",     hue: 262, sat: 84, light: 52 },
    { word: "Sting",     hue: 248, sat: 86, light: 51 },
    { word: "Spank",     hue: 210, sat: 89, light: 50 }
];

const HAMMER_HIT = [
    { word: "Crush",       hue: 30,  sat: 90, light: 48 },
    { word: "Smash",       hue: 28,  sat: 95, light: 50 },
    { word: "Obliterate",  hue: 35,  sat: 92, light: 49 },
    { word: "Pulverize",   hue: 32,  sat: 94, light: 51 },
    { word: "Hammer Down", hue: 38,  sat: 88, light: 50 },
    { word: "Devastate",   hue: 33,  sat: 91, light: 49 },
    { word: "Flatten",     hue: 36,  sat: 89, light: 52 },
    { word: "Bludgeon",    hue: 31,  sat: 93, light: 48 }
];

const MISS_LINES = [
    { word: "Miss",   hue: 220, sat: 72, light: 56 },
    { word: "Whiff",  hue: 232, sat: 68, light: 58 },
    { word: "Oops",   hue: 46,  sat: 94, light: 58 },
    { word: "Wide",   hue: 206, sat: 70, light: 55 },
    { word: "Glance", hue: 188, sat: 66, light: 57 },
    { word: "Fumble", hue: 262, sat: 63, light: 58 },
    { word: "Nope",   hue: 248, sat: 66, light: 57 }
];

const ANIM_DURATION = 1650;

/**
 * Shows tool-specific commentary feedback on the canvas.
 * @param {HTMLCanvasElement} canvas
 * @param {boolean} hit - whether the smash connected
 * @param {number} canvasX - x position on canvas
 * @param {number} canvasY - y position on canvas
 * @param {string} toolName - current tool ('punch', 'slap', 'hammer')
 */
export function showCommentaryAt(canvas, hit, canvasX, canvasY, toolName = 'punch') {
    let lines = MISS_LINES;
    if (hit) {
        if (toolName === 'slap') {
            lines = SLAP_HIT;
        } else if (toolName === 'hammer') {
            lines = HAMMER_HIT;
        } else {
            lines = PUNCH_HIT;
        }
    }
    const { word, hue, sat, light } = lines[Math.floor(Math.random() * lines.length)];

    const rect    = canvas.getBoundingClientRect();
    const screenX = rect.left + canvasX * (rect.width  / canvas.width);
    const screenY = rect.top  + canvasY * (rect.height / canvas.height);

    const gradientId = `cg-${Date.now()}-${Math.floor(Math.random() * 1e5)}`;
    const tilt       = (Math.random() * 12 - 6).toFixed(1);
    const glowLight  = Math.min(light + 28, 92);
    const midLight   = Math.min(light + 10, 78);
    const edgeLight  = Math.max(light - 6,  28);

    const el = document.createElement('div');
    el.className = 'commentary-bar commentary-fade';
    el.style.left      = `${screenX}px`;
    el.style.top       = `${screenY}px`;
    el.style.transform = 'translate(-50%, -50%)';
    el.style.setProperty('--commentary-hue',   String(hue));
    el.style.setProperty('--commentary-sat',   `${sat}%`);
    el.style.setProperty('--commentary-light', `${light}%`);
    el.style.setProperty('--commentary-tilt',  `${tilt}deg`);

    el.innerHTML = `
        <svg class="commentary-svg" viewBox="0 0 640 240" aria-hidden="true" focusable="false">
            <defs>
                <radialGradient id="${gradientId}" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stop-color="hsla(${hue},${sat}%,${glowLight}%,0.95)"></stop>
                    <stop offset="65%"  stop-color="hsla(${hue},${sat}%,${midLight}%,0.35)"></stop>
                    <stop offset="100%" stop-color="hsla(${hue},${sat}%,${edgeLight}%,0)"></stop>
                </radialGradient>
            </defs>
            <g transform="translate(320 120)">
                <circle r="86" fill="url(#${gradientId})"></circle>
                <g class="commentary-burst-lines">
                    <line x1="0"   y1="-102" x2="0"   y2="-136"></line>
                    <line x1="72"  y1="-72"  x2="96"  y2="-96"></line>
                    <line x1="102" y1="0"    x2="138" y2="0"></line>
                    <line x1="72"  y1="72"   x2="96"  y2="96"></line>
                    <line x1="0"   y1="102"  x2="0"   y2="136"></line>
                    <line x1="-72" y1="72"   x2="-96" y2="96"></line>
                    <line x1="-102" y1="0"   x2="-138" y2="0"></line>
                    <line x1="-72" y1="-72"  x2="-96" y2="-96"></line>
                </g>
            </g>
        </svg>
        <span class="commentary-word">${word}</span>`;

    document.body.appendChild(el);
    setTimeout(() => el.remove(), ANIM_DURATION);
}

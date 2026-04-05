const HIT_LINES = [
    { word: "Crush",       hue: 2,   sat: 96, light: 48 },
    { word: "Slam",        hue: 10,  sat: 96, light: 50 },
    { word: "Wreck",       hue: 18,  sat: 94, light: 49 },
    { word: "Boom",        hue: 28,  sat: 95, light: 52 },
    { word: "Smash",       hue: 6,   sat: 98, light: 50 },
    { word: "Impact",      hue: 22,  sat: 92, light: 50 },
    { word: "Brutal",      hue: 0,   sat: 90, light: 46 },
    { word: "Destroyed",   hue: 14,  sat: 92, light: 49 },
    { word: "Flattened",   hue: 34,  sat: 90, light: 52 },
    { word: "Annihilated", hue: 355, sat: 90, light: 47 }
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

export function showCommentaryAt(canvas, hit, canvasX, canvasY) {
    const lines = hit ? HIT_LINES : MISS_LINES;
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

const DEFAULT_MOOD_CONFIGS = {
    hit: {
        icons: ["💥", "😂", "✨", "👊", "🎯"],
        count: 9,
        cadenceMs: 110,
        drift: 80,
        riseMin: 50,
        riseMax: 120,
        spin: 90
    },
    miss: {
        icons: ["😵", "💨", "🙈", "🤡", "😅"],
        count: 7,
        cadenceMs: 140,
        drift: 75,
        riseMin: 45,
        riseMax: 100,
        spin: 70
    },
    combo: {
        icons: ["🔥", "💥", "🤣", "⚡", "🏆", "👊"],
        count: 12,
        cadenceMs: 95,
        drift: 95,
        riseMin: 65,
        riseMax: 130,
        spin: 120
    }
};

const TOOL_CONFIGS = {
    punch: {
        hit: { icons: ["👊", "💥", "🎯", "😤"], count: 9, cadenceMs: 105, drift: 70, riseMin: 55, riseMax: 110, spin: 75 },
        miss: { icons: ["👀", "💨", "😅", "🫠"], count: 6, cadenceMs: 150, drift: 68, riseMin: 45, riseMax: 90, spin: 60 },
        combo: { icons: ["👊", "🔥", "💥", "🏅"], count: 11, cadenceMs: 90, drift: 90, riseMin: 70, riseMax: 140, spin: 105 }
    },
    slap: {
        hit: { icons: ["👋", "✨", "🤣", "🌀"], count: 10, cadenceMs: 100, drift: 100, riseMin: 50, riseMax: 120, spin: 150 },
        miss: { icons: ["🙈", "🫣", "💨", "😬"], count: 7, cadenceMs: 135, drift: 95, riseMin: 45, riseMax: 105, spin: 120 },
        combo: { icons: ["👋", "⚡", "✨", "🤣", "🎉"], count: 13, cadenceMs: 85, drift: 120, riseMin: 70, riseMax: 145, spin: 170 }
    },
    hammer: {
        hit: { icons: ["🔨", "💣", "💢", "🧱"], count: 8, cadenceMs: 118, drift: 65, riseMin: 60, riseMax: 130, spin: 65 },
        miss: { icons: ["🔨", "😵", "💨", "😓"], count: 6, cadenceMs: 145, drift: 60, riseMin: 50, riseMax: 100, spin: 55 },
        combo: { icons: ["🔨", "💥", "🔥", "🏆", "⚠️"], count: 12, cadenceMs: 92, drift: 85, riseMin: 75, riseMax: 150, spin: 90 }
    }
};

export {
    DEFAULT_MOOD_CONFIGS,
    TOOL_CONFIGS
};

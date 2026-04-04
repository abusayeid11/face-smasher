// Commentary animation module - reusable hit/miss/combo effects

function createCommentaryAnimator(elements) {
    const { stage, bubble, message, icons } = elements || {};

    let animToken = 0;
    let iconBurstTimer = null;
    let messageTimer = null;
    let stageResetTimer = null;

    const defaultMoodConfigs = {
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

    const toolConfigs = {
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

    function clearTimers() {
        clearInterval(iconBurstTimer);
        clearInterval(messageTimer);
        clearTimeout(stageResetTimer);
    }

    function clearIcons() {
        if (icons) {
            icons.innerHTML = "";
        }
    }

    function resetMoodClasses() {
        if (bubble) {
            bubble.classList.remove("hit", "miss", "combo");
        }
    }

    function resetToolClasses() {
        if (stage) {
            stage.classList.remove("tool-punch", "tool-slap", "tool-hammer");
        }
    }

    function normalizeTool(toolName) {
        const name = String(toolName || "punch").toLowerCase();
        if (name === "hammer") return "hammer";
        if (name === "slap" || name === "glove") return "slap";
        return "punch";
    }

    function resolveMoodConfig(toolName, mood) {
        const safeMood = mood in defaultMoodConfigs ? mood : "hit";
        const safeTool = normalizeTool(toolName);
        const toolMood = toolConfigs[safeTool]?.[safeMood] || {};
        return {
            ...defaultMoodConfigs[safeMood],
            ...toolMood
        };
    }

    function burstIcons(config) {
        if (!icons) return;

        let created = 0;
        clearInterval(iconBurstTimer);
        iconBurstTimer = setInterval(() => {
            if (created >= config.count) {
                clearInterval(iconBurstTimer);
                return;
            }

            const icon = document.createElement("span");
            icon.className = "commentary-icon";
            icon.textContent = config.icons[Math.floor(Math.random() * config.icons.length)];
            icon.style.left = `${8 + Math.random() * 84}%`;
            icon.style.setProperty("--driftX", `${Math.round((Math.random() - 0.5) * config.drift)}px`);
            icon.style.setProperty("--riseY", `${-config.riseMin - Math.round(Math.random() * (config.riseMax - config.riseMin))}px`);
            icon.style.setProperty("--spin", `${Math.round((Math.random() - 0.5) * config.spin)}deg`);
            icon.style.setProperty("--dur", `${900 + Math.round(Math.random() * 500)}ms`);
            icon.style.setProperty("--endScale", `${(1 + Math.random() * 0.5).toFixed(2)}`);
            icons.appendChild(icon);

            setTimeout(() => icon.remove(), 1700);
            created += 1;
        }, config.cadenceMs);
    }

    function animate(text, mood = "hit", toolName = "punch") {
        if (!stage || !bubble || !message) return;

        const safeMood = mood in defaultMoodConfigs ? mood : "hit";
        const normalizedTool = normalizeTool(toolName);
        const config = resolveMoodConfig(normalizedTool, safeMood);
        const localToken = ++animToken;

        clearTimers();
        clearIcons();
        resetMoodClasses();
        resetToolClasses();
        stage.classList.add(`tool-${normalizedTool}`);
        bubble.classList.add(safeMood);
        stage.classList.remove("active");

        // Restart entry animation reliably.
        void bubble.offsetWidth;
        stage.classList.add("active");

        const cleanText = String(text || "").trim();
        let idx = 0;
        message.innerHTML = '<span class="commentary-message-caret"></span>';

        messageTimer = setInterval(() => {
            if (localToken !== animToken) return;

            idx += 2;
            if (idx >= cleanText.length) {
                message.textContent = cleanText;
                clearInterval(messageTimer);
                return;
            }

            const partial = cleanText.slice(0, idx);
            message.innerHTML = `${partial}<span class="commentary-message-caret"></span>`;
        }, 24);

        burstIcons(config);

        stageResetTimer = setTimeout(() => {
            if (localToken !== animToken) return;
            stage.classList.remove("active");
        }, 2900);
    }

    function setIdleMessage(text) {
        if (!message) return;

        clearTimers();
        clearIcons();
        resetMoodClasses();
        resetToolClasses();
        stage?.classList.remove("active");
        message.textContent = text;
    }

    return {
        animate,
        showHit: (text, toolName = "punch") => animate(text, "hit", toolName),
        showMiss: (text, toolName = "punch") => animate(text, "miss", toolName),
        showCombo: (text, toolName = "punch") => animate(text, "combo", toolName),
        setIdleMessage,
        clear: () => {
            clearTimers();
            clearIcons();
            resetMoodClasses();
            resetToolClasses();
            stage?.classList.remove("active");
        }
    };
}

export { createCommentaryAnimator };
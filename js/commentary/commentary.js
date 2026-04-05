// Commentary animation module - reusable hit/miss/combo effects
import { DEFAULT_MOOD_CONFIGS, TOOL_CONFIGS } from './config.js';

function normalizeToolName(toolName) {
    const name = String(toolName || "punch").toLowerCase();
    if (name === "hammer") return "hammer";
    if (name === "slap" || name === "glove") return "slap";
    return "punch";
}

function normalizeMood(mood) {
    return mood in DEFAULT_MOOD_CONFIGS ? mood : "hit";
}

function resolveMoodConfig(toolName, mood) {
    const safeMood = normalizeMood(mood);
    const safeTool = normalizeToolName(toolName);
    const toolMood = TOOL_CONFIGS[safeTool]?.[safeMood] || {};
    return {
        ...DEFAULT_MOOD_CONFIGS[safeMood],
        ...toolMood
    };
}

function createCommentaryAnimator(elements) {
    const { stage, bubble, message, icons } = elements || {};

    const state = {
        animToken: 0,
        iconBurstTimer: null,
        messageTimer: null,
        stageResetTimer: null
    };

    function clearTimers() {
        clearInterval(state.iconBurstTimer);
        clearInterval(state.messageTimer);
        clearTimeout(state.stageResetTimer);
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

    function startTypewriter(text, localToken) {
        const cleanText = String(text || "").trim();
        let idx = 0;
        message.innerHTML = '<span class="commentary-message-caret"></span>';

        state.messageTimer = setInterval(() => {
            if (localToken !== state.animToken) return;

            idx += 2;
            if (idx >= cleanText.length) {
                message.textContent = cleanText;
                clearInterval(state.messageTimer);
                return;
            }

            const partial = cleanText.slice(0, idx);
            message.innerHTML = `${partial}<span class="commentary-message-caret"></span>`;
        }, 24);
    }

    function burstIcons(config) {
        if (!icons) return;

        let created = 0;
        clearInterval(state.iconBurstTimer);
        state.iconBurstTimer = setInterval(() => {
            if (created >= config.count) {
                clearInterval(state.iconBurstTimer);
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

    function resetStageState() {
        clearTimers();
        clearIcons();
        resetMoodClasses();
        resetToolClasses();
        stage?.classList.remove("active");
    }

    function animate(text, mood = "hit", toolName = "punch") {
        if (!stage || !bubble || !message) return;

        const safeMood = normalizeMood(mood);
        const normalizedTool = normalizeToolName(toolName);
        const config = resolveMoodConfig(normalizedTool, safeMood);
        const localToken = ++state.animToken;

        resetStageState();
        stage.classList.add(`tool-${normalizedTool}`);
        bubble.classList.add(safeMood);

        // Restart entry animation reliably.
        void bubble.offsetWidth;
        stage.classList.add("active");

        startTypewriter(text, localToken);
        burstIcons(config);

        state.stageResetTimer = setTimeout(() => {
            if (localToken !== state.animToken) return;
            stage.classList.remove("active");
        }, 2900);
    }

    function setIdleMessage(text) {
        if (!message) return;

        resetStageState();
        message.textContent = text;
    }

    return {
        animate,
        showHit: (text, toolName = "punch") => animate(text, "hit", toolName),
        showMiss: (text, toolName = "punch") => animate(text, "miss", toolName),
        showCombo: (text, toolName = "punch") => animate(text, "combo", toolName),
        setIdleMessage,
        clear: () => {
            resetStageState();
        }
    };
}

export { createCommentaryAnimator };
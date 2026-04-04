// Comic pop-up module - renders BAM/POW style effects

function createComicPopupAnimator(elements) {
    const { stage, canvas } = elements || {};
    let cleanupTimer = null;

    const TOOL_POP_CONFIG = {
        punch: {
            driftX: 36,
            riseMin: 22,
            riseMax: 44,
            rotMax: 20,
            skewMax: 12
        },
        slap: {
            driftX: 48,
            riseMin: 18,
            riseMax: 38,
            rotMax: 28,
            skewMax: 16
        },
        hammer: {
            driftX: 28,
            riseMin: 28,
            riseMax: 54,
            rotMax: 16,
            skewMax: 10
        }
    };


    function normalizeTool(toolName) {
        const name = String(toolName || "punch").toLowerCase();
        if (name === "hammer") return "hammer";
        if (name === "slap" || name === "glove") return "slap";
        return "punch";
    }

    function clear() {
        if (!stage) return;
        stage.innerHTML = "";
        if (cleanupTimer) {
            clearTimeout(cleanupTimer);
            cleanupTimer = null;
        }
    }

    function show(payload, position, toolName = "punch", combo = 0, mood = "hit") {
        if (!stage || !canvas) return;
        if (!payload) return;

        const message = typeof payload === "object"
            ? payload
            : { text: payload };

        if (!message.text) return;

        const rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        const scaleX = rect.width / canvas.width;
        const scaleY = rect.height / canvas.height;
        const safeX = typeof position?.x === "number" ? position.x : canvas.width / 2;
        const safeY = typeof position?.y === "number" ? position.y : canvas.height / 2;

        const popup = document.createElement("div");
        const safeTool = normalizeTool(toolName);
        const toolConfig = TOOL_POP_CONFIG[safeTool] || TOOL_POP_CONFIG.punch;
        const safeMood = mood === "miss" ? "miss" : "hit";
        popup.className = "comic-pop";
        if (combo >= 3) {
            popup.classList.add("comic-combo");
        }
        if (message.toolAnim) {
            popup.classList.add(message.toolAnim);
        } else if (safeMood === "miss") {
            popup.classList.add("pop-anim-miss");
        }

        const textSpan = document.createElement("span");
        textSpan.className = "comic-pop-text";
        textSpan.textContent = message.text;
        if (message.textAnim) {
            textSpan.classList.add(message.textAnim);
        } else {
            textSpan.classList.add("text-anim-pop");
        }
        if (message.color) {
            textSpan.style.setProperty("--pop-color", message.color);
        }
        if (message.accent) {
            textSpan.style.setProperty("--pop-accent", message.accent);
        }
        popup.appendChild(textSpan);
        popup.style.left = `${safeX * scaleX}px`;
        popup.style.top = `${safeY * scaleY}px`;
        popup.style.setProperty("--pop-rot", `${Math.round((Math.random() - 0.5) * toolConfig.rotMax)}deg`);
        popup.style.setProperty("--pop-dx", `${Math.round((Math.random() - 0.5) * toolConfig.driftX)}px`);
        popup.style.setProperty("--pop-dy", `${-toolConfig.riseMin - Math.round(Math.random() * (toolConfig.riseMax - toolConfig.riseMin))}px`);
        popup.style.setProperty("--pop-skew", `${Math.round((Math.random() - 0.5) * toolConfig.skewMax)}deg`);

        stage.appendChild(popup);

        const cleanup = () => popup.remove();
        popup.addEventListener("animationend", cleanup, { once: true });
        cleanupTimer = setTimeout(cleanup, 1800);
    }

    return {
        show,
        clear
    };
}

export { createComicPopupAnimator };

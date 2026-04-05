function createCommentaryManager(options) {
    const {
        commentaryAnimator,
        toggleComedyBtn,
        toggleComedyText,
        setStatusMessage,
        plainInstructionMessage,
        getCurrentToolName,
        getIntroMessage,
        getHitMessage,
        getMissMessage,
        isGameStarted
    } = options || {};

    let comedyModeEnabled = true;

    function setComedyButtonState() {
        if (toggleComedyText) {
            toggleComedyText.textContent = comedyModeEnabled
                ? "Commentary is on"
                : "Commentary is off";
        }

        if (!toggleComedyBtn) return;

        toggleComedyBtn.classList.toggle("off", !comedyModeEnabled);
        toggleComedyBtn.setAttribute("aria-checked", comedyModeEnabled ? "true" : "false");

        if (!comedyModeEnabled) {
            commentaryAnimator.clear();
            setStatusMessage(plainInstructionMessage);
        }
    }

    function handleToggle() {
        comedyModeEnabled = !comedyModeEnabled;
        setComedyButtonState();

        if (typeof isGameStarted === "function" && isGameStarted()) {
            setStatusMessage(comedyModeEnabled
                ? "Commentary enabled. Funny updates are back."
                : "Commentary disabled. Clean mode activated.");

            if (comedyModeEnabled) {
                const currentTool = getCurrentToolName();
                commentaryAnimator.showHit(getIntroMessage(currentTool), currentTool);
            }
        }
    }

    function init() {
        setComedyButtonState();
        if (toggleComedyBtn) {
            toggleComedyBtn.addEventListener("click", handleToggle);
        }
    }

    function onSuccessfulSmash({ toolName, combo }) {
        if (!comedyModeEnabled) {
            commentaryAnimator.clear();
            setStatusMessage(plainInstructionMessage);
            return;
        }

        const message = getHitMessage(toolName, combo);
        setStatusMessage(message);
        if (combo >= 3) {
            commentaryAnimator.showCombo(message, toolName);
        } else {
            commentaryAnimator.showHit(message, toolName);
        }
    }

    function onMissSmash({ toolName }) {
        if (comedyModeEnabled) {
            const message = getMissMessage(toolName);
            setStatusMessage(message);
            commentaryAnimator.showMiss(message, toolName);
            return;
        }

        commentaryAnimator.clear();
        setStatusMessage(plainInstructionMessage);
    }

    return {
        init,
        onSuccessfulSmash,
        onMissSmash,
        isComedyModeEnabled: () => comedyModeEnabled
    };
}

export { createCommentaryManager };

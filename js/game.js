// Game module - handles main render loop and game logic

let score = 0;
let hopInterval = 1500;
let gameTimer = null;
let screenShake = 0;
let comboCount = 0;
let lastHitAt = 0;

function initGame(canvas, ctx, scoreLabel, options) {
    const { 
        face, 
        tool, 
        playToolSound, 
        playHitSound,
        getToolName,
        createMark, 
        drawMark, 
        resetFacePos, 
        startTimer,
        getMousePos,
        triggerSmashAnim,
        onSuccessfulSmash,
        onMissSmash
    } = options;
    
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Apply screen shake
        ctx.save();
        if (screenShake > 0) {
            ctx.translate(
                (Math.random() - 0.5) * screenShake * 2,
                (Math.random() - 0.5) * screenShake * 2
            );
            screenShake *= 0.85;
            if (screenShake < 0.5) screenShake = 0;
        }
        
        // Draw face
        if (face.ready && face.loaded) {
            ctx.drawImage(face.image, face.x, face.y, face.size, face.size);
            
            // Draw marks
            for (const mark of face.marks) {
                drawMark(ctx, mark, face.x, face.y);
            }
        }
        
        // Tool animation
        let toolDrawSize = tool.size;
        let toolOffsetX = 0;
        let toolOffsetY = 0;
        let toolRotation = 0;
        
        if (tool.smashAnim > 0) {
            const progress = tool.smashAnim;
            
            if (progress > 0.7) {
                const pullBack = (progress - 0.7) / 0.3;
                toolOffsetY = -15 * pullBack;
                toolDrawSize = tool.size * (1 - 0.1 * pullBack);
            } else if (progress > 0.3) {
                const punch = (progress - 0.3) / 0.4;
                toolOffsetY = 20 * punch;
                toolDrawSize = tool.size * (1 + 0.3 * punch);
                toolRotation = -0.2 * punch;
            } else {
                const squash = progress / 0.3;
                toolDrawSize = tool.size * (1.4 - 0.4 * squash);
                toolOffsetY = 10 * squash;
                toolRotation = 0.15 * (1 - squash);
            }
            
            tool.smashAnim -= 0.06;
            if (tool.smashAnim < 0) tool.smashAnim = 0;
        }
        
        // Draw tool
        if (tool.image && tool.image.complete) {
            const pos = getMousePos();
            ctx.save();
            ctx.translate(pos.x + toolOffsetX, pos.y + toolOffsetY);
            ctx.rotate(toolRotation);
            ctx.drawImage(tool.image, -toolDrawSize/2, -toolDrawSize/2, toolDrawSize, toolDrawSize);
            ctx.restore();
        }
        
        ctx.restore();
        requestAnimationFrame(render);
    }
    
    function handleSmash() {
        triggerSmashAnim();
        const pos = getMousePos();
        const currentToolName = typeof getToolName === 'function' ? getToolName() : 'punch';
        
        if (face.ready && face.loaded) {
            if (pos.x >= face.x && pos.x <= face.x + face.size &&
                pos.y >= face.y && pos.y <= face.y + face.size) {
                
                const now = performance.now();
                comboCount = (now - lastHitAt) <= 900 ? comboCount + 1 : 1;
                lastHitAt = now;

                score++;
                scoreLabel.innerHTML = `Smashed: ${score}`;
                if (hopInterval > 300) hopInterval -= 100;
                
                screenShake = 15;
                if (typeof playToolSound === 'function') {
                    playToolSound(currentToolName);
                } else if (typeof playHitSound === 'function') {
                    playHitSound();
                }
                
                const relX = pos.x - face.x;
                const relY = pos.y - face.y;
                
                const newMarks = createMark(currentToolName, relX, relY);
                face.marks.push(...newMarks);

                if (typeof onSuccessfulSmash === 'function') {
                    onSuccessfulSmash({
                        score,
                        toolName: currentToolName,
                        combo: comboCount,
                        hitPos: { x: pos.x, y: pos.y }
                    });
                }
                
                resetFacePos();
                startTimer();
            } else if (typeof onMissSmash === 'function') {
                comboCount = 0;
                onMissSmash({
                    toolName: currentToolName
                });
            }
        }
    }
    
    function resetScore(label) {
        score = 0;
        comboCount = 0;
        lastHitAt = 0;
        label.innerHTML = "Smashed: 0";
        face.marks = [];
    }
    
    function resetSpeed() {
        hopInterval = 1500;
        startTimer();
    }
    
    function getSpeed() {
        return hopInterval;
    }
    
    function setSpeed(speed) {
        hopInterval = speed;
    }
    
    render();
    
    return {
        handleSmash,
        resetScore,
        resetSpeed,
        getSpeed,
        setSpeed
    };
}

export { initGame };
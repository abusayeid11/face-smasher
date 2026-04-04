// Audio module - handles sound effects using local audio files

const sounds = {
    punch: new Audio('audio/punch.mp3'),
    slap: new Audio('audio/slap.mp3'),
    hammer: new Audio('audio/hammer.mp3')
};

// Preload sounds
Object.values(sounds).forEach(sound => {
    sound.load();
});

function playToolSound(toolName) {
    const sound = sounds[toolName];
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(err => {
            console.warn('Audio play failed:', err);
        });
    }
}

// Export both functions for compatibility
function playHitSound() {
    playToolSound('punch'); // Default to punch
}

export { playHitSound, playToolSound };
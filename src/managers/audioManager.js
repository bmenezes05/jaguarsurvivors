export class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.recentSounds = new Map(); // Track recently played sounds for throttling
    }

    /**
     * Play a sound with automatic pitch randomization
     * @param {string} key - The sound key to play
     * @param {object} config - Configuration options (volume, detune, etc.)
     */
    play(key, config = {}) {
        if (!this.scene.cache.audio.exists(key)) {
            console.warn(`Audio key "${key}" not found in cache`);
            return;
        }

        // Apply automatic pitch randomization if not explicitly set
        const audioConfig = {
            volume: config.volume !== undefined ? config.volume : 1.0,
            detune: config.detune !== undefined
                ? config.detune
                : Phaser.Math.Between(-200, 200), // -200 to +200 cents (2 semitones)
            ...config
        };

        // Play the sound
        this.scene.sound.play(key, audioConfig);

        // Track the sound for potential throttling
        this.recentSounds.set(key, Date.now());
    }

    /**
     * Play a sound with volume variation
     * @param {string} key - The sound key
     * @param {number} baseVolume - Base volume level
     * @param {number} variation - Volume variation amount (0-1)
     */
    playWithVariation(key, baseVolume = 1.0, variation = 0.2) {
        const volumeVariation = Phaser.Math.FloatBetween(-variation, variation);
        this.play(key, {
            volume: Phaser.Math.Clamp(baseVolume + volumeVariation, 0, 1)
        });
    }

    /**
     * Stop a looping sound
     * @param {string} key - The sound key to stop
     */
    stop(key) {
        if (this.scene.sound.get(key)) {
            this.scene.sound.get(key).stop();
        }
    }

    /**
     * Check if a sound was recently played (for throttling)
     * @param {string} key - The sound key
     * @param {number} throttleMs - Milliseconds to throttle
     * @returns {boolean}
     */
    wasRecentlyPlayed(key, throttleMs = 100) {
        const lastPlayed = this.recentSounds.get(key);
        if (!lastPlayed) return false;
        return (Date.now() - lastPlayed) < throttleMs;
    }
}
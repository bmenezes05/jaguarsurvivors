/**
 * DifficultyManager
 * 
 * Centralized system for progressive difficulty scaling.
 * INDEPENDENT from behavior logic - only modifies stats.
 * 
 * Features:
 * - Time-based difficulty progression
 * - Multiple scaling curves (linear, exponential, logarithmic, step)
 * - Per-stat configuration
 * - Named profiles for enemy archetypes
 */
export class DifficultyManager {
    constructor(scene, config) {
        this.scene = scene;
        this.config = config;

        // Fully initialize/reset state
        this.reset();
    }

    /**
     * Start or reset the difficulty timer.
     * Call this when a new run begins.
     */
    reset() {
        this.runStartTime = this.scene.time.now;
        this.currentLevel = 0;
        this.isPaused = false;
        this.pausedTime = 0;
        this.lastDifficultyMultiplier = 1;

        console.debug('DifficultyManager reset at time:', this.runStartTime);
    }

    /**
     * Pause difficulty progression.
     * Useful during boss fights or menus.
     */
    pause() {
        if (!this.isPaused) {
            this.isPaused = true;
            this.pauseStartTime = this.scene.time.now;
        }
    }

    /**
     * Resume difficulty progression.
     */
    resume() {
        if (this.isPaused) {
            this.pausedTime += this.scene.time.now - this.pauseStartTime;
            this.isPaused = false;
        }
    }

    /**
     * Get elapsed time in milliseconds, excluding paused time.
     */
    getElapsedTime() {
        let elapsed = this.scene.time.now - this.runStartTime - this.pausedTime;

        if (this.isPaused) {
            elapsed -= (this.scene.time.now - this.pauseStartTime);
        }

        return Math.max(0, elapsed);
    }

    /**
     * Get elapsed time in seconds.
     */
    getElapsedSeconds() {
        return this.getElapsedTime() / 1000;
    }

    /**
     * Get elapsed time in minutes.
     */
    getElapsedMinutes() {
        return this.getElapsedTime() / 60000;
    }

    /**
     * Get a multiplier for a given stat.
     * @param {string} statKey - The stat to get multiplier for (health, speed, damage, etc.)
     * @param {string} profile - Optional profile name for archetype-specific scaling
     * @returns {number} The multiplier to apply to the base stat
     */
    getMultiplier(statKey, profile = null) {
        const elapsed = this.getElapsedTime();
        let multiplier = 1.0;

        // First check profile-specific scaling
        if (profile && this.config.profiles && this.config.profiles[profile]) {
            const profileConfig = this.config.profiles[profile];
            if (profileConfig[statKey]) {
                multiplier = this.calculateMultiplier(elapsed, profileConfig[statKey]);
            }
        }
        // Fall back to global scaling
        else if (this.config.global && this.config.global[statKey]) {
            multiplier = this.calculateMultiplier(elapsed, this.config.global[statKey]);
        }

        if (statKey === 'health' && multiplier > this.lastDifficultyMultiplier + CONFIG.endlessMode.difficultyIncreaseInterval) {
            this.lastDifficultyMultiplier = multiplier;
            this.scene.events.emit('difficulty-increased');
        }

        return multiplier;
    }

    /**
     * Calculate multiplier based on scaling configuration.
     * @param {number} elapsed - Elapsed time in ms
     * @param {Object} scaling - Scaling configuration object
     * @returns {number} Calculated multiplier
     */
    calculateMultiplier(elapsed, scaling) {
        const { curve, min, max, rampUpTime } = scaling;

        // Calculate progress (0 to 1)
        let progress = Math.min(elapsed / rampUpTime, 1.0);
        if (this.scene.isEndlessMode) {
            progress = elapsed / rampUpTime;
        }

        switch (curve) {
            case 'linear':
                return min + (max - min) * progress;

            case 'exponential':
                // Exponential growth from min to max
                return min * Math.pow(max / min, progress);

            case 'logarithmic':
                // Logarithmic curve - fast initial growth, then slows
                return min + (max - min) * Math.log(1 + progress * (Math.E - 1));

            case 'quadratic':
                // Quadratic curve - starts slow, accelerates
                return min + (max - min) * (progress * progress);

            case 'inverse_quadratic':
                // Inverse quadratic - starts fast, decelerates
                return min + (max - min) * (1 - Math.pow(1 - progress, 2));

            case 'step':
                return this.getStepValue(elapsed, scaling.steps, min);

            case 'sine':
                // Smooth sine wave transition
                return min + (max - min) * (1 - Math.cos(progress * Math.PI)) / 2;

            default:
                return 1.0;
        }
    }

    /**
     * Get value from step-based scaling.
     * @param {number} elapsed - Elapsed time in ms
     * @param {Array} steps - Array of {time, value} objects
     * @param {number} defaultValue - Default value if no step matches
     * @returns {number} The step value
     */
    getStepValue(elapsed, steps, defaultValue = 1.0) {
        if (!steps || steps.length === 0) return defaultValue;

        // Sort steps by time (descending) and find first matching
        const sortedSteps = [...steps].sort((a, b) => b.time - a.time);

        for (const step of sortedSteps) {
            if (elapsed >= step.time) {
                return step.value;
            }
        }

        return defaultValue;
    }

    /**
     * Resolve all scaled stats for an enemy configuration.
     * @param {Object} baseConfig - The base enemy configuration
     * @returns {Object} Object containing all scaled stat values
     */
    resolveStats(baseConfig) {
        const profile = baseConfig.scalingProfile || null;

        return {
            health: (baseConfig.health || 100) * this.getMultiplier('health', profile),
            damage: (baseConfig.damage || 10) * this.getMultiplier('damage', profile),
            speed: (baseConfig.speed || 100) * this.getMultiplier('speed', profile),
            knockbackResistance: this.getMultiplier('knockbackResistance', profile)
        };
    }

    /**
     * Get the current difficulty level as a percentage (0-100).
     */
    getDifficultyPercent() {
        // Use health scaling as the reference
        const healthMultiplier = this.getMultiplier('health');
        const globalConfig = this.config.global?.health;

        if (!globalConfig) return 0;

        const { min, max } = globalConfig;
        return Math.min(100, ((healthMultiplier - min) / (max - min)) * 100);
    }

    /**
     * Get a human-readable difficulty label.
     */
    getDifficultyLabel() {
        const percent = this.getDifficultyPercent();

        if (percent < 20) return 'Easy';
        if (percent < 40) return 'Normal';
        if (percent < 60) return 'Hard';
        if (percent < 80) return 'Very Hard';
        return 'Nightmare';
    }

    /**
     * Debug output for current difficulty state.
     */
    debugLog() {
        console.log('=== Difficulty Manager State ===');
        console.log('Elapsed Time:', this.getElapsedSeconds().toFixed(1), 's');
        console.log('Difficulty:', this.getDifficultyPercent().toFixed(1), '%');
        console.log('Label:', this.getDifficultyLabel());
        console.log('Multipliers:');
        console.log('  Health:', this.getMultiplier('health').toFixed(2));
        console.log('  Speed:', this.getMultiplier('speed').toFixed(2));
        console.log('  Damage:', this.getMultiplier('damage').toFixed(2));
        console.log('  KB Resist:', this.getMultiplier('knockbackResistance').toFixed(2));
    }
}

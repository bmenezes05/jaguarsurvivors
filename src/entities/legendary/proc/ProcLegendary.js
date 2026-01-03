import { BaseLegendary } from '../BaseLegendary.js';

/**
 * ProcLegendary
 * 
 * Base class for all proc-type legendaries.
 * Procs are passive effects triggered by game events.
 * 
 * Characteristics:
 * - Event-driven (on hit, on kill, on damage taken, etc.)
 * - Have chance to trigger
 * - May have internal cooldown
 * - Do not spawn persistent entities
 */
export class ProcLegendary extends BaseLegendary {
    constructor(scene, config) {
        super(scene, config);
        this.lastTriggerTime = 0;
        this.triggerEvent = null; // Set by subclass (e.g., 'enemy-damaged')
    }

    /**
     * Activate the proc.
     * Calls registerTriggers to set up event listening.
     */
    activate() {
        this.isActive = true;
        this.registerTriggers();
    }

    /**
     * Register which events trigger this proc.
     * Must be implemented by subclasses.
     * Should set this.triggerEvent to the event name.
     */
    registerTriggers() {
        throw new Error(`${this.constructor.name} must implement registerTriggers()`);
    }

    /**
     * Check if the proc can trigger based on cooldown.
     * @returns {boolean} True if cooldown has elapsed
     */
    canTrigger() {
        const now = this.scene.time.now;
        const cooldown = this.config.cooldown || 0;
        return now - this.lastTriggerTime >= cooldown;
    }

    /**
     * Roll chance to see if proc triggers.
     * @returns {boolean} True if proc should trigger
     */
    rollChance() {
        const chance = this.config.chance !== undefined ? this.config.chance : 1.0;
        return Math.random() < chance;
    }

    /**
     * Execute the proc effect.
     * Must be implemented by subclasses.
     * @param {Object} data - Event data (varies by trigger type)
     */
    onTrigger(data) {
        throw new Error(`${this.constructor.name} must implement onTrigger()`);
    }

    /**
     * Mark that the proc was triggered (for cooldown tracking).
     */
    markTriggered() {
        this.lastTriggerTime = this.scene.time.now;
    }

    /**
     * No cleanup needed for most procs.
     */
    destroy() {
        if (!this.isActive) return;
        super.destroy();
    }
}

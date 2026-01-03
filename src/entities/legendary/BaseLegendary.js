/**
 * BaseLegendary
 * 
 * Abstract base class for all legendary upgrades.
 * Defines the contract and lifecycle that all legendaries must follow.
 * 
 * Lifecycle:
 * 1. Constructor: Initialize with scene and config
 * 2. activate(): Called when legendary is selected by player
 * 3. update(delta): Called every frame (optional)
 * 4. destroy(): Called on game reset/cleanup
 */
export class BaseLegendary {
    constructor(scene, config) {
        this.scene = scene;
        this.config = config;
        this.id = config.id;
        this.name = config.name;
        this.type = config.type;
        this.isActive = false;
    }

    /**
     * Activate the legendary effect.
     * Must be implemented by subclasses.
     */
    activate() {
        throw new Error(`${this.constructor.name} must implement activate()`);
    }

    /**
     * Update loop called every frame.
     * Optional - override if needed.
     * @param {number} delta - Time since last frame in ms
     */
    update(delta) {
        // Optional - override in subclass if needed
    }

    /**
     * Cleanup and destroy the legendary.
     * Optional - override if cleanup is needed.
     */
    destroy() {
        if (!this.isActive) return;
        this.isActive = false;
        this.scene = null; // Prevent further scene access
    }

    /**
     * Get display info for UI
     */
    getDisplayInfo() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            description: this.config.description,
            icon: this.config.icon,
            category: this.config.category
        };
    }
}

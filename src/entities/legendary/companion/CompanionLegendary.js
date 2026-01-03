import { BaseLegendary } from '../BaseLegendary.js';

/**
 * CompanionLegendary
 * 
 * Base class for all companion-type legendaries.
 * Companions are entities that follow the player and provide assistance.
 * 
 * Characteristics:
 * - Follow the player with configurable offset
 * - Have their own behavior (attack, collect, buff, etc.)
 * - Independent AI and update loop
 * - Multiple companions can exist simultaneously
 */
export class CompanionLegendary extends BaseLegendary {
    constructor(scene, config) {
        super(scene, config);
        this.sprite = null;
        this.offset = config.offset || { x: -50, y: -50 };
        this.followSpeed = config.followSpeed || 0.1; // Lerp factor
    }

    /**
     * Activate the companion.
     * Creates the sprite and starts following.
     */
    activate() {
        this.isActive = true;
        this.createSprite();
    }

    /**
     * Create the companion sprite.
     * Must be implemented by subclasses.
     */
    createSprite() {
        throw new Error(`${this.constructor.name} must implement createSprite()`);
    }

    /**
     * Update the companion.
     * Handles position following and behavior.
     * @param {number} delta - Time since last frame in ms
     */
    update(delta) {
        if (!this.isActive || !this.sprite) return;

        this.updatePosition(delta);
        this.updateBehavior(delta);
    }

    /**
     * Update companion position to follow player.
     * @param {number} delta - Time since last frame in ms
     */
    updatePosition(delta) {
        const player = this.scene.player;
        if (!player) return;

        const targetX = player.x + this.offset.x;
        const targetY = player.y + this.offset.y;

        // Smooth follow using lerp
        this.sprite.x += (targetX - this.sprite.x) * this.followSpeed;
        this.sprite.y += (targetY - this.sprite.y) * this.followSpeed;
    }

    /**
     * Update companion-specific behavior.
     * Override in subclass for custom behavior (attack, collect, buff, etc.).
     * @param {number} delta - Time since last frame in ms
     */
    updateBehavior(delta) {
        // Override in subclass
    }

    /**
     * Cleanup companion sprite.
     */
    destroy() {
        if (!this.isActive) return;

        if (this.sprite) {
            this.sprite.destroy();
            this.sprite = null;
        }
        super.destroy();
    }
}

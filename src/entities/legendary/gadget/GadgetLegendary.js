import { BaseLegendary } from '../BaseLegendary.js';

/**
 * GadgetLegendary
 * 
 * Base class for all gadget-type legendaries.
 * Gadgets are autonomous entities that exist in the world and act independently.
 * 
 * Characteristics:
 * - Can be stationary or mobile
 * - Have visual representation (sprites)
 * - May have physics interactions
 * - Self-contained update loop
 */
export class GadgetLegendary extends BaseLegendary {
    constructor(scene, config) {
        super(scene, config);
        this.sprites = [];
        this.projectiles = null;
        this.graphics = [];
    }

    /**
     * Activate the gadget.
     * Calls createVisuals and setupPhysics.
     */
    activate() {
        this.isActive = true;
        this.createVisuals();
        this.setupPhysics();
    }

    /**
     * Create visual representation of the gadget.
     * Must be implemented by subclasses.
     */
    createVisuals() {
        throw new Error(`${this.constructor.name} must implement createVisuals()`);
    }

    /**
     * Setup physics interactions.
     * Optional - override if physics is needed.
     */
    setupPhysics() {
        // Optional - override in subclass if needed
    }

    /**
     * Update the gadget.
     * Override in subclass for custom behavior.
     * @param {number} delta - Time since last frame in ms
     */
    update(delta) {
        // Override in subclass
    }

    /**
     * Cleanup all visual elements and physics.
     */
    destroy() {
        if (!this.isActive) return;

        // Destroy all sprites
        this.sprites.forEach(sprite => {
            if (sprite && sprite.destroy) {
                sprite.destroy();
            }
        });
        this.sprites = [];

        // Destroy all graphics
        this.graphics.forEach(graphic => {
            if (graphic && graphic.destroy) {
                graphic.destroy();
            }
        });
        this.graphics = [];

        // Clear projectile group
        if (this.projectiles && this.projectiles.scene) {
            try {
                this.projectiles.clear(true, true);
            } catch (e) {
                console.debug('GadgetLegendary: Error clearing projectiles during destroy', e);
            }
            this.projectiles = null;
        }

        super.destroy();
    }
}

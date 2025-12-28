/**
 * WeaponStrategy (Base Class)
 * 
 * Abstract base class for weapon attack behavior strategies.
 * Implements the Strategy Pattern to allow different weapon types
 * to have completely different attack mechanics.
 * 
 * Strategy Hierarchy:
 * 
 *   WeaponStrategy (abstract)
 *   ├── MeleeWeaponStrategy
 *   │   - Close-range hitbox attacks
 *   │   - Animation-driven damage zones
 *   │
 *   ├── RangedWeaponStrategy
 *   │   - Fires projectiles in a straight line
 *   │   - Travel distance based on range
 *   │
 *   └── TrailWeaponStrategy
 *       - Time-based trail effects
 *       - Spawns visual trails that move or stay
 *       - Uses lifetimeMs
 */
export class WeaponStrategy {
    /**
     * @param {Weapon} weapon - The weapon instance this strategy belongs to
     */
    constructor(weapon) {
        if (new.target === WeaponStrategy) {
            throw new Error('WeaponStrategy is abstract and cannot be instantiated');
        }

        this.weapon = weapon;
        this.scene = weapon.scene;
    }

    /**
     * Execute an attack toward the target
     * Must be implemented by subclasses
     * @param {EnemyFacade} target - The enemy to attack
     * @abstract
     */
    attack(target) {
        throw new Error('attack() must be implemented by WeaponStrategy');
    }

    /**
     * Update loop for the strategy
     * Called every frame by the parent Weapon
     * @param {number} delta - Time since last update in ms
     */
    update(delta) {
        // Optional - override in subclass if needed
    }

    /**
     * Cleanup when strategy is destroyed
     * Override in subclass to clean up resources
     */
    destroy() {
        // Optional - override in subclass if needed
    }
}

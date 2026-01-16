import { ChaseBehavior } from './behaviors/chaseBehavior.js';
import { ChargeBehavior } from './behaviors/chargeBehavior.js';
import { ZigZagBehavior } from './behaviors/zigzagBehavior.js';
import { BurstPursuitBehavior } from './behaviors/burstPursuitBehavior.js';
import { OrbitBehavior } from './behaviors/orbitBehavior.js';
import { FleeBehavior } from './behaviors/fleeBehavior.js';
import { StationaryBurstBehavior } from './behaviors/stationaryBurstBehavior.js';
import { TacticalChaseBehavior } from './behaviors/tacticalChaseBehavior.js';
import { RhythmicAreaBehavior } from './behaviors/rhythmicAreaBehavior.js';
/**
 * BehaviorFactory
 * 
 * Factory for creating behavior instances from configuration.
 * Uses a registry pattern for easy extensibility.
 * 
 * To add a new behavior:
 * 1. Create the behavior class extending BaseBehavior
 * 2. Call BehaviorFactory.register('key', BehaviorClass)
 * 3. Use 'key' in enemy config ai.behaviorKey
 */
export class BehaviorFactory {
    static behaviors = new Map();
    static initialized = false;
    /**
     * Initialize the factory with all built-in behaviors.
     * Called automatically on first use.
     */
    static initialize() {
        if (this.initialized) return;
        // Register all built-in behaviors
        this.register('chase', ChaseBehavior);
        this.register('charge', ChargeBehavior);
        this.register('zigzag', ZigZagBehavior);
        this.register('burst_pursuit', BurstPursuitBehavior);
        this.register('orbit', OrbitBehavior);
        this.register('flee', FleeBehavior);
        this.register('stationary_burst', StationaryBurstBehavior);
        this.register('tactical_chase', TacticalChaseBehavior);
        this.register('rhythmic_area', RhythmicAreaBehavior);
        this.initialized = true;

        console.debug('BehaviorFactory initialized with behaviors:',
            Array.from(this.behaviors.keys()));
    }
    /**
     * Register a new behavior type.
     * @param {string} key - Unique identifier for the behavior
     * @param {typeof BaseBehavior} BehaviorClass - The behavior class to instantiate
     */
    static register(key, BehaviorClass) {
        if (this.behaviors.has(key)) {
            console.warn(`BehaviorFactory: Overwriting behavior '${key}'`);
        }
        this.behaviors.set(key, BehaviorClass);
    }
    /**
     * Create a behavior instance from a key and parameters.
     * @param {string} key - The behavior type key
     * @param {Enemy} enemy - The enemy entity
     * @param {Object} params - Configuration parameters for the behavior
     * @returns {BaseBehavior} The created behavior instance
     */
    static create(key, enemy, params = {}) {
        this.initialize();
        const BehaviorClass = this.behaviors.get(key);

        if (!BehaviorClass) {
            console.warn(`BehaviorFactory: Unknown behavior '${key}', defaulting to 'chase'`);
            return new ChaseBehavior(enemy, params);
        }
        return new BehaviorClass(enemy, params);
    }
    /**
     * Create a behavior from an AI configuration block.
     * This is the primary method used by Enemy.spawn().
     * 
     * @param {Enemy} enemy - The enemy entity
     * @param {Object} aiConfig - The ai block from enemy config
     * @returns {BaseBehavior} The created behavior instance
     */
    static createFromConfig(enemy, aiConfig) {
        if (!aiConfig) {
            // Default behavior for enemies without AI config
            return this.create('chase', enemy, { speed: 1.0 });
        }
        const key = aiConfig.behaviorKey || 'chase';
        const params = aiConfig.behaviorParams || {};
        return this.create(key, enemy, params);
    }
    /**
     * Check if a behavior type is registered.
     * @param {string} key - The behavior type key
     * @returns {boolean}
     */
    static has(key) {
        this.initialize();
        return this.behaviors.has(key);
    }
    /**
     * Get all registered behavior keys.
     * @returns {string[]}
     */
    static getRegisteredBehaviors() {
        this.initialize();
        return Array.from(this.behaviors.keys());
    }
    /**
     * Unregister a behavior type.
     * @param {string} key - The behavior type key
     */
    static unregister(key) {
        this.behaviors.delete(key);
    }
    /**
     * Clear all registered behaviors (useful for testing).
     */
    static clear() {
        this.behaviors.clear();
        this.initialized = false;
    }
}
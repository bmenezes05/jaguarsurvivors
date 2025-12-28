/**
 * Configuration Re-Export
 * 
 * This file maintains BACKWARD COMPATIBILITY for all existing imports.
 * The actual configuration has been modularized into src/config directory.
 * 
 * Existing imports like:
 *   import { CONFIG } from './config.js';
 *   import { CONFIG } from '../config.js';
 *   import { BASE_CONFIG } from './config.js';
 * 
 * Will continue to work exactly as before.
 * 
 * New modular files:
 * - src/config/weapons.config.js   (Weapon definitions)
 * - src/config/enemies.config.js   (Enemy & Boss definitions)
 * - src/config/players.config.js   (Player character definitions)
 * - src/config/maps.config.js      (Stage/Map definitions)
 * - src/config/upgrades.config.js  (Upgrades, Synergies, Items, Legendary)
 * - src/config/audio.config.js     (Audio file paths)
 * - src/config/gameplay.config.js  (XP, Pickups, Status Effects, World)
 * - src/config/index.js            (Aggregator)
 * 
 * WEAPON TYPE SEPARATION:
 * Weapons are now strictly typed:
 * - 'melee': Close range attacks (hitbox + animation)
 * - 'ranged': Projectile based attacks (straight line, range limit)
 * - 'trail': Trail based attacks (lifetime based, zone control)
 * 
 * Each type has its own strategyStats in weapons.config.js.
 */

// Re-export everything from the modular config
export { BASE_CONFIG, CONFIG, resetConfig } from './index.js';
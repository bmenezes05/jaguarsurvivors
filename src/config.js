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
 * WEAPON TYPE MIGRATION:
 * The 'ranged' weapon type has been renamed to 'trail' to better reflect
 * the actual behavior (trail effects, not true projectiles).
 * 
 * New trail weapon properties:
 * - trailSpeed: Visual movement speed (was: projectileSpeed)
 * - lifetimeMs: Duration in ms (was: range when used as duration)
 * - trailSize: Visual size (was: projectileSize)
 * 
 * Legacy properties are preserved for backward compatibility.
 */

// Re-export everything from the modular config
export { BASE_CONFIG, CONFIG, resetConfig } from './config/index.js';
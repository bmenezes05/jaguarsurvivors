/**
 * Root Configuration Aggregator
 * 
 * This file aggregates all modular configuration files into a single
 * CONFIG object that maintains FULL BACKWARD COMPATIBILITY with
 * existing code that imports and uses CONFIG.
 * 
 * Directory Structure:
 * src/config/
 * ├── index.js          (this file - aggregator)
 * ├── weapons.config.js
 * ├── projectiles.config.js
 * ├── enemies.config.js
 * ├── players.config.js
 * ├── maps.config.js
 * ├── upgrades.config.js
 * ├── audio.config.js
 * └── gameplay.config.js
 * 
 * Usage:
 * - Import from './config.js' as before (unchanged)
 * - Access CONFIG.weapon, CONFIG.enemy, etc. as before
 */
// Import all modular configs
import { weaponsConfig } from './weapons.config.js';
import { projectilesConfig } from './projectiles.config.js';
import { enemiesConfig, bossesConfig } from './enemies.config.js';
import { playersConfig } from './players.config.js';
import { mapsConfig } from './maps.config.js';
import {
    upgradesConfig,
    equipableItemsConfig,
    legendaryConfig,
    metaShopConfig,
    achievementsConfig
} from './upgrades.config.js';
import { audioConfig } from './audio.config.js';
import { pickupsConfig } from './pickups.config.js';
import {
    xpConfig,
    statusEffectsConfig,
    worldConfig,
    equipmentLimitsConfig,
    telegraphConfig,
    endlessModeConfig
} from './gameplay.config.js';
import { difficultyConfig } from './difficulty.config.js';
import { bossPhaseConfig } from './bossPhases.config.js';
import { structuresConfig } from './structures.config.js';
/**
 * BASE_CONFIG - Immutable base configuration
 * Used for resetting CONFIG to initial state
 */
export const BASE_CONFIG = {
    // == PLAYER ==
    player: playersConfig,
    // == ENEMY ==
    enemy: enemiesConfig,
    // == BOSSES ==
    bosses: bossesConfig,
    // == WEAPON ==
    weapon: weaponsConfig,
    // == PROJECTILES ==
    projectiles: projectilesConfig,
    // == XP ==
    xp: xpConfig,
    // == MAPS ==
    maps: mapsConfig,
    // == AUDIO ==
    audio: audioConfig,
    // == VISUALS ==
    statusEffects: statusEffectsConfig,
    // == PICKUPS ==
    pickups: pickupsConfig,
    // == UPGRADES ==
    upgrades: upgradesConfig,
    // == SYNERGIES ==
    synergies: [],
    // == EQUIPABLE ITEMS ==
    equipableItems: equipableItemsConfig,
    // == LEGENDARY ==
    legendary: legendaryConfig,
    // == META SHOP ==
    metaShop: metaShopConfig,
    // == ACHIEVEMENTS ==
    achievements: achievementsConfig,
    // == WORLD ==
    world: worldConfig,
    // == EQUIPMENT LIMITS ==
    equipmentLimits: equipmentLimitsConfig,
    // == AI DIFFICULTY SCALING ==
    difficulty: difficultyConfig,
    // == BOSS PHASE CONFIGURATIONS ==
    // == STRUCTURES ==
    structures: structuresConfig,
    // == TELEGRAPH ==
    telegraph: telegraphConfig,
    // == ENDLESS MODE ==
    endlessMode: endlessModeConfig
};
/**
 * CONFIG - Mutable configuration object
 * Deep cloned from BASE_CONFIG to allow runtime modifications
 */
export let CONFIG = JSON.parse(JSON.stringify(BASE_CONFIG));
/**
 * Resets CONFIG back to its initial state
 * Useful for game restarts or scene transitions
 */
export const resetConfig = () => {
    CONFIG = JSON.parse(JSON.stringify(BASE_CONFIG));
};
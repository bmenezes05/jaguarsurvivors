/**
 * Gameplay Configuration
 * 
 * Contains XP system, pickups, status effects, and general gameplay settings.
 */

// ==================== XP SYSTEM ====================
export const xpConfig = {
    baseXPToLevel: 20,
    xpScaling: 1.4,
    magnetRange: 150,
    magnetSpeed: 500,
    gems: [
        {
            key: 'xp_gem',
            image: 'src/assets/images/xp_small.png',
            gemValue: 10
        },
        {
            key: 'xp_gem_medium',
            image: 'src/assets/images/xp_medium.png',
            gemValue: 20
        },
        {
            key: 'xp_gem_big',
            image: 'src/assets/images/xp_big.png',
            gemValue: 30
        },
        {
            key: 'xp_gem_huge',
            image: 'src/assets/images/xp_huge.png',
            gemValue: 50
        }
    ]
};

// ==================== STATUS EFFECTS ====================
export const statusEffectsConfig = {
    burn: { color: 0xFF4500, name: 'BURN' },
    freeze: { color: 0x00FFFF, name: 'FREEZE' },
    poison: { color: 0x00FF00, name: 'POISON' },
    stun: { color: 0xFFFF00, name: 'STUN' }
};

// ==================== WORLD SETTINGS ====================
export const worldConfig = {
    width: 1500,
    height: 1500,
    tileSize: 128
};

// ==================== EQUIPMENT LIMITS ====================
export const equipmentLimitsConfig = {
    maxWeapons: 2,
    maxItems: 3
};



// ==================== TELEGRAPH SYSTEM ====================
export const telegraphConfig = {
    defaults: {
        duration: 1000, // ms before spawn
        alpha: 0.4,
        startScale: 0.1,
        endScale: 1.0
    },
    types: {
        enemy: {
            color: 0xFF0000, // Red
            radius: 30,
            shape: 'circle'
        },
        elite: {
            color: 0xFF8C00, // Dark Orange
            radius: 45,
            shape: 'circle'
        },
        boss: {
            color: 0xFF0000, // Red
            radius: 80,
            shape: 'circle'
        },
        item: {
            color: 0x00FF00, // Green
            radius: 20,
            shape: 'circle'
        },
        structure: {
            color: 0x00FF00, // Green (same as item)
            radius: 50, // Larger for structures
            shape: 'circle'
        }
    }
};

// ==================== ENDLESS MODE ====================
export const endlessModeConfig = {
    difficultyIncreaseInterval: 0.25,
    waveDifficultyMultiplier: 0.1,
    bossChance: 0.25,
};

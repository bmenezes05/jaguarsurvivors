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

// ==================== PICKUPS ====================
export const pickupsConfig = {
    tables: {
        common: [
            { type: 'health_kit', chance: 0.8 },
            { type: 'magnet', chance: 0.15 },
            { type: 'map_bomb', chance: 0.05 }
        ],
        rare: [
            { type: 'health_kit', chance: 0.5 },
            { type: 'magnet', chance: 0.25 },
            { type: 'map_bomb', chance: 0.25 }
        ],
        boss: [
            { type: 'health_kit_big', chance: 1.0 }
        ]
    },
    types: {
        health_kit: {
            color: 0x00FF00,
            scale: 1.0,
            spriteKey: 'pickup_cure',
            icon: '➕',
            shape: 'square',
            effect: 'heal',
            value: 0.2
        },
        health_kit_big: {
            color: 0x00FF00,
            scale: 1.5,
            spriteKey: 'pickup_cure',
            icon: '➕',
            shape: 'square',
            effect: 'heal',
            value: 0.5
        },
        magnet: {
            color: 0x0000FF,
            scale: 1.0,
            spriteKey: 'pickup_speedboots',
            icon: '🧲',
            shape: 'circle',
            effect: 'magnet',
            duration: 5000
        },
        map_bomb: {
            color: 0xFF0000,
            scale: 1.0,
            spriteKey: 'pickup_bomb',
            icon: '💣',
            shape: 'star',
            effect: 'bomb'
        },
        coin: {
            color: 0xFFD700,
            scale: 0.8,
            spriteKey: 'pickup_bomb',
            icon: '💰',
            shape: 'circle',
            effect: 'coin',
            value: 1
        }
    }
};

// ==================== WORLD SETTINGS ====================
export const worldConfig = {
    width: 1500,
    height: 1500,
    tileSize: 128
};

// ==================== EQUIPMENT LIMITS ====================
export const equipmentLimitsConfig = {
    maxWeapons: 3,
    maxItems: 3
};

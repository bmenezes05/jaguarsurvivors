export const structuresConfig = {
    // Global settings
    spawn: {
        density: 0.05, // Low density to avoid clogging the map
        minDistance: 300, // Distance between structures
        minPlayerDistance: 400, // Distance from player spawn
        interval: 10000, // Respawn attempt every 10 seconds
    },

    // Structure Types
    types: {
        crate_wood: {
            key: 'crate_wood',
            spriteKey: 'structure_crate',
            image: 'src/assets/images/weapon_handbag.png',
            maxHp: 50,
            solid: true,
            hitboxScale: 0.8,
            dropTable: 'common_structure'
        },
        barrel_explosive: {
            key: 'barrel_explosive',
            spriteKey: 'structure_barrel',
            image: 'src/assets/images/weapon_handbag.png',
            maxHp: 40,
            solid: true,
            hitboxScale: 0.7,
            dropTable: 'rare_structure'
        },
        structure_rock_1: {
            key: 'structure_rock_1',
            spriteKey: 'structure_rock_1',
            image: 'src/assets/images/structure_rock_1.png',
            maxHp: 100,
            solid: true,
            hitboxScale: 0.9,
            dropTable: 'common_structure'
        },
        structure_rock_2: {
            key: 'structure_rock_2',
            spriteKey: 'structure_rock_2',
            image: 'src/assets/images/structure_rock_2.png',
            maxHp: 150,
            solid: true,
            hitboxScale: 0.9,
            dropTable: 'rare_structure'
        },
        structure_crystal: {
            key: 'structure_crystal',
            spriteKey: 'structure_crystal',
            image: 'src/assets/images/structure_crystal.png',
            maxHp: 80,
            solid: true,
            hitboxScale: 0.8,
            dropTable: 'legendary_structure'
        }
    },

    // Drop Tables for structures
    dropTables: {
        common_structure: [
            { type: 'nothing', chance: 0.6 },
            { type: 'xp_gem', chance: 0.3, value: 10 },
            { type: 'health_kit', chance: 0.1 }
        ],
        rare_structure: [
            { type: 'nothing', chance: 0.4 },
            { type: 'xp_gem_medium', chance: 0.4, value: 20 },
            { type: 'magnet', chance: 0.2 }
        ],
        legendary_structure: [
            { type: 'nothing', chance: 0.2 },
            { type: 'xp_gem_large', chance: 0.6, value: 50 },
            { type: 'treasure_chest', chance: 0.2 }
        ]
    }
};

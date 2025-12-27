/**
 * Upgrades & Progression Configuration
 * 
 * Contains all upgrade definitions, synergies, equipable items,
 * legendary rewards, and meta shop configurations.
 */

// ==================== PASSIVE UPGRADES ====================
export const upgradesConfig = [
    {
        id: 'dmg',
        name: 'DANO LETAL',
        spriteKey: 'pickup_bomb',
        iconSpriteKey: 'pickup_bomb',
        icon: '⚔️',
        desc: '+20% Dano',
        type: 'passive',
        maxStacks: -1,
        applyEffect: { stat: 'damageStat', operation: 'addMultiplier', value: 0.2 }
    },
    {
        id: 'cd',
        name: 'GATILHO RÁPIDO',
        spriteKey: 'pickup_bomb',
        iconSpriteKey: 'pickup_bomb',
        icon: '⚡',
        desc: '+20% Vel. Ataque',
        type: 'passive',
        maxStacks: -1,
        applyEffect: { stat: 'attackSpeedStat', operation: 'addMultiplier', value: 0.2 }
    },
    {
        id: 'spd',
        name: 'AGILIDADE',
        spriteKey: 'pickup_speedboots',
        iconSpriteKey: 'pickup_speedboots',
        icon: '👟',
        desc: '+15% Move Spd',
        type: 'passive',
        maxStacks: -1,
        applyEffect: { stat: 'moveSpeedStat', operation: 'addMultiplier', value: 0.15 }
    },
    {
        id: 'rng',
        name: 'OLHO DE ÁGUIA',
        spriteKey: 'pickup_bomb',
        iconSpriteKey: 'pickup_bomb',
        icon: '🎯',
        desc: '+25% Alcance/Área',
        type: 'passive',
        maxStacks: -1,
        applyEffect: { stat: 'areaStat', operation: 'addMultiplier', value: 0.25 }
    },
    {
        id: 'hp',
        name: 'BLINDAGEM',
        spriteKey: 'pickup_shield',
        iconSpriteKey: 'pickup_shield',
        icon: '🛡️',
        desc: '+20 HP Máx',
        type: 'passive',
        maxStacks: -1,
        applyEffect: { stat: 'maxHealthStat', operation: 'addFlat', value: 20 }
    },
    {
        id: 'prj',
        name: 'MUNIÇÃO VELOZ',
        spriteKey: 'pickup_bomb',
        iconSpriteKey: 'pickup_bomb',
        icon: '💨',
        desc: '+30% Vel. Projétil',
        type: 'passive',
        maxStacks: -1,
        applyEffect: { stat: 'projectileSpeedStat', operation: 'addMultiplier', value: 0.3 }
    },
    {
        id: 'crit',
        name: 'INSTINTO ASSASSINO',
        spriteKey: 'pickup_bomb',
        iconSpriteKey: 'pickup_bomb',
        icon: '🗡️',
        desc: '+10% Chance Crítico',
        type: 'passive',
        maxStacks: -1,
        applyEffect: { stat: 'critChanceStat', operation: 'addFlat', value: 0.1 }
    },
    {
        id: 'evasion',
        name: 'REFLEXOS DE LINCE',
        spriteKey: 'pickup_speedboots',
        iconSpriteKey: 'pickup_speedboots',
        icon: '🍃',
        desc: '+5% Esquiva',
        type: 'passive',
        maxStacks: -1,
        applyEffect: { stat: 'evasionStat', operation: 'addFlat', value: 0.05 }
    },
    {
        id: 'thorns',
        name: 'ARMADURA DE ESPINHOS',
        spriteKey: 'pickup_shield',
        iconSpriteKey: 'pickup_shield',
        icon: '🌵',
        desc: 'Reflete 20% do Dano',
        type: 'passive',
        maxStacks: -1,
        applyEffect: { stat: 'thornsStat', operation: 'addFlat', value: 0.2 }
    },
    {
        id: 'knockback',
        name: 'IMPACTO BRUTAL',
        spriteKey: 'pickup_bomb',
        iconSpriteKey: 'pickup_bomb',
        icon: '👊',
        desc: '+30% Força Empurrão',
        type: 'passive',
        maxStacks: -1,
        applyEffect: { stat: 'knockbackStat', operation: 'addMultiplier', value: 0.3 }
    },
    {
        id: 'elemental',
        name: 'MESTRE DOS ELEMENTOS',
        spriteKey: 'pickup_bomb',
        iconSpriteKey: 'pickup_bomb',
        icon: '🔥',
        desc: '+25% Dano Elemental',
        type: 'passive',
        maxStacks: -1,
        applyEffect: { stat: 'elementalDamageStat', operation: 'addMultiplier', value: 0.25 }
    },
    {
        id: 'pact_glass_cannon',
        name: 'PACTO DE SANGUE',
        spriteKey: 'pickup_bomb',
        iconSpriteKey: 'pickup_bomb',
        icon: '🩸',
        desc: '+50% Dano, -20% Vida Máx',
        type: 'passive',
        maxStacks: 1,
        applyEffect: { stat: 'damageStat', operation: 'addMultiplier', value: 0.5 }
    },
    {
        id: 'vampirism',
        name: 'VAMPIRISMO',
        spriteKey: 'pickup_cure',
        iconSpriteKey: 'pickup_cure',
        icon: '🧛',
        desc: '+2% Life Steal',
        type: 'passive',
        maxStacks: -1,
        applyEffect: { stat: 'lifeStealStat', operation: 'addFlat', value: 0.02 }
    },
    {
        id: 'meditation',
        name: 'MEDITAÇÃO',
        spriteKey: 'pickup_cure',
        iconSpriteKey: 'pickup_cure',
        icon: '🧘',
        desc: '+1 HP/sec Regen',
        type: 'passive',
        maxStacks: -1,
        applyEffect: { stat: 'hpRegenStat', operation: 'addFlat', value: 1.0 }
    }
];

// ==================== SYNERGIES (Weapon + Passive = Legendary) ====================
export const synergiesConfig = [
    {
        resultId: 'evo_ghost_blade',
        name: 'GHOST BLADE',
        spriteKey: 'weapon_katana',
        icon: '👻',
        desc: 'LEGENDARY: Ignora Armor + Dano Crítico Massivo',
        reqWeapon: 'weapon_katana',
        reqPassive: 'crit',
        reqPassiveLevel: 1,
        effects: [
            { stat: 'damageStat', operation: 'addMultiplier', value: 1.0 },
            { stat: 'critChanceStat', operation: 'addFlat', value: 0.2 },
            { stat: 'criticalDamageStat', operation: 'addFlat', value: 1.0 }
        ]
    },
    {
        resultId: 'evo_holy_smite',
        name: 'JULGAMENTO DIVINO',
        spriteKey: 'weapon_sword',
        icon: '✨',
        desc: 'LEGENDARY: Ataques explodem em área',
        reqWeapon: 'weapon_sword',
        reqPassive: 'rng',
        reqPassiveLevel: 1,
        effects: [
            { stat: 'areaStat', operation: 'addMultiplier', value: 0.5 },
            { stat: 'damageStat', operation: 'addMultiplier', value: 0.5 }
        ]
    }
];

// ==================== EQUIPABLE ITEMS ====================
export const equipableItemsConfig = [
    {
        id: 'boots_speed',
        name: 'Botas Velozes',
        spriteKey: 'item_boots',
        icon: '👟',
        desc: '+15% Move Speed por nível',
        maxLevel: 5,
        levelEffects: [
            { stat: 'moveSpeedStat', operation: 'addMultiplier', value: 0.15 }
        ]
    },
    {
        id: 'shield_reflect',
        name: 'Escudo de Espinhos',
        spriteKey: 'pickup_shield',
        icon: '🛡️',
        desc: '+10% Thorns por nível',
        maxLevel: 5,
        levelEffects: [
            { stat: 'thornsStat', operation: 'addFlat', value: 0.1 }
        ]
    },
    {
        id: 'crown_power',
        name: 'Coroa do Poder',
        spriteKey: 'item_crown',
        icon: '👑',
        desc: '+12% Dano por nível',
        maxLevel: 5,
        levelEffects: [
            { stat: 'damageStat', operation: 'addMultiplier', value: 0.12 }
        ]
    },
    {
        id: 'glasses_vision',
        name: 'Óculos de Precisão',
        spriteKey: 'item_glasses',
        icon: '👓',
        desc: '+8% Crit Chance por nível',
        maxLevel: 5,
        levelEffects: [
            { stat: 'critChanceStat', operation: 'addFlat', value: 0.08 }
        ]
    },
    {
        id: 'gloves_strength',
        name: 'Luvas de Força',
        spriteKey: 'item_gloves',
        icon: '🥊',
        desc: '+15% Knockback por nível',
        maxLevel: 5,
        levelEffects: [
            { stat: 'knockbackStat', operation: 'addMultiplier', value: 0.15 }
        ]
    },
    {
        id: 'cape_evasion',
        name: 'Capa da Evasão',
        spriteKey: 'item_cape',
        icon: '🧥',
        desc: '+5% Evasion por nível',
        maxLevel: 5,
        levelEffects: [
            { stat: 'evasionStat', operation: 'addFlat', value: 0.05 }
        ]
    },
    {
        id: 'chain_justice',
        name: 'Corrente da Justiça',
        spriteKey: 'item_chain_justice',
        icon: '⛓️',
        desc: '+20% HP Max por nível',
        maxLevel: 5,
        levelEffects: [
            { stat: 'maxHealthStat', operation: 'addMultiplier', value: 0.20 }
        ]
    }
];

// ==================== LEGENDARY REWARDS ====================
export const legendaryConfig = [
    // Gadgets: Autonomous systems
    {
        id: 'orbital_blade',
        name: 'Lâmina Orbital',
        type: 'gadget',
        description: 'Uma lâmina de energia orbita você, cortando inimigos próximos.',
        icon: '🔄',
        rarity: 'legendary',
        config: {
            radius: 100,
            speed: 2,
            damage: 50,
            scale: 1.0,
            sprite: 'weapon_katana'
        }
    },
    {
        id: 'auto_turret',
        name: 'Torreta Automática',
        type: 'gadget',
        description: 'Um drone que atira automaticamente no inimigo mais próximo.',
        icon: '🤖',
        rarity: 'legendary',
        config: {
            fireRate: 1000,
            range: 400,
            damage: 30,
            projectileSpeed: 600,
            sprite: 'weapon_laser_gun'
        }
    },
    // Procs: Chance on Hit effects
    {
        id: 'chain_lightning',
        name: 'Cadeia de Raios',
        type: 'proc',
        description: '15% de chance de disparar um raio que salta entre inimigos.',
        icon: '⚡',
        rarity: 'legendary',
        config: {
            chance: 0.15,
            damage: 40,
            bounces: 3,
            range: 200,
            color: 0x00FFFF
        }
    },
    {
        id: 'frost_nova',
        name: 'Nova Gélida',
        type: 'proc',
        description: '10% de chance de congelar inimigos em área ao acertar.',
        icon: '❄️',
        rarity: 'legendary',
        config: {
            chance: 0.10,
            damage: 20,
            radius: 150,
            freezeDuration: 2000,
            color: 0x66AAFF
        }
    }
];

// ==================== META SHOP ====================
export const metaShopConfig = [
    {
        id: 'health',
        name: 'Vitalidade',
        icon: '❤️',
        description: '+5% Max HP per rank',
        costBase: 100,
        costScaling: 1.5,
        maxRank: 10,
        stat: 'maxHealth',
        bonusPerRank: 0.05
    },
    {
        id: 'damage',
        name: 'Força Bruta',
        icon: '⚔️',
        description: '+5% Damage per rank',
        costBase: 150,
        costScaling: 1.6,
        maxRank: 10,
        stat: 'damage',
        bonusPerRank: 0.05
    },
    {
        id: 'goldGain',
        name: 'Ganância',
        icon: '💰',
        description: '+10% Gold Gain per rank',
        costBase: 200,
        costScaling: 1.8,
        maxRank: 5,
        stat: 'goldGain',
        bonusPerRank: 0.10
    },
    {
        id: 'moveSpeed',
        name: 'Agilidade',
        icon: '👟',
        description: '+3% Speed per rank',
        costBase: 120,
        costScaling: 1.5,
        maxRank: 5,
        stat: 'moveSpeed',
        bonusPerRank: 0.03
    },
    {
        id: 'revival',
        name: 'Segunda Chance',
        icon: '🕊️',
        description: '+1 Revival (Max 1)',
        costBase: 1000,
        costScaling: 2.0,
        maxRank: 1,
        stat: 'revival',
        bonusPerRank: 1
    }
];

// ==================== ACHIEVEMENTS ====================
export const achievementsConfig = [
    { id: 'unlock_ucraniaman', title: 'O Estrangeiro', desc: 'Matar 1.000 inimigos' },
    { id: 'unlock_samurai', title: 'Código de Honra', desc: 'Sobreviver 10min' },
    { id: 'unlock_miss', title: 'Fora da Lei', desc: 'Acumular 5.000 moedas' }
];

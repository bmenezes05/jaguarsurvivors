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
    },
    {
        id: 'dash_cooldown',
        name: 'DASH MAIS RÁPIDO',
        spriteKey: 'pickup_speedboots',
        iconSpriteKey: 'pickup_speedboots',
        icon: '💨',
        desc: '-15% Cooldown do Dash',
        type: 'passive',
        maxStacks: -1,
        applyEffect: { stat: 'dashCooldownStat', operation: 'addMultiplier', value: -0.15 }
    },
    {
        id: 'dash_speed',
        name: 'DASH MAIS LONGO',
        spriteKey: 'pickup_speedboots',
        iconSpriteKey: 'pickup_speedboots',
        icon: '🚀',
        desc: '+20% Distância do Dash',
        type: 'passive',
        maxStacks: -1,
        applyEffect: { stat: 'dashSpeedStat', operation: 'addMultiplier', value: 0.20 }
    }
];

// Synergies removed for MVP as per request

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
        desc: '+15% Thorns por nível',
        maxLevel: 5,
        levelEffects: [
            { stat: 'thornsStat', operation: 'addFlat', value: 0.15 }
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
    },
    {
        id: 'book_of_wisdom',
        name: 'Livro da Sabedoria',
        spriteKey: 'item_book',
        icon: '📖',
        desc: '+10% XP Gain por nível',
        maxLevel: 5,
        levelEffects: [
            { stat: 'xpGainStat', operation: 'addMultiplier', value: 0.10 }
        ]
    },
    {
        id: 'ring_of_fire',
        name: 'Anel de Fogo',
        spriteKey: 'item_ring',
        icon: '🔥',
        desc: '+15% Dano Elemental por nível',
        maxLevel: 5,
        levelEffects: [
            { stat: 'elementalDamageStat', operation: 'addMultiplier', value: 0.15 }
        ]
    },
    {
        id: 'amulet_of_luck',
        name: 'Amuleto da Sorte',
        spriteKey: 'item_amulet',
        icon: '🍀',
        desc: '+5% Chance de Drop por nível',
        maxLevel: 5,
        levelEffects: [
            { stat: 'dropChanceStat', operation: 'addMultiplier', value: 0.05 }
        ]
    },
    {
        id: 'tome_of_power',
        name: 'Tomo do Poder',
        spriteKey: 'item_tome',
        icon: '📜',
        desc: '+1 Projétil por nível',
        maxLevel: 3,
        levelEffects: [
            { stat: 'projectileCountStat', operation: 'addFlat', value: 1 }
        ]
    }
];

// ==================== LEGENDARY REWARDS ====================
export const legendaryConfig = [
    // ========== GADGETS ==========
    {
        id: 'orbital_blade',
        name: 'Lâmina Orbital',
        type: 'gadget',
        category: 'Gadget',
        description: 'Uma lâmina de energia orbita você, cortando inimigos próximos.',
        icon: '🔄',
        rarity: 'legendary',
        sprite: 'weapon_katana',
        radius: 120,
        speed: 3,
        damage: 75,
        scale: 1.2
    },
    {
        id: 'auto_turret',
        name: 'Torreta Automática',
        type: 'gadget',
        category: 'Gadget',
        description: 'Um drone que atira automaticamente no inimigo mais próximo.',
        icon: '🤖',
        rarity: 'legendary',
        sprite: 'weapon_laser_gun',
        fireRate: 1000,
        range: 400,
        damage: 30,
        projectileSpeed: 600
    },
    {
        id: 'buff_totem',
        name: 'Totem Sagrado',
        type: 'gadget',
        category: 'Gadget',
        description: 'Totem que aumenta seu dano em 50% quando você está próximo.',
        icon: '🗿',
        rarity: 'legendary',
        sprite: 'weapon_sword',
        radius: 200,
        damageBonus: 0.5
    },
    {
        id: 'debuff_field',
        name: 'Campo de Enfraquecimento',
        type: 'gadget',
        category: 'Gadget',
        description: 'Cria uma área que reduz a velocidade dos inimigos em 70%.',
        icon: '🌀',
        rarity: 'legendary',
        sprite: 'weapon_laser_gun',
        radius: 250,
        slowAmount: 0.7,
        damagePerSecond: 10
    },
    {
        id: 'laser_trap',
        name: 'Armadilha Laser',
        type: 'gadget',
        category: 'Gadget',
        description: 'Laser rotativo que varre uma área, causando dano contínuo.',
        icon: '📡',
        rarity: 'legendary',
        sprite: 'weapon_laser_gun',
        length: 300,
        rotationSpeed: 1.5,
        damage: 40
    },

    // ========== PROCS ==========
    {
        id: 'chain_lightning',
        name: 'Cadeia de Raios',
        type: 'proc',
        category: 'Proc',
        description: '15% de chance de disparar um raio que salta entre inimigos.',
        icon: '⚡',
        rarity: 'legendary',
        chance: 0.15,
        damage: 40,
        bounces: 3,
        range: 200,
        color: 0x00FFFF,
        cooldown: 500
    },
    {
        id: 'frost_nova',
        name: 'Nova Gélida',
        type: 'proc',
        category: 'Proc',
        description: '10% de chance de congelar inimigos em área ao acertar.',
        icon: '❄️',
        rarity: 'legendary',
        chance: 0.10,
        damage: 20,
        radius: 150,
        freezeDuration: 2000,
        color: 0x66AAFF,
        cooldown: 1000
    },
    {
        id: 'explosion_on_kill',
        name: 'Morte Explosiva',
        type: 'proc',
        category: 'Proc',
        description: '100% de chance: inimigos explodem ao morrer, causando dano em área.',
        icon: '💥',
        rarity: 'legendary',
        chance: 1.0,
        damage: 60,
        radius: 120,
        color: 0xFF4500,
        cooldown: 0
    },
    {
        id: 'vampire_strike',
        name: 'Golpe Vampírico',
        type: 'proc',
        category: 'Proc',
        description: '20% de chance de roubar vida ao causar dano.',
        icon: '🧛',
        rarity: 'legendary',
        chance: 0.20,
        healPercent: 0.5,
        color: 0xFF0000,
        cooldown: 200
    },
    {
        id: 'thorns_burst',
        name: 'Espinhos Explosivos',
        type: 'proc',
        category: 'Proc',
        description: '25% de chance ao receber dano de refletir em área.',
        icon: '🌵',
        rarity: 'legendary',
        chance: 0.25,
        damageMultiplier: 2.0,
        radius: 180,
        color: 0x8B4513,
        cooldown: 1000
    },

    // ========== COMPANIONS ==========
    {
        id: 'attack_companion',
        name: 'Jaguar Espiritual',
        type: 'companion',
        category: 'Companion',
        description: 'Um jaguar espiritual que ataca inimigos próximos.',
        icon: '🐆',
        rarity: 'legendary',
        sprite: 'enemy_jaguar',
        scale: 0.6,
        tint: 0x00FFFF,
        offset: { x: -60, y: -40 },
        attackRate: 1500,
        range: 300,
        damage: 35,
        projectileSprite: 'weapon_laser_gun',
        projectileSpeed: 500
    },
    {
        id: 'collector_companion',
        name: 'Espírito Coletor',
        type: 'companion',
        category: 'Companion',
        description: 'Coleta automaticamente XP e itens em uma área maior.',
        icon: '👻',
        rarity: 'legendary',
        sprite: 'pickup_xp',
        scale: 1.0,
        tint: 0xFFD700,
        offset: { x: 50, y: -50 },
        collectionRadius: 400,
        collectionRate: 100
    },
    {
        id: 'buff_companion',
        name: 'Xamã Protetor',
        type: 'companion',
        category: 'Companion',
        description: 'Periodicamente concede escudo e aumenta velocidade de ataque.',
        icon: '🧙',
        rarity: 'legendary',
        sprite: 'enemy_shaman',
        scale: 0.5,
        tint: 0x00FF00,
        offset: { x: 60, y: 40 },
        buffDuration: 5000,
        buffCooldown: 10000,
        attackSpeedBonus: 0.3,
        shieldAmount: 50
    },
    {
        id: 'gadget_mine',
        name: 'Mina Terrestre',
        type: 'gadget',
        category: 'Gadget',
        description: 'Deixa minas no chão que explodem em contato com inimigos.',
        icon: '💣',
        rarity: 'legendary',
        sprite: 'legendary_gadget_mine',
        radius: 150,
        damage: 100,
        cooldown: 3000
    },
    {
        id: 'proc_nova',
        name: 'Nova Sagrada',
        type: 'proc',
        category: 'Proc',
        description: '25% de chance de emitir uma nova de energia sagrada ao ser atingido.',
        icon: '💥',
        rarity: 'legendary',
        chance: 0.25,
        damage: 80,
        radius: 200,
        color: 0xFFFF00,
        cooldown: 1000
    },
    {
        id: 'companion_wisp',
        name: 'Wisp de Gelo',
        type: 'companion',
        category: 'Companion',
        description: 'Um wisp que atira projéteis de gelo que lentificam inimigos.',
        icon: '❄️',
        rarity: 'legendary',
        sprite: 'legendary_companion_wisp',
        scale: 0.8,
        tint: 0xADD8E6,
        offset: { x: -50, y: -60 },
        attackRate: 2000,
        range: 400,
        damage: 20,
        projectileSprite: 'pixel',
        projectileSpeed: 400,
        effects: {
            elemental: 'freeze',
            slowAmount: 0.5,
            duration: 2000
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
    { id: 'unlock_miss', title: 'Fora da Lei', desc: 'Acumular 5.000 moedas' },
    { id: 'defeat_favela_boss', title: 'Pacificador', desc: 'Derrotar o chefe da Favela' },
    { id: 'defeat_congresso_boss', title: 'Reforma Política', desc: 'Derrotar o chefe do Congresso' },
    { id: 'defeat_avenida_boss', title: 'Voz do Povo', desc: 'Derrotar o chefe das Manifestações' },
    { id: 'reach_endless_mode', title: 'Sobrevivente', desc: 'Chegar ao Modo Infinito' },
    { id: 'unlock_all_characters', title: 'Heróis da Nação', desc: 'Desbloquear todos os personagens' },
    { id: 'max_level_item', title: 'Potencial Máximo', desc: 'Levar um item ao nível máximo' },
    { id: 'win_with_all_characters', title: 'Líder Versátil', desc: 'Vencer com todos os personagens' }
];

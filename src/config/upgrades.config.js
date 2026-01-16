/**
 * Upgrades & Progression Configuration
 * 
 * Contains all upgrade definitions, synergies, equipable items,
 * legendary rewards, and meta shop configurations.
 */

// ==================== EQUIPABLE ITEMS ====================
export const equipableItemsConfig = [
    {
        id: 'item_medalha',
        name: 'Medalha de Honra',
        spriteKey: 'item_medalha',
        image: 'src/assets/images/item_medalha.png',
        desc: '+20% Move Speed por nível',
        maxLevel: 5,
        levelEffects: [
            { stat: 'moveSpeedStat', operation: 'addMultiplier', value: 0.20 }
        ]
    },
    {
        id: 'item_luva',
        name: 'Luva do Brasil',
        spriteKey: 'item_luva',
        image: 'src/assets/images/item_luva.png',
        desc: '+20% Dano por nível',
        maxLevel: 5,
        levelEffects: [
            { stat: 'damageStat', operation: 'addMultiplier', value: 0.20 }
        ]
    },
    {
        id: 'item_coroa',
        name: 'Coroa Imperial',
        spriteKey: 'item_coroa',
        image: 'src/assets/images/item_coroa.png',
        desc: '+20% Dano Crítico por nível',
        maxLevel: 5,
        levelEffects: [
            { stat: 'criticalDamageStat', operation: 'addMultiplier', value: 0.20 }
        ]
    },
    {
        id: 'item_oculos',
        name: 'Óculos do Futuro',
        spriteKey: 'item_oculos',
        image: 'src/assets/images/item_oculos.png',
        desc: '+15% Chance Crítico por nível',
        maxLevel: 5,
        levelEffects: [
            { stat: 'critChanceStat', operation: 'addFlat', value: 0.15 }
        ]
    },
    {
        id: 'item_toga',
        name: 'Toga do STF',
        spriteKey: 'item_toga',
        image: 'src/assets/images/item_toga.png',
        desc: '+25% HP Máximo por nível',
        maxLevel: 5,
        levelEffects: [
            { stat: 'maxHealthStat', operation: 'addMultiplier', value: 0.25 }
        ]
    },
    {
        id: 'item_terno_centrao',
        name: 'Terno do Centrão',
        spriteKey: 'item_terno_centrao',
        image: 'src/assets/images/item_terno_centrao.png',
        desc: '+1.0 HP Regen por nível',
        maxLevel: 5,
        levelEffects: [
            { stat: 'hpRegenStat', operation: 'addFlat', value: 1.0 }
        ]
    },
    {
        id: 'item_garra',
        name: 'Garra de Jaguar',
        spriteKey: 'item_garra',
        image: 'src/assets/images/item_garra.png',
        desc: '+5% Life Steal por nível',
        maxLevel: 5,
        levelEffects: [
            { stat: 'lifeStealStat', operation: 'addFlat', value: 0.5 }
        ]
    },
    {
        id: 'item_bandeira_missao',
        name: 'Bandeira de Missão',
        spriteKey: 'item_bandeira_missao',
        image: 'src/assets/images/item_bandeira_missao.png',
        desc: '-25% Recarga Dash por nível',
        maxLevel: 5,
        levelEffects: [
            { stat: 'dashCooldownStat', operation: 'addMultiplier', value: -0.25 }
        ]
    },
    {
        id: 'item_corrente',
        name: 'Corrente de Ouro',
        spriteKey: 'item_corrente',
        image: 'src/assets/images/item_corrente.png',
        desc: '+10 Espinhos por nível',
        maxLevel: 5,
        levelEffects: [
            { stat: 'thornsStat', operation: 'addFlat', value: 10 }
        ]
    },
    {
        id: 'item_soco_ingles',
        name: 'Soco Inglês',
        spriteKey: 'item_soco_ingles',
        image: 'src/assets/images/item_soco_ingles.png',
        desc: '+15% Dano por nível',
        maxLevel: 5,
        levelEffects: [
            { stat: 'damageStat', operation: 'addMultiplier', value: 0.15 }
        ]
    },
    {
        id: 'item_cinto',
        name: 'Cinto da Missão',
        spriteKey: 'item_cinto',
        image: 'src/assets/images/item_cinto.png',
        desc: '+40 Raio de Coleta por nível',
        maxLevel: 5,
        levelEffects: [
            { stat: 'pickupRadiusStat', operation: 'addFlat', value: 40 }
        ]
    },
    {
        id: 'item_boots',
        name: 'Botas Voadoras',
        spriteKey: 'item_boots',
        image: 'src/assets/images/item_boots.png',
        desc: '+25% Move Speed por nível',
        maxLevel: 5,
        levelEffects: [
            { stat: 'moveSpeedStat', operation: 'addMultiplier', value: 0.25 }
        ]
    },
    {
        id: 'item_bracelete',
        name: 'Bracelete de Força',
        spriteKey: 'item_bracelete',
        image: 'src/assets/images/item_bracelete.png',
        desc: '+25% Vel. Ataque por nível',
        maxLevel: 5,
        levelEffects: [
            { stat: 'attackSpeedStat', operation: 'addMultiplier', value: 0.25 }
        ]
    }
];



// ==================== LEGENDARY REWARDS ====================
export const legendaryConfig = [
    // ========== GADGETS ==========
    {
        id: 'legend_blade',
        name: 'Lâmina Orbital',
        type: 'gadget',
        category: 'Gadget',
        description: 'Uma lâmina de energia orbita você, cortando inimigos próximos.',
        icon: '🔄',
        rarity: 'legendary',
        sprite: 'legend_blade',
        radius: 120,
        speed: 2,
        damage: 75,
        scale: 0.4
    },
    {
        id: 'legend_torre',
        name: 'Torreta Automática',
        type: 'gadget',
        category: 'Gadget',
        description: 'Um drone que atira automaticamente no inimigo mais próximo.',
        icon: '🤖',
        rarity: 'legendary',
        sprite: 'legend_torre',
        fireRate: 1000,
        range: 400,
        damage: 30,
        projectileSpeed: 600,
        projectileSprite: 'projectile_energy',
        scale: 0.6
    },
    {
        id: 'legend_totem',
        name: 'Totem Sagrado',
        type: 'gadget',
        category: 'Gadget',
        description: 'Totem que aumenta seu dano em 100% quando você está próximo.',
        icon: '🗿',
        rarity: 'legendary',
        sprite: 'legend_totem',
        radius: 200,
        damageBonus: 1.0
    },
    {
        id: 'legend_dark_field',
        name: 'Zona Obscura',
        type: 'gadget',
        category: 'Gadget',
        description: 'Cria uma área que reduz a velocidade dos inimigos em 70%.',
        icon: '🌀',
        rarity: 'legendary',
        sprite: 'legend_dark_field',
        radius: 250,
        slowAmount: 0.7,
        damagePerSecond: 10
    },
    {
        id: 'legend_torre_laser',
        name: 'Armadilha Laser',
        type: 'gadget',
        category: 'Gadget',
        description: 'Laser rotativo que varre uma área, causando dano contínuo.',
        icon: '📡',
        rarity: 'legendary',
        sprite: 'legend_torre_laser',
        length: 300,
        rotationSpeed: 1.5,
        damage: 40
    },
    {
        id: 'legend_mina_terrestre',
        name: 'Mina Terrestre',
        type: 'gadget',
        category: 'Gadget',
        description: 'Deixa minas no chão que explodem em contato com inimigos.',
        icon: '💣',
        rarity: 'legendary',
        sprite: 'legend_mina_terrestre',
        radius: 150,
        damage: 100,
        cooldown: 3000
    },

    // // ========== PROCS ==========
    {
        id: 'legend_chain',
        name: 'Cadeia de Raios',
        type: 'proc',
        category: 'Proc',
        description: '15% de chance de disparar um raio que salta entre inimigos.',
        icon: '⚡',
        rarity: 'legendary',
        sprite: 'legend_chain',
        chance: 0.15,
        damage: 40,
        bounces: 3,
        range: 200,
        color: 0x00FFFF,
        cooldown: 500
    },
    {
        id: 'legend_ice',
        name: 'Nova Gélida',
        type: 'proc',
        category: 'Proc',
        description: '10% de chance de congelar inimigos em área ao acertar.',
        icon: '❄️',
        rarity: 'legendary',
        sprite: 'legend_ice',
        chance: 0.10,
        damage: 20,
        radius: 250,
        freezeDuration: 4000,
        color: 0x66AAFF,
        cooldown: 1000
    },
    {
        id: 'legend_explosao',
        name: 'Morte Explosiva',
        type: 'proc',
        category: 'Proc',
        description: '100% de chance: inimigos explodem ao morrer, causando dano em área.',
        icon: '💥',
        rarity: 'legendary',
        sprite: 'legend_explosao',
        chance: 1.0,
        damage: 60,
        radius: 120,
        color: 0xFF4500,
        cooldown: 0
    },
    {
        id: 'legend_vampiro',
        name: 'Golpe Vampírico',
        type: 'proc',
        category: 'Proc',
        description: '20% de chance de roubar vida ao causar dano.',
        icon: '🧛',
        rarity: 'legendary',
        sprite: 'legend_vampiro',
        chance: 0.20,
        healPercent: 0.5,
        color: 0xFF0000,
        cooldown: 200
    },
    {
        id: 'legend_espinhos',
        name: 'Espinhos Explosivos',
        type: 'proc',
        category: 'Proc',
        description: '25% de chance ao receber dano de refletir em área.',
        icon: '🌵',
        rarity: 'legendary',
        sprite: 'legend_espinhos',
        chance: 0.25,
        damageMultiplier: 2.0,
        radius: 180,
        color: 0x8B4513,
        cooldown: 1000
    },
    {
        id: 'legend_light',
        name: 'Nova Sagrada',
        type: 'proc',
        category: 'Proc',
        description: '25% de chance de emitir uma nova de energia sagrada ao ser atingido.',
        icon: '✨',
        rarity: 'legendary',
        sprite: 'legend_light',
        chance: 0.25,
        damage: 80,
        radius: 200,
        color: 0xFFFF00,
        cooldown: 1000
    },

    // ========== COMPANIONS ==========
    {
        id: 'legend_jaguar',
        name: 'Jaguar Espiritual',
        type: 'companion',
        category: 'Companion',
        description: 'Um jaguar espiritual que ataca inimigos próximos.',
        icon: '🐆',
        rarity: 'legendary',
        sprite: 'legend_jaguar',
        scale: 0.6,
        tint: 0x00FFFF,
        offset: { x: -60, y: -40 },
        attackRate: 1500,
        range: 300,
        damage: 35,
        projectileSprite: 'projectile_blue',
        projectileSpeed: 500
    },
    {
        id: 'legend_espirito',
        name: 'Espírito Coletor',
        type: 'companion',
        category: 'Companion',
        description: 'Coleta automaticamente XP e itens em uma área maior.',
        icon: '👻',
        rarity: 'legendary',
        sprite: 'legend_espirito',
        scale: 0.4,
        offset: { x: 50, y: -50 },
        collectionRadius: 400,
        collectionRate: 100
    },
    {
        id: 'legend_xama',
        name: 'Xamã Protetor',
        type: 'companion',
        category: 'Companion',
        description: 'Periodicamente concede escudo e aumenta velocidade de ataque.',
        icon: '🧙',
        rarity: 'legendary',
        sprite: 'legend_xama',
        scale: 0.5,
        tint: 0x00FF00,
        offset: { x: 60, y: 40 },
        buffDuration: 5000,
        buffCooldown: 10000,
        attackSpeedBonus: 0.3,
        shieldAmount: 50
    },
    {
        id: 'legend_drone',
        name: 'Drone',
        type: 'companion',
        category: 'Companion',
        description: 'Um drone que ataca inimigos próximos.',
        icon: '🛸',
        rarity: 'legendary',
        sprite: 'legend_drone',
        scale: 0.6,
        offset: { x: -60, y: -60 },
        attackRate: 1500,
        range: 300,
        damage: 35,
        projectileSprite: 'projectile_energy',
        projectileSpeed: 500
    },
    {
        id: 'legend_wisp',
        name: 'Wisp de Gelo',
        type: 'companion',
        category: 'Companion',
        description: 'Um wisp que atira projéteis de gelo que lentificam inimigos.',
        icon: '❄️',
        rarity: 'legendary',
        sprite: 'legend_wisp',
        scale: 0.35,
        tint: 0xADD8E6,
        offset: { x: -50, y: -60 },
        attackRate: 2000,
        range: 400,
        damage: 40,
        projectileSprite: 'projectile_ice',
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

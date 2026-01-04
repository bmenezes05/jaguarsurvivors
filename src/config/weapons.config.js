export const weaponsConfig = [

    // ==================== MELEE ====================
    {
        key: 'weapon_sword',
        name: 'Espada',
        type: 'melee',
        image: 'src/assets/images/weapon_sword.png',
        slotType: 'primary',

        baseStats: {
            damage: 25,
            cooldown: 1000,
            knockback: 150,
            knockbackDuration: 50
        },

        strategyStats: {
            meleeHitbox: { width: 160, height: 100 },
            meleeAnimDuration: 250,
            frontalAttack: true,
            meleeOffsetHitbox: { x: 100, y: 0 }
        },

        visual: {
            scale: 0.5,
            offset: { x: 30, y: 0 },
            origin: { x: 0.3, y: 0.5 },
            gripOrigin: { x: 0.5, y: 1.5 },
            angleOrigin: 0,
            angleAttack: 180,
            rotationSmoothing: 0.2
        },

        effects: {
            elemental: 'none',
            dotDamage: 0,
            dotDuration: 0
        },

        audio: {
            soundKey: 'weapon_sword',
            hitSoundKey: 'hit'
        }
    },
    {
        key: 'weapon_arm',
        name: 'Braço',
        type: 'melee',
        image: 'src/assets/images/weapon_arm.png',
        slotType: 'primary',

        baseStats: {
            damage: 50,
            cooldown: 2000,
            knockback: 200,
            knockbackDuration: 100
        },

        strategyStats: {
            meleeHitbox: { width: 180, height: 200 },
            meleeAnimDuration: 250,
            frontalAttack: false,
            meleeOffsetHitbox: { x: 0, y: 40 },
        },

        visual: {
            scale: 0.38,
            offset: { x: 28, y: 40 },
            origin: { x: 0.3, y: 0.5 },
            gripOrigin: { x: 0.5, y: 1.5 },
            angleOrigin: 180,
            angleAttackOrigin: 0,
            angleAttackEnd: 900,
            rotationSmoothing: 0.2
        },

        effects: {
            elemental: 'none',
            dotDamage: 0,
            dotDuration: 0
        },

        audio: {
            soundKey: 'weapon_sword',
            hitSoundKey: 'hit'
        }
    },
    {
        key: 'weapon_katana',
        name: 'Katana',
        type: 'melee',
        image: 'src/assets/images/weapon_katana.png',
        slotType: 'primary',

        baseStats: {
            damage: 20,
            cooldown: 800,
            knockback: 120,
            knockbackDuration: 80
        },

        strategyStats: {
            meleeHitbox: { width: 200, height: 100 },
            meleeAnimDuration: 250,
            frontalAttack: true,
            meleeOffsetHitbox: { x: 100, y: 0 }
        },

        visual: {
            scale: 0.5,
            offset: { x: 40, y: -10 },
            origin: { x: 0.3, y: 0.5 },
            gripOrigin: { x: 0.5, y: 1.5 },
            angleOrigin: 0,
            angleAttack: 180,
            rotationSmoothing: 0.2
        },

        effects: {
            elemental: 'none',
            dotDamage: 0,
            dotDuration: 0
        },

        audio: {
            soundKey: 'weapon_sword',
            hitSoundKey: 'hit'
        }
    },
    {
        key: 'weapon_axe',
        name: 'Machado Sangrento',
        type: 'melee',
        image: 'src/assets/images/weapon_axe.png',
        slotType: 'primary',

        baseStats: {
            damage: 60,
            cooldown: 1200,
            knockback: 200,
            knockbackDuration: 100
        },

        strategyStats: {
            meleeHitbox: { width: 200, height: 200 },
            meleeAnimDuration: 250,
            frontalAttack: true,
            meleeOffsetHitbox: { x: 100, y: 0 }
        },

        visual: {
            scale: 0.4,
            offset: { x: 30, y: 0 },
            origin: { x: 0.3, y: 0.5 },
            gripOrigin: { x: 0.5, y: 1.5 },
            angleOrigin: 0,
            angleAttackOrigin: 0,
            angleAttackEnd: 180,
            rotationSmoothing: 0.2
        },

        effects: {
            elemental: 'none',
            dotDamage: 0,
            dotDuration: 0
        },

        audio: {
            soundKey: 'weapon_sword',
            hitSoundKey: 'hit'
        }
    },
    {
        key: 'weapon_hammer',
        name: 'Martelo Brasileiro',
        type: 'melee',
        image: 'src/assets/images/weapon_hammer.png',
        slotType: 'primary',

        baseStats: {
            damage: 80,
            cooldown: 2200,
            knockback: 400,
            knockbackDuration: 300
        },

        strategyStats: {
            meleeHitbox: { width: 200, height: 100 },
            meleeAnimDuration: 250,
            frontalAttack: true,
            meleeOffsetHitbox: { x: 100, y: 0 }
        },

        visual: {
            scale: 0.4,
            offset: { x: 40, y: -40 },
            origin: { x: 0.3, y: 0.5 },
            gripOrigin: { x: 0.5, y: 1.0 },
            angleOrigin: 0,
            angleAttackOrigin: 0,
            angleAttackEnd: 90,
            rotationSmoothing: 0.2
        },

        effects: {
            elemental: 'none',
            dotDamage: 0,
            dotDuration: 0
        },

        audio: {
            soundKey: 'weapon_sword',
            hitSoundKey: 'hit'
        }
    },
    {
        key: 'weapon_mace',
        name: 'Maça do Impeachment',
        type: 'melee',
        image: 'src/assets/images/weapon_mace.png',
        slotType: 'primary',

        baseStats: {
            damage: 80,
            cooldown: 2200,
            knockback: 400,
            knockbackDuration: 300
        },

        strategyStats: {
            meleeHitbox: { width: 200, height: 100 },
            meleeAnimDuration: 250,
            frontalAttack: true,
            meleeOffsetHitbox: { x: 100, y: 0 }
        },

        visual: {
            scale: 0.45,
            offset: { x: 40, y: -20 },
            origin: { x: 0.3, y: 0.5 },
            gripOrigin: { x: 0.5, y: 1.5 },
            angleOrigin: 0,
            angleAttack: 180,
            rotationSmoothing: 0.2
        },

        effects: {
            elemental: 'none',
            dotDamage: 0,
            dotDuration: 0
        },

        audio: {
            soundKey: 'weapon_sword',
            hitSoundKey: 'hit'
        }
    },
    {
        key: 'weapon_magic_staff',
        name: 'Microfone Gelado',
        type: 'melee',
        image: 'src/assets/images/weapon_magic_staff.png',
        slotType: 'primary',

        baseStats: {
            damage: 10,
            cooldown: 1000,
            knockback: 100,
            knockbackDuration: 100
        },

        strategyStats: {
            meleeHitbox: { width: 200, height: 100 },
            meleeAnimDuration: 250,
            frontalAttack: true,
            meleeOffsetHitbox: { x: 100, y: 0 }
        },

        visual: {
            scale: 0.45,
            offset: { x: 40, y: -20 },
            origin: { x: 0.3, y: 0.5 },
            gripOrigin: { x: 0.5, y: 1.5 },
            angleOrigin: 0,
            angleAttack: 180,
            rotationSmoothing: 0.2
        },

        effects: {
            elemental: 'freeze',
            dotDamage: 0,
            dotDuration: 2000
        },

        audio: {
            soundKey: 'weapon_sword',
            hitSoundKey: 'hit'
        }
    },
    {
        key: 'weapon_flame_sword',
        name: 'Espada de Fogo',
        type: 'melee',
        image: 'src/assets/images/weapon_flame_sword.png',
        slotType: 'primary',

        baseStats: {
            damage: 10,
            cooldown: 1000,
            knockback: 100,
            knockbackDuration: 100
        },

        strategyStats: {
            meleeHitbox: { width: 200, height: 100 },
            meleeAnimDuration: 250,
            frontalAttack: true,
            meleeOffsetHitbox: { x: 100, y: 0 }
        },

        visual: {
            scale: 0.45,
            offset: { x: 40, y: -20 },
            origin: { x: 0.3, y: 0.5 },
            gripOrigin: { x: 0.5, y: 1.5 },
            angleOrigin: 0,
            angleAttack: 180,
            rotationSmoothing: 0.2
        },

        effects: {
            elemental: 'burn',
            dotDamage: 2,
            dotDuration: 2000
        },

        audio: {
            soundKey: 'weapon_sword',
            hitSoundKey: 'hit'
        }
    },
    // ==================== RANGED ====================
    {
        key: 'weapon_laser_gun',
        name: 'Arma Laser',
        type: 'ranged',
        image: 'src/assets/images/weapon_laser_gun.png',
        slotType: 'secondary',

        baseStats: {
            damage: 25,
            cooldown: 800,
            knockback: 20,
            knockbackDuration: 50
        },

        strategyStats: {
            projectileSpeed: 500,
            range: 350,
            projectileSize: 10
        },

        projectileVisuals: {
            spriteKey: 'pixel',
            tint: 0x00FFFF,
            scale: 1,
            animations: []
        },

        visual: {
            scale: 0.45,
            offset: { x: 45, y: 10 }
        },

        effects: {
            elemental: 'none',
            dotDamage: 0,
            dotDuration: 0
        },

        audio: {
            soundKey: 'weapon_laser',
            hitSoundKey: 'hit'
        }
    },
    {
        key: 'weapon_rifle',
        name: 'Rifle',
        type: 'ranged',
        image: 'src/assets/images/weapon_rifle.png',
        slotType: 'secondary',

        baseStats: {
            damage: 40,
            cooldown: 1200,
            knockback: 200,
            knockbackDuration: 100
        },

        strategyStats: {
            projectileSpeed: 600,
            range: 3000,
            projectileSize: 15
        },

        projectileVisuals: {
            spriteKey: 'pixel',
            tint: 0xFFAA00,
            scale: 1,
            animations: []
        },

        visual: {
            scale: 0.45,
            offset: { x: 30, y: 18 }
        },

        effects: {
            elemental: 'none',
            dotDamage: 0,
            dotDuration: 0
        },

        audio: {
            soundKey: 'weapon_shoot',
            hitSoundKey: 'hit'
        }
    },

    // ==================== TRAIL ====================
    {
        key: 'weapon_handbag',
        name: 'Mala de Dinheiro',
        type: 'trail',
        image: 'src/assets/images/weapon_handbag.png',
        slotType: 'secondary',

        baseStats: {
            damage: 10,
            cooldown: 300,
            knockback: 10,
            knockbackDuration: 30
        },

        strategyStats: {
            lifetimeMs: 800,
            trailSpeed: 0,
            trailSize: 14
        },

        projectileVisuals: {
            spriteKey: 'proj_bunch_money',
            scale: 0.5,
            animations: [
                { type: 'pulse', scaleMax: 0.5, duration: 2000 }
            ]
        },

        visual: {
            scale: 0.45,
            offset: { x: -25, y: 50 },
            origin: { x: 0.3, y: 0.5 },
            gripOrigin: { x: 0.5, y: 1.5 },
            angleOrigin: 0,
            angleAttack: 180,
            rotationSmoothing: 0.2
        },

        effects: {
            elemental: 'none',
            dotDamage: 0,
            dotDuration: 0
        },

        audio: {
            soundKey: 'weapon_sword',
            hitSoundKey: 'hit'
        }
    },
    {
        key: 'weapon_fire_glass',
        name: 'Rastro de Fogo',
        type: 'trail',
        image: 'src/assets/images/weapon_fire_glass.png',
        slotType: 'secondary',

        baseStats: {
            damage: 6,
            cooldown: 250,
            knockback: 0,
            knockbackDuration: 0
        },

        strategyStats: {
            lifetimeMs: 1200,
            trailSpeed: 0,
            trailSize: 12,
        },

        projectileVisuals: {
            spriteKey: 'proj_fire_trail',
            scale: 0.5,
            animations: [
                { type: 'pulse', scaleMax: 1.5, duration: 2000 }
            ]
        },

        visual: {
            scale: 0.45,
            offset: { x: -20, y: 30 },
            origin: { x: 0.3, y: 0.5 },
            gripOrigin: { x: 0.5, y: 1.5 },
            angleOrigin: 0,
            angleAttack: 0,
            rotationSmoothing: 0.2
        },

        effects: {
            elemental: 'burn',
            dotDamage: 3,
            dotDuration: 1500
        },

        audio: {
            soundKey: 'weapon_poison',
            hitSoundKey: 'poison'
        }
    },
    {
        key: 'weapon_poison_glass',
        name: 'Rastro Tóxico',
        type: 'trail',
        image: 'src/assets/images/weapon_poison_glass.png',
        slotType: 'secondary',

        baseStats: {
            damage: 6,
            cooldown: 250,
            knockback: 0,
            knockbackDuration: 0
        },

        strategyStats: {
            lifetimeMs: 1200,
            trailSpeed: 0,
            trailSize: 12,
        },

        projectileVisuals: {
            spriteKey: 'proj_poison_trail',
            scale: 0.5,
            animations: [
                { type: 'pulse', scaleMax: 1.5, duration: 2000 }
            ]
        },

        visual: {
            scale: 0.45,
            offset: { x: -20, y: 30 },
            origin: { x: 0.3, y: 0.5 },
            gripOrigin: { x: 0.5, y: 1.5 },
            angleOrigin: 0,
            angleAttack: 0,
            rotationSmoothing: 0.2
        },

        effects: {
            elemental: 'poison',
            dotDamage: 3,
            dotDuration: 1500
        },

        audio: {
            soundKey: 'weapon_poison',
            hitSoundKey: 'poison'
        }
    },
    {
        key: 'weapon_clt',
        name: 'Carteira de Trabalho',
        type: 'trail',
        image: 'src/assets/images/weapon_clt.png',
        slotType: 'secondary',

        baseStats: {
            damage: 20,
            cooldown: 300,
            knockback: 10,
            knockbackDuration: 30
        },

        strategyStats: {
            lifetimeMs: 800,
            trailSpeed: 0,
            trailSize: 14
        },

        projectileVisuals: {
            spriteKey: 'proj_clt',
            scale: 0.4,
            animations: [
                { type: 'pulse', scaleMax: 1.5, duration: 2000 }
            ]
        },

        visual: {
            scale: 0.4,
            offset: { x: -20, y: 30 },
            origin: { x: 0.3, y: 0.5 },
            gripOrigin: { x: 0.5, y: 1.5 },
            angleOrigin: 0,
            angleAttack: 0,
            rotationSmoothing: 0.2
        },

        effects: {
            elemental: 'stun',
            dotDamage: 0,
            dotDuration: 1000
        },

        audio: {
            soundKey: 'weapon_sword',
            hitSoundKey: 'hit'
        }
    }
];
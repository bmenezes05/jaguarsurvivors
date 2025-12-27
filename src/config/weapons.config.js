/**
 * Weapon Configuration
 * 
 * Weapon Types:
 * - 'melee': Close-range weapons using MeleeWeaponStrategy
 * - 'trail': Ranged weapons using TrailWeaponStrategy (creates trail effects)
 * 
 * Trail Weapon Properties (new semantics):
 * - trailSpeed: How fast the trail moves toward target (visual)
 * - lifetimeMs: Duration in ms before trail expires
 * - trailSize: Visual size of the trail effect
 * - trailColor: Color of the trail (hex)
 * - trailTexture: Optional sprite texture for the trail
 * - trailRotation: Whether the trail rotates
 * - trailScale: Visual scale multiplier
 * 
 * Legacy aliases (for backward compatibility):
 * - projectileSpeed → trailSpeed
 * - range → lifetimeMs (when used as duration)
 * - projectileSize → trailSize
 * - projectileColor → trailColor
 * - projectileTexture → trailTexture
 * - projectileRotation → trailRotation
 * - projectileScale → trailScale
 * - type: 'ranged' → type: 'trail'
 */

export const weaponsConfig = [
    // ==================== MELEE WEAPONS ====================
    {
        key: 'weapon_sword',
        name: 'Espada',
        type: 'melee',
        image: 'src/assets/images/weapon_sword.png',

        // Combat stats
        damage: 25,
        cooldown: 800,
        knockback: 150,
        knockbackDuration: 50,

        // Melee-specific
        meleeHitbox: { width: 200, height: 100 },
        meleeAnimDuration: 250,

        // Visual
        scale: 0.6,
        origin: { x: 0.3, y: 0.5 },
        gripOrigin: { x: 0.5, y: 1.5 },
        angleOrigin: 0,
        angleAttack: 180,
        rotationSmoothing: 0.2,

        // Effects
        elementalEffect: 'none',
        dotDamage: 0,
        dotDuration: 0,

        // Audio
        soundKey: 'weapon_sword',
        hitSoundKey: 'hit',

        // Legacy (unused for melee, but included for consistency)
        trailSpeed: 500,
        trailSize: 10
    },
    {
        key: 'weapon_arm',
        name: 'Braço',
        type: 'melee',
        image: 'src/assets/images/weapon_arm.png',

        damage: 50,
        cooldown: 1600,
        knockback: 300,
        knockbackDuration: 50,

        meleeHitbox: { width: 200, height: 100 },
        meleeAnimDuration: 250,

        scale: 0.5,
        origin: { x: 0.25, y: 0.95 },
        gripOrigin: { x: 0.4, y: 1.5 },
        angleOrigin: 90,
        angleAttack: 180,
        rotationSmoothing: 0.2,

        elementalEffect: 'none',
        dotDamage: 0,
        dotDuration: 0,

        soundKey: 'weapon_hammer',
        hitSoundKey: 'hit',

        trailSpeed: 500,
        trailSize: 10
    },
    {
        key: 'weapon_flame_sword',
        name: 'Espada de fogo',
        type: 'melee',
        image: 'src/assets/images/weapon_flame_sword.png',

        damage: 25,
        cooldown: 800,
        knockback: 100,
        knockbackDuration: 50,

        meleeHitbox: { width: 200, height: 100 },
        meleeAnimDuration: 250,

        scale: 0.6,
        origin: { x: 0.3, y: 0.5 },
        gripOrigin: { x: 0.5, y: 1.5 },
        angleOrigin: 0,
        angleAttack: 180,
        rotationSmoothing: 0.2,

        elementalEffect: 'burn',
        dotDamage: 1,
        dotDuration: 1000,

        soundKey: 'weapon_sword',
        hitSoundKey: 'hit',

        trailSpeed: 500,
        trailSize: 10
    },
    {
        key: 'weapon_katana',
        name: 'Katana',
        type: 'melee',
        image: 'src/assets/images/weapon_katana.png',

        damage: 30,
        cooldown: 600,
        knockback: 120,
        knockbackDuration: 50,

        meleeHitbox: { width: 220, height: 110 },
        meleeAnimDuration: 250,

        scale: 0.6,
        origin: { x: 0.25, y: 0.5 },
        gripOrigin: { x: 0.5, y: 1.5 },
        angleOrigin: 0,
        angleAttack: 180,
        rotationSmoothing: 0.2,

        elementalEffect: 'none',
        dotDamage: 0,
        dotDuration: 0,

        soundKey: 'weapon_sword',
        hitSoundKey: 'hit',

        trailSpeed: 500,
        trailSize: 10
    },

    // ==================== TRAIL WEAPONS ====================
    {
        key: 'weapon_laser_gun',
        name: 'Arma Laser',
        type: 'trail', // NEW: Explicit trail type
        image: 'src/assets/images/weapon_laser_gun.png',

        damage: 25,
        cooldown: 800,
        knockback: 20,
        knockbackDuration: 50,

        // Trail-specific properties (new semantics)
        lifetimeMs: 350, // How long the trail exists (was "range")
        trailSpeed: 500, // Visual movement speed (was "projectileSpeed")
        trailSize: 10,   // Visual size (was "projectileSize")
        trailColor: 0x00FFFF,
        trailTexture: null,
        trailScale: 1.0,
        trailRotation: false,

        // Visual
        scale: 0.6,
        origin: { x: 0.3, y: 0.5 },
        gripOrigin: { x: 0.5, y: 1.5 },
        angleOrigin: 0,
        angleAttack: 180,
        rotationSmoothing: 0.2,

        elementalEffect: 'none',
        dotDamage: 0,
        dotDuration: 0,

        soundKey: 'weapon_laser',
        hitSoundKey: 'hit',

        // Legacy aliases for backward compatibility
        range: 350,
        projectileSpeed: 500,
        projectileSize: 10,
        projectileColor: 0x00FFFF,
        projectileTexture: null,
        projectileScale: 1.0,
        projectileRotation: false
    },
    {
        key: 'weapon_handbag',
        name: 'Mala de dinheiro',
        type: 'trail',
        image: 'src/assets/images/weapon_handbag.png',

        damage: 25,
        cooldown: 800,
        knockback: 20,
        knockbackDuration: 50,

        lifetimeMs: 350,
        trailSpeed: 500,
        trailSize: 10,
        trailColor: 0xFFD700,
        trailTexture: null,
        trailScale: 1.0,
        trailRotation: true,

        scale: 0.6,
        origin: { x: 0.3, y: 0.5 },
        gripOrigin: { x: 0.5, y: 1.5 },
        angleOrigin: 0,
        angleAttack: 180,
        rotationSmoothing: 0.2,

        elementalEffect: 'none',
        dotDamage: 0,
        dotDuration: 0,

        soundKey: 'weapon_shoot',
        hitSoundKey: 'hit',

        range: 350,
        projectileSpeed: 500,
        projectileSize: 10,
        projectileColor: 0xFFD700,
        projectileTexture: null,
        projectileScale: 1.0,
        projectileRotation: true
    },
    {
        key: 'weapon_magic_staff',
        name: 'Microfone mágico',
        type: 'trail',
        image: 'src/assets/images/weapon_magic_staff.png',

        damage: 20,
        cooldown: 1000,
        knockback: 30,
        knockbackDuration: 50,

        lifetimeMs: 400,
        trailSpeed: 400,
        trailSize: 12,
        trailColor: 0x9966FF,
        trailTexture: null,
        trailScale: 1.2,
        trailRotation: true,

        scale: 0.6,
        origin: { x: 0.2, y: 0.5 },
        gripOrigin: { x: 0.5, y: 1.5 },
        angleOrigin: 0,
        angleAttack: 180,
        rotationSmoothing: 0.2,

        elementalEffect: 'freeze',
        dotDamage: 2,
        dotDuration: 1500,

        soundKey: 'weapon_spell',
        hitSoundKey: 'hit',

        range: 400,
        projectileSpeed: 400,
        projectileSize: 12,
        projectileColor: 0x9966FF,
        projectileTexture: null,
        projectileScale: 1.2,
        projectileRotation: true
    },
    {
        key: 'weapon_rifle',
        name: 'Rifle',
        type: 'trail',
        image: 'src/assets/images/weapon_rifle.png',

        damage: 40,
        cooldown: 1200,
        knockback: 200,
        knockbackDuration: 100,

        // Long-lasting trail (simulates bullet travel)
        lifetimeMs: 3000, // 3 seconds lifetime
        trailSpeed: 600,
        trailSize: 15,
        trailColor: 0xFFAA00,
        trailTexture: null,
        trailScale: 1.0,
        trailRotation: false,

        scale: 0.6,
        origin: { x: 0.2, y: 0.3 },
        gripOrigin: { x: 0.5, y: 1.5 },
        angleOrigin: 0,
        angleAttack: 180,
        rotationSmoothing: 0.2,

        elementalEffect: 'none',
        dotDamage: 0,
        dotDuration: 0,

        soundKey: 'weapon_shoot',
        hitSoundKey: 'hit',

        range: 30000, // Legacy: kept for reference, now use lifetimeMs
        projectileSpeed: 600,
        projectileSize: 15,
        projectileColor: 0xFFAA00,
        projectileTexture: null,
        projectileScale: 1.0,
        projectileRotation: false
    }
];

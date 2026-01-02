/**
 * AUDIO_CONFIG
 * 
 * Central configuration for all game audio events.
 * Defines mapping between EventBus events and Sound Keys.
 * 
 * Structure:
 * event-name: [
 *   {
 *     key: 'sound_key',          // Main sound key
 *     keys: ['a', 'b'],          // Optional: Variations (picked randomly)
 *     condition: (ctx) => bool,  // Logic to determine if this sound plays
 *     priority: 1-100,           // Sound priority (Higher = more important)
 *     throttle: 50,              // Min time (ms) between identical calls
 *     chance: 1.0,               // 0-1 probability to play
 *     config: {                  // Phaser Sound Config
 *       volume: 1.0,
 *       rate: 1.0,
 *       detune: 0,
 *       loop: false
 *     }
 *   }
 * ]
 */

export const AUDIO_CONFIG = {
    // =========================================================================
    // COMBAT EVENTS
    // =========================================================================

    // Weapon Swing / Fire (No Hit)
    'weapon-fire': [
        {
            key: 'sfx_swing',
            keys: ['sfx_swing_1', 'sfx_swing_2', 'sfx_swing_3'],
            condition: () => true,
            priority: 40,
            throttle: 80, // Prevent machine-gun layering
            config: { volume: 0.4 }
        }
    ],

    // Entity Taking Damage
    'enemy-damaged': [
        // Standard Enemy Hit
        {
            key: 'sfx_hit_flesh',
            keys: ['sfx_hit_flesh_1', 'sfx_hit_flesh_2', 'sfx_hit_flesh_3'],
            condition: (ctx) => !ctx.target?.isBoss && !ctx.isCritical,
            priority: 50,
            throttle: 50,
            config: { volume: 0.5 }
        },
        // Critical Hit (Overlay)
        {
            key: 'sfx_crit',
            condition: (ctx) => ctx.isCritical,
            priority: 60,
            throttle: 50,
            config: { volume: 0.8, detune: 200 }
        },
        // Boss Hit
        {
            key: 'sfx_hit_boss',
            condition: (ctx) => ctx.target?.isBoss,
            priority: 70,
            throttle: 50,
            config: { volume: 0.7 }
        }
    ],

    'player-damaged': [
        {
            key: 'sfx_player_hurt',
            keys: ['sfx_player_hurt_1', 'sfx_player_hurt_2'],
            condition: () => true,
            priority: 80, // High priority so player feels damage
            throttle: 200,
            config: { volume: 0.8 }
        }
    ],

    // =========================================================================
    // ENTITY LIFECYCLE
    // =========================================================================

    'enemy-died': [
        {
            key: 'sfx_enemy_die',
            keys: ['sfx_enemy_die_1', 'sfx_enemy_die_2'],
            condition: (ctx) => !ctx.target?.isBoss,
            priority: 45,
            throttle: 100,
            chance: 0.8, // Not every death needs a sound in chaos
            config: { volume: 0.4 }
        }
    ],

    'boss-died': [
        {
            key: 'sfx_boss_death',
            condition: () => true,
            priority: 100,
            config: { volume: 1.0 }
        }
    ],

    'boss-spawned': [
        {
            key: 'sfx_boss_spawn',
            condition: () => true,
            priority: 95,
            config: { volume: 1.0 }
        }
    ],

    // =========================================================================
    // LOOT & PROGRESSION
    // =========================================================================

    'xp-collected': [
        {
            key: 'sfx_gem_collect',
            condition: () => true,
            priority: 30, // Low priority, background noise
            throttle: 40,
            config: { volume: 0.25 }
        }
    ],

    'pickup-collected': [
        {
            key: 'sfx_item_pickup',
            condition: () => true,
            priority: 80,
            config: { volume: 0.6 }
        }
    ],

    'level-up': [
        {
            key: 'sfx_level_up',
            condition: () => true,
            priority: 90,
            config: { volume: 0.8 }
        }
    ],

    'structure-damaged': [
        {
            key: 'sfx_hit_flesh', // Reuse hit sound or dedicated
            condition: () => true,
            priority: 45,
            throttle: 50,
            config: { volume: 0.5, detune: 500 } // Higher pitch for wood/metal?
        }
    ],

    'structure-destroyed': [
        {
            key: 'sfx_hit_flesh',
            condition: () => true,
            priority: 50,
            config: { volume: 0.8, detune: -200 } // Lower pitch for break
        }
    ],

    // =========================================================================
    // UI EVENTS
    // =========================================================================

    'ui-click': [
        {
            key: 'sfx_ui_click',
            condition: () => true,
            priority: 90,
            throttle: 50,
            config: { volume: 0.6 }
        }
    ],

    'ui-hover': [
        {
            key: 'sfx_ui_hover',
            condition: () => true,
            priority: 20,
            throttle: 50,
            config: { volume: 0.2 }
        }
    ],

    // =========================================================================
    // SYSTEM
    // =========================================================================
    'wave-changed': [
        {
            key: 'sfx_wave_bell',
            condition: () => true,
            priority: 85,
            config: { volume: 0.7 }
        }
    ]
};

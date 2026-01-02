import { HitImpactEffect } from './effects/hitImpactEffect.js';
import { DeathBurstEffect } from './effects/deathBurstEffect.js';
import { SparkEffect } from './effects/sparkEffect.js';
import { FlashEffect } from './effects/flashEffect.js';
import { PulseEffect } from './effects/pulseEffect.js';
import { ShakeEffect } from './effects/shakeEffect.js';
import { HitStopEffect } from './effects/hitStopEffect.js';
import { DamagePopupEffect } from './effects/damagePopupEffect.js';
import { CameraFlashEffect } from './effects/cameraFlashEffect.js';

export const VFX_CONFIG = {
    'enemy-damaged': [
        {
            effectClass: FlashEffect,
            condition: () => true,
            config: { duration: 100, color: 0x880000 }
        },
        // Pulse animation
        {
            effectClass: PulseEffect,
            condition: () => true,
            config: { scale: 1.2, duration: 200 }
        },
        {
            effectClass: SparkEffect,
            condition: () => true,
            config: { count: 30, color: 0xff0000, speedMin: 100, speedMax: 500, life: 600 }
        },
        // Damage Popup (Normal) - Non Crit, Non Boss
        {
            effectClass: DamagePopupEffect,
            condition: (data) => !data.isCritical && (data.target && !data.target.isBoss),
            config: { color: '#FFFFFF', scale: 1.0 }
        },
        // Damage Popup (Normal) - Non Crit, Boss
        {
            effectClass: DamagePopupEffect,
            condition: (data) => !data.isCritical && (data.target && data.target.isBoss),
            config: { color: '#FFD700', scale: 1.0 }
        },

        // CRITICAL HITS
        {
            effectClass: HitStopEffect,
            condition: (data) => data.isCritical,
            config: { duration: 30 }
        },
        {
            effectClass: ShakeEffect,
            condition: (data) => data.isCritical,
            config: { intensity: 0.005, duration: 30 }
        },
        {
            effectClass: DamagePopupEffect,
            condition: (data) => data.isCritical,
            config: { color: '#FF4500', scale: 1.8 }
        },
        {
            effectClass: SparkEffect,
            condition: (data) => data.isCritical,
            config: { count: 8, color: 0xFFD700, speedMin: 150, speedMax: 300 }
        }
    ],
    'boss-spawned': [
        {
            effectClass: CameraFlashEffect,
            condition: () => true,
            config: { duration: 500, r: 100, g: 0, b: 0 } // Red flash
        }
    ],

    'structure-damaged': [
        {
            effectClass: FlashEffect,
            condition: () => true,
            config: { duration: 100, color: 0x880000 }
        },
        {
            effectClass: SparkEffect,
            condition: () => true,
            config: { count: 30, color: 0xFFFFFF, speedMin: 100, speedMax: 400, life: 500 }
        }
    ],

    'structure-destroyed': [
        {
            effectClass: SparkEffect,
            condition: () => true,
            config: { count: 60, color: 0xAAAAAA, speedMin: 150, speedMax: 500, life: 800 }
        }
        // Could add cloud/smoke effect if class exists, using Spark for now as placeholder or generic 
    ],

    'player-damaged': [
        {
            effectClass: ShakeEffect,
            condition: () => true,
            config: { intensity: 0.015, duration: 200 }
        },
        {
            effectClass: HitStopEffect,
            condition: () => true,
            config: { duration: 50 }
        }
    ],

    'status-applied': [
        // Flash
        {
            effectClass: FlashEffect,
            condition: (d) => d.type === 'stun',
            config: { duration: 100, color: 0xFFFF00 }
        },
        {
            effectClass: FlashEffect,
            condition: (d) => d.type === 'freeze',
            config: { duration: 100, color: 0x00FFFF }
        },
        {
            effectClass: FlashEffect,
            condition: (d) => d.type === 'poison',
            config: { duration: 100, color: 0x00FF00 }
        },
        {
            effectClass: FlashEffect,
            condition: (d) => d.type === 'burn',
            config: { duration: 100, color: 0xFFD700 }
        },
        {
            effectClass: FlashEffect,
            condition: (d) => d.type === 'enrage',
            config: { duration: 100, color: 0xFF0000 }
        },
        // Spark
        {
            effectClass: SparkEffect,
            condition: (d) => d.type === 'stun',
            config: { count: 30, color: 0xFFFF00, speedMin: 100, speedMax: 500, life: 600 }
        },
        {
            effectClass: SparkEffect,
            condition: (d) => d.type === 'freeze',
            config: { count: 30, color: 0x00FFFF, speedMin: 100, speedMax: 500, life: 600 }
        },
        {
            effectClass: SparkEffect,
            condition: (d) => d.type === 'poison',
            config: { count: 30, color: 0x00FF00, speedMin: 100, speedMax: 500, life: 600 }
        },
        {
            effectClass: SparkEffect,
            condition: (d) => d.type === 'burn',
            config: { count: 30, color: 0xFFD700, speedMin: 100, speedMax: 500, life: 600 }
        }
    ],

    'boss-died': [
        {
            effectClass: DeathBurstEffect,
            condition: () => true,
            config: {
                color: 0xFF0000
            }
        }
    ]
};

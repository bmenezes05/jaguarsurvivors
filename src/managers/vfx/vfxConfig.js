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
        // Standard Flash (White)
        {
            effectClass: FlashEffect,
            condition: () => true,
            config: { duration: 100 }
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
            config: { count: 30, color: 0xff0000, speedMin: 150, speedMax: 300 }
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
        {
            effectClass: SparkEffect,
            condition: (d) => d.type === 'poison',
            config: { count: 5, color: 0x00FF00, speedMin: 50, speedMax: 150 }
        },
        {
            effectClass: SparkEffect,
            condition: (d) => d.type === 'burn',
            config: { count: 5, color: 0xFFD700, speedMin: 50, speedMax: 150 }
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

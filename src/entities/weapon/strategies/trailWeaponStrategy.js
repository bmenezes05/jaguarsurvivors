import { WeaponStrategy } from '../weaponStrategy.js';
import { Projectile } from '../../projectile/projectile.js';
import { ObjectPool } from '../../../managers/objectPool.js';
import { createProjectileGroup } from '../../projectile/projectileGroup.js';

/**
 * TrailWeaponStrategy
 * 
 * A weapon strategy that creates time-based trail effects.
 * Trails are spawned at a position and remain active for a duration (lifetime),
 * dealing damage to enemies they overlap with.
 * 
 * Can be stationary (trailSpeed = 0) or moving.
 */
export class TrailWeaponStrategy extends WeaponStrategy {
    constructor(weapon) {
        super(weapon);

        this.activeTrails = [];
        this.pool = new ObjectPool(this.scene, Projectile, 30);

        if (!this.scene.projectileGroup) {
            this.scene.projectileGroup = createProjectileGroup(this.scene);
        }
        this.projectileGroup = this.scene.projectileGroup;
    }

    /**
     * Spawns a trail effect based on the weapon's trail type.
     * @param {EnemyFacade} target - The enemy to target
     */
    attack(target) {
        const { weapon } = this;
        const { config } = weapon;
        const strategyStats = config.strategyStats || {};

        if (!target) return;

        this.scene.events.emit('weapon-attack', { weaponKey: config.key, ...config });

        switch (strategyStats.trailType) {
            case 'mine':
                this.dropMine(target);
                break;
            default:
                this.createTrail(target);
                break;
        }
    }

    /**
     * Creates a standard, continuous trail effect.
     * @param {EnemyFacade} target - The enemy to target
     */
    createTrail(target) {
        this.spawnTrailObject(target, false);
    }

    /**
     * Drops a single, persistent mine.
     * @param {EnemyFacade} target - The enemy to target
     */
    dropMine(target) {
        this.spawnTrailObject(target, true);
    }

    /**
     * Helper function to spawn the trail/mine object.
     * @param {EnemyFacade} target - The enemy to target
     * @param {boolean} isMine - Determines if the object is a mine with extended lifetime.
     */
    spawnTrailObject(target, isMine) {
        const { weapon } = this;
        const { config, player, current } = weapon;

        const angle = Phaser.Math.Angle.Between(player.x, player.y, target.x, target.y);
        const spawnOffset = current.trailSize ?? 10;
        const x = player.x + Math.cos(angle) * spawnOffset;
        const y = player.y + Math.sin(angle) * spawnOffset;

        const { damage, isCritical } = weapon.calculateDamage();

        let lifetime = current.lifetimeMs;
        if (isMine) {
            lifetime *= 5; // Mines last 5x longer
        }

        const trailConfig = {
            ...config.strategyStats,
            elementalEffect: config.effects?.elemental,
            dotDamage: current.dotDamage,
            dotDuration: config.effects?.dotDuration,
            projectileVisuals: config.projectileVisuals,
            lifetimeMs: lifetime,
            impactVFX: config.visual.impactVFX
        };

        const trail = this.pool.get({
            x, y, targetX: target.x, targetY: target.y, damage,
            weapon: trailConfig,
            projectileSpeed: current.trailSpeed,
            isCritical,
            knockbackMultiplier: player.stats.knockback
        });

        trail.visual.setData('parent', trail);
        this.projectileGroup.add(trail.visual);
        this.activeTrails.push(trail);
    }

    /**
     * Updates all active trails
     */
    update(delta) {
        for (let i = this.activeTrails.length - 1; i >= 0; i--) {
            const trail = this.activeTrails[i];

            if (!trail.isActive) {
                this.projectileGroup.remove(trail.visual);
                this.pool.release(trail);
                this.activeTrails.splice(i, 1);
                continue;
            }

            trail.update(delta);
        }
    }

    /**
     * Cleans up all trails when strategy is destroyed
     */
    destroy() {
        for (const trail of this.activeTrails) {
            this.projectileGroup.remove(trail.visual);
            this.pool.release(trail);
        }
        this.activeTrails = [];
    }
}

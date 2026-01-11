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
     * Spawns a trail effect toward the target
     * @param {EnemyFacade} target - The enemy to target
     */
    attack(target) {
        const { weapon } = this;
        const { config, player, current } = weapon;

        if (!target) return;

        console.debug("EVENT_EMITTED", { eventName: 'weapon-shoot', payload: config.key });
        this.scene.events.emit('weapon-shoot', config.key);

        // Get behavior type (default to CONTINUOUS)
        const behaviorType = config.strategyStats?.behaviorType || 'CONTINUOUS';

        const angle = Phaser.Math.Angle.Between(
            player.x, player.y, target.x, target.y
        );
        const spawnOffset = current.trailSize ?? 10;
        const x = player.x + Math.cos(angle) * spawnOffset;
        const y = player.y + Math.sin(angle) * spawnOffset;

        const { damage, isCritical } = weapon.calculateDamage();

        // Adjust properties based on behavior
        let lifetimeMs = current.lifetimeMs;
        let finalDamage = damage;

        switch (behaviorType) {
            case 'MINE':
                // Mines last longer and deal more damage
                lifetimeMs = current.lifetimeMs * 5; // 5x longer lifetime
                finalDamage = damage * 2; // 2x damage
                break;
            case 'AREA':
                // Areas deal damage over time
                lifetimeMs = current.lifetimeMs * 3; // 3x longer lifetime
                break;
            case 'CONTINUOUS':
            default:
                // Use default values
                break;
        }

        const trailConfig = {
            ...config.strategyStats,
            elementalEffect: config.effects?.elemental,
            dotDamage: current.dotDamage,
            dotDuration: config.effects?.dotDuration,
            projectileVisuals: config.projectileVisuals,
            lifetimeMs: lifetimeMs,
            behaviorType: behaviorType
        };

        const trail = this.pool.get({
            x,
            y,
            targetX: target.x,
            targetY: target.y,
            damage: finalDamage,
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

import { WeaponStrategy } from '../weaponStrategy.js';
import { Projectile } from '../../projectile/projectile.js';
import { ObjectPool } from '../../../managers/objectPool.js';
import { createProjectileGroup } from '../../projectile/projectileGroup.js';

/**
 * RangedWeaponStrategy
 * 
 * Strategy for weapons that fire projectiles which travel a certain distance (range)
 * at a specific speed.
 * 
 * Behavior:
 * - Fires a projectile towards the target.
 * - Projectile travels in a straight line.
 * - Projectile is destroyed after traveling 'range' distance (converted to lifetime).
 * 
 * Uses:
 * - projectileSpeed
 * - range
 * - projectileSize
 */
export class RangedWeaponStrategy extends WeaponStrategy {
    constructor(weapon) {
        super(weapon);

        this.activeProjectiles = [];
        this.pool = new ObjectPool(this.scene, Projectile, 30);

        if (!this.scene.projectileGroup) {
            this.scene.projectileGroup = createProjectileGroup(this.scene);
        }
        this.projectileGroup = this.scene.projectileGroup;
    }

    /**
     * Fires a projectile toward the target
     * @param {EnemyFacade} target - The enemy to target
     */
    attack(target) {
        const { weapon } = this;
        // Access stats from the weapon's processed 'current' state
        const { config, player, current } = weapon;

        if (!target) return;

        console.debug("EVENT_EMITTED", { eventName: 'weapon-shoot', payload: config.key });
        this.scene.events.emit('weapon-shoot', config.key);

        const angle = Phaser.Math.Angle.Between(
            player.x, player.y, target.x, target.y
        );

        // Spawn offset
        const spawnOffset = current.projectileSize ?? 10;
        const x = player.x + Math.cos(angle) * spawnOffset;
        const y = player.y + Math.sin(angle) * spawnOffset;

        const { damage, isCritical } = weapon.calculateDamage();

        // Calculate lifetime based on range and speed
        const speed = current.projectileSpeed || 500;
        const range = current.range || 350;

        // time (ms) = (range / speed) * 1000
        let lifetimeMs = (range / speed) * 1000;

        // Safety cap
        if (!isFinite(lifetimeMs) || lifetimeMs <= 0) lifetimeMs = 2000;

        const projectile = this.pool.get({
            x,
            y,
            targetX: target.x,
            targetY: target.y,
            damage,
            weapon: {
                ...config.strategyStats, // Pass strategy stats (color, size, etc)
                effects: config.effects, // Pass effects for on-hit logic
                projectileVisuals: config.projectileVisuals, // Data-Driven Visuals
                // Computed lifetime for the projectile
                lifetimeMs: lifetimeMs
            },
            projectileSpeed: speed,
            isCritical,
            knockbackMultiplier: player.stats.knockback
        });

        projectile.visual.setData('parent', projectile);
        this.projectileGroup.add(projectile.visual);
        this.activeProjectiles.push(projectile);
    }

    update(delta) {
        for (let i = this.activeProjectiles.length - 1; i >= 0; i--) {
            const proj = this.activeProjectiles[i];

            if (!proj.isActive) {
                this.projectileGroup.remove(proj.visual);
                this.pool.release(proj);
                this.activeProjectiles.splice(i, 1);
                continue;
            }

            proj.update(delta);
        }
    }

    destroy() {
        for (const proj of this.activeProjectiles) {
            this.projectileGroup.remove(proj.visual);
            this.pool.release(proj);
        }
        this.activeProjectiles = [];
    }
}

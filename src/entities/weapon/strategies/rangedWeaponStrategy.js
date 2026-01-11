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
        const { config, player, current } = weapon;

        if (!target) return;

        console.debug("EVENT_EMITTED", { eventName: 'weapon-shoot', payload: config.key });
        this.scene.events.emit('weapon-shoot', config.key);

        // Get behavior type (default to STANDARD)
        const behaviorType = config.strategyStats?.behaviorType || 'STANDARD';

        switch (behaviorType) {
            case 'LASER':
                this.fireLaser(target);
                break;
            case 'BURST':
                this.fireBurst(target);
                break;
            case 'STANDARD':
            default:
                this.fireStandard(target);
                break;
        }
    }

    fireStandard(target) {
        const { weapon } = this;
        const { config, player, current } = weapon;

        const angle = Phaser.Math.Angle.Between(
            player.x, player.y, target.x, target.y
        );

        const spawnOffset = current.projectileSize ?? 10;
        const x = player.x + Math.cos(angle) * spawnOffset;
        const y = player.y + Math.sin(angle) * spawnOffset;

        const { damage, isCritical } = weapon.calculateDamage();
        const speed = current.projectileSpeed || 500;
        const range = current.range || 350;
        let lifetimeMs = (range / speed) * 1000;

        if (!isFinite(lifetimeMs) || lifetimeMs <= 0) lifetimeMs = 2000;

        this.spawnProjectile(x, y, target.x, target.y, damage, isCritical, speed, lifetimeMs, config);
    }

    fireLaser(target) {
        const { weapon } = this;
        const { config, player, current } = weapon;

        // Ultra-fast projectile
        const speed = 1200;
        const range = current.range || 600;
        let lifetimeMs = (range / speed) * 1000;

        const angle = Phaser.Math.Angle.Between(
            player.x, player.y, target.x, target.y
        );

        const spawnOffset = current.projectileSize ?? 10;
        const x = player.x + Math.cos(angle) * spawnOffset;
        const y = player.y + Math.sin(angle) * spawnOffset;

        const { damage, isCritical } = weapon.calculateDamage();

        this.spawnProjectile(x, y, target.x, target.y, damage, isCritical, speed, lifetimeMs, config);
    }

    fireBurst(target) {
        const { weapon } = this;
        const { config, player, current } = weapon;

        const burstCount = 3;
        const burstDelay = 80; // ms between shots
        const speed = current.projectileSpeed || 600;
        const range = current.range || 3000;
        let lifetimeMs = (range / speed) * 1000;

        for (let i = 0; i < burstCount; i++) {
            this.scene.time.delayedCall(i * burstDelay, () => {
                if (!weapon.player || !weapon.player.isActive) return;

                const angle = Phaser.Math.Angle.Between(
                    player.x, player.y, target.x, target.y
                );

                const spawnOffset = current.projectileSize ?? 10;
                const x = player.x + Math.cos(angle) * spawnOffset;
                const y = player.y + Math.sin(angle) * spawnOffset;

                const { damage, isCritical } = weapon.calculateDamage();

                this.spawnProjectile(x, y, target.x, target.y, damage * 0.4, isCritical, speed, lifetimeMs, config);
            });
        }
    }

    spawnProjectile(x, y, targetX, targetY, damage, isCritical, speed, lifetimeMs, config) {
        const projectile = this.pool.get({
            x,
            y,
            targetX,
            targetY,
            damage,
            weapon: {
                ...config.strategyStats,
                effects: config.effects,
                projectileVisuals: config.projectileVisuals,
                lifetimeMs: lifetimeMs
            },
            projectileSpeed: speed,
            isCritical,
            knockbackMultiplier: this.weapon.player.stats.knockback
        });

        projectile.visual.setData('parent', projectile);
        this.projectileGroup.add(projectile.visual);
        projectile.applyVelocity(x, y, targetX, targetY, speed);

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

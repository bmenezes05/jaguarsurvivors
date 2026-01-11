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
     * Dispatches the attack based on the weapon's ranged type.
     * @param {EnemyFacade} target - The enemy to target
     */
    attack(target) {
        const { config } = this.weapon;
        const strategyStats = config.strategyStats || {};

        if (!target) return;

        this.scene.events.emit('weapon-attack', { weaponKey: config.key, ...config });

        switch (strategyStats.rangedType) {
            case 'laser':
                this.fireLaser(target);
                break;
            default:
                this.fireProjectile(target);
                break;
        }
    }

    /**
     * Fires a laser beam, creating a static hitbox.
     * @param {EnemyFacade} target - The enemy to target
     */
    fireLaser(target) {
        const { weapon } = this;
        const { player, current } = weapon;

        const angle = Phaser.Math.Angle.Between(player.x, player.y, target.x, target.y);
        const range = current.range;
        const width = current.projectileSize;
        const beamDuration = 150; // short duration for the beam effect

        const hitbox = this.scene.add.zone(0, 0, range, width);
        this.scene.physics.world.enable(hitbox);
        hitbox.body.setAllowGravity(false);
        hitbox.body.moves = false;

        hitbox.setOrigin(0, 0.5);
        hitbox.setPosition(player.x, player.y);
        hitbox.setAngle(Phaser.Math.RadToDeg(angle));

        const hitTargets = new Set();
        const overlapCallback = (_, targetSprite) => {
            const targetParent = targetSprite.getData('parent');
            if (!targetParent?.isActive || hitTargets.has(targetParent)) return;

            this.applyDamage(targetParent);
            hitTargets.add(targetParent);
        };

        this.scene.physics.overlap(hitbox, this.scene.enemySpawner.group, overlapCallback);
        if (this.scene.structureSystem && this.scene.structureSystem.group) {
            this.scene.physics.overlap(hitbox, this.scene.structureSystem.group, overlapCallback);
        }

        this.scene.time.delayedCall(beamDuration, () => hitbox.destroy());
    }

    /**
     * Fires a traditional projectile that travels over time.
     * @param {EnemyFacade} target - The enemy to target
     */
    fireProjectile(target) {
        const { weapon } = this;
        const { config, player, current } = weapon;

        const angle = Phaser.Math.Angle.Between(player.x, player.y, target.x, target.y);
        const spawnOffset = current.projectileSize ?? 10;
        const x = player.x + Math.cos(angle) * spawnOffset;
        const y = player.y + Math.sin(angle) * spawnOffset;

        const { damage, isCritical } = weapon.calculateDamage();
        const speed = current.projectileSpeed || 500;
        const range = current.range || 350;
        let lifetimeMs = (range / speed) * 1000;
        if (!isFinite(lifetimeMs) || lifetimeMs <= 0) lifetimeMs = 2000;

        const projectile = this.pool.get({
            x, y, targetX: target.x, targetY: target.y, damage,
            weapon: {
                ...config.strategyStats,
                effects: config.effects,
                projectileVisuals: config.projectileVisuals,
                lifetimeMs: lifetimeMs,
                impactVFX: config.visual.impactVFX
            },
            projectileSpeed: speed, isCritical,
            knockbackMultiplier: player.stats.knockback
        });

        projectile.visual.setData('parent', projectile);
        this.projectileGroup.add(projectile.visual);
        projectile.applyVelocity(x, y, target.x, target.y, speed);
        this.activeProjectiles.push(projectile);
    }

    /**
     * Applies damage and effects to a target.
     * Required for hitbox-based attacks like the laser.
     */
    applyDamage(target) {
        const { weapon } = this;
        const { config, player, current } = weapon;
        const { damage, isCritical } = weapon.calculateDamage();
        const effects = config.effects || {};
        const isStructure = target.container && target.container.getData('isStructure');

        if (!isStructure && effects.elemental && effects.elemental !== 'none') {
            target.applyEffect(
                effects.elemental,
                weapon.current.dotDamage,
                effects.dotDuration || 0
            );
        }

        target.takeDamage(damage, isCritical, player);

        if (!isStructure) {
            const kb = current.knockback;
            const kbDuration = weapon.baseStats.knockbackDuration || 0;
            target.applyKnockback(kb, kbDuration);
        }
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

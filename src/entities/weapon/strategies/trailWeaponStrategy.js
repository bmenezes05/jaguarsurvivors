import { WeaponStrategy } from '../weaponStrategy.js';
import { Projectile } from '../../projectile/projectile.js';
import { ObjectPool } from '../../../managers/objectPool.js';
import { createProjectileGroup } from '../../projectile/projectileGroup.js';

/**
 * TrailWeaponStrategy
 * 
 * A weapon strategy that creates time-based trail effects.
 * Unlike a true projectile system, trails are spawned at a position
 * and remain active for a duration (lifetime), dealing damage to
 * enemies they overlap with.
 * 
 * Key Concepts:
 * - trailSpeed: Visual speed of the trail effect (how fast it moves toward target)
 * - lifetimeMs: How long the trail remains active (in milliseconds)
 * - trailSize: Visual size of the trail effect
 * 
 * The trails use the Projectile class internally for physics/collision,
 * but the naming and API reflect their true behavior.
 */
export class TrailWeaponStrategy extends WeaponStrategy {
    constructor(weapon) {
        super(weapon);

        this.activeTrails = [];
        this.pool = new ObjectPool(this.scene, Projectile, 30);

        this.scene.projectileGroup = createProjectileGroup(
            this.scene,
            weapon.enemySpawner.group
        );
        this.projectileGroup = this.scene.projectileGroup;
    }

    /**
     * Spawns a trail effect toward the target
     * @param {EnemyFacade} target - The enemy to target
     */
    attack(target) {
        const { weapon } = this;
        const { config, player, current } = weapon;

        console.debug("EVENT_EMITTED", { eventName: 'weapon-shoot', payload: config.key });
        this.scene.events.emit('weapon-shoot', config.key);

        const angle = Phaser.Math.Angle.Between(
            player.x, player.y, target.x, target.y
        );

        // Spawn trail slightly offset from player in direction of target
        const spawnOffset = config.trailSize ?? config.projectileSize ?? 10;
        const x = player.x + Math.cos(angle) * spawnOffset;
        const y = player.y + Math.sin(angle) * spawnOffset;

        const { damage, isCritical } = weapon.calculateDamage();

        // Create trail using the pool
        // Note: Internally uses Projectile class, but we pass trail-oriented semantics
        const trail = this.pool.get({
            x,
            y,
            targetX: target.x,
            targetY: target.y,
            damage,
            weapon: config,
            // trailSpeed controls visual movement speed
            projectileSpeed: current.trailSpeed ?? current.projectileSpeed,
            isCritical,
            knockbackMultiplier: player.stats.knockback
        });

        trail.visual.setData('parent', trail);
        this.projectileGroup.add(trail.visual);
        this.activeTrails.push(trail);
    }

    /**
     * Updates all active trails
     * Trails are removed when their lifetime expires or they hit an enemy
     * @param {number} delta - Time since last update in ms
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

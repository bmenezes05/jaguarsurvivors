import { CONFIG } from '../../config.js';
import { MeleeWeaponStrategy } from './strategies/meleeWeaponStrategy.js';
import { TrailWeaponStrategy } from './strategies/trailWeaponStrategy.js';

export class Weapon {
    constructor(scene, playerCombat, enemySpawner, weaponKey) {
        this.scene = scene;
        this.player = playerCombat;
        this.enemySpawner = enemySpawner;

        this.config = CONFIG.weapon.find(w => w.key === weaponKey);
        this.cooldownTimer = 0;

        // Base stats with support for both new (trail-oriented) and legacy (projectile-oriented) names
        this.base = {
            damage: this.config.damage,
            cooldown: this.config.cooldown,
            // For trail weapons: lifetimeMs determines how long the trail exists
            // For legacy support: falls back to range
            lifetimeMs: this.config.lifetimeMs ?? this.config.range,
            // For trail weapons: trailSpeed controls visual movement
            // For legacy support: falls back to projectileSpeed
            trailSpeed: this.config.trailSpeed ?? this.config.projectileSpeed,
            // Size of the trail/projectile visual
            trailSize: this.config.trailSize ?? this.config.projectileSize ?? 10,
            // DOT damage for elemental effects
            dotDamage: this.config.dotDamage ?? 0
        };

        // Legacy aliases for backward compatibility
        this.base.range = this.base.lifetimeMs;
        this.base.projectileSpeed = this.base.trailSpeed;

        this.current = {};
        this.strategy = this.createStrategy();
    }

    createStrategy() {
        // 'trail' is the new type, 'ranged' is kept for backward compatibility
        if (this.config.type === 'ranged') {
            console.warn(
                `[Weapon] DEPRECATED: type 'ranged' is deprecated for weapon '${this.config.key}'. ` +
                `Use type 'trail' instead. Ranged behavior has been replaced with trail-based effects.`
            );
        }

        const isMelee = this.config.type === 'melee';
        return isMelee
            ? new MeleeWeaponStrategy(this)
            : new TrailWeaponStrategy(this);
    }

    update(delta) {
        this.cooldownTimer += delta;
        this.updateDynamicStats();

        const target = this.findNearestEnemy(this.current.range);
        if (!target) return;
        this.updateWeaponRotation(target);

        if (this.cooldownTimer >= this.current.cooldown) {
            this.strategy.attack(target);
            this.cooldownTimer = 0;
        }

        this.strategy.update?.(delta);
    }

    updateDynamicStats() {
        const stats = this.player.stats;

        this.current.damage = this.base.damage * stats.damage;
        this.current.cooldown = this.base.cooldown / stats.attackSpeed;
        this.current.lifetimeMs = this.base.lifetimeMs * stats.area;
        this.current.trailSpeed = this.base.trailSpeed * stats.projectileSpeed;
        this.current.dotDamage = this.base.dotDamage * stats.elementalDamage;

        // Legacy aliases for backward compatibility with strategies
        this.current.range = this.current.lifetimeMs;
        this.current.projectileSpeed = this.current.trailSpeed;
    }

    findNearestEnemy(maxDistance) {
        let nearest = null;
        let minDist = maxDistance;

        for (const enemy of this.enemySpawner.enemies) {
            if (!enemy.isActive) continue;

            const dist = Phaser.Math.Distance.Between(
                this.player.x, this.player.y, enemy.x, enemy.y
            );

            if (dist < minDist) {
                minDist = dist;
                nearest = enemy;
            }
        }

        return nearest;
    }

    updateWeaponRotation(target) {
        const angle = Phaser.Math.Angle.Between(
            this.player.x, this.player.y, target.x, target.y
        );

        const desired = this.player.facingRight ? angle : -angle;
        const smoothing = this.config.rotationSmoothing ?? 0.2;

        this.config.rotation = Phaser.Math.Linear(
            this.config.rotation || 0,
            desired,
            smoothing
        );
    }

    calculateDamage() {
        const stats = this.player.stats;
        const isCritical = Math.random() < stats.critChance;
        const critMult = isCritical ? stats.criticalDamage : 1;

        return {
            isCritical,
            damage: this.current.damage * critMult
        };
    }
}

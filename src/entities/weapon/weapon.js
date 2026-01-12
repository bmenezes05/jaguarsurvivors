import { CONFIG } from '../../config/config.js';
import { MeleeWeaponStrategy } from './strategies/meleeWeaponStrategy.js';
import { TrailWeaponStrategy } from './strategies/trailWeaponStrategy.js';
import { RangedWeaponStrategy } from './strategies/rangedWeaponStrategy.js';

export class Weapon {
    constructor(scene, playerCombat, enemySpawner, weaponKey) {
        this.scene = scene;
        this.player = playerCombat;
        this.enemySpawner = enemySpawner;
        this.level = 1;

        this.config = CONFIG.weapon.find(w => w.key === weaponKey);

        if (!this.config) {
            console.error(`[Weapon] Config not found for key: ${weaponKey}`);
            return;
        }

        this.cooldownTimer = 0;

        this.baseStats = this.config.baseStats || {};
        this.strategyStats = this.config.strategyStats || {};

        this.current = {};
        this.animOffset = { x: 0, y: 0 };
        this.strategy = this.createStrategy();
    }

    createStrategy() {
        const type = this.config.type;
        switch (type) {
            case 'melee':
                return new MeleeWeaponStrategy(this);
            case 'ranged':
                return new RangedWeaponStrategy(this);
            case 'trail':
                return new TrailWeaponStrategy(this);
            default:
                console.warn(`[Weapon] Unknown type '${type}' for weapon '${this.config.key}'. Defaulting to Melee.`);
                return new MeleeWeaponStrategy(this);
        }
    }

    update(delta) {
        this.cooldownTimer += delta;
        this.updateDynamicStats();

        // Determine the range to check for enemies
        const range = this.current.detectionRange || 400;
        const target = this.findNearestEnemy(range);

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

        // Base Stats Calculation
        this.current.damage = (this.baseStats.damage || 0) * stats.damage;
        this.current.cooldown = (this.baseStats.cooldown || 1000) / stats.attackSpeed;

        // Calculate knockback and duration
        this.current.knockback = (this.baseStats.knockback || 0) * stats.knockback;
        this.current.knockbackDuration = this.baseStats.knockbackDuration || 0;

        // Effects
        this.current.dotDamage = (this.config.effects?.dotDamage || 0) * stats.elementalDamage;

        // Strategy Specific Stats Calculation
        if (this.config.type === 'ranged') {
            this.current.projectileSpeed = (this.strategyStats.projectileSpeed || 500) * stats.projectileSpeed;
            this.current.range = (this.strategyStats.range || 300) * stats.area;
            this.current.projectileSize = (this.strategyStats.projectileSize || 10) * stats.area;
            this.current.detectionRange = this.current.range;

        } else if (this.config.type === 'trail') {
            this.current.lifetimeMs = (this.strategyStats.lifetimeMs || 1000) * stats.area;
            this.current.trailSpeed = (this.strategyStats.trailSpeed || 0) * stats.projectileSpeed;
            this.current.trailSize = (this.strategyStats.trailSize || 10) * stats.area;
            this.current.detectionRange = 400; // Default range for trail weapons

        } else if (this.config.type === 'melee') {
            const hitbox = this.strategyStats.meleeHitbox || { width: 100, height: 100 };
            this.current.meleeHitboxWidth = hitbox.width * stats.area;
            this.current.meleeHitboxHeight = hitbox.height * stats.area;
            // Detection range must cover the hitbox
            this.current.detectionRange = Math.max(this.current.meleeHitboxWidth, this.current.meleeHitboxHeight) * 1.5;
        }
    }

    findNearestEnemy(maxDistance) {
        let nearest = null;
        let minDist = maxDistance;

        // 1. Check Enemies
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

        // 2. Check Structures
        if (this.scene.structureSystem && this.scene.structureSystem.structures) {
            for (const struct of this.scene.structureSystem.structures) {
                if (!struct.isActive) continue;

                // Simple check: treat structure as a targetable point (its center)
                const dist = Phaser.Math.Distance.Between(
                    this.player.x, this.player.y, struct.x, struct.y
                );

                if (dist < minDist) {
                    minDist = dist;
                    nearest = struct; // Duck-typing: structure has x, y, and takeDamage
                }
            }
        }

        return nearest;
    }

    updateWeaponRotation(target) {
        // Visual Rotation updates only
        const angle = Phaser.Math.Angle.Between(
            this.player.x, this.player.y, target.x, target.y
        );

        const desired = this.player.facingRight ? angle : -angle;
        // Access visual config safely
        const visual = this.config.visual || {};
        const smoothing = visual.rotationSmoothing ?? 0.2;

        // We store the rotation on config.rotation temporarily for visual consistency if needed
        // But better to store on 'current' or instance
        this.rotation = Phaser.Math.Linear(
            this.rotation || 0,
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

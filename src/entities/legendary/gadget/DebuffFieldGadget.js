import { GadgetLegendary } from './GadgetLegendary.js';

/**
 * DebuffFieldGadget
 * 
 * Creates a stationary field that slows enemies and deals damage over time.
 * 
 * Behavior:
 * - Placed at player's position on activation
 * - Slows enemies within radius
 * - Deals periodic damage to enemies in field
 * - Visual swirling effect
 */
export class DebuffFieldGadget extends GadgetLegendary {
    constructor(scene, config) {
        super(scene, config);
        this.position = null;
        this.affectedEnemies = new Map(); // Track which enemies are slowed
        this.damageTimer = 0;
    }

    createVisuals() {
        const player = this.scene.player;
        const radius = this.config.radius || 250;

        // Create field circle
        const field = this.scene.add.circle(
            player.x,
            player.y,
            radius,
            0x9400D3, // Purple
            0.2
        );

        // Create swirling graphics
        const graphics = this.scene.add.graphics();
        graphics.lineStyle(3, 0x9400D3, 0.6);

        // Draw spiral
        const centerX = player.x;
        const centerY = player.y;
        let angle = 0;
        graphics.beginPath();

        for (let r = 0; r < radius; r += 10) {
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;
            if (r === 0) {
                graphics.moveTo(x, y);
            } else {
                graphics.lineTo(x, y);
            }
            angle += 0.3;
        }

        graphics.strokePath();

        // Rotate the spiral continuously
        this.scene.tweens.add({
            targets: graphics,
            rotation: Math.PI * 2,
            duration: 3000,
            repeat: -1
        });

        // Pulse the field
        this.scene.tweens.add({
            targets: field,
            alpha: 0.4,
            duration: 1500,
            yoyo: true,
            repeat: -1
        });

        this.sprites.push(field);
        this.graphics.push(graphics);
        this.position = { x: player.x, y: player.y };
    }

    update(delta) {
        if (!this.isActive || !this.position) return;

        const radius = this.config.radius || 250;
        const slowAmount = this.config.slowAmount || 0.7;
        const damagePerSecond = this.config.damagePerSecond || 10;

        // Get all active enemies
        const enemies = this.scene.enemySpawner?.enemies?.filter(e => e.isActive) || [];
        const currentlyAffected = new Set();

        enemies.forEach(enemy => {
            const dist = Phaser.Math.Distance.Between(
                this.position.x,
                this.position.y,
                enemy.x,
                enemy.y
            );

            if (dist <= radius) {
                currentlyAffected.add(enemy);
                this.applyDebuff(enemy, slowAmount);
            }
        });

        // Remove debuff from enemies that left the field
        this.affectedEnemies.forEach((originalSpeed, enemy) => {
            if (!currentlyAffected.has(enemy)) {
                this.removeDebuff(enemy, originalSpeed);
            }
        });

        // Deal periodic damage
        this.damageTimer += delta;
        if (this.damageTimer >= 1000) { // Every second
            currentlyAffected.forEach(enemy => {
                enemy.takeDamage(damagePerSecond);
            });
            this.damageTimer = 0;
        }
    }

    applyDebuff(enemy, slowAmount) {
        if (!this.affectedEnemies.has(enemy)) {
            const originalSpeed = enemy.enemy?.speed || 0;
            this.affectedEnemies.set(enemy, originalSpeed);

            if (enemy.enemy) {
                enemy.enemy.speed = originalSpeed * (1 - slowAmount);
            }

            // Visual tint
            if (enemy.sprite) {
                enemy.sprite.setTint(0x9400D3);
            }
        }
    }

    removeDebuff(enemy, originalSpeed) {
        if (enemy.enemy) {
            enemy.enemy.speed = originalSpeed;
        }

        if (enemy.sprite && enemy.isActive) {
            enemy.sprite.clearTint();
        }

        this.affectedEnemies.delete(enemy);
    }

    destroy() {
        if (!this.isActive) return;

        // Restore all affected enemies
        this.affectedEnemies.forEach((originalSpeed, enemy) => {
            this.removeDebuff(enemy, originalSpeed);
        });
        this.affectedEnemies.clear();

        super.destroy();
    }
}

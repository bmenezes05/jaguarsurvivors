import { EnemyProjectile } from '../enemyProjectile.js';

export class EnemyCombat {
    constructor(scene, enemy) {
        this.scene = scene;
        this.enemy = enemy;
        this.cooldown = 0;

        // Telegraph
        this.isTelegraphing = false;
        this.telegraphLine = null;
        this.telegraphTimer = 0;

        // Boss Stomp
        this.stompTimer = 0;
    }

    reset() {
        this.cooldown = 0;
        this.isTelegraphing = false;
        this.stompTimer = 0;
        this.clearTelegraph();
    }

    update(player, delta) {
        if (!this.enemy.isActive) return;

        // Respect stun status
        if (this.enemy.status && this.enemy.status.isStunned()) {
            return;
        }

        // 1. Boss Stomp Mechanic
        if (this.enemy.isBoss) {
            this.updateBossStomp(delta);
        }

        // 2. Cooldowns
        if (this.cooldown > 0) {
            this.cooldown -= delta;
        }

        // 3. Telegraph Update (Visual Tracking)
        if (this.isTelegraphing) {
            this.updateTelegraphVisual(player);
            return; // Busy aiming
        }

        // 4. Shooting Logic
        if (this.enemy.entity.config.canShoot && this.cooldown <= 0) {
            const distance = Phaser.Math.Distance.Between(
                this.enemy.x, this.enemy.y,
                player.x, player.y
            );

            if (distance < (this.enemy.entity.config.shootRange || 400)) {
                this.startTelegraph(player);
            }
        }
    }

    startTelegraph(player) {
        this.isTelegraphing = true;

        // Visual
        this.telegraphLine = this.scene.add.graphics();
        this.enemy.view.container.add(this.telegraphLine);

        // Schedule Attack
        this.scene.time.delayedCall(1000, () => {
            // Validate state before shooting
            if (this.enemy.isActive && this.enemy.entity.health > 0) {
                // DON'T shoot if stunned
                if (!this.enemy.status || !this.enemy.status.isStunned()) {
                    this.shoot(player);
                }
            }
            this.clearTelegraph();
        });
    }

    updateTelegraphVisual(player) {
        if (!this.telegraphLine) return;

        this.telegraphLine.clear();
        this.telegraphLine.lineStyle(2, 0xFF0000, 0.5);
        this.telegraphLine.beginPath();
        this.telegraphLine.moveTo(0, 0); // Local 0,0 (enemy center)

        // Calculate relative position to player
        // Since graphic is in container, we need local coordinates of player relative to container
        // Actually simplest is just simple subtraction since container is at enemy.x/y
        const relX = player.x - this.enemy.view.container.x;
        const relY = player.y - this.enemy.view.container.y;

        this.telegraphLine.lineTo(relX, relY);
        this.telegraphLine.strokePath();
    }

    clearTelegraph() {
        this.isTelegraphing = false;
        if (this.telegraphLine) {
            this.telegraphLine.destroy();
            this.telegraphLine = null;
        }
    }

    shoot(player) {
        // Create Projectile
        const proj = new EnemyProjectile(
            this.scene,
            this.enemy.x,
            this.enemy.y,
            player,
            this.enemy.entity.config
        );

        if (this.scene.enemyProjectiles) {
            this.scene.enemyProjectiles.add(proj.sprite);
        }

        // Apply velocity AFTER adding to group to avoid physics reset
        proj.applyVelocity(player, this.enemy.entity.config);

        // Reset Cooldown
        this.cooldown = this.enemy.entity.config.shootInterval || 2000;
    }

    updateBossStomp(delta) {
        const bossData = this.enemy.entity.config.bossData || {};
        const stompInterval = bossData.stompInterval || 3000;

        this.stompTimer += delta;

        if (this.stompTimer >= stompInterval) {
            this.stompTimer = 0;
            this.performStomp();
        }
    }

    performStomp() {
        // Visual
        const stompCircle = this.scene.add.circle(
            this.enemy.x, this.enemy.y, 10, 0xFF0000, 0.4
        );
        this.scene.tweens.add({
            targets: stompCircle,
            scale: 5,
            alpha: 0,
            duration: 500,
            onComplete: () => stompCircle.destroy()
        });

        // Screen Shake
        this.scene.cameras.main.shake(100, 0.005);

        // Logic (Optional: Damage nearby player? Not in legacy code, but good to add if needed)
        // Legacy code didn't have damage logic for stomp itself, just the shake/visual.
    }

    isBlockingMovement() {
        return this.isTelegraphing;
    }
}

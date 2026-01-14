export class EnemyCombat {
    constructor(scene, enemy) {
        this.scene = scene;
        this.enemy = enemy;
        this.cooldown = 0;

        // Telegraph
        this.isTelegraphing = false;
        this.telegraphLine = null;

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

        // 4. Attack Logic
        if (this.cooldown <= 0) {
            const config = this.enemy.entity.config;
            const distance = Phaser.Math.Distance.Between(this.enemy.x, this.enemy.y, player.x, player.y);

            // Ranged Attack
            if (config.rangedAttack && distance < config.rangedAttack.range) {
                this.startTelegraph(player);
                return;
            }

            // Trail Attack (no range check, happens as it moves)
            if (config.trailAttack) {
                this.executeAttack(player);
                return;
            }
        }
    }

    startTelegraph(player) {
        this.isTelegraphing = true;
        const telegraphDuration = this.enemy.entity.config.rangedAttack.telegraphDuration ?? 1000;

        // Visual
        this.telegraphLine = this.scene.add.graphics();
        this.enemy.view.container.add(this.telegraphLine);

        // Schedule Attack
        this.scene.time.delayedCall(telegraphDuration, () => {
            if (this.enemy.isActive && this.enemy.entity.health > 0) {
                this.executeAttack(player);
            }
            this.clearTelegraph();
        });
    }

    updateTelegraphVisual(player) {
        if (!this.telegraphLine) return;

        this.telegraphLine.clear();
        this.telegraphLine.lineStyle(2, 0xFF0000, 0.5);
        this.telegraphLine.beginPath();
        this.telegraphLine.moveTo(0, 0);

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

    executeAttack(player) {
        const config = this.enemy.entity.config;

        if (config.rangedAttack) {
            this.performRangedAttack(player, config.rangedAttack);
        } else if (config.trailAttack) {
            this.performTrailAttack(player, config.trailAttack);
        }

        const cooldown = config.rangedAttack?.cooldown || config.trailAttack?.cooldown || 2000;
        this.cooldown = cooldown;
    }

    performRangedAttack(player, attackConfig) {
        if (!this.scene.projectiles) return;

        const projectile = this.scene.projectiles.spawn({
            x: this.enemy.x,
            y: this.enemy.y,
            targetX: player.x,
            targetY: player.y,
            damage: this.enemy.entity.stats.damage,
            weapon: attackConfig.projectileConfig,
            isEnemy: true
        });

        if (projectile) {
            projectile.applyVelocity(
                this.enemy.x,
                this.enemy.y,
                player.x,
                player.y,
                attackConfig.projectileConfig.speed
            );
        }
    }

    performTrailAttack(player, attackConfig) {
        if (!this.scene.projectiles) return;

        this.scene.projectiles.spawn({
            x: this.enemy.x,
            y: this.enemy.y,
            damage: this.enemy.entity.stats.damage,
            weapon: attackConfig.projectileConfig,
            isEnemy: true
        });
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

        this.scene.cameras.main.shake(100, 0.005);
    }

    isBlockingMovement() {
        return this.isTelegraphing;
    }
}

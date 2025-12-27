
export class ProcManager {
    constructor(scene) {
        this.scene = scene;
        this.procs = [];
    }

    addProc(id, config) {
        this.procs.push({ id, config });
    }

    onEnemyDamaged(target) {
        this.procs.forEach(proc => {
            if (Math.random() < proc.config.chance) {
                this.triggerProc(proc, target);
            }
        });
    }

    triggerProc(proc, target) {
        if (proc.id === 'chain_lightning') {
            this.doChainLightning(proc.config, target);
        } else if (proc.id === 'frost_nova') {
            this.doFrostNova(proc.config, target);
        }
    }

    doChainLightning(config, initialTarget) {
        const range = config.range;
        const bounces = config.bounces;
        const damage = config.damage;

        // Simple BFS/Greedy chain
        let current = initialTarget;
        let chain = [current];

        // Visual
        const graphics = this.scene.add.graphics();
        graphics.lineStyle(2, config.color, 1);

        for (let i = 0; i < bounces; i++) {
            // Find nearest neighbor not in chain
            const enemies = this.scene.enemySpawner.enemies.filter(e => e.isActive && !chain.includes(e));
            let nearest = null;
            let minDist = range;

            enemies.forEach(e => {
                const dist = Phaser.Math.Distance.Between(current.x, current.y, e.x, e.y);
                if (dist < minDist) {
                    minDist = dist;
                    nearest = e;
                }
            });

            if (nearest) {
                // Zap
                nearest.takeDamage(damage);

                // Draw line
                graphics.lineBetween(current.x, current.y, nearest.x, nearest.y);

                current = nearest;
                chain.push(current);
            } else {
                break; // No more targets
            }
        }

        // Fade out graphics
        this.scene.tweens.add({
            targets: graphics,
            alpha: 0,
            duration: 300,
            onComplete: () => graphics.destroy()
        });
    }

    doFrostNova(config, center) {
        const radius = config.radius;
        const damage = config.damage;

        // Visual Circle
        const circle = this.scene.add.circle(center.x, center.y, 10, config.color, 0.5);
        this.scene.tweens.add({
            targets: circle,
            scale: radius / 10, // Scale to radius
            alpha: 0,
            duration: 400,
            onComplete: () => circle.destroy()
        });

        // Hit enemies
        const enemies = this.scene.enemySpawner.enemies.filter(e => e.isActive);
        enemies.forEach(e => {
            if (Phaser.Math.Distance.Between(center.x, center.y, e.x, e.y) <= radius) {
                e.takeDamage(damage);

                // Apply Freeze (Slow)
                // We need a mechanic on Enemy to handle speed modifiers. 
                // Currently Enemy.js doesn't have a standardized status effect system other than simple DOT stub.
                // Let's manually slow them for now.
                if (e.enemy) {
                    const originalSpeed = e.enemy.speed;
                    e.enemy.speed = 0; // Stop them
                    e.sprite.setTint(0x00FFFF);

                    this.scene.time.delayedCall(config.freezeDuration, () => {
                        if (e.isActive && e.enemy) {
                            e.enemy.speed = originalSpeed; // Restore (buggy if multiple layers, but ok for proto)
                            e.sprite.clearTint();
                        }
                    });
                }
            }
        });
    }
}

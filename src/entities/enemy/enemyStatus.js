export class EnemyStatus {
    constructor(scene, enemy) {
        this.scene = scene;
        this.enemy = enemy;
        this.activeEffects = new Map();

        // Settings
        this.damageTickInterval = 500; // ms    
    }

    reset() {
        this.activeEffects.clear();
    }

    apply(type, config) {
        if (!type || type === 'none') return;
        type = type.toLowerCase();

        // Config: { damage: number, duration: number }
        this.activeEffects.set(type, {
            duration: config.duration || 1000,
            tickTimer: 0,
            damage: config.damage || 0,
            type: type
        });

        // Event for UI/Sound
        this.scene.events.emit('status-applied', this.enemy, type);
    }

    update(delta) {
        if (this.enemy.entity.isDead()) return;

        // 1. Process Active Effects
        for (const [type, effect] of this.activeEffects.entries()) {
            effect.duration -= delta;
            effect.tickTimer += delta;

            // Tick Damage
            if (effect.tickTimer >= this.damageTickInterval) {
                effect.tickTimer = 0;
                if (effect.damage > 0) {
                    // Apply dot damage
                    this.enemy.takeDamage(effect.damage, false, { key: 'status_' + type });
                }
            }

            // Clean up expired
            if (effect.duration <= 0) {
                this.activeEffects.delete(type);
            }
        }

        this.checkEnrageTransition();
    }

    checkEnrageTransition() {
        if (!this.enemy.isBoss) return;

        const bossData = this.enemy.entity.config.bossData || {};
        if (!bossData.enrageHealthThreshold) return;

        const healthPercent = this.enemy.health / this.enemy.maxHealth;
        const isEnraged = healthPercent <= bossData.enrageHealthThreshold;

        // If newly enraged
        if (isEnraged && !this.isEnraged) {
            this.isEnraged = true;

            // Pop effect
            const sprite = this.enemy.view.sprite;
            // Stop any existing scale tweens to prevent accumulation
            this.scene.tweens.killTweensOf(sprite, ['scaleX', 'scaleY']);

            // Get original scale from config if possible, or current if it's the first time
            let originalScaleX = sprite.getData('originalScaleX');
            if (originalScaleX === undefined || originalScaleX === null) {
                originalScaleX = sprite.scaleX;
                sprite.setData('originalScaleX', originalScaleX);
            }

            this.scene.tweens.add({
                targets: sprite,
                scaleX: originalScaleX * 1.2,
                scaleY: originalScaleX * 1.2, // Assuming uniform scale for sprite
                yoyo: true,
                duration: 200,
                onComplete: () => {
                    if (sprite && sprite.setScale) {
                        sprite.setScale(originalScaleX);
                    }
                }
            });
        }
    }

    getSpeedMultiplier() {
        let multiplier = 1.0;

        if (this.activeEffects.has('freeze')) {
            multiplier *= 0.4;
        }

        if (this.isEnraged) {
            multiplier *= 1.5; // Hardcoded enrage speed boost or from config
        }

        return multiplier;
    }

    isStunned() {
        return this.activeEffects.has('stun');
    }

    onDeath() {
        // Poison Spread Logic
        if (this.activeEffects.has('poison')) {
            const range = 150;
            const enemies = this.scene.enemySystem?.enemySpawner?.getEnemies() || []; // Robust check

            const nearby = enemies.filter(e =>
                e !== this.enemy &&
                e.isActive &&
                Phaser.Math.Distance.Between(this.enemy.x, this.enemy.y, e.x, e.y) < range
            );

            nearby.forEach(e => {
                // Apply poison to nearby enemies
                if (e.applyEffect) {
                    e.applyEffect('poison', 1, 2000);
                }
            });
        }
    }
}

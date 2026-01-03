import { CompanionLegendary } from './CompanionLegendary.js';

/**
 * BuffCompanion
 * 
 * A companion that periodically grants buffs to the player.
 * 
 * Behavior:
 * - Follows player with offset
 * - Periodically activates buff
 * - Grants attack speed boost and shield
 * - Visual indicator when buff is active
 */
export class BuffCompanion extends CompanionLegendary {
    constructor(scene, config) {
        super(scene, config);
        this.buffCooldownTimer = 0;
        this.buffActive = false;
        this.buffDurationTimer = 0;
        this.aura = null;
    }

    createSprite() {
        const player = this.scene.player;

        this.sprite = this.scene.add.sprite(
            player.x + this.offset.x,
            player.y + this.offset.y,
            this.config.sprite || 'enemy_shaman'
        );

        this.sprite.setScale(this.config.scale || 0.5);
        this.sprite.setTint(this.config.tint || 0x00FF00);

        // Create aura circle
        this.aura = this.scene.add.circle(
            this.sprite.x,
            this.sprite.y,
            30,
            0x00FF00,
            0.3
        );
        this.aura.setVisible(false);

        // Floating animation
        this.scene.tweens.add({
            targets: this.sprite,
            y: this.sprite.y - 8,
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    updatePosition(delta) {
        super.updatePosition(delta);

        // Update aura position
        if (this.aura) {
            this.aura.setPosition(this.sprite.x, this.sprite.y);
        }
    }

    updateBehavior(delta) {
        const buffDuration = this.config.buffDuration || 5000;
        const buffCooldown = this.config.buffCooldown || 10000;

        if (this.buffActive) {
            // Buff is active
            this.buffDurationTimer += delta;

            if (this.buffDurationTimer >= buffDuration) {
                this.deactivateBuff();
            }
        } else {
            // Buff is on cooldown
            this.buffCooldownTimer += delta;

            if (this.buffCooldownTimer >= buffCooldown) {
                this.activateBuff();
            }
        }
    }

    activateBuff() {
        const player = this.scene.player;
        if (!player) return;

        this.buffActive = true;
        this.buffDurationTimer = 0;

        const attackSpeedBonus = this.config.attackSpeedBonus || 0.3;
        const shieldAmount = this.config.shieldAmount || 50;

        // Apply attack speed buff
        player.stats.attackSpeedStat.addMultiplier(attackSpeedBonus);

        // Apply shield (temporary health)
        player.health = Math.min(player.health + shieldAmount, player.stats.maxHealth + shieldAmount);

        // Visual feedback
        if (this.aura) {
            this.aura.setVisible(true);
            this.scene.tweens.add({
                targets: this.aura,
                scale: 1.5,
                alpha: 0.5,
                duration: 500,
                yoyo: true,
                repeat: -1
            });
        }

        // Particle effect
        this.createBuffParticles(player);

        console.debug('Buff Companion: Activated buff', {
            attackSpeed: attackSpeedBonus,
            shield: shieldAmount
        });
    }

    deactivateBuff() {
        const player = this.scene.player;
        if (!player) return;

        this.buffActive = false;
        this.buffCooldownTimer = 0;

        const attackSpeedBonus = this.config.attackSpeedBonus || 0.3;

        // Remove attack speed buff
        player.stats.attackSpeedStat.addMultiplier(-attackSpeedBonus);

        // Hide aura
        if (this.aura) {
            this.aura.setVisible(false);
            this.scene.tweens.killTweensOf(this.aura);
        }

        console.debug('Buff Companion: Deactivated buff');
    }

    createBuffParticles(player) {
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            const particle = this.scene.add.circle(
                player.x,
                player.y,
                4,
                0x00FF00,
                0.8
            );

            this.scene.tweens.add({
                targets: particle,
                x: player.x + Math.cos(angle) * 40,
                y: player.y + Math.sin(angle) * 40,
                alpha: 0,
                duration: 600,
                onComplete: () => particle.destroy()
            });
        }
    }

    destroy() {
        // Remove buff if active
        if (this.buffActive) {
            this.deactivateBuff();
        }

        // Destroy aura
        if (this.aura) {
            this.aura.destroy();
            this.aura = null;
        }

        super.destroy();
    }
}

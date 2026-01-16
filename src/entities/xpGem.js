import { CONFIG } from '../config/config.js';

export class XPGem {
    constructor(scene) {
        this.scene = scene;
        // Pre-create sprite with a dummy texture
        this.sprite = this.scene.add.image(0, 0, 'xp_gem');
        this.sprite.setDisplaySize(32, 32);
        this.scene.physics.add.existing(this.sprite);
        this.body = this.sprite.body;
        this.body.setCollideWorldBounds(true);
        this.isActive = false;

        // Initial state
        this.sprite.setVisible(false);
        this.body.enable = false;
    }

    spawn(config) {
        const { x, y, gemConfig } = config;
        this.value = gemConfig.gemValue;

        this.sprite.setTexture(gemConfig.key);
        this.sprite.setPosition(x, y);
        this.sprite.setVisible(true);
        this.sprite.setAlpha(1);

        // Visual Polish: Randomized base scale and rotation
        const baseScale = 0.7 + Math.random() * 0.3; // 0.7 to 1.0
        this.sprite.setScale(baseScale);
        this.sprite.setRotation(Math.random() * Math.PI * 2);

        this.body.enable = true;
        this.body.updateFromGameObject();
        this.body.setVelocity(0, 0);

        this.isActive = true;
        this.isFlying = false;

        // Cleanup old tweens
        if (this.tween) this.tween.remove();

        // Pulsing scale animation
        this.tween = this.scene.tweens.add({
            targets: this.sprite,
            scale: baseScale * 1.2,
            duration: 800 + Math.random() * 400,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    setActive(value) {
        this.isActive = value;
        this.sprite.setVisible(value);
        this.body.enable = value;
    }

    setVisible(value) {
        this.sprite.setVisible(value);
    }

    setPosition(x, y) {
        this.sprite.setPosition(x, y);
    }

    update(delta, player) {
        if (!this.isActive) return;

        const dx = player.x - this.sprite.x;
        const dy = player.y - this.sprite.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Pickup range (from stats or config)
        const pickupRange = player.stats.pickupRadius || CONFIG.xp.magnetRange;

        if (distance < pickupRange || this.isFlying) {
            const speed = this.isFlying ? 800 : CONFIG.xp.magnetSpeed;
            this.body.setVelocity((dx / distance) * speed, (dy / distance) * speed);

            if (distance < 30) {
                this.collect();
            }
        } else {
            this.body.setVelocity(0, 0);
        }
    }

    flyToPlayer() {
        this.isFlying = true;
        // Feedback visual de que foi atraído
        this.scene.tweens.add({
            targets: this.sprite,
            scale: 1.5,
            duration: 200,
            yoyo: true
        });
    }

    collect() {
        if (!this.isActive) return;

        this.scene.xpSystem.addXP(this.value);
        this.isActive = false;
        this.body.enable = false;
        this.sprite.setVisible(false);

        if (this.tween) {
            this.tween.remove();
            this.tween = null;
        }
    }
}
import { CONFIG } from '../config.js';

export class Pickup extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene, 0, 0);
        this.scene = scene;
        this.isActive = false;

        // Pre-create visuals (we'll update them in spawn)
        this.shape = scene.add.circle(0, 0, 15, 0xFFFFFF);

        // Use sprite instead of text for icons
        this.icon = scene.add.sprite(0, 0, 'pickup_bomb'); // Default sprite
        this.icon.setScale(0.5); // Start small, will adjust per pickup type

        this.add([this.shape, this.icon]);

        // Physics
        scene.physics.world.enable(this);
        this.body.setCircle(15);
        this.body.setOffset(-15, -15);

        // Hide initially
        this.setActive(false);
        this.setVisible(false);
        this.body.enable = false;

        scene.add.existing(this);
    }

    spawn(config) {
        const { x, y, type } = config;
        this.type = type;
        this.pickupConfig = CONFIG.pickups.types[type];

        this.setPosition(x, y);
        this.setVisible(true);
        this.setActive(true);
        this.body.enable = true;
        this.isActive = true;
        this.alpha = 1;
        this.setScale(0);

        // Update Visuals - use sprite instead of emoji text
        this.shape.setFillStyle(this.pickupConfig.color);

        // Use sprite from config, fallback to pickup_bomb if not specified
        const spriteKey = this.pickupConfig.spriteKey || 'pickup_bomb';
        this.icon.setTexture(spriteKey);
        this.icon.setScale(this.pickupConfig.scale || 1.0);

        // Standard animations
        if (this.floatTween) this.floatTween.remove();
        this.floatTween = this.scene.tweens.add({
            targets: this,
            y: y - 10,
            yoyo: true,
            duration: 1000,
            ease: 'Sine.easeInOut',
            repeat: -1
        });

        if (this.pulseTween) this.pulseTween.remove();
        this.pulseTween = this.scene.tweens.add({
            targets: this.shape,
            alpha: 0.6,
            yoyo: true,
            duration: 500,
            loop: -1
        });

        // Entrance animation
        this.scene.tweens.add({
            targets: this,
            scale: 1,
            duration: 300,
            ease: 'Back.out'
        });
    }

    collect() {
        if (!this.isActive) return;
        this.isActive = false;

        // Stop tweens
        if (this.floatTween) this.floatTween.remove();
        if (this.pulseTween) this.pulseTween.remove();

        // Exit animation
        this.scene.tweens.add({
            targets: this,
            scale: 1.5,
            alpha: 0,
            duration: 200,
            onComplete: () => {
                this.setVisible(false);
                this.body.enable = false;
                this.setActive(false);
            }
        });

        return this.pickupConfig;
    }

    // Helper for ObjectPool
    reset(config) {
        this.spawn(config);
    }
}

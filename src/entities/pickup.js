import { CONFIG } from '../config/config.js';

export class Pickup extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene, 0, 0);
        this.scene = scene;
        this.isActive = false;

        // Use ONLY the sprite as per constraints
        this.icon = scene.add.sprite(0, 0, 'pickup_bomb');
        this.icon.setScale(0.5);

        this.add(this.icon);

        // Physics
        scene.physics.world.enable(this);
        this.body.setCircle(15);
        this.body.setOffset(-15, -15);
        this.body.setCollideWorldBounds(true);

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

        if (!this.pickupConfig) {
            console.error(`[Pickup] Config missing for type: ${type}. Check pickups.config.js.`);
            this.pickupConfig = CONFIG.pickups.types['health_kit'] || { spriteKey: 'pickup_bomb', scale: 1.0 };
        }

        this.setPosition(x, y);
        this.setVisible(true);
        this.setActive(true);
        this.body.enable = true;
        this.isActive = true;
        this.alpha = 1;
        this.setScale(0);

        // Use sprite from config
        const spriteKey = this.pickupConfig.spriteKey || 'pickup_bomb';
        this.icon.setTexture(spriteKey);
        this.icon.setScale(this.pickupConfig.scale || 1.0);

        // Floating animation
        if (this.floatTween) this.floatTween.remove();
        this.floatTween = this.scene.tweens.add({
            targets: this,
            y: y - 8,
            yoyo: true,
            duration: 1200,
            ease: 'Sine.easeInOut',
            repeat: -1
        });

        // Entrance animation
        this.scene.tweens.add({
            targets: this,
            scale: 1,
            duration: 300,
            ease: 'Back.out'
        });

        // Subtle pulsing of the sprite itself
        if (this.pulseTween) this.pulseTween.remove();
        this.pulseTween = this.scene.tweens.add({
            targets: this.icon,
            scale: (this.pickupConfig.scale || 1.0) * 1.1,
            yoyo: true,
            duration: 600,
            ease: 'Sine.easeInOut',
            repeat: -1
        });
    }

    collect() {
        if (!this.isActive) return;
        this.isActive = false;
        this.body.enable = false;

        // Stop tweens
        if (this.floatTween) this.floatTween.remove();
        if (this.pulseTween) this.pulseTween.remove();

        // Exit animation
        this.scene.tweens.add({
            targets: this,
            scale: 1.8,
            alpha: 0,
            duration: 250,
            ease: 'Cubic.out',
            onComplete: () => {
                this.setVisible(false);
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

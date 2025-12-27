export class JuiceManager {
    constructor(scene) {
        this.scene = scene;
    }

    /**
     * Pauses physics and tweens for a short duration to create impact.
     * @param {number} duration - Duration in milliseconds (default 50ms)
     */
    hitStop(duration = 50) {
        // Pause Physics
        if (this.scene.physics.world) {
            this.scene.physics.world.pause();
        }

        // Pause Tweens
        this.scene.tweens.pauseAll();

        // Resume after duration
        // We use setTimeout here because scene.time events might be affected if we paused the scene update loop,
        // but typically physics.pause() doesn't stop scene.time. 
        // However, to be safe and independent of scene time dilation:
        setTimeout(() => {
            if (this.scene && this.scene.physics && this.scene.physics.world) {
                this.scene.physics.world.resume();
                this.scene.tweens.resumeAll();
            }
        }, duration);
    }

    /**
     * Shakes the main camera.
     * @param {number} intensity - intensity of shake (0.0 to 1.0)
     * @param {number} duration - duration in ms
     */
    shake(intensity = 0.01, duration = 100) {
        if (this.scene.cameras && this.scene.cameras.main) {
            this.scene.cameras.main.shake(duration, intensity);
        }
    }

    /**
     * Flashes a sprite with a specific color tint.
     * @param {Phaser.GameObjects.Sprite} sprite - The sprite to flash
     * @param {number} color - Hex color (e.g., 0xFFFFFF for white)
     * @param {number} duration - Duration of the flash
     */
    flash(sprite, color = 0xFFFFFF, duration = 100) {
        if (!sprite || !sprite.setTint) return;

        sprite.setTint(color);

        this.scene.time.delayedCall(duration, () => {
            if (sprite && sprite.clearTint) {
                sprite.clearTint();
            }
        });
    }

    /**
     * Scales a sprite up/down briefly to simulate recoil/pulse.
     * @param {Phaser.GameObjects.Sprite} sprite 
     * @param {number} scaleFactor - Multiplier (e.g., 1.2 for 20% growth)
     * @param {number} duration 
     */
    pulse(sprite, scaleFactor = 1.2, duration = 100) {
        if (!sprite) return;

        const originalScaleX = sprite.scaleX;
        const originalScaleY = sprite.scaleY;

        this.scene.tweens.add({
            targets: sprite,
            scaleX: originalScaleX * scaleFactor,
            scaleY: originalScaleY * scaleFactor,
            duration: duration / 2,
            yoyo: true,
            onComplete: () => {
                sprite.setScale(originalScaleX, originalScaleY);
            }
        });
    }

    /**
     * Creates a spark effect at x, y
     */
    spark(x, y) {
        // Create a few particles
        for (let i = 0; i < 5; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 100 + Math.random() * 100;
            const life = 200 + Math.random() * 100;

            const p = this.scene.add.circle(x, y, 3, 0xFFFF00);
            this.scene.physics.add.existing(p);
            p.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

            this.scene.tweens.add({
                targets: p,
                alpha: 0,
                scale: 0,
                duration: life,
                onComplete: () => p.destroy()
            });
        }
    }
}
